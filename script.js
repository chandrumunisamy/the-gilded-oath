const REPOSITORY = 'chandrumunisamy/the-gilded-oath';
const RELEASES_PAGE = `https://github.com/${REPOSITORY}/releases`;
const LATEST_RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;

const downloadLinks = [...document.querySelectorAll('[data-download-link]')];
const downloadLabels = [...document.querySelectorAll('[data-download-label]')];
const versionLabels = [...document.querySelectorAll('[data-release-version]')];
const releaseSizeLabels = [...document.querySelectorAll('[data-release-size]')];
const downloadStatus = document.querySelector('#download-status');
const integritySection = document.querySelector('#integrity');
const checksum = document.querySelector('#checksum');
const checksumLabel = document.querySelector('#checksum-label');
const copyButton = document.querySelector('#copy-hash');

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return 'Android APK';
  const mib = bytes / (1024 * 1024);
  return `${mib.toFixed(mib >= 100 ? 0 : 1)} MiB APK`;
}

function setDownloadTarget(url) {
  downloadLinks.forEach((link) => {
    link.href = url;
    link.target = '_self';
  });
}

function setReleaseFallback(message) {
  setDownloadTarget(RELEASES_PAGE);
  downloadLabels.forEach((label) => { label.textContent = 'Open GitHub Releases'; });
  if (downloadStatus) {
    downloadStatus.textContent = message;
    downloadStatus.classList.add('warning');
  }
}

async function resolveLatestRelease() {
  try {
    const response = await fetch(LATEST_RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const release = await response.json();
    const apk = Array.isArray(release.assets)
      ? release.assets.find((asset) => asset.name.toLowerCase().endsWith('.apk'))
      : null;

    const version = release.tag_name || release.name || 'latest build';
    versionLabels.forEach((label) => { label.textContent = version; });

    if (!apk) {
      setReleaseFallback(`${version} exists, but it does not contain an APK yet.`);
      return;
    }

    setDownloadTarget(apk.browser_download_url);
    downloadLabels.forEach((label) => { label.textContent = `Download ${version} APK`; });
    releaseSizeLabels.forEach((label) => { label.textContent = formatBytes(apk.size); });

    if (downloadStatus) {
      downloadStatus.textContent = `${apk.name} is ready to download from GitHub Releases.`;
      downloadStatus.classList.remove('warning');
      downloadStatus.classList.add('ready');
    }

    const digest = typeof apk.digest === 'string' ? apk.digest : '';
    if (digest.toLowerCase().startsWith('sha256:') && integritySection && checksum) {
      const sha = digest.slice('sha256:'.length);
      checksum.textContent = sha;
      checksumLabel.textContent = `SHA-256 · ${apk.name}`;
      integritySection.hidden = false;
      requestAnimationFrame(() => integritySection.classList.add('is-visible'));
    }
  } catch (error) {
    setReleaseFallback('Direct download is not published yet. Open Releases and upload the APK first.');
  }
}

copyButton?.addEventListener('click', async () => {
  if (!checksum?.textContent.trim()) return;
  try {
    await navigator.clipboard.writeText(checksum.textContent.trim());
    copyButton.textContent = 'Checksum copied';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(checksum);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.textContent = 'Checksum selected';
  }
  window.setTimeout(() => { copyButton.textContent = 'Copy checksum'; }, 1800);
});

const header = document.querySelector('#site-header');
const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealElements = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const screensTrack = document.querySelector('#screens-track');
const screenCards = screensTrack ? [...screensTrack.querySelectorAll('.screen')] : [];
const screenDots = [...document.querySelectorAll('#screen-dots button')];

function updateScreenDots() {
  if (!screensTrack || !screenCards.length || !screenDots.length) return;
  const trackCenter = screensTrack.scrollLeft + screensTrack.clientWidth / 2;
  let activeIndex = 0;
  let smallestDistance = Infinity;
  screenCards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(trackCenter - cardCenter);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      activeIndex = index;
    }
  });
  screenDots.forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
}

screensTrack?.addEventListener('scroll', updateScreenDots, { passive: true });
screenDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    screenCards[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
});
window.addEventListener('resize', updateScreenDots, { passive: true });
updateScreenDots();

const heroArt = document.querySelector('#hero-art');
const finePointer = window.matchMedia('(pointer: fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroArt && finePointer && !reducedMotion) {
  heroArt.addEventListener('pointermove', (event) => {
    const rect = heroArt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroArt.style.transform = `perspective(1000px) rotateX(${-y * 2.5}deg) rotateY(${x * 3.5}deg)`;
  });
  heroArt.addEventListener('pointerleave', () => {
    heroArt.style.transform = '';
  });
}

resolveLatestRelease();
