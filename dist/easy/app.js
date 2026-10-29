(() => {
  'use strict';
  const {scenarios,concepts,levels}=window.LAB;
  const $=s=>document.querySelector(s);
  const storageKey='structure-lab-easy-v1';
  let storageAvailable=true;
  let saved={};
  try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')||{};}catch{storageAvailable=false;}
  const state={page:'practice',current:Number.isInteger(saved.current)&&saved.current>=0&&saved.current<21?saved.current:0,records:saved.records&&typeof saved.records==='object'?saved.records:{},history:Array.isArray(saved.history)?saved.history:[],selection:null,submitted:false,hint:false,guides:true,showOhlc:false,retry:false};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=n=>Number(n).toFixed(2);
  const current=()=>scenarios[state.current];
  const attempted=()=>Object.keys(state.records).filter(k=>scenarios.some(s=>s.id===k)).length;
  const mastered=()=>Object.values(state.records).filter(r=>r.correct).length;
  const accuracy=()=>state.history.length?Math.round(100*state.history.filter(h=>h.correct).length/state.history.length):0;
  function save(){try{localStorage.setItem(storageKey,JSON.stringify({current:state.current,records:state.records,history:state.history}));}catch{storageAvailable=false;}}
  function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2800);}
  function loadScenario(index,retry=false){
    state.current=Math.max(0,Math.min(scenarios.length-1,index));state.page='practice';state.retry=retry;state.hint=false;state.guides=current().tier===0;state.showOhlc=false;
    const record=state.records[current().id];
    state.selection=record&&!retry?record.selected:null;state.submitted=Boolean(record&&!retry);
    save();render();
  }
  function pathHtml(){return levels.map((l,i)=>`<div class="path-item ${current().tier===i?'active':''}"><span class="path-num">${i+1}</span><button data-level="${i}" aria-label="Practice ${l.name}">${l.name}<small>${l.subtitle}</small></button></div>`).join('');}
  function intro(title,desc,eyebrow,button=true){return `<div class="page-intro"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${desc}</p></div>${button?'<button class="outline-button" data-action="curriculum" aria-label="Browse all 21 scenarios">Browse scenarios <span class="arrow">↗</span></button>':''}</div>`;}
  function render(){
    $('#learning-path').innerHTML=pathHtml();
    document.querySelectorAll('[data-page]').forEach(b=>{b.classList.toggle('active',b.dataset.page===state.page);if(b.dataset.page===state.page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    $('#breadcrumb').innerHTML=`Workspace <span>/</span> ${state.page==='practice'?'Practice':state.page==='notes'?'Field notes':'Your progress'}`;
    $('#content').innerHTML=(storageAvailable?'':'<div class="storage-notice">Browser storage is unavailable. You can practice, but progress will last only for this visit.</div>')+(state.page==='practice'?practiceHtml():state.page==='notes'?notesHtml():progressHtml());
    bindContent();
    if(state.page==='practice'){drawChart();bindChart();}
  }
  function practiceHtml(){
    const s=current();
    const r=state.records[s.id];
    const allDone=attempted()===21;
    return `${intro('Read the structure.','Train your eye. Mark the chart. Understand the why.','OBSERVE. IDENTIFY. REPEAT.')}
    ${allDone?`<div class="complete-panel"><div><span class="eyebrow">PATH COMPLETED</span><h2>You’ve worked through all 21.</h2><p>${mastered()} scenarios currently correct. Revisit missed reads to strengthen the process.</p></div><button class="primary" data-action="retry">${mastered()===21?'Practice again':'Revisit missed scenarios'} <span>↗</span></button></div>`:''}
    <section class="session-bar" aria-label="Practice session progress"><div class="session-name"><span class="session-icon">⌁</span><div>Market structure training<small>${levels[s.tier].description}</small></div></div><div class="session-progress"><div class="progress-track"><div class="progress-fill" style="width:${attempted()/21*100}%"></div></div><span class="session-count"><strong>${String(attempted()).padStart(2,'0')}</strong> / 21</span><span class="metric-divider"></span><span class="session-accuracy">${state.history.length?accuracy()+'%':'—'}<small>Accuracy</small></span></div></section>
    <div class="workspace"><div><section class="chart-card" aria-label="Interactive synthetic price chart"><div class="chart-heading"><div class="instrument"><span class="instrument-icon">SL</span><span>LAB / USD<small>Synthetic price action · Scenario ${String(s.index+1).padStart(2,'0')}</small></span></div><div class="chart-menu"><span class="chart-status">24 CLOSED CANDLES</span><span class="timeframe">5m</span></div></div>
    <div class="chart-toolbar"><button class="toolbar-button ${state.guides?'active':''}" id="toggle-guides" aria-pressed="${state.guides}"><span class="toggle-track"></span>Swing guides</button><button class="toolbar-button ${state.showOhlc?'active':''}" id="toggle-ohlc" aria-pressed="${state.showOhlc}">⊞ OHLC</button><span class="chart-instruction">${state.submitted?'Annotated answer':s.mode==='candle'?'Click a candle to mark it':s.mode==='zone'?'Select a shaded price band':'Observe, then choose a plan'}</span></div><div class="chart-area"><svg id="price-chart" class="chart-svg" viewBox="0 0 780 420" role="group" aria-label="${esc(s.concept)} scenario. ${esc(s.task)}"></svg></div>
    <div class="chart-footer"><div class="chart-legend"><span class="legend-item"><i class="legend-square"></i> Bullish</span><span class="legend-item"><i class="legend-square" style="background:var(--red)"></i> Bearish</span></div><span id="chart-readout" class="ohlc">${s.mode==='candle'?'Select a candle to inspect':'All candles are closed'}</span></div></section>
    <p class="chart-caption"><span class="caption-dot">i</span>${s.tier===0?'Reference levels are supplied so you can focus on the pattern.':s.tier===1?'Same rules, opposite direction. Read the context before naming the pattern.':'Challenge mode: a plausible-looking setup may fail a required condition.'} Candle numbers run left to right; all prices are fictional.</p></div>
    <section class="exercise-card" aria-label="Scenario question"><div class="exercise-top"><span class="exercise-num">EXERCISE ${String(s.index+1).padStart(2,'0')} / 21</span><span class="level-badge level-${s.tier}">${levels[s.tier].name}</span></div><div class="concept-tag">${s.concept}</div><h2>${s.title}</h2><p class="context-text">${s.context}</p><div class="task-box"><span class="task-icon">${s.mode==='candle'?'⌖':s.mode==='zone'?'▧':'↳'}</span><span>${s.task}</span></div>
    ${s.mode==='choice'?`<div class="option-list">${s.options.map(([id,t])=>`<button class="answer-option ${state.selection===id?'selected':''} ${state.submitted&&id===s.correct?'correct':''} ${state.submitted&&state.selection===id&&id!==s.correct?'wrong':''}" data-option="${id}" aria-pressed="${state.selection===id}" ${state.submitted?'disabled':''}><span class="option-key">${id}</span><span>${t}</span></button>`).join('')}</div>`:''}
    <div class="selection-status ${state.selection!==null?'has-selection':''}" id="selection-status" aria-live="polite">${selectionText()}</div>
    ${state.submitted?feedbackHtml(s,r):`<button class="primary" id="check-answer" ${state.selection===null?'disabled':''}>Check answer <span>↵</span></button><button class="hint-button" id="hint-button" aria-expanded="${state.hint}">${state.hint?'Hide the hint':'Need a nudge? Get a hint'} <span>↗</span></button>${state.hint?`<div class="hint-content">${s.hint}</div>`:''}`}
    <div class="question-meta"><span>${s.mode==='candle'?'MARK THE CHART':s.mode==='zone'?'IDENTIFY THE ZONE':'READ & REASON'}</span><button class="text-button" data-action="notes">Rules & definitions ↗</button></div></section></div>
    <div class="concept-strip"><span class="strip-label">7 CORE CONCEPTS</span><div class="concept-chips">${concepts.map((c,i)=>`<button class="concept-chip ${s.key===c.key?'active':''}" data-concept="${i}">${c.name}</button>`).join('')}</div></div><div class="bottom-tip"><p><span>Process over prediction.</span> A correct read never guarantees an outcome.</p><button class="text-button" id="previous-scenario" ${s.index===0?'disabled':''}>← Previous scenario</button></div>`;
  }
  function selectionText(){if(state.selection===null)return current().mode==='candle'?'No candle marked yet.':current().mode==='zone'?'No price band selected.':'Choose one answer.';return current().mode==='candle'?`Candle ${state.selection+1} selected${state.submitted?'':' · click another to change'}`:current().mode==='zone'?`Band ${state.selection} selected`:`Answer ${state.selection} selected`;}
  function feedbackHtml(s,r){
    const correct=state.selection===s.correct;
    return `<div class="feedback ${correct?'':'incorrect'}" role="status"><div class="feedback-heading"><span>${correct?'✓':'↳'}</span>${correct?'That’s the read.':'Let’s unpack that.'}</div>${!correct?`<p style="margin-bottom:8px;color:#d2bbfb">${s.mode==='candle'?`The correct mark is candle ${s.correct+1}.`:s.mode==='zone'?`The correct zone is band ${s.correct}.`:`The correct answer is ${s.correct}.`}</p>`:''}<p>${s.explanation}</p><div class="rule">${s.rule}</div><button class="primary next-button" id="next-scenario">${s.index===20?'See your progress':'Next scenario'} <span>→</span></button><button class="hint-button" id="retry-current">Practice this one again ↺</button></div>`;
  }
  function notesHtml(){return `${intro('Keep the rules close.','The conventions behind every answer in the lab.','YOUR FIELD NOTES',false)}<div class="notes-grid">${concepts.map((c,i)=>`<article class="note-card" id="note-${c.key}"><div class="note-header"><span class="note-number">0${i+1}</span><h2>${c.name}</h2></div><span class="eyebrow" style="color:#8592a5;font-size:8px;margin-bottom:12px">${c.full}</span><p>${c.definition}</p><div class="note-rule">${esc(c.rule)}</div><p>${c.caution}</p><button class="outline-button" data-start="${i}">Practice ${c.name} <span class="arrow">↗</span></button></article>`).join('')}</div><div class="source-note"><strong>Know what these charts can tell you.</strong><br>All 21 scenarios use author-written synthetic OHLC prices, not historical or live data. These are explicit training conventions; SMC terminology is not universal. Candlestick patterns alone cannot verify institutional activity. This lab teaches recognition and conditional planning, not investment recommendations or profitability.<br><br><strong>Further reading</strong><br><a href="https://trendspider.com/learning-center/fair-value-gap-trading-strategy/" target="_blank" rel="noopener noreferrer">TrendSpider · FVG mechanics ↗</a><a href="https://help.trendspider.com/kb/indicators/order-blocks" target="_blank" rel="noopener noreferrer">TrendSpider · order-block conventions ↗</a><br>Reference material informs the terminology. The lab’s answer rules are stated above and do not adopt claims about future returns.</div>`;}
  function progressHtml(){
    const count=attempted(),missed=scenarios.filter(s=>state.records[s.id]&&!state.records[s.id].correct);
    return `${intro('Make your practice count.','Review your reads, find weak spots, and come back sharper.','YOUR PROGRESS')}<div class="stat-grid"><div class="stat-card"><strong>${count}<span style="font-size:16px"> / 21</span></strong><span>Scenarios completed</span></div><div class="stat-card"><strong>${state.history.length?accuracy()+'%':'—'}</strong><span>Accuracy across ${state.history.length} attempts</span></div><div class="stat-card"><strong>${mastered()}</strong><span>Currently correct scenarios</span></div></div><div class="progress-layout"><section class="skill-card"><h2>Your concept map</h2>${concepts.map(c=>{const rows=scenarios.filter(s=>s.key===c.key),right=rows.filter(s=>state.records[s.id]?.correct).length;return `<div class="skill-row"><span>${c.name}</span><div class="progress-track"><div class="progress-fill" style="width:${right/3*100}%"></div></div><span class="count">${right} / 3</span></div>`;}).join('')}<p class="muted" style="font-size:10px;margin-top:25px">Each concept has one exercise at each difficulty. Scores reflect your latest submitted answer per scenario.</p></section><section class="activity-card"><h2>Recent reads</h2>${state.history.length?state.history.slice(-7).reverse().map(h=>{const s=scenarios.find(s=>s.id===h.id);return s?`<div class="activity-row"><span class="activity-mark ${h.correct?'':'missed'}">${h.correct?'✓':'↳'}</span><div>${s.title}<small>${levels[s.tier].name} · ${h.correct?'Correct':'Review recommended'}${h.hint?' · hint used':''}</small></div></div>`:'';}).join(''):'<div class="empty-state">Your first read starts the record.<br>Complete a scenario to see your practice history here.</div>'}</section></div><div class="progress-actions"><button class="primary" data-action="continue">Continue practice <span>→</span></button><button class="secondary" data-action="retry">${missed.length?`Revisit ${missed.length} missed scenario${missed.length===1?'':'s'}`:'Practice again'} ↺</button><button class="text-button" id="reset-progress">Reset progress</button></div><p class="muted" style="font-size:10px;margin-top:19px">Progress stays in this browser on this device. Hints do not lower your score. Accuracy includes repeat attempts.</p>`;
  }
  function bindContent(){
    document.querySelectorAll('[data-action="curriculum"]').forEach(b=>b.onclick=openCurriculum);
    document.querySelectorAll('[data-action="notes"]').forEach(b=>b.onclick=()=>{state.page='notes';render();window.scrollTo(0,0);});
    document.querySelectorAll('[data-action="retry"]').forEach(b=>b.onclick=()=>{const missed=scenarios.find(s=>state.records[s.id]&&!state.records[s.id].correct);loadScenario(missed?missed.index:0,true);window.scrollTo(0,0);});
    document.querySelectorAll('[data-action="continue"]').forEach(b=>b.onclick=()=>{const next=scenarios.find(s=>!state.records[s.id]);loadScenario(next?next.index:state.current);});
    document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{loadScenario(Number(b.dataset.start));window.scrollTo(0,0);});
    document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{loadScenario(Number(b.dataset.level)*7);window.scrollTo(0,0);});
    document.querySelectorAll('[data-concept]').forEach(b=>b.onclick=()=>loadScenario(current().tier*7+Number(b.dataset.concept)));
    document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>select(b.dataset.option));
    if($('#check-answer'))$('#check-answer').onclick=submit;
    if($('#hint-button'))$('#hint-button').onclick=()=>{state.hint=!state.hint;render();};
    if($('#toggle-guides'))$('#toggle-guides').onclick=()=>{state.guides=!state.guides;render();};
    if($('#toggle-ohlc'))$('#toggle-ohlc').onclick=()=>{state.showOhlc=!state.showOhlc;render();};
    if($('#next-scenario'))$('#next-scenario').onclick=next;
    if($('#retry-current'))$('#retry-current').onclick=()=>loadScenario(state.current,true);
    if($('#previous-scenario'))$('#previous-scenario').onclick=()=>loadScenario(state.current-1);
    if($('#reset-progress'))$('#reset-progress').onclick=()=>$('#reset-dialog').showModal();
  }
  function select(value){if(state.submitted)return;state.selection=value;render();if(current().mode==='candle')updateReadout(value);}
  function submit(){
    if(state.submitted||state.selection===null)return;
    const s=current(),correct=state.selection===s.correct;
    const record={selected:state.selection,correct,hint:state.hint};
    state.records[s.id]=record;state.history.push({id:s.id,...record});state.submitted=true;save();render();
    if(window.innerWidth<761)document.querySelector('.feedback')?.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function next(){if(state.current===20){state.page='progress';render();window.scrollTo(0,0);}else{loadScenario(state.current+1);window.scrollTo(0,0);}}
  function updateReadout(i){const c=current().candles[i];if(c&&$('#chart-readout'))$('#chart-readout').textContent=`#${i+1} O ${num(c.o)}  H ${num(c.h)}  L ${num(c.l)}  C ${num(c.c)}`;}
  function drawChart(){
    const s=current(),cs=s.candles,svg=$('#price-chart');
    const min=Math.floor(Math.min(...cs.map(c=>c.l))-3),max=Math.ceil(Math.max(...cs.map(c=>c.h))+3);
    const left=32,right=706,top=25,bottom=366,w=right-left,h=bottom-top;
    const y=p=>bottom-(p-min)/(max-min)*h;
    const step=w/cs.length,x=i=>left+step*(i+.5);
    const line=(p,start,label,color='#84779f')=>`<line x1="${x(start)}" y1="${y(p)}" x2="${right}" y2="${y(p)}" stroke="${color}" stroke-width="1" stroke-dasharray="5 5"/><text x="${x(start)+5}" y="${y(p)-8}" style="fill:${color};font-size:9px">${esc(label)}</text>`;
    let out=`<title>${esc(s.title)}</title><desc>24 synthetic five-minute candles. ${esc(s.context)} ${esc(s.task)} Use the OHLC toggle for candle labels. ${s.mode==='candle'?'Use left and right arrow keys to select a candle, then Enter to check your answer.':''}</desc>`;
    for(let i=0;i<=5;i++){const p=min+(max-min)*i/5;out+=`<line class="gridline" x1="${left}" y1="${y(p)}" x2="${right}" y2="${y(p)}"/><text x="${right+12}" y="${y(p)+4}">${num(p)}</text>`;}
    for(let i=0;i<cs.length;i+=4){out+=`<line class="gridline" x1="${x(i)}" y1="${top}" x2="${x(i)}" y2="${bottom}"/><text x="${x(i)}" y="${bottom+21}" text-anchor="middle">${String(9+Math.floor(i*5/60)).padStart(2,'0')}:${String(i*5%60).padStart(2,'0')}</text>`;}
    out+=`<text x="${left+19}" y="${top+35}" class="chart-watermark">STRUCTURE / LAB</text><text x="${left+20}" y="${top+54}" style="font-size:8px;letter-spacing:2px;fill:#425060">SYNTHETIC MARKET · 5 MINUTE</text>`;
    if(s.zone){const [lo,hi]=s.zone;out+=`<rect x="${x(s.zoneStart)-step/2}" y="${y(hi)}" width="${right-x(s.zoneStart)+step/2}" height="${y(lo)-y(hi)}" rx="2" fill="#b8a3fc" fill-opacity="${state.submitted?.12:.055}" stroke="#74628f" stroke-opacity=".6" stroke-dasharray="4 4"/><text x="${x(s.zoneStart)+6}" y="${y(hi)+13}" style="fill:#a191bd;font-size:8px">${s.key==='ob'?'CANDIDATE OB':s.key==='entry'?'FVG RETEST ZONE':'ZONE'} · ${num(lo)}–${num(hi)}</text>`;}
    if(s.level!==undefined)out+=line(s.level,s.levelStart||0,s.levelLabel||'Reference level');
    if(s.mode==='zone'){
      s.zones.forEach(z=>{const selected=state.selection===z.id,correct=state.submitted&&z.id===s.correct,color=correct?'#64d7b0':selected?'#c6acff':'#9e8aba',sx=x(s.zoneStart)-step/2;out+=`<g class="zone-hit" data-zone="${z.id}" role="button" tabindex="${state.submitted?-1:0}" aria-label="Band ${z.id}: ${num(z.lo)} to ${num(z.hi)}" aria-pressed="${selected}"><rect x="${sx}" y="${y(z.hi)}" width="${right-sx}" height="${Math.max(10,y(z.lo)-y(z.hi))}" rx="2" fill="${color}" fill-opacity="${selected||correct?.2:.08}" stroke="${color}" stroke-width="${selected||correct?1.8:1}" stroke-dasharray="${selected||correct?'none':'4 4'}"/><rect x="${right-39}" y="${y(z.hi)+4}" width="30" height="17" fill="#242332" rx="3"/><text x="${right-24}" y="${y(z.hi)+16}" text-anchor="middle" style="fill:${color};font-size:10px">${z.id}</text></g>`;});
    }
    const last=cs[cs.length-1].c;
    out+=`<line x1="${left}" y1="${y(last)}" x2="${right}" y2="${y(last)}" stroke="#426958" stroke-width=".7" stroke-dasharray="2 5"/><rect x="${right+5}" y="${y(last)-9}" width="63" height="18" rx="3" fill="#234c3f"/><text x="${right+36}" y="${y(last)+4}" text-anchor="middle" style="fill:#98ddc1">${num(last)}</text>`;
    cs.forEach((c,i)=>{
      const color=c.c>=c.o?'#64d7b0':'#ed8993',selected=s.mode==='candle'&&state.selection===i,correct=state.submitted&&s.mode==='candle'&&s.correct===i;
      if(selected||correct)out+=`<rect x="${x(i)-step*.45}" y="${y(c.h)-10}" width="${step*.9}" height="${y(c.l)-y(c.h)+20}" rx="4" fill="${correct?'#64d7b0':state.submitted?'#ed8993':'#b8a3fc'}" fill-opacity=".12" stroke="${correct?'#64d7b0':state.submitted?'#ed8993':'#b8a3fc'}" stroke-width="1"/>`;
      out+=`<line x1="${x(i)}" y1="${y(c.h)}" x2="${x(i)}" y2="${y(c.l)}" stroke="${color}" stroke-width="1.3" pointer-events="none"/><rect x="${x(i)-step*.23}" y="${y(Math.max(c.o,c.c))}" width="${step*.46}" height="${Math.max(1.4,Math.abs(y(c.o)-y(c.c)))}" fill="${color}" rx=".6" pointer-events="none"/>`;
      if(s.mode==='candle'&&!state.submitted)out+=`<rect class="candle-hit" data-candle="${i}" x="${x(i)-step*.48}" y="${top}" width="${step*.96}" height="${h}" fill="transparent" role="button" tabindex="0" aria-label="Candle ${i+1}, open ${num(c.o)}, high ${num(c.h)}, low ${num(c.l)}, close ${num(c.c)}" aria-pressed="${selected}" style="cursor:crosshair"/>`;
      if(state.showOhlc||selected||correct||s.highlight?.includes(i))out+=`<text x="${x(i)}" y="${bottom+38}" text-anchor="middle" style="font-size:8px;fill:${selected||correct?'#cfbaff':'#7e8b9e'}">${i+1}</text>`;
    });
    if(state.guides&&s.guides.length)s.guides.forEach(([i,label])=>{const high=label.includes('H'),cy=high?y(cs[i].h)-13:y(cs[i].l)+18;out+=`<text x="${x(i)}" y="${cy}" text-anchor="middle" style="fill:#c0a8e4;font-size:8px">${label}</text>`;});
    if(state.guides&&!s.guides.length&&s.tier>0){const gl=s.key==='sweep'?[[3,s.tier===1?'EQL':'EQH'],[9,s.tier===1?'EQL':'EQH']]:s.key==='shift'?[[4,s.tier===1?'HH':'LH'],[9,s.tier===1?'HH':'LH'],[14,s.tier===1?'HL':'LH']]:[[12,'REF']];gl.forEach(([i,label])=>{out+=`<text x="${x(i)}" y="${y(cs[i].h)-13}" text-anchor="middle" style="fill:#c0a8e4;font-size:8px">${label}</text>`;});}
    if(state.submitted&&s.mode==='candle'){
      const c=cs[s.correct];out+=`<circle cx="${x(s.correct)}" cy="${y(c.h)-22}" r="9" fill="#264437" stroke="#64d7b0"/><text x="${x(s.correct)}" y="${y(c.h)-18}" text-anchor="middle" style="fill:#9be4c6;font-size:10px">✓</text>`;
    }
    if(state.submitted&&s.mode==='choice'){
      const i=s.tier===2?(s.key==='sweep'?18:s.key==='ob'||s.key==='entry'?22:s.key==='fvg'?18:s.key==='displacement'?17:s.key==='bos'?21:19):s.key==='entry'?16:18;
      const c=cs[i];out+=`<circle cx="${x(i)}" cy="${y(c.h)-15}" r="8" fill="#3a304f" stroke="#b8a3fc"/><text x="${x(i)}" y="${y(c.h)-12}" text-anchor="middle" style="fill:#dccbff;font-size:9px">!</text><rect x="${x(i)-step*.4}" y="${y(c.h)-2}" width="${step*.8}" height="${y(c.l)-y(c.h)+4}" rx="2" fill="none" stroke="#b8a3fc" stroke-width="1" stroke-dasharray="3 3"/>`;
    }
    out+=`<text x="${left}" y="416" style="fill:#58677a;font-size:8px">FICTIONAL OHLC · ALL CANDLES CLOSED</text><text x="${right}" y="416" text-anchor="end" style="fill:#58677a;font-size:8px">CANDLES 01–24</text>`;
    svg.innerHTML=out;
    if(s.mode==='candle'&&state.selection!==null)updateReadout(state.selection);
  }
  function bindChart(){
    document.querySelectorAll('[data-candle]').forEach(el=>{
      const i=Number(el.dataset.candle);el.onclick=()=>select(i);el.onmouseenter=()=>updateReadout(i);
      el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();select(i);}};
    });
    document.querySelectorAll('[data-zone]').forEach(el=>{el.onclick=()=>select(el.dataset.zone);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();select(el.dataset.zone);}};});
  }
  function openCurriculum(){
    $('#curriculum-list').innerHTML=levels.map((l,i)=>`<section class="curriculum-level"><h3>0${i+1} · ${l.name.toUpperCase()} <span style="color:#78879b">/ ${l.subtitle}</span></h3>${scenarios.filter(s=>s.tier===i).map(s=>`<button class="curriculum-row ${s.index===state.current?'current':''}" data-scenario="${s.index}"><span class="row-num">${String(s.index+1).padStart(2,'0')}</span><span>${s.title}</span><span class="row-concept">${s.concept}</span><span class="row-state">${state.records[s.id]?(state.records[s.id].correct?'✓':'↳'):'·'}</span></button>`).join('')}</section>`).join('');
    document.querySelectorAll('[data-scenario]').forEach(b=>b.onclick=()=>{$('#curriculum-dialog').close();loadScenario(Number(b.dataset.scenario));window.scrollTo(0,0);});
    $('#curriculum-dialog').showModal();
  }
  document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{state.page=b.dataset.page;render();window.scrollTo(0,0);});
  $('.brand').onclick=e=>{e.preventDefault();state.page='practice';render();};
  $('#close-dialog').onclick=()=>$('#curriculum-dialog').close();
  $('#cancel-reset').onclick=()=>$('#reset-dialog').close();
  $('#confirm-reset').onclick=()=>{state.records={};state.history=[];$('#reset-dialog').close();loadScenario(0);toast('A fresh chart. A fresh start.');};
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
  document.addEventListener('keydown',e=>{
    if(state.page!=='practice'||document.querySelector('dialog[open]')||e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.target?.matches('button,a,[role="button"]'))return;
    if(e.key==='Enter'){e.preventDefault();if(state.submitted)next();else submit();}
    if(!state.submitted&&current().mode==='candle'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();select(Math.min(23,Math.max(0,(state.selection??(e.key==='ArrowRight'?-1:24))+(e.key==='ArrowRight'?1:-1))));}
    if(!state.submitted&&current().mode==='choice'&&/^[1-4]$/.test(e.key))select(String.fromCharCode(64+Number(e.key)));
  });
  const initialRecord=state.records[current().id];
  if(initialRecord){state.selection=initialRecord.selected;state.submitted=true;}
  render();
})();
