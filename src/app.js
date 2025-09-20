import { renderLayout } from './components/layout.js';
import TrackingPage from './pages/tracking/tracking.js';

function parseRoute(route = '') {
  const [path, query = ''] = route.split('?');
  const searchParams = new URLSearchParams(query);
  return { path, searchParams };
}

function renderRoute(route, root, options = {}) {
  const { path, searchParams } = parseRoute(route);

  if (path === '#/tracking') {
    const trackingOptions = {
      ...options.tracking,
      initialReference: options.tracking?.initialReference || searchParams.get('ref') || searchParams.get('reference')
    };
    const page = new TrackingPage(root, trackingOptions);
    page.render();
    return;
  }

  if (root) {
    root.innerHTML = '<p>Halaman tidak ditemukan.</p>';
  }
}

export function initApp({ mountSelector = '#app', layoutOptions = {}, trackingOptions = {} } = {}) {
  const mountPoint = document.querySelector(mountSelector);
  if (!mountPoint) {
    throw new Error(`Elemen dengan selector "${mountSelector}" tidak ditemukan.`);
  }

  const initialLayoutOptions = { ...layoutOptions, activePath: '#/tracking' };
  mountPoint.innerHTML = renderLayout('<div class="app__content"></div>', initialLayoutOptions);

  const container = mountPoint.querySelector('.app__content');
  if (!container) {
    throw new Error('Container konten tidak tersedia.');
  }

  function updateNavigation(route) {
    const { path: currentPath } = parseRoute(route);
    const nav = mountPoint.querySelector('.layout__nav');
    if (!nav) {
      return;
    }

    const links = Array.from(nav.querySelectorAll('.layout__link'));
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) {
        return;
      }

      const normalized = href.startsWith('#') ? href : href.replace(/^[^#]*/, '');
      const { path } = parseRoute(normalized);
      const isActive = path === currentPath;
      if (isActive) {
        link.classList.add('layout__link--active');
      } else {
        link.classList.remove('layout__link--active');
      }
    });
  }

  function handleRouteChange() {
    if (!window.location.hash) {
      window.location.hash = '#/tracking';
    }

    const route = window.location.hash || '#/tracking';
    renderRoute(route, container, { tracking: trackingOptions });
    updateNavigation(route);
  }

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}

export default {
  initApp
};
