#!/usr/bin/env -S npx tsx
//
// vision-review — the visual-reviewer seat's outside eye.
//
// sends screenshots the seat already captured to a Google Gemini vision model
// and returns what a DIFFERENT model saw in them. the point is the outsideness:
// the reviewing model is not the model that built the page, so it isn't marking
// its own homework. it describes and flags plainly-visible defects — it never
// returns a verdict, a score, or a measurement (see the prompt below, which is
// the load-bearing part of this script).
//
// official source: @google/genai (Google Gen AI JS SDK). verify model ids /
// params via Context7 (`/googleapis/js-genai`) before changing them — do not
// trust memory. see SOURCES.md.
//
// usage:
//   npm --prefix "${CLAUDE_PLUGIN_ROOT}" run vision-review -- \
//     --shots ~/shots/home-1440.png,~/shots/home-375.png \
//     --labels "home @1440,home @375" \
//     --context "pricing page; dark brand, one accent, cards should read as one row" \
//     --tokens ~/proj/src/app.css
//
//   # write the read to a file instead of stdout:
//   ... --out ${TMPDIR:-/tmp}/team-justin-review/acme/outside-eye.md
//
// env: GOOGLE_API_KEY (or GEMINI_API_KEY) — a Google AI Studio key, the same one
// scripts/gen-asset.ts uses.
//
import { GoogleGenAI, type Part } from "@google/genai";
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

// --- args -----------------------------------------------------------------

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    // greedily consume every following token until the next --flag, so an
    // unquoted multi-word value (e.g. a context line whose quotes the shell
    // dropped) is rejoined instead of truncated to its first word.
    const parts: string[] = [];
    while (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
      parts.push(argv[++i]);
    }
    out[key] = parts.length ? parts.join(" ") : "true";
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

const shots = (args.shots ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// one label per shot, same order ("home @1440,home @375"). labels are what make
// a defect routable — "the second image" is not a location anyone can act on.
const labels = (args.labels ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// gemini-3.1-pro-preview is the newest Pro on the AI Studio tier and the default
// here: this pass is judgment-adjacent, so it runs on the strongest vision model
// rather than the cheapest. --model gemini-3.5-flash for a cheap sanity read.
const model = args.model ?? "gemini-3.1-pro-preview";
// what the screen is supposed to be — the seat's brief, in a sentence or two.
// without it the read is generic; with it the model can see intent missed.
const context = args.context ?? "";
// the project's token file, inlined as text so the read is bound to the system
// the build was supposed to use rather than the reviewer's own preferences.
const tokensPath = args.tokens;
const outPath = args.out;
// screenshots of a 1440 viewport are multi-MB PNGs and the request carries every
// one of them; downscale + re-encode so a full sweep fits comfortably in one call.
const maxWidth = parseInt(args["max-width"] ?? "1600", 10);
// a full sweep is pages × viewports × states — capped so one call can't quietly
// become a hundred-image request that costs more than the sweep that produced it.
const maxShots = parseInt(args["max-shots"] ?? "12", 10);

if (!shots.length) {
  console.error(
    "error: --shots is required (comma-separated screenshot paths).\n" +
      "see the header of scripts/vision-review.ts for usage.",
  );
  process.exit(1);
}

const missing = shots.filter((s) => !existsSync(s));
if (missing.length) {
  console.error(`error: screenshot not found: ${missing.join(", ")}`);
  process.exit(1);
}

if (shots.length > maxShots) {
  console.error(
    `error: ${shots.length} shots exceeds --max-shots ${maxShots}. ` +
      "split the sweep into more than one call, or raise the cap deliberately.",
  );
  process.exit(1);
}

const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "error: set GOOGLE_API_KEY (or GEMINI_API_KEY) to a Google AI Studio key.",
  );
  process.exit(1);
}

// --- the prompt -----------------------------------------------------------

