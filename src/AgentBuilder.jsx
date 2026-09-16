import React, {useEffect, useState} from 'react';
import {ArrowLeft, Copy, ArrowCounterClockwise, CaretDown, Check} from '@phosphor-icons/react';

const KEY='agent-builder-v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const save=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}};

const defaults={
 // A. context
 question:'', where:'file', materials:{interviews:true,fieldnote:false,context:false,other:false}, materialsNote:'', rulesCustom:'',
 // B. task
 purpose:'', output:'', success:{quote:true,perCase:false,complication:false,unclear:false}, successCustom:'', stop:'', afterCheck:'',
 // C. tools
 tools:{read:true,web:false,code:false,file:false}, toolsNote:'',
 // D. instruction written by the participant
 instruction:'', agentOut:'', selfcheck:{purpose:false,output:false,stop:false,rules:false,after:false},
 // E. reflection
 r1:'', r2:'', r3:'', rubric:{purpose:'',material:'',output:'',stop:''}
};

const rubricLevels=[['vague','מעורפל','אי אפשר לדעת מהתוצאה אם הסוכן עשה את מה שביקשתי.'],['partial','חלקי','אפשר לבדוק חלק, אבל נשארו פרשנויות פתוחות למה שביקשתי.'],['checkable','ניתן לבדיקה','כל מי שיקרא את ההגדרה ואת התוצאה יוכל להכריע אם היא עומדת בה.']];

const Field=({id,label,hint,value,onChange,rows=2,weak,strong})=><div className="ab-field"><label htmlFor={id}>{label}</label>{hint&&<p className="ab-hint">{hint}</p>}{(weak||strong)&&<div className="ab-examples"><div><b>חלש</b><span>{weak}</span></div><div><b>חזק</b><span>{strong}</span></div></div>}<textarea id={id} rows={rows} value={value} onChange={e=>onChange(e.target.value)}/></div>;
const Checks=({group,items,state,toggle})=><ul className="ab-checks">{items.map(([k,t])=><li key={k}><label><input type="checkbox" id={`${group}-${k}`} checked={!!state[group][k]} onChange={()=>toggle(group,k)}/><span>{t}</span></label></li>)}</ul>;

