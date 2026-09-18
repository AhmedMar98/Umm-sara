import ZAI from 'z-ai-web-dev-sdk';
import { readFileSync } from 'fs';

async function main() {
  const zai = await ZAI.create();
  const b64 = readFileSync('/home/z/my-project/download/v4-screenshots/09-home-light.png').toString('base64');
  const res = await zai.chat.completions.createVision({
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: `In this light-theme Arabic RTL page screenshot, find the 3-step "how it works" cards (numbered 01, 02, 03 with dashed connector line). QUESTION: In RTL Arabic, the FIRST step (01) must be on the RIGHT side and the LAST (03) on the LEFT. Where is card 01: right side or left side? Also check the 3 testimonial cards order. Answer precisely.` },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${b64}` } },
      ],
    }],
    thinking: { type: 'disabled' },
  });
  console.log(res.choices?.[0]?.message?.content ?? '');
}

main();
