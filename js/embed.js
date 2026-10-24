/* Shizonyash Webring: unstyled, CSS-customizable embed.
   <div id="my-webring"></div>
   <script src="https://shizonyash.github.io/js/embed.js" data-site="somedott.space" data-target="#my-webring" defer></script>
*/
(() => {
  const script = document.currentScript;
  if (!script) return;
  const base = new URL('../', script.src);
  const site = script.dataset.site;
  const selector = script.dataset.target;

  function mount() {
    const host = selector ? document.querySelector(selector) : script.parentElement;
    if (!host) {
      console.error('Shizonyash: target not found:', selector);
      return;
    }
    if (!site) {
      console.error('Shizonyash: data-site is required');
      return;
    }
    const root = document.createElement('div');
    root.className = 'shizonyash-webring';
    root.setAttribute('aria-label', 'Shizonyash webring');
    root.textContent = 'Loading webring…';
    host.append(root);

    fetch(new URL('data/members.json', base))
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        const members = data.members;
        if (!Array.isArray(members) || !members.length || !members.every(m =>
          m && typeof m.name === 'string' && typeof m.url === 'string' && /^https?:\/\//.test(m.url)
        )) throw new Error('Invalid members.json');
        const idx = members.findIndex(m => m.name === site);
        if (idx < 0) throw new Error(`Unknown member: ${site}`);
        const link = (cls, text, member, label) => {
          const a = document.createElement('a');
          a.className = cls;
          a.textContent = text;
          a.href = member.url;
          a.setAttribute('aria-label', label + ': ' + member.name);
          return a;
        };
        const title = document.createElement('div');
        title.className = 'shizonyash-title';
        title.textContent = 'shizonyash webring :3';
        const nav = document.createElement('div');
        nav.className = 'shizonyash-nav';
        const current = document.createElement('div');
        current.className = 'shizonyash-current';
        const caption = document.createElement('span');
        caption.className = 'shizonyash-caption';
        caption.textContent = 'you are at';
        const name = document.createElement('strong');
        name.className = 'shizonyash-site-name';
        name.textContent = members[idx].name;
        current.append(caption, name);
        nav.append(
          link('shizonyash-prev', '←', members[(idx - 1 + members.length) % members.length], 'Previous site'),
          current,
          link('shizonyash-next', '→', members[(idx + 1) % members.length], 'Next site')
        );
        root.replaceChildren(title, nav);
      })
      .catch(error => {
        root.textContent = 'webring unavailable';
        console.error('Shizonyash:', error);
      });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
