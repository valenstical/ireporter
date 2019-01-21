
function removeFile(id) {
  Select(`#${id}`).addClass('hide').removeClass('upload-column').empty();
}

class File {
  constructor(file) {
    this.file = file;
    this.size = file.size;
    this.type = file.type;
    this.name = file.name;
    this.id = `d${new Date().getTime()}`;
  }

  isImage() {
    const formats = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    return formats.indexOf(this.type.toLowerCase()) >= 0;
  }

  isVideo() {
    return this.type.toLowerCase() === 'video/mp4';
  }

  isWithinRange() {
    if (this.isImage(this.type)) {
      return this.size <= 2 * 1024 * 1024;
    }
    return this.size <= 50 * 1024 * 1024;
  }

  init() {
    const videoPanel = this.isVideo() ? '<video controls></video>' : '';
    Select('.upload-row').append(`
    <div class="column column-xs-3 upload-column" id="${this.id}">
      <div class="upload-item">
        ${videoPanel}
        <i class="fa fa-close hidden" onclick = 'removeFile("${this.id}")'></i>
        <img src="assets/images/resources/loader-light.gif" />
      </div>
    </div>`);
  }

  remove() {
    Select(`#${this.id}`).addClass('hide');
  }

  upload(url, success, failure) {
    const data = new FormData();
    data.append('file', this.file);
    queryAPI(url, 'PATCH', data, (json) => {
      if (json.status === CONSTANTS.STATUS.OK) {
        if (success) { success(json.data[0]); }
        Select(`#${this.id}`).child('img').addClass('hidden');
        Select(`#${this.id}`).child('.fa').removeClass('hidden');
        if (this.isVideo()) {
          Select(`#${this.id} .upload-item`).prop('rel', json.data[0].path).child('video').prop('src', `${ROOT}/${json.data[0].path}`);
        } else {
          Select(`#${this.id} .upload-item`).prop('style', `background-image:url(${ROOT}/${json.data[0].path})`).prop('rel', json.data[0].path);
        }
      } else {
        if (failure) { failure(); }
        const { error } = json;
        Dialog.showNotification(error[0]);
        Select(`#${this.id}`).addClass('hide');
      }
    }, () => {
      Dialog.showNotification('File upload failed. Can not connect to server.');
      Select(`#${this.id}`).addClass('hide');
    }, () => {});
  }
}
