const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {migrateProgress}=require('./dist/version-state.js');
const legacy={current:29,expertIntroduced:true,records:{'scenario-1':{correct:true,selected:21},'scenario-21':{correct:false,selected:'A'},'expert-4-shift':{correct:true,selected:{confirmation:-1}},'scenario-99':{correct:true}},history:[{id:'scenario-1',correct:true},{id:'expert-4-shift',correct:true},{id:'scenario-99',correct:true}]};
const easy=migrateProgress(legacy,'easy'),hard=migrateProgress(legacy,'hard');
assert.equal(easy.current,0);assert.equal(hard.current,29);
assert.deepEqual(Object.keys(easy.records),['scenario-1','scenario-21']);
assert.deepEqual(Object.keys(hard.records),['scenario-1','scenario-21','expert-4-shift']);
assert.equal(easy.history.length,1);assert.equal(hard.history.length,2);assert.equal(hard.expertIntroduced,true);
assert.equal(migrateProgress({...legacy,current:4},'easy').current,4);
assert.equal(migrateProgress({...legacy,current:4},'hard').current,28);
assert.equal(migrateProgress(null,'easy'),null);assert.equal(migrateProgress(legacy,'unknown'),null);
const storage=new Map([['structure-lab-v1',JSON.stringify(legacy)]]);
const code=fs.readFileSync('dist/version-state.js','utf8');
const run=version=>vm.runInNewContext(code,{document:{currentScript:{dataset:{trainerVersion:version}}},localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)}});
run('easy');run('hard');
assert.deepEqual(JSON.parse(storage.get('structure-lab-easy-v1')),easy);
assert.deepEqual(JSON.parse(storage.get('structure-lab-hard-v1')),hard);
assert.deepEqual(JSON.parse(storage.get('structure-lab-v1')),legacy);
storage.set('structure-lab-easy-v1',JSON.stringify({current:0,records:{},history:[]}));run('easy');run('hard');
assert.equal(Object.keys(JSON.parse(storage.get('structure-lab-easy-v1')).records).length,0,'reset easy stays reset');
assert.equal(Object.keys(JSON.parse(storage.get('structure-lab-hard-v1')).records).length,3,'easy reset preserves hard answers');
assert.doesNotThrow(()=>vm.runInNewContext(code,{document:{currentScript:{dataset:{trainerVersion:'hard'}}},localStorage:{getItem(){throw Error('storage disabled');}}}));
const index=fs.readFileSync('dist/index.html','utf8');
assert.ok(index.includes('href="easy/"'));assert.ok(index.includes('href="hard/"'));
assert.ok(!index.includes('src="app.js"'),'chooser does not launch a trainer automatically');
for(const mode of ['easy','hard']){
  const html=fs.readFileSync(`dist/${mode}/index.html`,'utf8');
  assert.ok(html.includes('class="version-return" href="../"'));
  assert.ok(html.includes(`data-trainer-version="${mode}"`));
  for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g))assert.ok(fs.existsSync(path.join('dist',mode,match[1])),`${mode} asset exists: ${match[1]}`);
  const app=fs.readFileSync(`dist/${mode}/app.js`,'utf8');assert.ok(app.includes(`structure-lab-${mode}-v1`));
  const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(`dist/${mode}/scenarios.js`,'utf8'),c);
  if(mode==='easy'){assert.equal(c.window.LAB.scenarios.length,21);assert.equal(c.window.LAB.levels.length,3);assert.ok(!html.includes('expert-scenarios.js'));}
  else{vm.runInContext(fs.readFileSync('dist/hard/expert-scenarios.js','utf8'),c);assert.equal(c.window.LAB.scenarios.length,35);assert.equal(c.window.LAB.defaultIndex,28);}
}
console.log('PASS: chooser links, original easy/new hard assets, legacy progress migration, separate storage and reset isolation.');
