import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, '..');
const downloads = resolve(root, 'public/downloads');
const tempDir = resolve(root, 'tmp/pdfs');
mkdirSync(tempDir, { recursive: true });

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const clean = (value) => value
  .replaceAll('\u2014', ':')
  .replaceAll('\u2013', '-')
  .replaceAll('\u2011', '-');

const dataUrl = (path, mime) => `data:${mime};base64,${readFileSync(path).toString('base64')}`;
const logo = dataUrl(resolve(root, 'public/assets/high-ai-logo.jpg'), 'image/jpeg');
const assistantRegular = dataUrl(resolve(root, 'public/assets/fonts/Assistant-Regular.ttf'), 'font/ttf');
const assistantSemiBold = dataUrl(resolve(root, 'public/assets/fonts/Assistant-SemiBold.ttf'), 'font/ttf');
const karantinaBold = dataUrl(resolve(root, 'public/assets/fonts/Karantina-Bold.ttf'), 'font/ttf');

const interviewFiles = [
  ['INT01', 'נעמה', 'מקור 1'],
  ['INT03', 'מיכל', 'מקור 2'],
  ['INT02', 'איתן', 'מקור 3'],
];

function interviewPage([id, name, sourceLabel]) {
  const raw = clean(readFileSync(resolve(downloads, `${id}_interview.txt`), 'utf8'));
  const paragraphs = [...raw.matchAll(/\[(INT\d{2}-P\d{2})\]\s*([^:]+):\s*([\s\S]*?)(?=\n\n\[|$)/g)];
  if (paragraphs.length !== 12) throw new Error(`${id}: expected 12 numbered paragraphs, found ${paragraphs.length}`);
  const metadata = raw.split('\n').slice(2, 6).map(clean);
  return `<section class="page interview-page">
    <header class="page-header">
      <img src="${logo}" alt="HIGH AI">
      <div><span>${sourceLabel}</span><bdi dir="ltr">${id}</bdi></div>
    </header>
    <div class="interview-title">
      <p>קטע ריאיון סינתטי</p>
      <h1>${name}</h1>
      <div class="gold-rule"></div>
    </div>
    <div class="metadata">
      ${metadata.map(line => `<p>${escapeHtml(line)}</p>`).join('')}
    </div>
    <div class="transcript">
      ${paragraphs.map(([, ref, speaker, words]) => `<article class="turn">
        <div class="turn-ref"><bdi dir="ltr">${ref}</bdi></div>
        <p><strong>${escapeHtml(speaker.trim())}:</strong> ${escapeHtml(clean(words.trim()))}</p>
      </article>`).join('')}
    </div>
    <footer><span>בינה איכותנית | פל״א | HIGH AI</span><span class="page-number"></span></footer>
  </section>`;
}

const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<title>חומרי התרגיל | בינה איכותנית</title>
<style>
@font-face{font-family:Assistant;src:url('${assistantRegular}') format('truetype');font-weight:400}
@font-face{font-family:Assistant;src:url('${assistantSemiBold}') format('truetype');font-weight:600}
@font-face{font-family:Karantina;src:url('${karantinaBold}') format('truetype');font-weight:700}
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#d8d8d1;color:#18372d;font-family:Assistant,Arial,sans-serif}
.page{position:relative;width:210mm;height:297mm;margin:0 auto;background:#f6f4ec;overflow:hidden;page-break-after:always}
.page:last-child{page-break-after:auto}
.cover{padding:16mm 18mm 14mm}
.cover:before,.cover:after{content:"";position:absolute;right:0;bottom:0;width:100%;height:47mm;background:#004128;clip-path:polygon(0 32%,100% 0,100% 100%,0 100%);z-index:0}
.cover:after{right:auto;left:18mm;width:11mm;height:53mm;background:#8b7029;clip-path:polygon(0 18%,100% 8%,100% 100%,0 100%)}
.cover>*{position:relative;z-index:1}
.brand-line{display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1.2mm solid #004128;padding-bottom:7mm}
.brand-line img{width:48mm;height:auto;mix-blend-mode:multiply}
.brand-line p{font-size:10pt;color:#5f6f67;margin:2mm 0 0}
.cover-copy{margin-top:24mm;max-width:150mm}
.cover-copy .eyebrow{font-size:12pt;color:#8b7029;font-weight:600;margin:0 0 5mm}
.cover-copy h1{font-family:Karantina,Assistant,sans-serif;font-size:47pt;line-height:.9;color:#004128;margin:0 0 7mm}
.cover-copy .subtitle{font-size:19pt;line-height:1.35;margin:0 0 13mm;max-width:130mm}
.purpose-grid{display:grid;grid-template-columns:1fr 1fr;gap:7mm;max-width:155mm}
.purpose-card{border-top:1.2mm solid #8b7029;padding-top:4mm}
.purpose-card h2{font-size:13pt;margin:0 0 3mm;color:#004128}
.purpose-card p{font-size:10.4pt;line-height:1.5;margin:0}
.cover-note{position:absolute;bottom:13mm;right:40mm;left:40mm;color:#f6f4ec;font-size:9.5pt;line-height:1.5;text-align:center}
.cover-note strong{display:block;font-size:12pt;margin-bottom:2mm}
.page-header{height:23mm;padding:7mm 15mm 4mm;display:flex;align-items:center;justify-content:space-between;border-bottom:.5mm solid #b8b9ab}
.page-header img{width:39mm;height:auto;mix-blend-mode:multiply}
.page-header div{display:flex;align-items:center;gap:4mm;font-size:10pt;color:#5f6f67}
.page-header bdi{font-weight:600;color:#004128}
.interview-page{padding-bottom:16mm}
.interview-title{position:absolute;top:30mm;right:15mm;width:35mm}
.interview-title p{font-size:8.5pt;color:#8b7029;font-weight:600;margin:0 0 1mm}
.interview-title h1{font-family:Karantina,Assistant,sans-serif;font-size:31pt;line-height:1;margin:0;color:#004128}
.gold-rule{width:18mm;height:1.1mm;background:#8b7029;margin-top:3mm}
.metadata{position:absolute;top:30mm;right:55mm;left:15mm;padding:3.2mm 4mm;background:#ebe9dc;border-right:1mm solid #8b7029}
.metadata p{font-size:7.8pt;line-height:1.35;margin:.5mm 0;color:#40544d}
.transcript{position:absolute;top:61mm;right:15mm;left:15mm;bottom:17mm;display:grid;grid-template-columns:1fr 1fr;grid-auto-flow:column;grid-template-rows:repeat(6,auto);column-gap:9mm;align-content:start}
.turn{display:grid;grid-template-columns:23mm 1fr;gap:2.2mm;border-top:.25mm solid #c7c8bb;padding:2.3mm 0 2.1mm;break-inside:avoid}
.turn:nth-child(1),.turn:nth-child(7){border-top:.8mm solid #004128}
.turn-ref{direction:ltr;text-align:left;font-size:7.3pt;color:#8b7029;font-weight:600;padding-top:.4mm}
.turn p{font-size:8.55pt;line-height:1.34;margin:0;text-align:right}
.turn strong{color:#004128}
footer{position:absolute;bottom:6mm;right:15mm;left:15mm;display:flex;justify-content:space-between;border-top:.3mm solid #b8b9ab;padding-top:2mm;font-size:7.5pt;color:#66766f}
.page-number:after{counter-increment:page;content:counter(page)}
@media print{html,body{background:white}.page{margin:0}}
</style>
</head>
<body>
  <section class="page cover">
    <div class="brand-line"><img src="${logo}" alt="HIGH AI"><p>17 בספטמבר 2026 | סדנת בינה איכותנית</p></div>
    <div class="cover-copy">
      <p class="eyebrow">חומרי התרגיל</p>
      <h1>שלושה ראיונות.<br>שאלה אחת.</h1>
      <p class="subtitle">כיצד סוכן AI יכול לעזור לנו להשוות מקורות, וכיצד אנחנו בודקים ומשפרים את הפירוש שלו?</p>
      <div class="purpose-grid">
        <div class="purpose-card"><h2>מהו הסוכן בתרגיל?</h2><p>משימה שאנו מגדירים בתוך ChatGPT. אנחנו נותנים לה מטרה, חומרי מקור, תוצר מבוקש ונקודת עצירה לבדיקה. אין צורך בתכנות.</p></div>
        <div class="purpose-card"><h2>מה הוא אמור לעשות?</h2><p>לקרוא שלושה ראיונות, להשוות ביניהם, לצטט במדויק ולהציג פירוש ראשוני שאפשר לבדוק מול המקור.</p></div>
        <div class="purpose-card"><h2>מה אנחנו עושים?</h2><p>בודקים את הציטוטים וההקשר, מזהים מה חסר או גורף מדי, ומבקשים מהסוכן לשפר את הפירוש.</p></div>
        <div class="purpose-card"><h2>שאלת העבודה</h2><p>מה עוזר לאנשים להמשיך להתנדב, ומה עלול לגרום להם להפסיק?</p></div>
      </div>
    </div>
    <div class="cover-note"><strong>חומר סינתטי לתרגול בלבד</strong>כל האנשים, האירועים והציטוטים בדויים. אין להסיק מהחומר על אוכלוסייה אמיתית.</div>
  </section>
  ${interviewFiles.map(interviewPage).join('\n')}
</body>
</html>`;

const htmlPath = resolve(tempDir, 'workshop-exercise.html');
writeFileSync(htmlPath, html);
console.log(htmlPath);
