import React, {useState} from 'react';
import {ArrowLeft, CaretDown, ArrowCounterClockwise} from '@phosphor-icons/react';

const nodes = [
 {id:'goal', number:'01', title:'היעד והחומר', short:'קובץ אחד, שאלה אחת', kind:'setup',
  lead:'כל המקורות בקובץ PDF אחד: שלושה קטעי ריאיון בדויים עם מזהי פסקאות. השאלה: מה עוזר לאנשים להמשיך להתנדב, ומה עלול לגרום להם להפסיק?',
  subs:[['מורידים את קובץ המקורות','שלושה ראיונות: נעמה, מיכל, איתן. אין קבצים נוספים.'],['קוראים לפחות ריאיון אחד','קשה להגדיר תוצר לחומר שלא ראיתם.'],['מגדירים תוצאה טובה','השוואה עם ציטוטים שאפשר למצוא, שלא מוחקת הבדלים. הסוכן מציע ועוצר.']],
  outcome:['מה צריך שיהיה ביד?','הקובץ שמור, ומשפט אחד על מה רוצים לדעת ממנו.']},
 {id:'build', number:'02', title:'בונים את הסוכן', short:'הקשר, משימה, כלים, הוראה', kind:'setup',
  lead:'אין הוראה מוכנה. בדף ״בונים סוכן״ מגדירים את ארבעת הרכיבים וכותבים את ההוראה במילים שלכם.',
  subs:[['ההקשר','מה החומר, איפה הוא, ומה אסור לסוכן לעשות.'],['המשימה','מטרה, תוצר שאפשר לבדוק, תנאי הצלחה, נקודת עצירה, ומה קורה אחרי הבדיקה שלכם.'],['כלים','בתרגיל הזה: רק קריאת הקובץ.'],['כותבים את ההוראה','במילים שלכם, כולל כללי הבית ומה עושים עם הערה. בדיקה עצמית לפני ההעתקה.']],
  outcome:['מה יוצא מכאן?','הוראה שכתבתם, מועתקת ומוכנה להדבקה במשימה חדשה עם הקובץ.']},
 {id:'run', number:'03', title:'מפעילים', short:'משימה חדשה, קובץ, ההוראה שלכם', kind:'agent',
  lead:'פותחים משימה חדשה ב־ChatGPT Desktop, מצרפים את קובץ המקורות ומדביקים את ההוראה. מקבלים את התוצר ולא נוגעים בו עדיין.',
  subs:[['הסוכן מציג מה קרא','אם לא, מבקשים. אין לנתח חומר שלא נקרא.'],['הסוכן מציג תוצר ועוצר','אם המשיך למסקנה, נקודת העצירה בהגדרה לא הייתה ברורה מספיק.'],['משווים למה שביקשתם','פער בין ההגדרה לתוצר הוא הממצא הראשון, לא תקלה.']],
  outcome:['מה צריך לקבל?','את מה שהגדרתם כתוצר, או הבנה של איזה חלק בהגדרה אפשר לפרש אחרת.'],
  next:['מתי ממשיכים?','כשהסוכן קרא את שלושת הראיונות, הציג תוצר ועצר.']},
 {id:'verify', number:'04', title:'בודקים מול המקור', short:'עבודת החוקר, בלי הסוכן', kind:'human',
  lead:'כאן עוצרים את הסוכן ועובדים כחוקרים. פותחים את הקובץ ובודקים כל ציטוט במקומו.',
  subs:[['מוצאים כל ציטוט לפי מזהה הפסקה','וקוראים גם את השאלה והמשך התשובה שסביבו.'],['בוחרים פרט שראוי לבדיקה','ציטוט לא מדויק, הסתייגות שנשמטה, הסבר אחר, או פירוש גורף מדי.'],['מנסחים הערה אחת','במילים שלכם, עם הפניה לפסקה.']],
  outcome:['מה צריך להשיג?','ציטוטים שנבדקו והערה אחת שמפנה למקום מסוים במקור.'],
  next:['מתי ממשיכים?','כשאפשר להסביר מה רוצים שהסוכן יבדוק שוב, ועל סמך איזו פסקה.']},
 {id:'revise', number:'05', title:'משפרים את הפירוש', short:'הסוכן חוזר למקור; אתם מחליטים', kind:'agent',
  lead:'ממשיכים באותה משימה. שולחים את ההערה ואת מה שכתבתם ב״מה קורה אחרי הבדיקה״. הסוכן בוחן מול המקור, לא מסכים אוטומטית.',
  subs:[['שולחים הערה ומזהה פסקה','באותה משימה. מה לעשות איתה כבר כתוב בהוראה שלכם.'],['בודקים את התגובה','חזר למקור או רק הסכים? ההסבר לשינוי מפנה לפסקה?'],['שומרים ומשקפים','טבלה, פסקה, משפט משלכם, וההגדרה שעשתה את זה. רפלקציה בדף בונים סוכן.']],
  outcome:['עם מה יוצאים?','השוואה שבדקתם, פירוש מסויג עם הפניות, משפט על ההחלטה, והגדרת סוכן שאפשר להשתמש בה שוב.'],
  next:['איך יודעים שסיימנו?','אפשר להראות היכן המקור תומך, מה מסבך, מה לא ידוע, ואיזה חלק בהגדרה עשה את ההבדל.']}
];

