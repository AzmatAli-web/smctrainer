const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context = {window:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('dist/easy/scenarios.js','utf8'),context);
const {scenarios,concepts} = context.window.LAB;
assert.equal(scenarios.length,21);
assert.equal(concepts.length,7);
assert.equal(new Set(scenarios.map(s=>s.id)).size,21);
for (const s of scenarios) {
  assert.equal(s.candles.length,24,s.id);
  for (const c of s.candles) {
    assert.ok([c.o,c.h,c.l,c.c].every(Number.isFinite),s.id);
    assert.ok(c.h>=Math.max(c.o,c.c) && c.l<=Math.min(c.o,c.c),`${s.id}: OHLC envelope`);
  }
  if(s.mode==='choice') assert.ok(s.options.some(([id])=>id===s.correct),s.id);
  if(s.mode==='zone') assert.ok(s.zones.some(z=>z.id===s.correct),s.id);
  if(['bos','shift'].includes(s.key) && s.tier<2) {
    const up=(s.key==='bos' && s.tier===0)||(s.key==='shift' && s.tier===0);
    const first=s.candles.findIndex((c,i)=>i>s.levelStart&&(up?c.c>s.level:c.c<s.level));
    assert.equal(first,s.correct,`${s.id}: first close across reference`);
  }
  if(s.key==='sweep' && s.tier<2) {
    const c=s.candles[s.correct];
    assert.ok(s.tier===0?c.h>s.level&&c.c<s.level:c.l<s.level&&c.c>s.level,`${s.id}: sweep rejection`);
    assert.equal(s.tier===0?s.candles[3].h:s.candles[3].l,s.level);
    assert.equal(s.tier===0?s.candles[9].h:s.candles[9].l,s.level);
  }
  if(s.key==='displacement'&&s.tier<2) {
    const i=s.correct,c=s.candles[i],body=Math.abs(c.c-c.o);
    const bodies=s.candles.slice(i-5,i).map(p=>Math.abs(p.c-p.o)).sort((a,b)=>a-b);
    assert.ok(body>=bodies[2]*2,`${s.id}: body expansion`);
    assert.ok(s.tier===0?(c.c-c.l)/(c.h-c.l)>=.75:(c.h-c.c)/(c.h-c.l)>=.75,`${s.id}: close at extreme`);
    assert.ok(s.tier===0?c.c>s.level:c.c<s.level,`${s.id}: structural close`);
  }
  if(s.key==='ob'&&s.tier<2) {
    const c=s.candles[s.correct],next=s.candles[s.correct+1];
    assert.ok(s.tier===0?c.c<c.o&&next.c>next.o&&next.c>s.level:c.c>c.o&&next.c<next.o&&next.c<s.level,`${s.id}: opposing origin and structure break`);
    assert.equal(s.zone[0],c.l);assert.equal(s.zone[1],c.h);
  }
  if(s.key==='fvg'&&s.tier<2) {
    const first=s.candles[16],third=s.candles[18],z=s.zones.find(z=>z.id===s.correct);
    const lo=s.tier===0?first.h:third.h,hi=s.tier===0?third.l:first.l;
    assert.ok(lo<hi,`${s.id}: outer candles do not overlap`);
    assert.equal(z.lo,lo);assert.equal(z.hi,hi);
  }
}
assert.ok(!scenarios[14].candles.slice(13).some(c=>c.c>110),'wick trap is not BOS');
assert.ok(!scenarios[15].candles.slice(15).some(c=>c.c>112),'wick trap is not MSS');
assert.ok(scenarios[16].candles[18].c>114,'accepted break does not close back');
assert.ok(scenarios[17].candles[22].c<102.2,'OB invalidated');
assert.ok(scenarios[18].candles[17].c<109,'wick alone does not displace structure');
assert.ok(scenarios[19].candles[16].h>=scenarios[19].candles[18].l,'no FVG with overlapping wicks');
assert.ok(scenarios[20].candles[22].c<100.5,'long premise invalidated');
console.log('PASS: 21 scenarios, 504 valid OHLC candles, structure/sweep/OB/displacement/FVG and seven challenge invariants.');
