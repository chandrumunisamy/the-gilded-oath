const REPOSITORY = 'chandrumunisamy/the-gilded-oath';
const RELEASES_PAGE = `https://github.com/${REPOSITORY}/releases`;
const LATEST_RELEASE = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
const CACHE_KEY = 'gilded-oath-download-v2';
const links = [...document.querySelectorAll('[data-download-link]')];

function useDownload(url) {
  if (!url) return;
  links.forEach((link) => { link.href = url; });
}

function getCachedDownload() {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!saved?.url || Date.now() - saved.time > 6 * 60 * 60 * 1000) return null;
    return saved.url;
  } catch {
    return null;
  }
}

async function findDownload() {
  const cached = getCachedDownload();
  if (cached) useDownload(cached);

  try {
    const response = await fetch(LATEST_RELEASE, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) return;
    const release = await response.json();
    const apk = Array.isArray(release.assets)
      ? release.assets.find((file) => file.name.toLowerCase().endsWith('.apk'))
      : null;
    if (!apk?.browser_download_url) return;
    useDownload(apk.browser_download_url);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ url: apk.browser_download_url, time: Date.now() }));
    } catch {
      // The download link still works without saved browser data.
    }
  } catch {
    useDownload(cached || RELEASES_PAGE);
  }
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(findDownload, { timeout: 1500 });
} else {
  window.setTimeout(findDownload, 350);
}
