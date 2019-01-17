
/* eslint-disable no-unused-vars, no-undef */
const images = [];
const videos = [];
let reportID = null;

function submitReport(form) {
  const param = new FormData(form);

  if (param.get('type')) {
    param.append('location', `${param.get('latitude')},${param.get('longitude')}`);

    param.append('Images', images.join(','));
    param.append('Videos', videos.join(','));

    toggleLoader(form);
    Select('#resultPane').empty();

    const url = param.get('type') === CONSTANTS.INCIDENT.RED_FLAG ? CONSTANTS.URL.RED_FLAGS : CONSTANTS.URL.INTERVENTIONS;

    queryAPI(url, 'POST', param, (json) => {
      if (json.status === CONSTANTS.STATUS.CREATED) {
        Select('form').addClass('hidden');
        Select('.upload-wrapper').removeClass('hidden');
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


init();
