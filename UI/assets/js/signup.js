/* eslint-disable no-unused-vars, no-undef */
function register(form) {
  if (Select('#termsCheckedBox:checked').count() > 0) {
    const param = new FormData(form);

    toggleLoader(form);
    Select('#resultPane').empty();


    queryAPI(CONSTANTS.URL.SIGNUP, 'POST', param, (json) => {
      if (json.status === CONSTANTS.STATUS.CREATED) {
        User.login(json.data[0]);
        goto(CONSTANTS.PAGE.USER_DASHBOARD);
      } else {
        const { error } = json;
        Dialog.showMessageDialog('Sign up Failed!', error, 'error');
        echo('', error);
      }
    }, () => {
      Dialog.showMessageDialog('Sign up Failed!', CONSTANTS.MESSAGE.ERROR, 'error');
    }, () => {
      toggleLoader(form);
    });
  } else {
    Dialog.showMessageDialog('', 'Please agree to our terms and conditions', 'error');
  }
  return false;
}
