import React, { useState } from 'react';
import { DownloadSimple, ArrowLeft } from '@phosphor-icons/react';
import { datasetFiles } from './dataset-files';

const groups = [
  ['starter', 'קובץ התרגיל', 'שלושה ראיונות בקובץ אחד.'],
  ['sources', 'מרחיבים את האוסף', 'מקורות להדגמת המנחה ולתרגול בהמשך. אין צורך להוריד אותם במהלך התרגיל.'],
  ['optional', 'עזרים נוספים : לפי הצורך', 'תבניות נפרדות והסברים מורחבים. בתרגיל הנוכחי עובדים בשיחה אחת, ללא תבניות נפרדות.'],
  ['instructor', 'למנחה : הסברים וכיווני פרשנות', 'כולל הצעות לניתוח. אין לצרף לסוכן של המשתתפים לפני התרגול.']
];
export default function DatasetLibrary({asset}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [saveToFolder, setSaveToFolder] = useState(false);
  async function bulk(files) {
    setBusy(true); setStatus('מכין את הקבצים…');
    let folder;
    try {
      // Request the folder during the user's click, before asynchronous fetching.
      if (saveToFolder && 'showDirectoryPicker' in window) folder = await window.showDirectoryPicker({mode:'readwrite'});
      const results = await Promise.all(files.map(async file => {
        try {
          const response = await fetch(asset(`downloads/${file.file}`));
          if (!response.ok) throw new Error('Download unavailable');
          return {file, blob:await response.blob()};
        } catch { return {file, failed:true}; }
      }));
      let count = 0; const failures=[];
      for (const result of results) {
        if (result.failed) {failures.push(result.file.file); continue;}
        try {
          if (folder) {
            // Never overwrite a pre-existing user file.
            const dot=result.file.file.lastIndexOf('.');
            const stem=result.file.file.slice(0,dot), ext=result.file.file.slice(dot);
            let name=result.file.file, suffix=1;
            while (true) {
              try {await folder.getFileHandle(name); name=`${stem} (${suffix++})${ext}`;}
              catch (error) {if(error.name==='NotFoundError') break; throw error;}
            }
            const handle=await folder.getFileHandle(name,{create:true});
            const writer=await handle.createWritable(); await writer.write(result.blob); await writer.close();
          } else {
            const url=URL.createObjectURL(result.blob);
            const link=document.createElement('a'); link.href=url; link.download=result.file.file;
            document.body.appendChild(link); link.click(); link.remove();
            setTimeout(()=>URL.revokeObjectURL(url),60000);
            await new Promise(resolve=>setTimeout(resolve,300));
          }
          count++;
        } catch {failures.push(result.file.file);}
      }
      setStatus(`${folder?`נשמרו ${count} קבצים בתיקייה שבחרתם.`:`בקשות הורדה שנשלחו לדפדפן: ${count}. בדקו שכל הקבצים התקבלו; ייתכן שתידרשו לאפשר הורדות מרובות.`}${failures.length?` לא הושלמה הורדת: ${failures.join(', ')}. אפשר לנסות שוב או להוריד בנפרד.`:''}`);
    } catch(error) {
      setStatus(error.name==='AbortError'?'בחירת התיקייה בוטלה. אפשר לנסות שוב או להוריד כל קובץ בנפרד.':'לא ניתן לשמור לתיקייה. השתמשו בקישורי ההורדה הנפרדים או נסו בדפדפן אחר.');
    } finally {setBusy(false);}
  }
  function rows(group) {return datasetFiles.filter(f=>f.group===group).map(file=><div className="dataset-file" key={file.id}><div><h3>{file.title}</h3><p>{file.description}</p><small dir="ltr">{file.file}</small></div><a className="text-action" href={asset(`downloads/${file.file}`)} download={file.file} onClick={event=>{event.preventDefault(); if(!busy) bulk([file]);}}><DownloadSimple size={19}/>הורדה<span className="sr-only"> : {file.title}</span></a></div>);}
  return <section className="dataset-library" aria-labelledby="dataset-title">
    <p className="eyebrow">חומרי התרגול · הכול סינתטי</p><h2 id="dataset-title">כל החומרים להמשך ולעיון.</h2>
    <p>במהלך הסדנה משתמשים רק בקובץ התרגיל. כאן נשמרים גם המקורות הנפרדים, האוסף המורחב והעזרים האופציונליים.</p>
    <div className="download-actions"><button className="button" disabled={busy} onClick={()=>bulk(datasetFiles.filter(f=>f.group==='starter'))}><DownloadSimple size={21}/>הורדת קובץ התרגיל</button><button className="button secondary" disabled={busy} onClick={()=>bulk(datasetFiles.filter(f=>['starter','sources'].includes(f.group)))}>הורדת המקורות והקובץ המשולב · 11 קבצים</button></div>
    <p className="small muted">הקבצים יורדים בנפרד, ללא ZIP. ייתכן שהדפדפן יבקש לאפשר הורדות מרובות.</p>{'showDirectoryPicker' in window && <label className="folder-option"><input type="checkbox" checked={saveToFolder} disabled={busy} onChange={event=>setSaveToFolder(event.target.checked)}/> שמירה לתיקייה לבחירה במקום הורדות רגילות</label>}
    <p role="status" className="download-status">{status}</p>
    <div className="dataset-start">{rows('starter')}</div>
    {groups.slice(1).map(([group,title,description])=><details className="disclosure dataset-group" key={group}><summary>{title} <span className="small">{datasetFiles.filter(f=>f.group===group).length} קבצים</span></summary><p>{description}</p><button className="text-action" disabled={busy} onClick={()=>bulk(datasetFiles.filter(f=>f.group===group))}><DownloadSimple size={19}/>הורדת הקבוצה</button>{rows(group)}</details>)}
    <details className="disclosure dataset-group"><summary>הורדת כל המסמכים באתר</summary><p>24 קבצים: קובץ התרגיל, האוסף המלא, עזרים אופציונליים וכל מסמכי המנחה. כולל כיווני פרשנות : אינו מסלול ההורדה המומלץ למשתתפים.</p><button className="button secondary" disabled={busy} onClick={()=>bulk(datasetFiles)}>הורדת כל 24 הקבצים בנפרד</button></details>
    <a className="text-action dataset-next" href="#workshop">חזרה לתרגיל <ArrowLeft size={19}/></a>
  </section>;
}
