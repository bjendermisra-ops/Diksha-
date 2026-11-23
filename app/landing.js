const openLink = document.getElementById('open-app');
const page = new URLSearchParams(location.search).get('page') || '';
const validPage = /^[a-z0-9_-]+\.html$/i.test(page) ? page : '';
if (/Android/i.test(navigator.userAgent)) {
  const store = document.querySelector('.hero .button').href;
  openLink.href = 'intent://open?page=' + encodeURIComponent(validPage) +
    '#Intent;scheme=sriradha;package=bhagwat.gita.hindi.and.marathi.dev.santosh;S.browser_fallback_url=' +
    encodeURIComponent(store) + ';end';
} else if (validPage) {
  openLink.href = new URL(validPage, openLink.href).href;
}
