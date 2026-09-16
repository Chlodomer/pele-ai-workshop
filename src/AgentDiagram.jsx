import React, {useState} from 'react';

// Four parts of the instruction → the agent → what comes back.
// Hovering or focusing a part reveals what it controls and lights the matching piece of the product.
const parts = [
 {id:'goal', number:'01', title:'מטרה', question:'מה אני רוצה לדעת?',
  body:'מה עוזר לשלושת המרואיינים להמשיך להתנדב, ומה עלול לגרום להם להפסיק.',
  controls:'מה הסוכן מחפש בחומר.',
  example:'״עזור לי להבין מה עוזר לכל אחד מהם להמשיך, ומה עלול לגרום לו להפסיק.״',
  lights:['labels']},
 {id:'material', number:'02', title:'חומר', question:'מה מותר לו לקרוא?',
  body:'רק קובץ ה־PDF המצורף. בלי ידע מבחוץ, בלי ציטוטים שלא נמצאים בקובץ.',
  controls:'מאיפה מגיעות התשובות.',
  example:'״עבוד רק עם הקובץ המצורף. אל תוסיף ידע מבחוץ ואל תנסח ציטוט שאינו בקובץ.״',
  lights:['ids']},
 {id:'product', number:'03', title:'תוצר', question:'מה צריך לחזור?',
  body:'השוואה קצרה: לכל מרואיין כמה סיבות להמשיך וכמה להפסיק, כל אחת עם מזהה פסקה. ההבדלים נשארים גלויים. מה שלא ברור, ברשימה נפרדת.',
  controls:'הצורה של התשובה, כדי שאפשר יהיה לבדוק אותה מול המקור.',
  example:'״לכל מרואיין: 2–3 סיבות להמשיך, 1–2 סיכונים להפסקה, כל אחת עם מזהה פסקה. אחר כך: במה הם נבדלים, ומה נשאר לא ברור.״',
  lights:['a','b','c']},
 {id:'stop', number:'04', title:'נקודת עצירה', question:'מתי הוא עוצר?',
  body:'אחרי הקריאה הראשונה. בלי מסקנה. כשמגיעה הערה: מתקן רק את הפריט, מסמן מה השתנה, ועוצר שוב.',
  controls:'מי מחליט. אתם.',
  example:'״הצג את זה כקריאה ראשונה ועצור. אל תסיק מסקנה. אחרי הערה שלי, תקן רק את הפריט וסמן מה השתנה.״',
  lights:['d','loop']},
];

export default function AgentDiagram(){
 const [hover,setHover]=useState(null);const [pinned,setPinned]=useState(null);
 const active=hover??pinned;const lit=new Set(active?parts.find(p=>p.id===active).lights:[]);
 const cls=(key,base)=>`${base}${active?(lit.has(key)?' lit':' dim'):''}`;
 return <div className={`agent-diagram${active?' focused':''}`} onMouseLeave={()=>setHover(null)}>
  <p className="ad-hint" aria-hidden="true">{active?'החלק הזה קובע: '+parts.find(p=>p.id===active).controls:'עוברים עם העכבר על אחד מארבעת החלקים כדי לראות מה הוא קובע, ואיזה חלק בתוצר תלוי בו.'}</p>
  <div className="ad-grid">
   <ol className="ad-parts" aria-label="ארבעת חלקי ההוראה">{parts.map((p,i)=><li key={p.id} style={{'--i':i}}>
    <button type="button" className={`ad-part${active===p.id?' active':''}`} aria-pressed={pinned===p.id} onMouseEnter={()=>setHover(p.id)} onFocus={()=>setHover(p.id)} onBlur={()=>setHover(null)} onClick={()=>setPinned(pinned===p.id?null:p.id)}>
     <span className="ad-number">{p.number}</span>
     <span className="ad-title">{p.title}</span>
     <span className="ad-question">{p.question}</span>
     <span className="ad-body">{p.body}</span>
     <span className="ad-reveal"><span><span className="ad-controls"><strong>קובע:</strong> {p.controls}</span><span className="ad-example">{p.example}</span></span></span>
    </button></li>)}</ol>

   <div className="ad-flow" aria-hidden="true"><span className="ad-arrow"/><span className="ad-arrow"/><span className="ad-arrow"/><span className="ad-arrow"/></div>

   <div className="ad-agent" aria-label="הסוכן"><span className="ad-agent-name">הסוכן</span><span className="ad-agent-verbs"><span>קורא</span><span>משווה</span><span>מציע</span><span>עוצר</span></span></div>

   <div className="ad-flow single" aria-hidden="true"><span className="ad-arrow"/></div>

   <div className="ad-product" aria-label="מה חוזר מהסוכן">
    <h3>מה חוזר</h3>
    <section className={cls('a','ad-block')}><span className="ad-label">א · לכל מרואיין (×3)</span>
     <div className="ad-card"><strong dir="auto">INT01 נעמה</strong>
      <p><span className={cls('labels','ad-tag stay')}>ממשיכה כי</span> … <span className={cls('ids','ad-id')}>[INT01-P02]</span></p>
      <p><span className={cls('labels','ad-tag stay')}>ממשיכה כי</span> … <span className={cls('ids','ad-id')}>[INT01-P05]</span></p>
      <p><span className={cls('labels','ad-tag quit')}>עלולה להפסיק אם</span> … <span className={cls('ids','ad-id')}>[INT01-P07]</span></p>
      <small>ואחריה INT03 מיכל, INT02 איתן</small></div></section>
    <section className={cls('b','ad-block')}><span className="ad-label">ב · במה הם נבדלים</span>
     <div className="ad-card"><p>נעמה מול מיכל: …</p><p>איתן לבדו: …</p><small>הבדל נשאר הבדל, לא מתמזג</small></div></section>
    <section className={cls('c','ad-block')}><span className="ad-label">ג · מה לא היה ברור</span>
     <div className="ad-card"><p><span className={cls('ids','ad-id')}>INT02-P03</span> יכול להתפרש כ… או כ…</p><p>אף אחד לא מדבר ישירות על …</p></div></section>
    <section className={cls('d','ad-block stop')}><span className="ad-label">ד · ואז הוא עוצר</span>
     <div className="ad-card"><p>״קריאה ראשונה. ממתין לבדיקה שלכם.״</p></div></section>
   </div>
  </div>

  <div className={cls('loop','ad-loop')} aria-label="מעגל הבדיקה"><span className="ad-loop-line"/><ol><li>בודקים מול ה־PDF</li><li>שולחים הערה אחת</li><li>הסוכן מתקן את הפריט</li><li>ועוצר שוב</li></ol></div>
 </div>;
}
