import ZAI from 'z-ai-web-dev-sdk';
import { readFileSync, writeFileSync } from 'fs';

async function ask(zai: any, file: string, prompt: string, label: string) {
  const b64 = readFileSync(file).toString('base64');
  const res = await zai.chat.completions.createVision({
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${b64}` } },
      ],
    }],
    thinking: { type: 'disabled' },
  });
  const reply = res.choices?.[0]?.message?.content ?? '';
  console.log(`\n===== ${label} =====\n${reply.slice(0, 900)}`);
  return `\n===== ${label} =====\n${reply}\n`;
}

async function main() {
  const zai = await ZAI.create();
  let out = '';
  const base = '/home/z/my-project/download/v4-screenshots';

  out += await ask(zai, `${base}/12-recheck-product-dark.png`,
    `This is a FULL product showcase card centered in viewport (dark theme, Arabic RTL platform). Check PRECISELY: 1) Is the cream paper document visual FULLY visible including its bottom edge and the floating "PDF·READY" chip, or is anything cut by the CARD's rounded border? 2) Are the capsule tabs above rendering with the active one gold-inverted? 3) Any element clipped by the card boundary? Give a verdict: CLIPPED or NOT-CLIPPED with evidence. Score /10.`,
    '12-recheck-product-dark (full card)');

  out += await ask(zai, `${base}/03-home-product-showcase-cv.png`,
    `This is a viewport screenshot where the product showcase card may extend BELOW the visible viewport bottom (screenshot edge). QUESTION: is the paper-document visual clipped by the VIEWPORT EDGE (screenshot boundary) rather than by the card itself? Look at where the cut happens relative to the card's rounded border. Verdict: viewport-cut vs card-cut. Score /10.`,
    '03 re-diagnosis');

  try {
    out += await ask(zai, `${base}/02-home-stats-services.png`,
      `Examine: 1) the scrolling marquee strip of service words — is its text vertically cut in half or fully visible? 2) the 6 category cards — grid alignment OK? 3) ghost numbers 01-06 visibility acceptable for a subtle editorial effect? Verdict per item. Score /10.`,
      '02-home-stats-services');
  } catch (e: any) { console.error('02 FAILED:', e?.message?.slice(0, 120)); }

  writeFileSync('/home/z/my-project/research/pinterest-new/vlm-qa-v4-recheck2.md', out);
}

main();
