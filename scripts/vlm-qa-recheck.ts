import ZAI from 'z-ai-web-dev-sdk';
import { readFileSync, writeFileSync } from 'fs';

const PROMPTS: Record<string, string> = {
  '11-recheck-product-light': `Focused QA on a light-theme product showcase card of an Arabic RTL academic platform. The card should show: right side = product info (title بنّاء السيرة الذاتية, points, value chips, CTA); left side = a LIVE VISUAL zone containing a cream paper document with gold scan beam and floating chips (ATS PASSED / PDF READY). QUESTION 1: Is the paper document visual visible and complete? QUESTION 2: Is anything clipped or cut off at the edges? QUESTION 3: any contrast/legibility failures in light mode? Answer precisely with yes/no + details. Score /10.`,
  '03-home-product-showcase-cv': `Focused QA on a dark-theme product showcase (CV builder tab). Should show: capsule tabs (active gold), info column right, document visual with ATS scan beam left. Report: 1) document visual complete or clipped? 2) tabs render correctly? 3) any overflow/alignment issues? Score /10.`,
  '02-home-stats-services': `Look at the marquee strip (scrolling services words) and the category cards grid. 1) Is the marquee text vertically clipped/cut? 2) Are the ghost numbers (01-06) visible enough? 3) Card grid alignment OK? Be precise. Score /10.`,
};

async function main() {
  const zai = await ZAI.create();
  let out = '';
  for (const [name, prompt] of Object.entries(PROMPTS)) {
    try {
      const b64 = readFileSync(`/home/z/my-project/download/v4-screenshots/${name}.png`).toString('base64');
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
      out += `\n===== ${name} =====\n${reply}\n`;
      console.log(`\n===== ${name} =====\n${reply.slice(0, 700)}`);
    } catch (e: any) {
      console.error(`${name} FAILED:`, e?.message?.slice(0, 200));
    }
  }
  writeFileSync('/home/z/my-project/research/pinterest-new/vlm-qa-v4-recheck.md', out);
}

main();
