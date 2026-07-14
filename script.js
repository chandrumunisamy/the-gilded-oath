const REPOSITORY = 'chandrumunisamy/the-gilded-oath';
const DOWNLOADS_PAGE = `https://github.com/${REPOSITORY}/releases`;
const NEWEST_DOWNLOAD = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
const CACHE_KEY = 'gilded-oath-download';
const CACHE_AGE = 60 * 60 * 1000;

const downloadLinks = [...document.querySelectorAll('[data-download-link]')];

function setDownloadLink(url) {
  downloadLinks.forEach((link) => {
    link.href = url;
    link.rel = 'noopener';
  });
}

function readSavedLink() {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!saved?.url || Date.now() - saved.savedAt > CACHE_AGE) return null;
    return saved.url;
  } catch {
    return null;
  }
}

function saveLink(url) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ url, savedAt: Date.now() }));
  } catch {
    // The download still works even when storage is unavailable.
  }
}

async function findNewestDownload() {
  const savedLink = readSavedLink();
  if (savedLink) setDownloadLink(savedLink);

  try {
    const response = await fetch(NEWEST_DOWNLOAD, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) return;

    const release = await response.json();
    const gameFile = Array.isArray(release.assets)
      ? release.assets.find((item) => item.name.toLowerCase().endsWith('.apk'))
      : null;

    if (!gameFile?.browser_download_url) return;
    setDownloadLink(gameFile.browser_download_url);
    saveLink(gameFile.browser_download_url);
  } catch {
    setDownloadLink(savedLink || DOWNLOADS_PAGE);
  }
}

const header = document.querySelector('#site-header');
let headerQueued = false;
function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 18);
  headerQueued = false;
}
window.addEventListener('scroll', () => {
  if (headerQueued) return;
  headerQueued = true;
  requestAnimationFrame(updateHeader);
}, { passive: true });
updateHeader();

const revealItems = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const screensTrack = document.querySelector('#screens-track');
const screenCards = screensTrack ? [...screensTrack.querySelectorAll('.screen')] : [];
const screenDots = [...document.querySelectorAll('#screen-dots button')];
let dotsQueued = false;

function updateScreenDots() {
  if (!screensTrack || !screenCards.length || !screenDots.length) return;
  const middle = screensTrack.scrollLeft + screensTrack.clientWidth / 2;
  let active = 0;
  let best = Infinity;
  screenCards.forEach((card, index) => {
    const distance = Math.abs(middle - (card.offsetLeft + card.offsetWidth / 2));
    if (distance < best) {
      best = distance;
      active = index;
    }
  });
  screenDots.forEach((dot, index) => dot.classList.toggle('active', index === active));
  dotsQueued = false;
}

screensTrack?.addEventListener('scroll', () => {
  if (dotsQueued) return;
  dotsQueued = true;
  requestAnimationFrame(updateScreenDots);
}, { passive: true });

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
  let heroQueued = false;
  let lastEvent;
  heroArt.addEventListener('pointermove', (event) => {
    lastEvent = event;
    if (heroQueued) return;
    heroQueued = true;
    requestAnimationFrame(() => {
      const rect = heroArt.getBoundingClientRect();
      const x = (lastEvent.clientX - rect.left) / rect.width - 0.5;
      const y = (lastEvent.clientY - rect.top) / rect.height - 0.5;
      heroArt.style.transform = `perspective(1000px) rotateX(${-y * 2}deg) rotateY(${x * 3}deg)`;
      heroQueued = false;
    });
  });
  heroArt.addEventListener('pointerleave', () => { heroArt.style.transform = ''; });
}

findNewestDownload();