// this is the whole contract of the pass. the outside eye DESCRIBES and FLAGS
// what is plainly visible; it does not judge, score, or measure. two failure
// modes are being prevented here: a second model handing down a verdict the team
// says belongs to the user, and a vision model inventing a contrast ratio or a
// pixel gap it cannot compute from a raster.
const SYSTEM = `You are a second pair of eyes on a web UI that someone else built. You are not its author and you are not its judge.

Your job: say what you actually see in the screenshots given, and name defects that are plainly visible in them.

Answer in exactly these three sections, in this order:

SAW — how the screen reads at a glance. What it is, what draws the eye first, the hierarchy, the density, the impression it gives. Be concrete and point at what you mean. No praise.
DEFECTS — things plainly wrong in the pixels. Misalignment, clipped or overlapping or cut-off content, text that is hard to read against what is behind it, an element that renders unstyled or broken, an asset that is stretched or blurry or missing, a state that renders empty when it should not. One line each, and name the labelled screenshot plus where in it.
UNSURE — anything you suspect but cannot confirm from these images. Put it here rather than in DEFECTS.

Hard rules:
- Report only what is visible in the images given. If you did not see it, you do not have it.
- Leave the verdict to your reader: they decide what happens next, and they are better placed than you to. State what is there and stop short of ship, fix, approve, reject, pass, fail, a score, or a severity ranking.
- Give no redesign direction. Whether this was the right composition is the reader's call, not yours. You describe, and you flag broken.
- Give no measurements. You cannot compute a contrast ratio or a pixel gap from an image. Say "this text looks hard to read against the photo behind it", never a number. The reader measures.
- Where a screenshot matches what the context says it should be, say so plainly in SAW and move on. Do not manufacture defects to look thorough.`;

// --- run ------------------------------------------------------------------

const ai = new GoogleGenAI({ apiKey });

// downscale + re-encode to webp so a full sweep's worth of screenshots fits in
// one request. width is capped, never enlarged — a 375 capture stays 375.
async function encodeShot(path: string): Promise<string> {
  const buf = await sharp(readFileSync(path), { failOn: "none" })
    .resize({ width: maxWidth, withoutEnlargement: true })
    .toFormat("webp", { quality: 80 })
    .toBuffer();
  return buf.toString("base64");
}

try {
  const parts: Part[] = [];

  let brief = "";
  if (context) brief += `What this screen is supposed to be: ${context}\n\n`;
  if (tokensPath) {
    if (!existsSync(tokensPath)) {
      console.error(`error: --tokens file not found: ${tokensPath}`);
      process.exit(1);
    }
    // truncated: a token file is the palette/type/spacing vocabulary the build
    // was given, and the head of it carries that. the full stylesheet would
    // crowd out the images without telling the eye anything more.
    const tokens = readFileSync(tokensPath, "utf8").slice(0, 6000);
    brief += `The design system this build was given (its token file, truncated):\n\`\`\`\n${tokens}\n\`\`\`\n\n`;
  }
  brief += `${shots.length} screenshot${shots.length > 1 ? "s" : ""} follow, each labelled.`;
  parts.push({ text: brief });

  for (let i = 0; i < shots.length; i++) {
    const label = labels[i] ?? shots[i];
    parts.push({ text: `Screenshot: ${label}` });
    parts.push({
      inlineData: { mimeType: "image/webp", data: await encodeShot(shots[i]) },
    });
  }

  console.error(`reading ${shots.length} screenshot(s) with ${model}…`);
  const res = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts }],
    config: { systemInstruction: SYSTEM },
  });

  const text = res.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();
  if (!text) {
    throw new Error(
      `${model} returned no text (finish reason: ${res.candidates?.[0]?.finishReason ?? "n/a"})`,
    );
  }

  const body = `<!-- outside eye: ${model} · ${shots.length} shot(s) · describes and flags, never judges -->\n\n${text}\n`;
  if (outPath) {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, body);
    console.error(`wrote: ${outPath}`);
  } else {
    process.stdout.write(body);
  }
} catch (err) {
  console.error(`vision-review failed: ${(err as Error).message}`);
  process.exit(1);
}
