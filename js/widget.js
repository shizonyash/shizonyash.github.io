(async () => {
  const label = document.getElementById('site-name');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  prev.removeAttribute('href');
  next.removeAttribute('href');
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { members } = await response.json();
    if (!Array.isArray(members) || !members.length || !members.every(m =>
      typeof m.name === 'string' && typeof m.url === 'string' && /^https?:\/\//.test(m.url)
    )) throw new Error('Invalid members.json');
    const id = new URLSearchParams(location.search).get('id');
    const index = id === null ? 0 : members.findIndex(m => m.name === id);
    if (index < 0) throw new Error(`Unknown member: ${id}`);
    label.textContent = members[index].name;
    prev.href = members[(index - 1 + members.length) % members.length].url;
    next.href = members[(index + 1) % members.length].url;
  } catch (error) {
    label.textContent = 'webring unavailable';
    console.error('Shizonyash widget:', error);
  }
})();
