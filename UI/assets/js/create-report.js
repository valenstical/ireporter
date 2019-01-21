/* eslint-disable no-unused-vars, no-undef */
let images = [];
let videos = [];
let reportID = null;
let panelID;
let url;
let uploaded;

function submitReport(form) {
  const param = new FormData(form);

  if (param.get('type')) {
    param.append('location', `${param.get('latitude')},${param.get('longitude')}`);

    param.append('Images', images.join(','));
    param.append('Videos', videos.join(','));

    toggleLoader(form);
    Select('#resultPane').empty();

    url = param.get('type') === CONSTANTS.INCIDENT.RED_FLAG ? CONSTANTS.URL.RED_FLAGS : CONSTANTS.URL.INTERVENTIONS;

    queryAPI(url, 'POST', param, (json) => {
      if (json.status === CONSTANTS.STATUS.CREATED) {
        Select('form').addClass('hidden');
        Select('.upload-wrapper').removeClass('hidden');
        Select('.indicator span:first-child').html('<i class="fa fa-check"></i>').next().addClass('active');
        Select('.heading').scroll();
        const { id, message } = json.data[0];
        Dialog.showNotification(message);
        reportID = id;
      } else {
        const { error } = json;
        Dialog.showMessageDialog('', error, 'error');
        echo('', error);
      }
    }, () => {
      Dialog.showMessageDialog('Server Error!', CONSTANTS.MESSAGE.ERROR, 'error');
    }, () => {
      toggleLoader(form);
    });
  } else {
    Dialog.showMessageDialog('', ['Please choose the type of report you are trying to make.'], 'error');
    Select('#resultPane').scroll();
  }

  return false;
}

function updateReport() {
  images = []; videos = [];
  Select('.upload-column .upload-item').forEach((element) => {
    const path = element.prop('rel');
    if (path.indexOf('images') === 0) {
      images.push(path);
    } else {
      videos.push(path);
    }
  });
 // TODO
}

function uploadFile(element) {
  const file = new File(element.files[0]);

  if (!(file.isImage() || file.isVideo())) {
    Dialog.showMessageDialog('Invalid File!', 'Please choose a valid image or video.', 'error');
  } else if (!file.isWithinRange()) {
    Dialog.showMessageDialog('File is too large!', 'File size must not exceed 2MB for images and 50MB for videos.', 'error');
  } else {
    file.init();
    reportID = 998281344;
    url = CONSTANTS.URL.RED_FLAGS;
    const type = file.isVideo() ? 'addVideo' : 'addImage';
    file.upload(`${url}/${reportID}/${type}`, (result) => {
      Dialog.showNotification(result.message);
      if (!uploaded) {
        Select('.btn-skip').removeClass('btn-secondary').html('Done <i class="fa fa-angle-double-right"></i>').click((e) => {
          e.preventDefault();
          updateReport();
        });
      }
      uploaded = true;
    });
  }
}

init();
