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
// env: GOOGLE_API_KEY (or GEMINI_API_KEY) — a Google AI Studio key.
//
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, extname, join, basename } from 'node:path';

// --- args -----------------------------------------------------------------

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        out[key] = 'true';
      } else {
        out[key] = next;
        i++;
      }
    }
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

// --- run ------------------------------------------------------------------

try {
  console.error(`generating with ${model}${inputPath ? ' (edit mode)' : ''}…`);
  const raw = await generate();
  const written = await optimizeAndWrite(raw);
  console.error('wrote:');
  for (const w of written) console.error(`  ${w}`);
} catch (err) {
  console.error(`gen-asset failed: ${(err as Error).message}`);
  process.exit(1);
}
