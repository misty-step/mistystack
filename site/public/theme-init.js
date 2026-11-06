// Apply the brand's saved choice before first paint. With no override, CSS
// follows the system. data-js reveals controls that require JavaScript.
(() => {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('misty-step-theme'); } catch { /* The system theme still applies. */ }
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  root.dataset.js = '';
})();