const instructorVersion=`אתה סוכן המסייע לי להבין נתונים איכותניים. עבוד רק עם שלושת הראיונות שבקובץ המצורף, ואל תשנה את המקור.\nהשאלה שלי: מה עוזר לאנשים להמשיך להתנדב, ומה עלול לגרום להם להפסיק?\nקרא את שלושת הראיונות והצג טבלה קצרה, שורה לכל ריאיון: מזהה; פירוש ראשוני; ציטוט מדויק עם מזהה הפסקה; פרט שמסבך את הפירוש או נשאר לא ברור. קרא כל ציטוט בהקשרו. אל תשלים מידע חסר ואל תכליל מהחומר הבדוי על אנשים אמיתיים.\nעצור אחרי הטבלה והמתן לבדיקה שלי. אם אינך יכול לקרוא את הקובץ, אמור זאת ואל תנתח.\n\nכשאחזיר לך הערה: בחן אותה מול המקור; אל תסכים איתי אוטומטית. תקן את הטבלה אם צריך והסבר בקצרה מה השתנה ולמה. לאחר מכן כתוב עד חמש שורות: מה יהיה מטעה בטענה שאנשים ממשיכים להתנדב מפני שהם מרגישים שייכים? הצע פירוש זהיר יותר, עם הפניות לפסקאות ומה שנותר לא מוכרע.`;
const sectionIndex={context:0,task:1,tools:2,write:3,reflect:4};
export default function AgentBuilder({section}){
 const [s,setS]=useState(()=>({...defaults,...load()}));
 const [copied,setCopied]=useState('');
 useEffect(()=>{save(s)},[s]);
 const set=(k,v)=>setS(p=>({...p,[k]:v}));
 const toggle=(g,k)=>setS(p=>({...p,[g]:{...p[g],[k]:!p[g][k]}}));




 const stageChecks=[
  [['שאלת עבודה',!!s.question.trim()],['מיקום החומר',!!s.where],['סוג החומר',Object.values(s.materials).some(Boolean)]],
  [['מטרה',!!s.purpose.trim()],['תוצר שאפשר לבדוק',s.output.trim().length>20],['שני תנאי הצלחה',Object.values(s.success).filter(Boolean).length+(s.successCustom.trim()?1:0)>=2],['נקודת עצירה',!!s.stop.trim()],['אחרי הבדיקה',!!s.afterCheck.trim()]],
  [['הכלים הוחלטו',Object.values(s.tools).some(Boolean)]],
  [['ההוראה נכתבה',s.instruction.trim().length>40],['בדיקה עצמית',Object.values(s.selfcheck).every(Boolean)]],
  [['שלוש תשובות',!!(s.r1.trim()&&s.r2.trim()&&s.r3.trim())],['ארבע הערכות עצמיות',Object.values(s.rubric).every(Boolean)]]
 ];
 const stageDone=stageChecks.map((c,i)=>c.length>0&&c.every(x=>x[1]));
 const total=stageChecks.flat().length, done=stageChecks.flat().filter(x=>x[1]).length;
 const stageMeta=[['01','ההקשר: מה עומד לרשות הסוכן, ומה אסור לו לעשות'],['02','המשימה: מה לעשות, מתי זה הצליח, מתי לעצור'],['03','כלים: מה הסוכן צריך כדי לבצע'],['04','כותבים את ההוראה לסוכן'],['05','אחרי ההרצה: רפלקציה']];
 const [open,setOpen]=useState(()=>{if(section in sectionIndex)return sectionIndex[section];try{const v=Number(sessionStorage.getItem(KEY+'-open'));return Number.isFinite(v)?v:0}catch{return 0}});
 useEffect(()=>{if(section in sectionIndex){setOpen(sectionIndex[section]);setTimeout(()=>document.getElementById(`stage-${sectionIndex[section]}`)?.scrollIntoView({block:'start'}),50)}},[section]);
 useEffect(()=>{try{sessionStorage.setItem(KEY+'-open',String(open))}catch{}},[open]);
 const goto=i=>{setOpen(i);setTimeout(()=>document.getElementById(`stage-${i}`)?.scrollIntoView({block:'start',behavior:'smooth'}),30)};
 const renderStage=(i,children,next=true)=>{const [num,title]=stageMeta[i];const checks=stageChecks[i];const ok=stageDone[i];const isOpen=open===i;
  return <section id={`stage-${i}`} className={`ab-stage ${isOpen?'open':''} ${ok?'done':''}`}>
   <button type="button" className="ab-stage-head" aria-expanded={isOpen} aria-controls={`stage-body-${i}`} onClick={()=>setOpen(isOpen?-1:i)}><span className="map-number">{num}</span><h2>{title}</h2><span className="ab-stage-status">{ok?<><Check size={14}/> הושלם</>:checks.length?`${checks.filter(x=>x[1]).length} / ${checks.length}`:''}</span><CaretDown size={22} className="ab-caret"/></button>
   {isOpen&&<div id={`stage-body-${i}`} className="ab-stage-body">{children}{next&&i<4&&<div className="ab-stage-next"><button type="button" className="button" onClick={()=>goto(i+1)}>{ok?'סיימתי, לשלב הבא':'ממשיכים בכל זאת'}<ArrowLeft size={20}/></button>{!ok&&<span className="ab-hint">אפשר לחזור ולהשלים אחר כך.</span>}</div>}</div>}
  </section>};
 return <div className="exercise-page ab-page">
  <header className="exercise-heading"><p className="eyebrow">בונים סוכן</p><h1>בונים סוכן<br/>במו ידיכם</h1><p className="subtitle">רשימת בדיקה בשלושה חלקים: הקשר, משימה, כלים. בסוף כותבים הוראת עבודה אחת ושולחים אותה לסוכן.</p><p>הסוכן הוא מה שאתם מגדירים: מטרה, חומר, תוצר ונקודת עצירה. אין כאן הנחיה מוכנה להעתקה; יש שאלות שמכריחות להחליט. אפשר לחזור ולשנות בכל שלב.</p><p className="ab-storage">הטקסט נשמר בדפדפן הזה בלבד. לפני מעבר למחשב אחר, מעתיקים למסמך (הכפתור בשלב 05).</p></header>
  <nav className="ab-strip" aria-label="מיקום בתרגיל"><span>צעד 2 מתוך 5 בתרגיל</span><a href="#workshop">חזרה לצעדי התרגיל</a></nav>

  

  <div className="ab-main">
  {renderStage(0,<>
   <Field id="q" label="שאלת העבודה" hint="שאלה אחת שאפשר לבדוק בחומר. לא נושא, שאלה." value={s.question} onChange={v=>set('question',v)} weak="שיח מורים." strong="כיצד מורים חדשים מתארים את הרגע שבו ביקשו עזרה מעמית בפעם הראשונה?"/>
   <div className="ab-field"><span className="ab-label">איפה החומר נמצא?</span><div className="ab-radios">{[['file','קובץ מצורף למשימה'],['folder','תיקייה שהוגדרה כסביבת עבודה'],['other','אחר']].map(([k,t])=><label key={k}><input type="radio" name="where" id={`where-${k}`} checked={s.where===k} onChange={()=>set('where',k)}/>{t}</label>)}</div></div>
   <div className="ab-field"><span className="ab-label">מה החומר כולל?</span><Checks state={s} toggle={toggle} group="materials" items={[['interviews','קטעי ריאיון עם מזהי פסקאות'],['fieldnote','רשומת תצפית'],['context','מסמכי הקשר (לא ראיות)'],['other','אחר']]}/>{s.materials.other&&<textarea id="mnote" rows="1" placeholder="מה עוד?" value={s.materialsNote} onChange={e=>set('materialsNote',e.target.value)}/>}</div>
   <div className="ab-field"><span className="ab-label">כללי בית: מה הסוכן לא עושה</span><p className="ab-hint">אלה לא החלטות עיצוב אלא אתיקה של עבודה עם מקורות. בשלב 04 מעתיקים אותם לתוך ההוראה, כלשונם או בניסוח שלכם.</p><ul className="ab-rules"><li>לא משנה את המקור</li><li>לא משלים מידע חסר ולא ממציא ציטוטים או מיקומים</li><li>מצטט עם מזהה פסקה וקורא בהקשר: השאלה והמשך התשובה</li><li>לא מכליל מחומר סינתטי על אנשים אמיתיים</li><li>מציג תחילה מה הצליח לקרוא; אם אינו יכול לקרוא קובץ, אומר זאת ואינו מנתח</li></ul><textarea id="rc" rows="1" placeholder="כלל נוסף משלכם (רשות)" value={s.rulesCustom} onChange={e=>set('rulesCustom',e.target.value)}/></div>
  </>)}

  {renderStage(1,<>
   <Field id="purpose" label="מטרה" hint="מה אתם רוצים להבין בסוף, במשפט אחד." value={s.purpose} onChange={v=>set('purpose',v)} weak="לנתח את הראיונות." strong="להבין מה מקל על מורים חדשים לבקש עזרה, ומה מקשה, בלי להניח שכולם חווים זאת אותו דבר."/>
   <Field id="output" label="תוצר" hint="מה בדיוק צריך לחזור. צורה, כמות, עמודות. אם אי אפשר לדמיין את התוצר, אי אפשר לבדוק אותו." rows={3} value={s.output} onChange={v=>set('output',v)} weak="סיכום של הממצאים." strong="לכל ריאיון: משפט פירוש אחד, הציטוט שעליו הוא נשען עם מזהה הפסקה, ופרט אחד מהריאיון שלא מתיישב עם הפירוש."/>
   <div className="ab-field"><span className="ab-label">תנאי הצלחה</span><p className="ab-hint">איך תדעו שהסוכן עשה מה שביקשתם? סמנו לפחות שניים, או כתבו משלכם.</p><Checks state={s} toggle={toggle} group="success" items={[['quote','כל פירוש נשען על ציטוט מדויק עם מיקום'],['perCase','כל מקור מיוצג בנפרד, בלי מיזוג בין מרואיינים'],['complication','לכל פירוש מצורף פרט שמסייג אותו'],['unclear','מה שלא נדון או לא ברור מסומן, לא מושלם']]}/><textarea id="sc" rows="1" placeholder="תנאי משלכם" value={s.successCustom} onChange={e=>set('successCustom',e.target.value)}/></div>
   <Field id="stop" label="נקודת עצירה" hint="הרגע שבו הסוכן מפסיק ומחכה לכם. בלי זה הוא ימשיך למסקנה." value={s.stop} onChange={v=>set('stop',v)} weak="כשתסיים." strong="אחרי שהצגת את הפירושים לשלושת הראיונות. אל תכתוב מסקנה כללית ואל תמשיך עד שאחזור אליך."/>
   <Field id="after" label="מה קורה אחרי הבדיקה שלכם" hint="מה הסוכן אמור לעשות עם ההערה שתחזירו לו." rows={3} value={s.afterCheck} onChange={v=>set('afterCheck',v)} weak="תקן לפי ההערה שלי." strong="כשאחזיר לך הערה עם מזהה פסקה, קרא את הפסקה שוב. אם היא תומכת בהערה, תקן והסבר מה השתנה; אם לא, אמור לי למה, עם ציטוט."/>
  </>)}

  {renderStage(2,<>
   <p className="ab-hint">בתרגיל הזה הסוכן צריך רק לקרוא. כל כלי נוסף הוא דרך נוספת שבה הוא יכול להביא חומר שלא בדקתם.</p>
   <Checks state={s} toggle={toggle} group="tools" items={[['read','קריאת החומר שמסרתי'],['web','חיפוש ברשת (למה? מה זה יוסיף שאינו במקורות?)'],['code','הרצת קוד או בניית טבלאות (מתי הטבלה נבדקת?)'],['file','יצירת קובץ פלט נפרד (המקור נשאר ללא שינוי?)']]}/>
   <textarea id="tn" rows="1" placeholder="הערה על השימוש בכלים (רשות)" value={s.toolsNote} onChange={e=>set('toolsNote',e.target.value)}/>
  </>)}

  {renderStage(3,<>
   <p className="ab-hint">כאן כותבים את ההוראה במילים שלכם, כולל מה הסוכן עושה עם הערה שתחזירו לו אחרי הבדיקה. מימין: מה שהחלטתם בשלבים הקודמים, כתזכורת. אין נוסח מוכן; הסוכן הוא מה שתכתבו.</p>
   <div className="ab-write">
    <div className="ab-write-main"><label htmlFor="instruction" className="ab-label">הוראת העבודה לסוכן</label><textarea id="instruction" rows={14} placeholder="למשל: אתה מסייע לי בניתוח איכותני. עבוד רק עם הקובץ המצורף…" value={s.instruction} onChange={e=>set('instruction',e.target.value)}/>
     <div className="ab-selfcheck"><span className="ab-label">לפני שמעתיקים: קראו את מה שכתבתם ובדקו</span><Checks state={s} toggle={toggle} group="selfcheck" items={[['purpose','כתוב מה המטרה'],['output','התוצר מוגדר כך שאפשר לדמיין אותו ולבדוק אותו'],['rules','חמשת כללי הבית נמצאים בפנים, כלשונם או בניסוח שלכם'],['stop','יש נקודת עצירה מפורשת: הסוכן עוצר ומחכה'],['after','כתוב מה הסוכן עושה עם ההערה שתחזירו לו']]}/></div>
     <div className="ab-actions"><button className="button" onClick={()=>copy(s.instruction,'prompt')} disabled={!s.instruction.trim()}><Copy size={20}/>העתקת ההוראה שכתבתי</button><span role="status">{copied==='prompt'?'הועתק. פותחים משימה חדשה, מצרפים את הקובץ ומדביקים.':copied==='fail'?'ההעתקה נחסמה. סמנו את הטקסט והעתיקו ידנית.':''}</span></div>
    </div>
    <aside className="ab-notes"><p className="eyebrow">מה החלטתם</p>
     <dl>
      <dt>שאלת העבודה</dt><dd>{s.question.trim()||'—'}</dd>
      <dt>החומר</dt><dd>{[s.materials.interviews&&'קטעי ריאיון',s.materials.fieldnote&&'רשומת תצפית',s.materials.context&&'מסמכי הקשר',s.materials.other&&(s.materialsNote||'אחר')].filter(Boolean).join(', ')||'—'} · {({file:'קובץ מצורף',folder:'תיקיית עבודה',other:'אחר'})[s.where]}</dd>
      <dt>מטרה</dt><dd>{s.purpose.trim()||'—'}</dd>
      <dt>תוצר</dt><dd>{s.output.trim()||'—'}</dd>
      <dt>תנאי הצלחה</dt><dd>{[s.success.quote&&'ציטוט מדויק עם מיקום',s.success.perCase&&'כל מקור בנפרד',s.success.complication&&'פרט מסייג לכל פירוש',s.success.unclear&&'לא נדון / לא ברור מסומן',s.successCustom.trim()].filter(Boolean).join('; ')||'—'}</dd>
      <dt>נקודת עצירה</dt><dd>{s.stop.trim()||'—'}</dd>
      <dt>אחרי הבדיקה</dt><dd>{s.afterCheck.trim()||'—'}</dd>
      <dt>כלים</dt><dd>{[s.tools.read&&'קריאת החומר',s.tools.web&&'חיפוש ברשת',s.tools.code&&'קוד / טבלאות',s.tools.file&&'קובץ פלט'].filter(Boolean).join(', ')||'—'}</dd>
      <dt>כללי בית</dt><dd>לא משנה את המקור · לא משלים מידע · מצטט עם מזהה פסקה ובהקשר · לא מכליל מחומר סינתטי · מציג תחילה מה קרא{s.rulesCustom.trim()?` · ${s.rulesCustom.trim()}`:''}</dd>
     </dl></aside>
   </div>
  </>)}

  {renderStage(4,<>
   <p className="ab-hint">ממלאים אחרי שהסוכן החזיר תוצר ובדקתם אותו מול המקור. קודם מדביקים את התוצר, ואז שלוש שאלות והערכה עצמית של ארבעת הרכיבים.</p>
   <Field id="agentOut" label="התוצר שהסוכן החזיר (מדביקים כלשונו)" hint="הגרסה האחרונה, אחרי התיקון. כך ההגדרה, התוצר והרפלקציה נשמרים יחד במסמך אחד." rows={6} value={s.agentOut} onChange={v=>set('agentOut',v)}/>
   <Field id="r1" label="1. מה קיבלתי לעומת מה שביקשתי?" hint="לא ״טוב״ או ״רע״: מה היה בתוצר שלא הופיע בהגדרה, ומה היה בהגדרה שלא הופיע בתוצר." rows={3} value={s.r1} onChange={v=>set('r1',v)}/>
   <Field id="r2" label="2. איזה חלק בהגדרה יצר את הפער?" hint="מטרה, חומר, תוצר או נקודת עצירה. ציינו פסקה אחת במקור שהסוכן קרא אחרת מכם." rows={3} value={s.r2} onChange={v=>set('r2',v)}/>
   <Field id="r3" label="3. מה שיניתי בהגדרה, ולמה?" hint="משפט אחד. אם לא שיניתם כלום, מה שכנע אתכם שההגדרה עמדה במבחן." rows={3} value={s.r3} onChange={v=>set('r3',v)}/>
   <div className="ab-rubric"><span className="ab-label">הערכה עצמית: עד כמה כל רכיב ניתן לבדיקה? (ארבע בחירות, נדרש)</span>
    <div className="ab-rubric-grid">{[['purpose','מטרה'],['material','חומר וכללים'],['output','תוצר'],['stop','נקודת עצירה']].map(([k,t])=><div key={k} className="ab-rubric-row"><strong>{t}</strong>{rubricLevels.map(([v,l,d])=><label key={v} className={s.rubric[k]===v?'on':''}><input type="radio" name={`rub-${k}`} id={`rub-${k}-${v}`} checked={s.rubric[k]===v} onChange={()=>setS(p=>({...p,rubric:{...p.rubric,[k]:v}}))}/><b>{l}</b><small>{d}</small></label>)}</div>)}</div>
   </div>
   {stageDone[3]&&<details className="disclosure ab-reveal"><summary>להשוואה: ההוראה שהמנחה כתב לאותו תרגיל</summary><p className="ab-hint">נפתח רק אחרי שכתבתם משלכם. זו גרסה אחת, לא הנוסח הנכון.</p><pre className="prompt-text">{instructorVersion}</pre></details>}
   <div className="ab-actions"><button className="button secondary" onClick={()=>copy(exportText(),'export')}><Copy size={20}/>העתקת ההגדרה והרפלקציה למסמך</button><span role="status">{copied==='export'?'הועתק. הדביקו במסמך שאתם שומרים.':''}</span></div>
  </>)}

  <div className="ab-footer"><button className="text-action" onClick={()=>{if(confirm('לנקות את כל השדות?')){setS({...defaults});}}}><ArrowCounterClockwise size={18}/>התחלה מחדש</button><a className="button" href="#workshop">לצעדי התרגיל<ArrowLeft size={20}/></a></div>
  </div>
 </div>;
}
