/* Dense, deterministic assessment charts. Correctness uses the published lab rules. */
(() => {
  const {scenarios,levels}=window.LAB;
  const round=n=>Math.round(n*100)/100;
  function build(anchors,n=60,seed=1){
    const closes=Array.from({length:n},(_,i)=>{
      let j=0;while(j<anchors.length-2&&anchors[j+1][0]<i)j++;
      const [a,av]=anchors[j],[b,bv]=anchors[j+1],t=(i-a)/(b-a);
      return round(av+(bv-av)*t+Math.sin(t*Math.PI)*Math.sin(i*2.71+seed)*.36);
    });
    return closes.map((c,i)=>{const o=i?closes[i-1]:round(c-.38);return {o,c,h:round(Math.max(o,c)+.24+((i*7+seed)%9)*.035),l:round(Math.min(o,c)-.25-((i*11+seed)%8)*.04)};});
  }
  const base=[[0,99],[6,106],[11,102.5],[18,112],[23,114],[24,114],[28,116.5],[32,118],[36,115],[39,113.4],[42,116.5],[45,115.5],[46,117.6],[48,116.1],[50,115.8],[51,121.6],[53,123],[56,120],[59,121.3]];
  const set=(cs,i,props)=>Object.assign(cs[i],props);
  const fmt=n=>Number(n).toFixed(2);
  function chart(key,hard){
    let c;
    if(key==='bos'){
      c=build(base);set(c,32,{h:118.7});set(c,39,{l:112.6});set(c,46,{h:119.3,c:117.6});set(c,47,{o:117.6});
      if(hard){const closes=[117.9,117.2,116.9,117.4,116.8,117.6,117.2,116.4,116.9];for(let i=51;i<60;i++){const o=i===51?c[50].c:closes[i-52],v=closes[i-51];c[i]={o,c:v,h:round(Math.max(o,v)+.3),l:round(Math.min(o,v)-.3)};}}
    }else if(key==='shift'){
      c=build([[0,100],[7,107],[12,103],[19,114],[23,116],[24,116],[28,119],[32,120.4],[36,116.5],[39,114.8],[42,117.5],[45,116.8],[48,115.8],[49,115.1],[52,115.6],[53,110.8],[56,109.4],[59,110.2]],60,2);
      set(c,32,{h:121});set(c,39,{l:114});set(c,45,{l:116.2});set(c,49,{l:113.2});set(c,53,{h:115.9,l:110.3});
      if(hard){for(let i=53;i<60;i++){const v=[115.2,115.6,115,114.8,115.3,115.7,115.4][i-53],o=i===53?115.6:c[i-1].c;c[i]={o,c:v,h:round(Math.max(o,v)+.25),l:round(Math.min(o,v)-.25)};}}
    }else if(key==='sweep'){
      c=build([[0,102],[7,110],[12,106],[19,116],[23,117],[24,117],[28,121.8],[32,118],[35,115.2],[39,121.7],[42,120.8],[43,122.6],[44,121.7],[46,121.5],[47,121.4],[50,120.8],[54,118],[57,117.3],[59,118.1]],60,3);
      set(c,28,{h:122.4});set(c,29,{h:122.2});set(c,35,{l:114.4});set(c,39,{h:122.4});set(c,40,{h:122.2});set(c,43,{h:123});set(c,47,{h:123.65});
      if(hard){set(c,55,{o:c[54].c,c:112.3,h:round(c[54].c+.2),l:112});c[56]={o:112.3,c:111.8,h:112.5,l:111.5};c[57]={o:111.8,c:112.5,h:112.7,l:111.6};c[58]={o:112.5,c:113,h:113.3,l:112.2};c[59]={o:113,c:112.7,h:113.3,l:112.4};}
    }else if(key==='ob'){
      c=build([[0,100],[7,107],[12,103],[19,112],[23,112.8],[24,112.8],[28,115],[32,116.3],[36,114.1],[39,112.5],[42,113.4],[43,112.4],[44,111.6],[45,110.8],[46,118.5],[47,120.2],[50,116.7],[53,113.1],[56,115.6],[59,116.2]],60,4);
      set(c,32,{h:116.8});set(c,45,{h:112.1,l:110.35});set(c,46,{h:119,l:110.6});set(c,47,{l:118.1});set(c,53,{l:111.6});
      if(hard){c[58]={o:c[57].c,c:109.9,h:round(c[57].c+.3),l:109.5};c[59]={o:109.9,c:111.1,h:111.4,l:109.6};}
    }else if(key==='displacement'){
      c=build(base,60,5);set(c,32,{h:118.65});set(c,44,{o:114.4,c:114.9,h:124,l:114.1});set(c,45,{o:114.9,l:114.65});set(c,50,{c:115,h:Math.max(c[50].o,115)+.3,l:114.6});set(c,51,{o:115,c:120.8,h:121.2,l:114.8});set(c,52,{o:120.8,l:120.55});
    }else if(key==='fvg'){
      c=build([[0,99],[7,105],[12,102],[19,111],[23,108],[28,114],[32,116],[36,112.7],[40,114.4],[44,114.5],[45,117.6],[46,117.8],[47,116.6],[49,114.7],[50,114.8],[51,121.8],[52,123],[53,123.1],[54,123],[55,122.2],[56,120],[57,119],[58,119.8],[59,119.2]],60,6);
      set(c,44,{h:116.8});set(c,45,{h:118});set(c,46,{l:116.5});set(c,50,{h:115.2,l:114.3});set(c,51,{h:122.1,l:114.6});set(c,52,{h:123.6,l:120.9});set(c,53,{l:121.9});set(c,54,{l:122.6});set(c,55,{l:121.3});set(c,56,{l:118.8});
      if(hard){c[59]={o:119.8,c:114.8,h:120.1,l:114.5};}
    }else{
      c=build([[0,133],[6,126],[11,129],[18,117.5],[23,113.2],[24,110.5],[27,108.4],[31,114.5],[35,115.3],[38,108.2],[41,110.3],[43,109],[44,108.2],[45,117.6],[46,120.2],[48,118.9],[50,117.4],[51,116.4],[52,114.1],[53,117.2]],54,7);
      set(c,27,{l:107.4});set(c,35,{h:116});set(c,36,{h:115.6});set(c,38,{l:107.4});set(c,44,{h:109.4,l:105.7});set(c,45,{h:118,l:108});set(c,46,{h:120.9,l:116.7});set(c,52,{l:112.2});set(c,53,{l:113.6,h:117.5});
      if(hard){c[52]={o:116.4,c:109.1,h:116.6,l:108.7};c[53]={o:109.1,c:110.5,h:110.7,l:108.9};}
    }
    if(hard){c=c.map(p=>({o:round(240-p.o),c:round(240-p.c),h:round(240-p.l),l:round(240-p.h)}));const first=c[0].o,prefix=build([[0,first+1.6],[3,first-.8],[7,first]],8,13);c=[...prefix,...c];}
    return c;
  }
  const candle=(id,label,answer,explanation,allowNone=false)=>({id,type:'candle',label,answer,explanation,allowNone});
  const price=(id,label,answer,explanation,tolerance=.005)=>({id,type:'number',label,answer:round(answer),explanation,tolerance});
  const choice=(id,label,answer,options,explanation)=>({id,type:'choice',label,answer,options,explanation});
  const orderChoices=(items,seed)=>items.slice(seed%items.length).concat(items.slice(0,seed%items.length));
  const keys=['bos','shift','sweep','ob','displacement','fvg','entry'];
  const expert=[];
  for(let tier=3;tier<=4;tier++)for(let k=0;k<keys.length;k++){
    const key=keys[k],hard=tier===4,offset=hard?8:0,cs=chart(key,hard),idx=i=>i+offset,n=i=>idx(i)+1;
    const p=(i,field)=>cs[idx(i)][field],dir=hard?'bearish':'bullish',opposite=hard?'bullish':'bearish',side=hard?'sell-side':'buy-side';
    let steps=[],context='',explanation='',title='',annotations=[];
    const referenceWindow=`Use candles ${n(24)}–${n(39)} as the external reference range. Treat pivots inside that range as internal. Judge only the closed candles shown.`;
    if(key==='bos'){
      title=hard?'Audit the latest expansion.':'Resolve the expansion.';
      context=`${referenceWindow} Assess continuation after candle ${n(39)}. The reference is the range’s ${hard?'lowest low':'highest high'}; structural invalidation is the opposite extreme formed after that reference and before candle ${n(45)}.`;
      steps=[candle('reference','Mark the external continuation reference candle.',idx(32),`Candle ${n(32)} defines the range’s ${hard?'lowest low':'highest high'} at ${fmt(p(32,hard?'l':'h'))}.`),candle('confirmation','Mark the FIRST subsequent close confirming external BOS, or choose none.',hard?-1:idx(51),hard?'Every later close remains inside the external boundary. The wick is not a qualifying structural close.':`Candle ${n(51)} is the first close beyond the external boundary; the earlier wick is a rejection.`,true),price('protected','Enter the structural invalidation boundary price.',p(39,hard?'h':'l'),`The opposite extreme after the reference is candle ${n(39)}: ${fmt(p(39,hard?'h':'l'))}.`),choice('class','Classify the external outcome at the snapshot.',hard?'no-bos':'bos',orderChoices([['bos',`${dir[0].toUpperCase()+dir.slice(1)} BOS`],['mss',`${opposite[0].toUpperCase()+opposite.slice(1)} MSS`],['no-bos',`No external BOS; ${hard?'sell-side':'buy-side'} sweep only`],['internal','Internal CHoCH only; external bias intact']],k+offset),'A continuation label requires a close through the external boundary, not merely an internal pivot or wick.')];
      annotations=[{i:idx(32),label:'External reference',price:p(32,hard?'l':'h')},{i:idx(39),label:'Protected boundary',price:p(39,hard?'h':'l')}];
    }else if(key==='shift'){
      title=hard?'Separate the structural layers.':'Read the structural hierarchy.';
      context=`${referenceWindow} The pre-window trend is ${hard?'bearish':'bullish'}. Use the range’s ${hard?'highest high':'lowest low'} as the protected external boundary. Distinguish internal breaks, wick penetration, and a displaced external close.`;
      steps=[candle('reference','Mark the protected external boundary candle.',idx(39),`Candle ${n(39)} is the protected external ${hard?'high':'low'}: ${fmt(p(39,hard?'h':'l'))}.`),candle('confirmation','Mark the first displaced external structure-shift close, or none.',hard?-1:idx(53),hard?'The internal structure changes, but no close crosses the external boundary. External MSS remains unconfirmed.':`Candle ${n(53)} closes through the external boundary with displacement.`,true),candle('trap','Mark the wick-only violation of that protected boundary.',idx(49),`Candle ${n(49)} trades beyond the boundary and closes back inside. Its wick does not confirm MSS.`),choice('class','What is the strongest supported conclusion?',hard?'internal':'external',orderChoices([['external',`${opposite[0].toUpperCase()+opposite.slice(1)} external MSS`],['internal','Internal break and sweep; external MSS unconfirmed'],['continuation','External BOS in the prior direction'],['reversal','External CHoCH without qualifying displacement']],2),'A lower-level break is not automatically a break of the protected external swing.')];
      annotations=[{i:idx(39),label:'External protection',price:p(39,hard?'h':'l')},{i:idx(49),label:'Wick rejection'},{i:hard?idx(53):idx(53),label:hard?'Still inside':'External MSS'}];
    }else if(key==='sweep'){
      title=hard?'Follow the complete liquidity sequence.':'Reconstruct the liquidity sequence.';
      context=`Find the two matching range extremes in candles ${n(24)}–${n(39)}. From candle ${n(45)} onward, find the first same-candle rejection of that pool. Use the opposite extreme of the same reference range to judge external reversal confirmation.`;
      steps=[candle('reference','Mark the EARLIER candle forming the matching liquidity pool.',idx(28),`Candles ${n(28)} and ${n(39)} share the same ${hard?'low':'high'}.`),price('pool','Enter the swept pool’s exact price.',p(28,hard?'l':'h'),`Both reference wicks end at ${fmt(p(28,hard?'l':'h'))}.`),candle('sweep','Mark the first qualifying rejection from the assessment window.',idx(47),`Candle ${n(47)} penetrates the pool and closes back inside. Earlier acceptance beyond it is a different event.`),candle('confirmation','Mark the later external MSS close, or none.',hard?idx(55):-1,hard?`Candle ${n(55)} displaces through the opposite range boundary.`:'The opposite external boundary is never broken by a close. No external reversal confirms.',true),choice('class','Classify the complete sequence, not just the first wick.',hard?'confirmed':'sweep-only',orderChoices([['sweep-only',`${side[0].toUpperCase()+side.slice(1)} sweep; external reversal unconfirmed`],['confirmed',`${side[0].toUpperCase()+side.slice(1)} sweep followed by ${opposite} MSS`],['acceptance','Acceptance only; no rejection occurs'],['entry','Internal shift only; no external sweep']],3),'The liquidity event and structure confirmation must be verified independently.')];
      annotations=[{i:idx(28),label:'Liquidity pool',price:p(28,hard?'l':'h')},{i:idx(47),label:'Rejection sweep'},...(hard?[{i:idx(55),label:'Later MSS'}]:[])];
    }else if(key==='ob'){
      title=hard?'Audit the origin and its current state.':'Trace the origin and test the zone.';
      context=`${referenceWindow} Find the impulse closing beyond the range’s ${hard?'low':'high'}. Trace its origin to the last opposing candle. Use the full wick range for the block and a close through its far boundary for invalidation.`;
      const lo=p(45,'l'),hi=p(45,'h');
      steps=[candle('origin','Mark the last opposing origin candle for the structure-breaking impulse.',idx(45),`Candle ${n(45)} is the final opposing candle before the impulse, not the earlier nearby candle.`),candle('impulse','Mark the displacement that validates that candidate origin.',idx(46),`Candle ${n(46)} closes through the external reference with a large real body.`),price('lower','Enter the block’s lower wick boundary.',lo,`Full-wick lower boundary: ${fmt(lo)}.`),price('upper','Enter the block’s upper wick boundary.',hi,`Full-wick upper boundary: ${fmt(hi)}.`),choice('validity','What is the block’s status at the LAST visible close?',hard?'invalid':'valid',orderChoices([['valid','Retested; original block remains structurally valid'],['invalid','Invalidated by a later close through its far boundary'],['restored','Invalidated, then automatically restored by the bounce'],['unknown','Untested origin; impulse did not close through external structure']],1),hard?`Candle ${n(58)} closes through the block’s far boundary. The later bounce does not restore it.`:'The retest trades into the block, but no close invalidates its far boundary.')];
      annotations=[{i:idx(45),label:'Origin OB',zone:[lo,hi]},{i:idx(46),label:'Displacement'},...(hard?[{i:idx(58),label:'Invalidation close'}]:[])];
    }else if(key==='displacement'){
      title=hard?'Verify the expansion criteria.':'Measure the directional move.';
      context=`${referenceWindow} Assess candles ${n(40)} onward. A qualifying displacement must close through the external continuation boundary, have a real body ≥2× the preceding five-body median, and close in the outer quarter in its direction. Use the earliest candle meeting all three.`;
      const body=Math.abs(p(51,'c')-p(51,'o')),bodies=cs.slice(idx(51)-5,idx(51)).map(x=>Math.abs(x.c-x.o)).sort((a,b)=>a-b),ratio=body/bodies[2];
      steps=[candle('reference','Mark the external reference candle.',idx(32),`Candle ${n(32)} supplies the external continuation boundary.`),candle('impulse','Mark the first candle passing all three displacement tests.',idx(51),`Candle ${n(51)} expands its body, closes near its directional extreme, and closes through structure.`),candle('trap','Mark the large-range candle that fails body/close confirmation.',idx(44),`Candle ${n(44)} has a dramatic wick but a small real body and no structural close.`),price('body','Enter the qualifying candle’s real-body size.',body,`|Close − open| = ${fmt(body)}.`),price('expansion','Enter its body / prior-five median ratio (×, one decimal).',Math.round(ratio*10)/10,`Prior-five median body = ${fmt(bodies[2])}; expansion = ${ratio.toFixed(1)}×.`,.051)];
      annotations=[{i:idx(32),label:'External boundary',price:p(32,hard?'l':'h')},{i:idx(44),label:'Wick trap'},{i:idx(51),label:'Qualified displacement'}];
    }else if(key==='fvg'){
      title=hard?'Track the imbalance through the snapshot.':'Map and track the imbalance.';
      context=`Find the LAST ${dir} FVG created in candles ${n(43)}–${n(53)} by an impulse with a body ≥2× its previous five-body median. Ignore wick-overlap near misses. Map the outer-wick boundaries, then track its first later mitigation and current validity.`;
      const lo=hard?p(52,'h'):p(50,'h'),hi=hard?p(50,'l'):p(52,'l');
      steps=[candle('middle','Mark the middle candle of the qualifying three-candle FVG.',idx(51),`The qualifying trio is ${n(50)}–${n(52)}. The earlier impulsive-looking trio overlaps.`),price('lower','Enter the exact lower FVG boundary.',lo,`The lower outer-wick boundary is ${fmt(lo)}.`),price('upper','Enter the exact upper FVG boundary.',hi,`The upper outer-wick boundary is ${fmt(hi)}.`),candle('mitigation','Mark the FIRST later candle that trades into this gap.',idx(56),`Candle ${n(56)} is the first later range to enter the FVG; earlier retracements remain outside.`),choice('validity','Classify this FVG at the final close.',hard?'invalid':'partial',orderChoices([['untouched','Unmitigated and untouched'],['partial','Partially mitigated; no invalidating close'],['invalid','Invalidated by a close through the far boundary'],['guaranteed','Fully mitigated; original directional premise still intact']],2),hard?`The final candle closes through the far boundary. That invalidates the original directional gap under the lab rule.`:'The gap is entered, but the far boundary is not closed through. A partial fill is not a full fill or invalidation.')];
      annotations=[{i:idx(50),label:'FVG boundaries',zone:[lo,hi]},{i:idx(51),label:'Middle candle'},{i:idx(56),label:'First mitigation'}];
    }else{
      title=hard?'Qualify the complete entry plan.':'Audit the complete entry plan.';
      context=`Snapshot ends at candle ${cs.length}; there are no future bars. Equal ${hard?'highs':'lows'} form in candles ${n(24)}–${n(39)}. Use the opposite range extreme for MSS. After sweep → displaced MSS → FVG retest, the first ${dir} rejection closing back inside the FVG is the hypothetical entry trigger. Entry = its close; stop = 0.10 beyond the sweep extreme; target = nearest post-MSS opposing swing. Require ≥2.00R before costs.`;
      const entry=p(53,'c'),stop=round(hard?p(44,'h')+.1:p(44,'l')-.1),target=p(46,hard?'l':'h'),rr=Math.abs(target-entry)/Math.abs(entry-stop);
      steps=[candle('sweep','Mark the liquidity sweep candle.',idx(44),`Candle ${n(44)} runs the matching liquidity pool and closes back inside.`),candle('mss','Mark the external displaced MSS close.',idx(45),`Candle ${n(45)} closes through the opposite reference extreme.`),candle('trigger','Mark the first qualifying retest rejection.',idx(53),`Candle ${n(53)} confirms the directional rejection; the preceding retest candle is not the trigger.`),price('entry','Enter the hypothetical trigger-close entry price.',entry,`Trigger close = ${fmt(entry)}.`),price('stop','Enter the stop price using the stated 0.10 buffer.',stop,`Sweep extreme ${fmt(p(44,hard?'h':'l'))} ${hard?'+':'−'} 0.10 = ${fmt(stop)}.`),price('target','Enter the nearest opposing post-MSS swing target.',target,`The post-shift swing at candle ${n(46)} is ${fmt(target)}.`),price('rr','Calculate reward / risk (R, two decimals).',Math.round(rr*100)/100,`Reward ${fmt(Math.abs(target-entry))} / risk ${fmt(Math.abs(entry-stop))} = ${rr.toFixed(2)}R.`,.005),choice('decision','Does the COMPLETE hypothetical plan pass this lab’s entry rules?',rr>=2?'passes':'pass',orderChoices([['passes','Trigger confirmed and ≥2R available: plan qualifies'],['pass','Stand aside: trigger exists but target room is below 2R'],['wait','Wait: no qualifying retest rejection has closed'],['invalid','Stand aside: structural invalidation was already breached']],hard?2:1),'Pattern confluence is not enough. The trigger, invalidation and target arithmetic must all fit the stated rule.')];
      annotations=[{i:idx(44),label:'Sweep',price:p(44,hard?'h':'l')},{i:idx(45),label:'MSS'},{i:idx(46),label:'Opposing target',price:target},{i:idx(53),label:'Trigger close',price:entry}];
    }
    explanation=steps.map(s=>s.explanation).join(' ');
    expert.push({id:`expert-${tier}-${key}`,index:scenarios.length+expert.length,tier,key,concept:key==='shift'?'CHoCH / MSS':key==='fvg'?'Fair value gap':key==='ob'?'Order block':key==='entry'?'Potential entries':key==='bos'?'BOS':key==='sweep'?'Liquidity sweep':'Displacement',mode:'assessment',title,context,task:'Complete every chart mark and calculation, then lock your analysis. All checks must pass for full credit.',candles:cs,steps,annotations,explanation,rule:'No guides. No answer hints. No partial passes. Classify the external context before using an internal signal.',guides:[]});
  }
  levels.push({name:'Expert',subtitle:'Blind analysis',description:'Dense charts · independent marks · exact prices'},{name:'Gauntlet',subtitle:'Every condition counts',description:'Nested traps · multi-part grading · strict invalidation'});
  scenarios.push(...expert);
  window.LAB.defaultIndex=28;
  window.LAB.gradeAssessment=(s,answers)=>s.steps.map(step=>{
    const value=answers?.[step.id],present=value!==undefined&&value!==null&&value!=='';
    return {step,value,correct:present&&(step.type==='number'?Number.isFinite(Number(value))&&Math.abs(Number(value)-step.answer)<=step.tolerance+1e-8:value===step.answer)};
  });
})();
