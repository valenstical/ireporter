let incident;
const url = type === CONSTANTS.INCIDENT.RED_FLAG ? CONSTANTS.URL.RED_FLAGS
  : CONSTANTS.URL.INTERVENTIONS;

function update(form, suffix) {
  const data = new FormData(form);
  toggleLoader(form);
  queryAPI(`${url}/${reportID}/${suffix}`, 'PATCH', data, (json) => {
    if (json.status === CONSTANTS.STATUS.OK) {
      Dialog.showNotification(json.data[0].message);
    } else {
      const { error } = json;
      Dialog.showNotification(error.join('<br>'), false);
    }
  }, () => {
    Dialog.showNotification(CONSTANTS.MESSAGE.ERROR);
  }, () => {
    toggleLoader(form);
  });
  return false;
}

function updateLocation(form) {
  return false;
}


queryAPI(`${url}/${reportID}`, 'GET', null, (json) => {
  const data = json.data[0];
  incident = data;
  const location = incident.location.split(',');

  Select(`[value = "${incident.type}"]`).prop('checked', true);
  Select('[name = "title"]').val(incident.title);
  Select('[name = "comment"]').val(incident.comment);
  Select('[name = "latitude"]').val(location[0]);
  Select('[name = "longitude"]').val(location[1]);
  Select('body').removeClass('busy');
});


init();
