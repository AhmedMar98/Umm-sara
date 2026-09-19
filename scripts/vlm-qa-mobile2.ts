import ZAI from 'z-ai-web-dev-sdk';
import { readFileSync, writeFileSync } from 'fs';

async function main() {
  const zai = await ZAI.create();
  let out = '';
  for (const name of ['13-mobile-showcase-verified', '14-mobile-showcase-info']) {
    try {
      const b64 = readFileSync(`/home/z/my-project/download/v4-screenshots/${name}.png`).toString('base64');
      const res = await zai.chat.completions.createVision({
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: `Mobile (390px) view of a product showcase card from an Arabic RTL premium platform. Check: 1) document visual with gold ATS scan beam visible and not clipped? 2) typography legible at this size? 3) any horizontal overflow or broken layout? 4) pills/tabs usable as touch targets (min ~44px)? Score /10 + issues.` },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${b64}` } },
          ],
        }],
        thinking: { type: 'disabled' },
      });
      const reply = res.choices?.[0]?.message?.content ?? '';
      out += `\n===== ${name} =====\n${reply}\n`;
      console.log(`\n===== ${name} =====\n${reply.slice(0, 600)}`);
    } catch (e: any) {
      console.error(`${name} FAILED:`, e?.message?.slice(0, 150));
    }
  }
  writeFileSync('/home/z/my-project/research/pinterest-new/vlm-qa-v4-mobile.md', out);
}

main();
