#!/usr/bin/env -S npx tsx
//
// gen-asset — the graphic-designer specialist's asset generator.
//
// generates (or edits) a raster asset with Google Gemini/Imagen, then runs a
// sharp optimization pass so the output is web-ready (avif/webp, sized) and the
// builder can drop it straight into a project's static/ dir.
//
// official source: @google/genai (Google Gen AI JS SDK). verify model ids /
// params via Context7 (`/googleapis/js-genai`) before changing them — do not
// trust memory. see SOURCES.md.
//
// usage:
//   npm --prefix ~/projects/claude-eng-team run gen-asset -- \
//     --prompt "abstract brushed-brass texture, warm charcoal ground, no text" \
//     --out ~/projects/jeweler-demo/static/hero.avif \
//     --sizes 1600,800 --formats avif,webp
//
//   # edit / enhance an existing image (Gemini image model, chat mode):
//   npm --prefix ~/projects/claude-eng-team run gen-asset -- \
//     --input ./client-photo.jpg --prompt "remove background, warm studio light" \
//     --out ~/projects/fastlane/static/product.avif
//
//   # ambient hero VIDEO background (Veo). emits mp4 + webm + poster (avif/webp):
//   npm --prefix ~/projects/claude-eng-team run gen-asset -- \
//     --video --prompt "slow drifting aurora haze over deep charcoal, no people, no text" \
//     --out ~/projects/studio/static/hero.mp4 --vwidth 1600 --aspect 16:9
//
// env: GOOGLE_API_KEY (or GEMINI_API_KEY) — a Google AI Studio key.
// video path also needs `ffmpeg`/`ffprobe` on PATH (web-encode + poster frame).
//
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, unlinkSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, extname, join, basename } from 'node:path';

// --- args -----------------------------------------------------------------

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    // greedily consume every following token until the next --flag, so an
    // unquoted multi-word value (e.g. a prompt whose quotes the shell dropped)
    // is rejoined instead of truncated to its first word.
    const parts: string[] = [];
    while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
      parts.push(argv[++i]);
    }
    out[key] = parts.length ? parts.join(' ') : 'true';
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

const prompt = args.prompt;
const outPath = args.out;
// gemini-2.5-flash-image ("nano banana") is the general default and the only
// model that supports edit mode. pass an imagen-* id for high-fidelity t2i.
const model = args.model ?? 'gemini-2.5-flash-image';
const inputPath = args.input; // when set: edit/enhance this image instead of pure t2i
const formats = (args.formats ?? (extname(outPath ?? '').slice(1) || 'avif'))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const sizes = (args.sizes ?? '')
  .split(',')
  .map((s) => parseInt(s.trim(), 10))
  .filter((n) => Number.isFinite(n) && n > 0);
const quality = parseInt(args.quality ?? '72', 10);

// --- video (veo) opts -----------------------------------------------------
// video path is chosen by --video or by passing a veo-* model. everything below
// only applies to that path; the image path ignores it.
const isVideo = args.video === 'true' || model.startsWith('veo');
// veo-3.0-fast is the cheap default for ambient loops; override with --model veo-*.
const videoModel = model.startsWith('veo') ? model : 'veo-3.0-fast-generate-001';
const aspect = args.aspect ?? '16:9';
// ambient hero bg wants no people, but the accepted personGeneration values differ
// by model: veo-3.1 preview only accepts 'allow_all' (it rejects dont_allow AND
// allow_adult), while older veo accepts 'dont_allow'. default per model so a
// no-people run doesn't hit a hard API rejection; the prompt still forbids people.
const personGeneration =
  args['person-generation'] ?? (videoModel.includes('veo-3.1') ? 'allow_all' : 'dont_allow');
const vwidth = parseInt(args.vwidth ?? '', 10); // optional: scale video to this width (keeps aspect)
// poster is a still image, so it gets image formats regardless of the --out (.mp4) ext.
const posterFormats = (args['poster-formats'] ?? 'avif,webp')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (!prompt || !outPath) {
  console.error(
    'error: --prompt and --out are required.\n' +
      'see the header of scripts/gen-asset.ts for usage.',
  );
  process.exit(1);
}

const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('error: set GOOGLE_API_KEY (or GEMINI_API_KEY) to a Google AI Studio key.');
  process.exit(1);
}

// --- generate -------------------------------------------------------------

const ai = new GoogleGenAI({ apiKey });

// returns the raw generated image bytes (png-ish) from whichever model path applies.
async function generate(): Promise<Buffer> {
  // imagen path: high-fidelity text-to-image via generateImages.
  if (model.startsWith('imagen')) {
    if (inputPath) {
      throw new Error('edit mode (--input) requires a gemini image model, not imagen.');
    }
    const res = await ai.models.generateImages({
      model,
      prompt,
      config: { numberOfImages: 1, includeRaiReason: true },
    });
    const b64 = res.generatedImages?.[0]?.image?.imageBytes;
    if (!b64) {
      throw new Error(
        `imagen returned no image (rai: ${res.generatedImages?.[0]?.raiFilteredReason ?? 'n/a'})`,
      );
    }
    return Buffer.from(b64, 'base64');
  }

  // gemini image path. edit mode sends the source image in chat; otherwise pure t2i.
  let parts;
  if (inputPath) {
    const srcB64 = readFileSync(inputPath).toString('base64');
    const chat = ai.chats.create({ model });
    const res = await chat.sendMessage({
      message: [
        { inlineData: { mimeType: 'image/png', data: srcB64 } },
        { text: prompt },
      ],
    });
    parts = res.candidates?.[0]?.content?.parts;
  } else {
    const res = await ai.models.generateContent({ model, contents: prompt });
    parts = res.candidates?.[0]?.content?.parts;
  }

  const imgPart = parts?.find((p: any) => p.inlineData?.data);
  if (!imgPart?.inlineData?.data) {
    const text = parts?.find((p: any) => p.text)?.text;
    throw new Error(`model returned no image${text ? ` (said: ${text.slice(0, 200)})` : ''}`);
  }
  return Buffer.from(imgPart.inlineData.data, 'base64');
}

