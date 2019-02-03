const user = JSON.parse(localStorage.getItem('user'));

if (!(user && user.isAdmin)) {
  window.location.assign('admin-login.html');
}
