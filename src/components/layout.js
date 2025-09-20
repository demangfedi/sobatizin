function renderNavigation(isAuthenticated = false, activePath = '#/tracking') {
  const linkClass = (path) =>
    `layout__link${activePath === path ? ' layout__link--active' : ''}`;
  const authLinks = isAuthenticated
    ? `<a class="${linkClass('#/dashboard')}" href="#/dashboard">Dashboard</a>`
    : `<a class="${linkClass('#/login')}" href="#/login">Masuk</a>`;

  return `
    <nav class="layout__nav">
      <a class="${linkClass('#/')}" href="#/">Beranda</a>
      <a class="${linkClass('#/tracking')}" href="#/tracking">Lacak Pesanan</a>
      ${authLinks}
    </nav>
  `;
}

export function renderLayout(content, options = {}) {
  const { title = 'SobatIzin', isAuthenticated = false, activePath = '#/tracking' } = options;

  return `
    <div class="layout">
      <header class="layout__header">
        <h1 class="layout__title">${title}</h1>
        ${renderNavigation(isAuthenticated, activePath)}
      </header>
      <main class="layout__content">${content}</main>
    </div>
  `;
}

export default {
  renderLayout
};
