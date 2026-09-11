(function () {
  const storageKey = 'nell-cardew-case-zero-board-v1';
  const hintKey = 'nell-cardew-case-zero-hints-v1';
  const form = document.querySelector('#case-form');
  const inputs = form ? Array.from(form.querySelectorAll('input, textarea')) : [];
  const saveStatus = document.querySelector('#save-status');
  const progressLabel = document.querySelector('#progress-label');
  const progressBar = document.querySelector('#progress-bar');

  function safeRead(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function updateProgress() {
    const complete = inputs.filter(function (field) { return field.value.trim().length > 0; }).length;
    if (progressLabel) progressLabel.textContent = complete + ' of ' + inputs.length + ' fields';
    if (progressBar) progressBar.style.width = ((complete / inputs.length) * 100) + '%';
  }

  if (form) {
    const saved = safeRead(storageKey, {});
    inputs.forEach(function (field) {
      if (typeof saved[field.name] === 'string') field.value = saved[field.name];
    });
    updateProgress();

    form.addEventListener('input', function () {
      const data = {};
      inputs.forEach(function (field) { data[field.name] = field.value; });
      const didSave = safeWrite(storageKey, data);
      if (saveStatus) {
        saveStatus.innerHTML = didSave
          ? '<span aria-hidden="true">✓</span> Saved on this device'
          : '<span aria-hidden="true">!</span> This browser blocked local saving';
      }
      updateProgress();
    });
  }

  const reset = document.querySelector('#reset-board');
  if (reset) {
    reset.addEventListener('click', function () {
      if (!window.confirm('Clear every answer on this Case Board?')) return;
      inputs.forEach(function (field) { field.value = ''; });
      try { localStorage.removeItem(storageKey); } catch (error) {}
      updateProgress();
      document.querySelector('#case-board').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const openHints = safeRead(hintKey, {});
  document.querySelectorAll('.reveal-hint').forEach(function (button) {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    if (openHints[panel.id]) {
      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      button.textContent = 'Hide';
    }

    button.addEventListener('click', function () {
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
      button.textContent = willOpen ? 'Hide' : 'Reveal';
      openHints[panel.id] = willOpen;
      safeWrite(hintKey, openHints);
    });
  });

  const completeCheck = document.querySelector('#board-complete');
  const revealSolution = document.querySelector('#reveal-solution');
  const solution = document.querySelector('#verified-solution');
  const gate = document.querySelector('#solution-gate');

  if (completeCheck && revealSolution) {
    completeCheck.addEventListener('change', function () {
      revealSolution.disabled = !completeCheck.checked;
    });
  }

  if (revealSolution && solution && gate) {
    revealSolution.addEventListener('click', function () {
      gate.hidden = true;
      solution.hidden = false;
      solution.focus();
    });
  }

  if ('IntersectionObserver' in window) {
    const links = Array.from(document.querySelectorAll('.case-nav a[data-nav]'));
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          const active = link.dataset.nav === entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    document.querySelectorAll('[data-section]').forEach(function (section) { observer.observe(section); });
  }
})();