// --- optimize + write -----------------------------------------------------

// emits one file per (size × format). single-size keeps the plain --out name;
// multi-size appends -<width>w before the extension so responsive variants are distinct.
async function optimizeAndWrite(raw: Buffer): Promise<string[]> {
  const dir = dirname(outPath);
  mkdirSync(dir, { recursive: true });
  const stem = basename(outPath, extname(outPath));
  const widths = sizes.length ? sizes : [null]; // null = keep intrinsic width
  const written: string[] = [];

  for (const w of widths) {
    for (const fmt of formats) {
      const suffix = w && widths.length > 1 ? `-${w}w` : '';
      const file = join(dir, `${stem}${suffix}.${fmt}`);
      let pipe = sharp(raw, { failOn: 'none' });
      if (w) pipe = pipe.resize({ width: w, withoutEnlargement: true });
      const buf = await pipe.toFormat(fmt as keyof sharp.FormatEnum, { quality }).toBuffer();
      writeFileSync(file, buf);
      written.push(`${file} (${(buf.length / 1024).toFixed(0)} KB)`);
    }
  }
  return written;
}

// --- video: generate (veo) + web-encode -----------------------------------

// veo is a long-running async operation: kick it off, poll until done, then
// pull the mp4 bytes from the returned uri.
async function generateVideo(): Promise<Buffer> {
  let op = await ai.models.generateVideos({
    model: videoModel,
    prompt,
    config: { numberOfVideos: 1, aspectRatio: aspect, personGeneration },
  });
  while (!op.done) {
    await new Promise((r) => setTimeout(r, 10000));
    process.stderr.write('.');
    op = await ai.operations.getVideosOperation({ operation: op });
  }
  process.stderr.write('\n');

  const vid = op.response?.generatedVideos?.[0];
  const uri = vid?.video?.uri;
  if (!uri) {
    const reason = op.response?.raiMediaFilteredReasons?.[0] ?? 'n/a';
    throw new Error(`veo returned no video (rai: ${reason})`);
  }
  // ai-studio download uris need the api key appended as a query param.
  const resp = await fetch(uri.includes('key=') ? uri : `${uri}&key=${apiKey}`);
  if (!resp.ok) throw new Error(`video download failed: ${resp.status} ${resp.statusText}`);
  return Buffer.from(await resp.arrayBuffer());
}

const kb = (f: string) => `${f} (${(statSync(f).size / 1024).toFixed(0)} KB)`;

// transcodes the raw veo mp4 into drop-in hero-loop assets: a webm (vp9, small,
// listed first in <video>), an mp4 (h264, universal fallback), and a poster
// still so the hero paints instantly while the video buffers. audio is stripped
// — ambient backgrounds are silent — and playback is muted+loop on the builder side.
async function encodeVideo(raw: Buffer): Promise<string[]> {
  const dir = dirname(outPath);
  mkdirSync(dir, { recursive: true });
  const stem = basename(outPath, extname(outPath));
  const srcFile = join(dir, `${stem}.src.mp4`);
  writeFileSync(srcFile, raw);
  const scale = Number.isFinite(vwidth) && vwidth > 0 ? ['-vf', `scale=${vwidth}:-2`] : [];
  const written: string[] = [];

  const webm = join(dir, `${stem}.webm`);
  execFileSync(
    'ffmpeg',
    ['-y', '-i', srcFile, '-an', ...scale, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', webm],
    { stdio: 'ignore' },
  );
  written.push(kb(webm));

  const mp4 = join(dir, `${stem}.mp4`);
  execFileSync(
    'ffmpeg',
    // faststart moves the moov atom to the front so playback can begin before full download.
    ['-y', '-i', srcFile, '-an', ...scale, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', mp4],
    { stdio: 'ignore' },
  );
  written.push(kb(mp4));

  // grab the first frame, then optimize it through the same sharp path the image assets use.
  const posterPng = join(dir, `${stem}.poster.png`);
  execFileSync('ffmpeg', ['-y', '-i', srcFile, '-frames:v', '1', ...scale, posterPng], { stdio: 'ignore' });
  const posterRaw = readFileSync(posterPng);
  for (const fmt of posterFormats) {
    const file = join(dir, `${stem}-poster.${fmt}`);
    const buf = await sharp(posterRaw).toFormat(fmt as keyof sharp.FormatEnum, { quality }).toBuffer();
    writeFileSync(file, buf);
    written.push(`${file} (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  unlinkSync(posterPng);
  unlinkSync(srcFile);
  return written;
}

// --- run ------------------------------------------------------------------

try {
  let written: string[];
  if (isVideo) {
    console.error(`generating video with ${videoModel} (veo is async — this can take a few minutes)…`);
    written = await encodeVideo(await generateVideo());
  } else {
    console.error(`generating with ${model}${inputPath ? ' (edit mode)' : ''}…`);
    written = await optimizeAndWrite(await generate());
  }
  console.error('wrote:');
  for (const w of written) console.error(`  ${w}`);
} catch (err) {
  console.error(`gen-asset failed: ${(err as Error).message}`);
  process.exit(1);
}
