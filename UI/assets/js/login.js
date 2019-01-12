/* eslint-disable no-unused-vars, no-undef */
function login(form) {
  const param = Select(form).serialize();

  toggleLoader();
  Select('#resultPane').empty();


  queryAPI(CONSTANTS.URL.LOGIN, 'post', param, (json) => {
    if (json.status === CONSTANTS.STATUS.OK) {
      User.login(json.data[0]);
      goto(CONSTANTS.PAGE.USER_DASHBOARD);
    } else {
      const { error } = json;
      Dialog.showMessageDialog('Sign in Failed!', error, 'error');
      echo('', error);
    }
  }, () => {
    // echo('Sign in Failed!!', CONSTANTS.MESSAGE.ERROR);
    Dialog.showMessageDialog('Sign in Failed!', CONSTANTS.MESSAGE.ERROR, 'error');
  }, () => {
    toggleLoader();
    Select('#resultPane').scroll();
  });


  return false;
}
