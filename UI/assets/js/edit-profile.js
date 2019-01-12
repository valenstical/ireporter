
const user = User.getUser();

function populateUser() {
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
  const url = `${CONSTANTS.URL.USERS}/${user.id}/profile`;
  toggleLoader();
  Select('#resultPane').empty();

  queryAPI(url, 'PATCH', param, (json) => {
    if (json.status === CONSTANTS.STATUS.OK) {
      User.login(json.data[0]);
      showIcon();
      Dialog.showMessageDialog('Profile updated!', 'Your profile has been updated successfully.', 'success');
    } else {
      const { error } = json;
      Dialog.showMessageDialog('Update Failed!', error, 'error');
      echo('', error);
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
