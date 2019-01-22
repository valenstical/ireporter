let closeButton;

function removeFile(element) {
  closeButton = element;
  Dialog.showConfirmDialog('Confirmation Required', 'Are you sure you want to remove this media file from your report?', () => {
    const btn = Select(closeButton);
    let rel = btn.prop('rel');
    rel = rel.split('*');
    const path = rel[0];
    const url = rel[1];
    const data = new FormData();
    data.append('path', path);

    Select(closeButton).parent().parent().addClass('hide')
      .removeClass('upload-column')
      .empty();
    queryAPI(`${url}/media`, 'DELETE', data, (json) => {
      if (json.status === CONSTANTS.STATUS.OK) {
        Dialog.showNotification(json.data[0].message);
      } else {
        const { error } = json;
        Dialog.showNotification(error[0]);
      }
    });
  });
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
        <i class="fa fa-close hidden" onclick = removeFile(this)></i>
        <img src="assets/images/resources/loader-light.gif" />
      </div>
    </div>`);
  }

  upload(url, success, failure) {
    const data = new FormData();
    const type = this.isVideo() ? 'addVideo' : 'addImage';
    data.append('file', this.file);
    queryAPI(`${url}/${type}`, 'PATCH', data, (json) => {
      if (json.status === CONSTANTS.STATUS.OK) {
        if (success) { success(json.data[0]); }
        const { path } = json.data[0];
        Select(`#${this.id}`).child('img').addClass('hidden');
        Select(`#${this.id}`).child('.fa').removeClass('hidden')
          .prop('rel', `${path}*${url}`);
        if (this.isVideo()) {
          Select(`#${this.id} .upload-item`).prop('rel', path).child('video').prop('src', `${ROOT}/${path}`);
        } else {
          Select(`#${this.id} .upload-item`).prop('style', `background-image:url(${ROOT}/${path})`).prop('rel', path);
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
