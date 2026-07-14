const copyButton = document.querySelector('#copy-hash');
const checksum = document.querySelector('#checksum');

copyButton?.addEventListener('click', async () => {
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
