/* eslint-disable no-unused-vars, no-undef */
function login(form, asAdmin) {
  const param = new FormData(form);

  toggleLoader(form);
  Select('#resultPane').empty();

  queryAPI(CONSTANTS.URL.LOGIN, 'POST', param, (json) => {
    if (json.status === CONSTANTS.STATUS.OK) {
      User.login(json.data[0]);
      if (asAdmin && User.isAdmin()) {
        goto(CONSTANTS.PAGE.ADMIN_DASHBOARD);
      } else if (asAdmin && !User.isAdmin()) {
        Dialog.showMessageDialog('Access Denied!', 'You do not have permission to access the admin section.', 'info');
      }else {
        goto(CONSTANTS.PAGE.USER_DASHBOARD);
      }
    } else {
      const { error } = json;
      Dialog.showMessageDialog('Sign in Failed!', error, 'error');
      echo('', error);
    }
  }, () => {
    Dialog.showMessageDialog('Sign in Failed!', CONSTANTS.MESSAGE.ERROR, 'error');
  }, () => {
    toggleLoader(form);
    Select('#resultPane').scroll();
  });


  return false;
}
