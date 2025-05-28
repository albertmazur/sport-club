import './styles.css';

fetch('/api/stadiums')
  .then(r => r.json())
  .then(data => {
    const el = document.getElementById('app');
    el.innerHTML = `<h1 class="text-2xl font-bold mb-4">Stadiony</h1>` +
      `<ul class="space-y-2">${data.map(s =>
        `<li class="p-2 bg-white rounded shadow">${s.name}</li>`
      ).join('')}</ul>`;
  });
