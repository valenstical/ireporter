
const user = User.getUser();

function populateUser() {
  Select('[name = "firstname"]').val(user.firstname);
  Select('[name = "lastname"]').val(user.lastname);
  Select('[name = "email"]').val(user.email);
  Select('[name = "username"]').val(user.username);
  Select('[name = "phoneNumber"]').val(user.phoneNumber);
  Select('[name = "othernames"]').val(user.othernames);
}

function editProfile(form) {
  const param = new FormData(form);
  const url = `${CONSTANTS.URL.USERS}/${user.id}/profile`;
  toggleLoader(form);
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
    toggleLoader(form);
  });

  return false;
}

function changePassword(form) {
  const param = new FormData(form);
  const url = `${CONSTANTS.URL.USERS}/${user.id}/password`;
  toggleLoader(form);

  queryAPI(url, 'PATCH', param, (json) => {
    if (json.status === CONSTANTS.STATUS.OK) {
      Dialog.showMessageDialog('Password updated!', json.data[0].message, 'success');
      Select('[name = "password"]').clear().prop('placeholder', '********');
    } else {
      const { error } = json;
      Dialog.showMessageDialog('', error[0], 'error');
    }
  }, () => {
    Dialog.showMessageDialog('Oops!!', CONSTANTS.MESSAGE.ERROR, 'error');
  }, () => {
    toggleLoader(form);
  });

  return false;
}

function uploadProfile() {
  const element = document.querySelector('[name = "file"]');
  const file = element.files[0];
  const { size, type } = file;

  if (!isImage(type)) {
    Dialog.showMessageDialog('Invalid Image!', 'Please choose a valid image.', 'error');
  } else if (!isWithinRange(type, size)) {
    Dialog.showMessageDialog('Image is too large!', 'Image size must not exceed 2MB', 'error');
  } else {
    toggleLoader('.profile-wrapper');
    const data = new FormData();
    data.append('file', file);
    const { id } = User.getUser();
    queryAPI(`${CONSTANTS.URL.USERS}/${id}/image`, 'PATCH', data, (json) => {
      if (json.status === CONSTANTS.STATUS.OK) {
        Dialog.showNotification('Profile image has been updated.');
        User.setUser(JSON.stringify(json.data[0]));
        showIcon();
      } else {
        const { error } = json;
        Dialog.showNotification(error[0], 'error');
      }
    }, () => {
      Dialog.showMessageDialog('Oops!!', CONSTANTS.MESSAGE.ERROR, 'error');
    }, () => {
      toggleLoader('.profile-wrapper');
    });
  }
}
init();
populateUser();
