import ZAI from 'z-ai-web-dev-sdk';
import { readFileSync } from 'fs';

const QA_PROMPT = `You are a strict senior product designer doing visual QA on screenshots of a premium Arabic RTL academic platform "أم سارة" (dark forest-green + champagne gold identity, Amiri serif wordmarks). Rate each screenshot 1-10 and list ONLY real, visible problems (layout breaks, overflow, illegible text, broken images/icons, contrast failures, misalignment, RTL issues). If the screenshot shows a LOGO (arch + pearl + underline mark) or a PRODUCT SHOWCASE (cinematic card with capsule tabs + document visual + radar visual), specifically evaluate:
LOGO: is the arch+pearl+underline mark rendering cleanly? balanced? professional?
SHOWCASE: are the capsule tabs, animated document visual, floating chips, value chips, and CTA rendering correctly? is the RTL layout correct?
Be concise. Answer per screenshot: [name] score: X/10, issues: ...`;

const SHOTS = [
  ['01-home-dark-hero-1920', 'Hero: logo orbit center (arch+pearl logo), asymmetric headline'],
  ['02-home-stats-services', 'Stats band + category cards grid'],
  ['03-home-product-showcase-cv', 'Product showcase - CV builder tab active'],
  ['04-home-product-showcase-plagiarism', 'Product showcase - plagiarism tab active'],
  ['05-home-logo-orbit', 'Hero logo closeup in knowledge orbit'],
  ['06-mobile-home', 'Mobile 390px home'],
  ['07-mobile-product-cv', 'Mobile product showcase CV'],
  ['08-mobile-product-plagiarism', 'Mobile product showcase plagiarism'],
  ['09-home-light', 'Light theme home'],
  ['10-product-light', 'Light theme product showcase'],
];

async function main() {
  const zai = await ZAI.create();
  let out = '';
  for (const [name, desc] of SHOTS) {
    try {
      const b64 = readFileSync(`/home/z/my-project/download/v4-screenshots/${name}.png`).toString('base64');
      const res = await zai.chat.completions.createVision({
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: `${QA_PROMPT}\n\nContext: ${desc}` },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${b64}` } },
          ],
        }],
        thinking: { type: 'disabled' },
      });
      const reply = res.choices?.[0]?.message?.content ?? '(no reply)';
      out += `\n===== ${name} =====\n${reply}\n`;
      console.log(`\n===== ${name} =====\n${reply.slice(0, 600)}`);
    } catch (e: any) {
      console.error(`${name} FAILED:`, e?.message?.slice(0, 200));
    }
  }
  const { writeFileSync } = await import('fs');
  writeFileSync('/home/z/my-project/research/pinterest-new/vlm-qa-v4.md', out);
}

main();
