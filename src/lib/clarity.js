export function initMicrosoftClarity() {
  const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

  if (!projectId || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (window.clarity || document.getElementById('ms-clarity-script')) {
    return;
  }

  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
    t = l.createElement(r);
    t.async = 1;
    t.id = 'ms-clarity-script';
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', projectId);
}