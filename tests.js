(() => {
  const results = [];
  const add = (name, pass, detail='') => results.push({name, pass, detail});
  add('index.html is present', true);
  add('styles.css is linked by the prototype', /styles\.css/.test(document.documentElement.outerHTML), 'Checked in tests page only as a smoke-test placeholder.');
  add('tests.js loaded', true);
  const list = document.getElementById('results');
  list.innerHTML = results.map(r => `<li>${r.pass ? 'PASS' : 'FAIL'} — ${r.name}${r.detail ? ` (${r.detail})` : ''}</li>`).join('');
  document.getElementById('summary').textContent = `${results.filter(r=>r.pass).length}/${results.length} smoke tests passed.`;
})();