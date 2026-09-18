import ZAI from 'z-ai-web-dev-sdk';
import { writeFileSync, readFileSync } from 'fs';

const LOGO_PROMPT = `You are a world-class brand identity designer analyzing a logo/identity reference image. Analyze in forensic detail:
1) Logo construction: symbol geometry (circles/grids/golden ratio/hidden shapes), stroke weights, optical corrections
2) Proportions and negative space usage (exact relationships you can estimate)
3) Symbol-to-name relationship (lockup structure, alignment, spacing rhythm)
4) Typography if present: classification (serif/sans/geometric/humanist), weight, case, tracking, any custom details
5) Color palette (approximate hex values), gradients, material feel
6) Visual balance and what exactly makes it feel premium/professional
7) How it would behave as favicon/app icon and in motion (which parts are designed to animate)
8) The 5 transferable design principles we can apply to an ORIGINAL Arabic academic-platform logo (brand: "أم سارة" / Umm Sara)
Be specific and technical. No fluff.`;

const PRODUCT_PROMPT = `This is a premium product display / e-commerce UI reference video (screen recording of a website). Analyze as a senior product designer:
1) Product card anatomy: image area ratio, info zones, padding rhythm, corner radii (estimate px), borders, shadows, background treatments
2) Information architecture inside cards: title/price/CTA placement, badge/tag system, rating display, typography hierarchy (sizes/weights)
3) Grid layout: columns, gap sizes, how cards behave on scroll (reveal/stagger/scale)
4) Hover and interaction states: exactly what animates (image zoom? card lift? CTA reveal? cursor changes?)
5) Pricing display style and offer/badge treatment
6) Mobile vs desktop behavior if visible
7) Color/material system (approximate hex values)
8) The 5 transferable principles for displaying SERVICES (not physical products) on a premium Arabic RTL academic platform
Be specific and technical. No fluff.`;

const LOGO_MOTION_PROMPT = `This is a logo animation / motion identity reference video. Analyze as a motion designer, frame by frame where needed:
1) Motion start point: what state does the logo begin in (off-screen? strokes? shapes? blur?)
2) Reveal sequence: exact order of elements appearing, and what drives them
3) Timing and rhythm: total duration, per-element durations, stagger amounts, pauses
4) Easing character: snappy/elastic/smooth? describe acceleration/deceleration feel
5) Transformations: morphs, rotations, scale, stroke-drawing, masks, clip reveals, counter-rotations
6) Direction of motion and relationship to brand personality
7) Final state and how it settles (overshoot? settle? loop?)
8) Sound-sync or emphasis beats if apparent
9) The transferable motion principles (NOT the literal animation) we could apply to an Arabic brand mark "أم سارة" with CSS/SVG only
Be specific and technical. No fluff.`;

async function analyze(zai: any, name: string, file: string, prompt: string, isImage: boolean) {
  const buf = readFileSync(file);
  const b64 = buf.toString('base64');
  const mime = isImage ? 'image/png' : 'video/mp4';
  const mediaType = isImage ? 'image_url' : 'video_url';
  const url = `data:${mime};base64,${b64}`;
  try {
    console.log(`\n===== ${name} =====`);
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: mediaType, [mediaType]: { url } } as any,
          ],
        },
      ],
      thinking: { type: 'disabled' },
    });
    const reply = response.choices?.[0]?.message?.content ?? '';
    writeFileSync(`/home/z/my-project/research/pinterest-new/${name}-analysis.md`, reply);
    console.log(reply.slice(0, 500) + '\n...[saved]');
    return reply;
  } catch (err: any) {
    console.error(`${name} FAILED:`, err?.message || String(err).slice(0, 300));
    return '';
  }
}

async function main() {
  const zai = await ZAI.create();
  const dir = '/home/z/my-project/research/pinterest-new';

  await analyze(zai, 'logo_ref', `${dir}/logo_ref.png`, LOGO_PROMPT, true);
  await analyze(zai, 'product_ref', `${dir}/product_ref.mp4`, PRODUCT_PROMPT, false);
  await analyze(zai, 'logo_motion', `${dir}/logo_motion.mp4`, LOGO_MOTION_PROMPT, false);
}

main();
