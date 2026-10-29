const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};vm.createContext(context);
for(const f of ['scenarios.js','expert-scenarios.js'])vm.runInContext(fs.readFileSync(`dist/${f}`,'utf8'),context);
const {scenarios,levels,defaultIndex,gradeAssessment}=context.window.LAB;
assert.equal(scenarios.length,35);assert.equal(levels.length,5);assert.equal(defaultIndex,28);
const experts=scenarios.filter(s=>s.mode==='assessment');
assert.equal(experts.length,14);
assert.equal(experts.reduce((n,s)=>n+s.steps.length,0),72);
for(const s of experts){
  const cs=s.candles,hard=s.tier===4,o=hard?8:0,at=i=>cs[i+o];
  assert.ok(cs.length>=54&&cs.length<=68);
  assert.equal(s.mode,'assessment');assert.equal(s.level,undefined);assert.equal(s.zone,undefined);assert.equal(s.hint,undefined);
  for(const [i,p]of cs.entries())assert.ok([p.o,p.h,p.l,p.c].every(Number.isFinite)&&p.h>=Math.max(p.o,p.c)&&p.l<=Math.min(p.o,p.c),`${s.id} OHLC ${i}`);
  const answers=Object.fromEntries(s.steps.map(p=>[p.id,p.answer]));
  assert.ok(gradeAssessment(s,answers).every(p=>p.correct),`${s.id}: correct full answer passes`);
  assert.ok(gradeAssessment(s,{}).every(p=>!p.correct),`${s.id}: blanks cannot pass`);
  for(const step of s.steps){
    const wrong={...answers,[step.id]:step.type==='number'?step.answer+1:step.type==='candle'?step.answer+1:'wrong-choice'};
    assert.equal(gradeAssessment(s,wrong).filter(p=>p.correct).length,s.steps.length-1,`${s.id}: one wrong check fails independently`);
    const blank={...answers,[step.id]:''};assert.equal(gradeAssessment(s,blank).filter(p=>p.correct).length,s.steps.length-1);
    if(step.type==='number'){assert.ok(gradeAssessment(s,{...answers,[step.id]:String(step.answer)}).every(p=>p.correct));assert.ok(!gradeAssessment(s,{...answers,[step.id]:'Infinity'}).every(p=>p.correct));}
    if(step.type==='candle')assert.ok(step.answer===-1&&step.allowNone||step.answer>=0&&step.answer<cs.length);
  }
  const range=cs.slice(24+o,40+o),max=Math.max(...range.map(p=>p.h)),min=Math.min(...range.map(p=>p.l));
  if(s.key==='bos'){
    const ref=at(32)[hard?'l':'h'];assert.equal(ref,hard?min:max);
    assert.equal(cs.findIndex((p,i)=>i>39+o&&(hard?p.c<ref:p.c>ref)),answers.confirmation);
    assert.equal(hard?Math.max(...cs.slice(33+o,46+o).map(p=>p.h)):Math.min(...cs.slice(33+o,46+o).map(p=>p.l)),answers.protected);
  }
  if(s.key==='shift'){
    const ref=at(39)[hard?'h':'l'];assert.equal(ref,hard?max:min);
    assert.equal(cs.findIndex((p,i)=>i>39+o&&(hard?p.c>ref:p.c<ref)),answers.confirmation);
    assert.ok(hard?at(49).h>ref&&at(49).c<ref:at(49).l<ref&&at(49).c>ref);
  }
  if(s.key==='sweep'){
    const ref=at(28)[hard?'l':'h'];assert.equal(ref,at(39)[hard?'l':'h']);
    assert.equal(cs.findIndex((p,i)=>i>=45+o&&(hard?p.l<ref&&p.c>ref:p.h>ref&&p.c<ref)),answers.sweep);
    const opposite=hard?max:min;
    assert.equal(cs.findIndex((p,i)=>i>answers.sweep&&(hard?p.c>opposite:p.c<opposite)),answers.confirmation);
  }
  if(s.key==='ob'){
    assert.equal(answers.lower,at(45).l);assert.equal(answers.upper,at(45).h);
    assert.ok(hard?at(45).c>at(45).o&&at(46).c<min:at(45).c<at(45).o&&at(46).c>max);
    assert.equal(cs.slice(47+o).some(p=>hard?p.c>answers.upper:p.c<answers.lower),hard);
  }
  if(s.key==='displacement'){
    const ref=at(32)[hard?'l':'h'];assert.equal(ref,hard?min:max);
    const qualified=cs.findIndex((p,i)=>{if(i<40+o)return false;const median=cs.slice(i-5,i).map(p=>Math.abs(p.c-p.o)).sort((a,b)=>a-b)[2];return Math.abs(p.c-p.o)>=2*median&&(hard?p.c<ref:p.c>ref)&&(hard?(p.h-p.c)/(p.h-p.l):(p.c-p.l)/(p.h-p.l))>=.75;});
    assert.equal(qualified,answers.impulse);assert.ok(Math.abs(Math.abs(at(51).c-at(51).o)-answers.body)<1e-7);
  }
  if(s.key==='fvg'){
    const qualifying=[];for(let i=43+o;i<=53+o;i++){const p=cs[i],median=cs.slice(i-5,i).map(p=>Math.abs(p.c-p.o)).sort((a,b)=>a-b)[2];if(Math.abs(p.c-p.o)>=2*median&&(hard?cs[i-1].l>cs[i+1].h:cs[i-1].h<cs[i+1].l))qualifying.push(i);}
    assert.equal(qualifying.at(-1),answers.middle);
    assert.equal(answers.lower,hard?at(52).h:at(50).h);assert.equal(answers.upper,hard?at(50).l:at(52).l);
    assert.equal(cs.findIndex((p,i)=>i>52+o&&p.l<=answers.upper&&p.h>=answers.lower),answers.mitigation);
    assert.equal(hard?cs.at(-1).c>answers.upper:cs.at(-1).c<answers.lower,hard);
  }
  if(s.key==='entry'){
    assert.equal(answers.entry,at(53).c);assert.equal(answers.target,at(46)[hard?'l':'h']);
    assert.ok(Math.abs(answers.stop-(at(44)[hard?'h':'l']+(hard?.1:-.1)))<1e-7);
    const rr=Math.abs(answers.target-answers.entry)/Math.abs(answers.entry-answers.stop);
    assert.ok(Math.abs(answers.rr-rr)<=.005);assert.equal(rr>=2,hard);
    assert.equal(answers.decision,hard?'passes':'pass');
    assert.ok(hard?at(44).h>at(27).h&&at(44).c<at(27).h:at(44).l<at(27).l&&at(44).c>at(27).l);
  }
}
console.log('PASS: 14 blind assessments, 72 independently graded checks, reference/range/sequence/FVG/displacement/entry invariants.');
