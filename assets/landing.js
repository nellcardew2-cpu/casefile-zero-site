(function () {
  const form = document.querySelector('#access-form');
  const success = document.querySelector('#form-success');
  const email = document.querySelector('#reader-email');
  const error = document.querySelector('#email-error');

  if (!form || !success || !email || !error) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    error.textContent = '';

    if (!email.validity.valid) {
      error.textContent = 'Enter a valid email address to test the delivery step.';
      email.focus();
      return;
    }

    email.value = '';
    document.querySelector('#news-consent').checked = false;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
})();
