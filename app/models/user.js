class User {
  constructor(isAdmin = false) {
    this.id = -1;
    this.firstname = '';
    this.lastname = '';
    this.othernames = '';
    this.email = '';
    this.phoneNumber = '';
    this.username = '';
    this.registered = new Date();
    this.isAdmin = isAdmin;
  }
}

export default User;
