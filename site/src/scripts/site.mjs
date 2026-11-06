import { startBrand } from '@misty-step/brand/runtime';
import { wire } from '@misty-step/brand/spine';

startBrand();
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
