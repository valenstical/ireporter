

function toggleLoader() {
  Wigi('.btn-submit img').toggleClass('hidden');
  Wigi('.btn-submit').toggleProp('disabled', 'true');
}

function alert(title, response) {
  let items = '';
  response.forEach((message) => {
    items = items.concat(`<li>${message}</li>`);
  });
  const result = `  
<div class="alert">
  <h4>${title}</h4>
  <ol class="unstyled-list">
    ${items}
  </ol>
</div>`;
  Wigi('#resultPane').html(result);
  return result;
}

function login(form) {
  const param = Wigi(form).serialize();

  toggleLoader();
  Wigi('#resultPane').empty();

  fetch(CONSTANTS.URL.LOGIN, {
    method: 'POST',
    body: param,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(response => response.json()).then((json) => {
    if (json.status === CONSTANTS.STATUS.OK) {
      User.login(json.data[0]);
      goto(CONSTANTS.PAGE.USER_DASHBOARD);
    } else {
      const { error } = json;
      alert('Sign in Failed!!', error);
    }
  })
    .catch(() => {
      alert('Sign in Failed!!', ['Please check your internet connection. If the problem continues, try again at a later time or contact us for further assistance.']);
    })
    .finally(() => {
      toggleLoader();
      Wigi('#resultPane').scroll();
    });
  return false;
}
