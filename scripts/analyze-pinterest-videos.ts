import ZAI from 'z-ai-web-dev-sdk';
import { writeFileSync } from 'fs';

const PROMPT = `This is a web design / UI UX motion inspiration video (screen recording of websites). Analyze it as an art director and creative developer. Describe in detail:
1) Overall design style and mood (colors with approximate hex values, background treatment)
2) Typography observed (serif/sans/mono, sizes, weights, hierarchy)
3) Layout and grid (hero composition, sections, cards, spacing, alignment)
4) Motion and micro-interactions (scroll effects, hover states, transitions, timing, easing feel)
5) Navigation and UI patterns (menus, buttons, forms)
6) Distinctive signature elements (cursor effects, grain, borders, overlays, marquees, 3D, gradients)
7) The single most important lesson applicable to a premium Arabic RTL dark-theme academic services website
Be specific and technical. No fluff.`;

async function main() {
  const videos: Array<[string, string]> = [
    ['video1', 'https://v1.pinimg.com/videos/iht/expMp4/13/56/74/135674fa48283dc2cb523afb95f7ce13_720w.mp4'],
    ['video2', 'https://v1.pinimg.com/videos/iht/expMp4/61/3d/08/613d080b7ef6fafe0a97204a0caa7590_720w.mp4'],
    ['video3', 'https://v1.pinimg.com/videos/iht/720p/8c/06/de/8c06def49ba51ec4e958a6b918bb105d.mp4'],
  ];

  const zai = await ZAI.create();
  for (const [name, url] of videos) {
    try {
      console.log(`\n===== ${name} =====`);
      const response = await zai.chat.completions.createVision({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: PROMPT },
              { type: 'video_url', video_url: { url } },
            ],
          },
        ],
        thinking: { type: 'disabled' },
      });
      const reply = response.choices?.[0]?.message?.content ?? '';
      writeFileSync(`/home/z/my-project/research/pinterest-videos/${name}-analysis.md`, reply);
      console.log(reply.slice(0, 400) + '\n...[saved to file]');
    } catch (err: any) {
      console.error(`${name} FAILED:`, err?.message || String(err).slice(0, 300));
      // Fallback: try base64 local file
      try {
        console.log(`Retrying ${name} with base64 local file...`);
        const { readFileSync } = await import('fs');
        const buf = readFileSync(`/home/z/my-project/research/pinterest-videos/${name}.mp4`);
        const b64 = buf.toString('base64');
        const response = await zai.chat.completions.createVision({
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: PROMPT },
                { type: 'video_url', video_url: { url: `data:video/mp4;base64,${b64}` } },
              ],
            },
          ],
          thinking: { type: 'disabled' },
        });
        const reply = response.choices?.[0]?.message?.content ?? '';
        writeFileSync(`/home/z/my-project/research/pinterest-videos/${name}-analysis.md`, reply);
        console.log(`base64 OK: ${reply.slice(0, 300)}...`);
      } catch (err2: any) {
        console.error(`${name} base64 also FAILED:`, err2?.message || String(err2).slice(0, 300));
      }
    }
  }
}
main();
