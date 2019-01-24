let incident;

function updateComment(form) {
  return false;
}

function updateLocation(form) {
  return false;
}

const url = type === CONSTANTS.INCIDENT.RED_FLAG ? CONSTANTS.URL.RED_FLAGS
  : CONSTANTS.URL.INTERVENTIONS;

queryAPI(`${url}/${reportID}`, 'GET', null, (json) => {
  const data = json.data[0];
  incident = data;
  const location= incident.location.split(',');

  Select(`[value = "${incident.type}"]`).prop('checked', true);
  Select('[name = "title"]').val(incident.title);
  Select('[name = "comment"]').val(incident.comment);
  Select('[name = "latitude"]').val(location[0]);
  Select('[name = "longitude"]').val(location[1]);

  
  Select('body').removeClass('busy');
});


init();
