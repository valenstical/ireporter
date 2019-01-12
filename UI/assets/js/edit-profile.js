

function populateUser() {
  const user = User.getUser();
  Select('[name = "firstname"]').val(user.firstname);
  Select('[name = "lastname"]').val(user.lastname);
  Select('[name = "email"]').val(user.email);
  Select('[name = "username"]').val(user.username);
  Select('[name = "phoneNumber"]').val(user.phoneNumber);
  Select('[name = "othernames"]').val(user.othernames);
  Select('.profile-img img').prop('src', `assets/images/profiles/${user.profile}`);
}

function editProfile(form) {
  const param = Select(form).serialize();
  toggleLoader();
  Select('#resultPane').empty();

  queryAPI(CONSTANTS.URL.SIGNUP, 'patch', param, (json) => {
    if (json.status === CONSTANTS.STATUS.OK) {
      // TODO SUCCESS
    } else {
      const { error } = json;
      Dialog.showMessageDialog('Sign in Failed!', error, 'error');
      echo('', error);
      Select('#resultPane').scroll();
    }
  }, () => {
    Dialog.showMessageDialog('Oops!!', CONSTANTS.MESSAGE.ERROR, 'error');
  }, () => {
    toggleLoader();
  });

  return false;
}

init();
populateUser();
