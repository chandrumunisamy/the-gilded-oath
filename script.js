const REPOSITORY = 'chandrumunisamy/the-gilded-oath';
const RELEASES_PAGE = `https://github.com/${REPOSITORY}/releases`;
const LATEST_RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;

const links = [...document.querySelectorAll('[data-download-link]')];
const labels = [...document.querySelectorAll('[data-download-label]')];
const status = document.querySelector('#download-status');

function setTarget(url) {
  links.forEach((link) => { link.href = url; });
}

function setFallback(message) {
  setTarget(RELEASES_PAGE);
  labels.forEach((label) => { label.textContent = 'View the download'; });
  if (status) {
    status.textContent = message;
    status.className = 'download-status warning';
  }
}

async function findDownload() {
  try {
    const response = await fetch(LATEST_RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) throw new Error('Release unavailable');

    const release = await response.json();
    const file = Array.isArray(release.assets)
      ? release.assets.find((asset) => asset.name.toLowerCase().endsWith('.apk'))
      : null;

    if (!file) {
      setFallback('The newest download is being prepared.');
      return;
    }

    setTarget(file.browser_download_url);
    labels.forEach((label) => { label.textContent = 'Download for Android'; });
    if (status) {
      status.textContent = 'The newest version is ready.';
      status.className = 'download-status ready';
    }
  } catch {
    setFallback('Open the download page to get the newest version.');
  }
}

findDownload();
