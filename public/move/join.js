// Shows the invitation from ?code= and, on Android, a button that opens it in the app
// (or Google Play when the app is not installed). The code never leaves the page.
const store = 'https://play.google.com/store/apps/details?id=com.jovexalabs.move';
const code = new URLSearchParams(location.search).get('code') ?? '';

if (/^[A-Za-z0-9_-]{16,64}$/.test(code)) {
  const link = `https://jovexalabs.com/move/join?code=${code}`;
  document.getElementById('link').textContent = link;
  document.getElementById('invite').hidden = false;
  if (/Android/i.test(navigator.userAgent)) {
    const open = document.getElementById('open');
    open.href = `intent://jovexalabs.com/move/join?code=${code}#Intent;scheme=https;` +
      `package=com.jovexalabs.move;S.browser_fallback_url=${encodeURIComponent(store)};end`;
    open.hidden = false;
  }
  const copy = document.getElementById('copy');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(link);
      copy.textContent = 'Copied';
    } catch {
      window.getSelection().selectAllChildren(document.getElementById('link'));
      copy.textContent = 'Selected: copy it from your browser';
    }
  });
} else {
  document.getElementById('invalid').hidden = false;
}
