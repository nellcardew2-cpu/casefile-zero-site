(function () {
  const form = document.querySelector('#access-form');
  const success = document.querySelector('#form-success');
  const email = document.querySelector('#reader-email');
  const error = document.querySelector('#email-error');
  const consent = document.querySelector('#news-consent');
  const consentError = document.querySelector('#consent-error');

  if (!form || !success || !email || !error || !consent || !consentError) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    error.textContent = '';
    consentError.textContent = '';

    if (!email.validity.valid) {
      error.textContent = 'Enter a valid email address to test the delivery step.';
      email.focus();
      return;
    }

    if (!consent.checked) {
      consentError.textContent = 'Please confirm that you want to join the Nell Cardew email list.';
      consent.focus();
      return;
    }

    email.value = '';
    consent.checked = false;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
})();
