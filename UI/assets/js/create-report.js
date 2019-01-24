/* eslint-disable no-unused-vars, no-undef */
let reportID;
let url;
let uploaded;

function submitReport(form) {
  const param = new FormData(form);

  if (param.get('type')) {
    param.append('location', `${param.get('latitude')},${param.get('longitude')}`);

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

function uploadFile(element) {
  const file = new File(element.files[0]);
  file.process(url, reportID, () => {
    if (!uploaded) {
      Select('.btn-skip').removeClass('btn-secondary').html('Done <i class="fa fa-angle-double-right"></i>');
    }
    uploaded = true;
  });
}

init();
