import { startBrand } from '@misty-step/brand/runtime';
import { wire } from '@misty-step/brand/spine';

const root = document.documentElement;
const THEME_KEY = 'mistystack-theme';
const systemDark = matchMedia('(prefers-color-scheme: dark)');
const systemTheme = () => (systemDark.matches ? 'dark' : 'light');
const savedTheme = () => {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch { return null; }
};

// One control switches between light and dark. Choosing the system's own
// theme forgets the saved choice, so the page follows the system again.
const themeToggle = document.querySelector('.theme-toggle');
const labelTheme = () => themeToggle?.setAttribute('aria-label', `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
labelTheme();
themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try {
    if (next === systemTheme()) localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, next);
  } catch { /* The selected theme still applies for this page. */ }
  labelTheme();
});
systemDark.addEventListener('change', () => {
  if (savedTheme()) return;
  root.dataset.theme = systemTheme();
  labelTheme();
});

startBrand();
// The spine's behaviour, including every [role="tab"]: the home page's install tabs.
wire();

const copyStatus = document.querySelector('[data-copy-status]');
for (const button of document.querySelectorAll('.copy')) {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.parentElement.querySelector('code').textContent);
      button.textContent = button.dataset.copied;
    } catch {
      button.textContent = button.dataset.failed;
    }
    if (copyStatus) copyStatus.textContent = button.textContent;
  });
}

for (const disclosure of document.querySelectorAll('.nav-menu, .browse-mobile, .toc-mobile')) {
  disclosure.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a');
    if (!link) return;
    disclosure.open = false;
    const destination = new URL(link.href);
    if (destination.pathname === location.pathname && destination.hash) {
      const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  });
  disclosure.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !disclosure.open) return;
    disclosure.open = false;
    disclosure.querySelector('summary').focus();
  });
}