export default function ExerciseMap(){
 const [open,setOpen]=useState('build');
 const current=nodes.find(n=>n.id===open);
 return <section className="exercise-page map-page">
  <header className="exercise-heading"><p className="eyebrow">מפת התרגיל</p><h1>התרגיל במבט אחד</h1><p className="subtitle">חמישה צעדים, עצירה אחת לבדיקה. לוחצים על צעד כדי לראות מה עושים בו.</p></header>
  <div className="map-flow" role="list" aria-label="צעדי התרגיל">
   {nodes.map((n,i)=><React.Fragment key={n.id}>
    <button role="listitem" className={`map-node ${n.kind} ${open===n.id?'open':''}`} aria-expanded={open===n.id} aria-controls="map-detail" onClick={()=>setOpen(open===n.id?null:n.id)}>
     <span className="map-number">{n.number}</span>
     <span className="map-title">{n.title}</span>
     <span className="map-short">{n.short}</span>
     <span className="map-kind">{n.kind==='human'?'החוקר':n.kind==='setup'?'אתם':'עם הסוכן'}</span>
     <CaretDown className="map-caret" size={20}/>
    </button>
    {i<nodes.length-1&&<span className="map-arrow" aria-hidden="true"><ArrowLeft size={26}/></span>}
   </React.Fragment>)}
  </div>
  <p className="map-loop"><ArrowCounterClockwise size={16}/><span>שני מקומות שבהם חוזרים אחורה: תוצר שלא תואם את ההגדרה מחזיר לצעד 02; תיקון שמעלה שאלה חדשה מחזיר לצעד 04.</span></p>
  <div id="map-detail" className={`map-detail ${current?'shown':''}`} aria-live="polite">
   {current&&<div key={current.id} className="map-detail-inner">
    <div className="map-detail-head"><span className="map-number">{current.number}</span><h2>{current.title}</h2></div>
    <p className="map-lead">{current.lead}</p>
    <ol className="map-subs">{current.subs.map(([t,d],i)=><li key={t}><span className="map-sub-index">{i+1}</span><div><strong>{t}</strong><p>{d}</p></div></li>)}</ol>
    <div className="map-outcomes">
     <div><strong>{current.outcome[0]}</strong><p>{current.outcome[1]}</p></div>
     {current.next&&<div><strong>{current.next[0]}</strong><p>{current.next[1]}</p></div>}
    </div>
   </div>}
  </div>
  <div className="exercise-next"><a className="button" href="#workshop">לתרגיל עצמו<ArrowLeft size={20}/></a><a className="text-action" href="#build/context">לדף בונים סוכן</a></div>
 </section>;
}
