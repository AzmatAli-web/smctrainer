/* One-time migration keeps existing answers while separating the two websites. */
(() => {
  function migrateProgress(legacy,version){
    if(!legacy||typeof legacy!=='object'||!['easy','hard'].includes(version))return null;
    const allowed=id=>{
      const original=/^scenario-(\d+)$/.exec(id);
      if(original)return Number(original[1])>=1&&Number(original[1])<=21;
      return version==='hard'&&/^expert-[34]-(bos|shift|sweep|ob|displacement|fvg|entry)$/.test(id);
    };
    const records=Object.fromEntries(Object.entries(legacy.records||{}).filter(([id])=>allowed(id)));
    const history=Array.isArray(legacy.history)?legacy.history.filter(item=>item&&allowed(item.id)):[];
    const current=version==='easy'?(Number.isInteger(legacy.current)&&legacy.current>=0&&legacy.current<21?legacy.current:0):(Number.isInteger(legacy.current)&&legacy.current>=21&&legacy.current<35?legacy.current:28);
    return {current,records,history,...(version==='hard'?{expertIntroduced:true}:{})};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={migrateProgress};
  if(typeof document==='undefined')return;
  const version=document.currentScript?.dataset.trainerVersion;
  if(!['easy','hard'].includes(version))return;
  try{
    const key=`structure-lab-${version}-v1`;
    if(localStorage.getItem(key)!==null)return;
    const legacy=JSON.parse(localStorage.getItem('structure-lab-v1')||'null');
    const migrated=migrateProgress(legacy,version);
    if(migrated)localStorage.setItem(key,JSON.stringify(migrated));
  }catch{/* Each trainer already handles unavailable browser storage. */}
})();
