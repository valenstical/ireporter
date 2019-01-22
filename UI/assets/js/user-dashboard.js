let resolved = 0;
let rejected = 0;
let investigating = 0;
let draft = 0;
let total = 0;
let incidents = [];

function getStatus(status) {
  total += 1;
  let statusIndicator = '';
  switch (status) {
    case CONSTANTS.INCIDENT.DRAFT:
      draft += 1;
      statusIndicator = '<span class="badge-citizen badge-status status-badge-draft"><i class="fa fa-file-text-o"></i>Pending</span>';
      break;
    case CONSTANTS.INCIDENT.INVESTIGATING:
      investigating += 1;
      statusIndicator = '<span class="badge-citizen badge-status status-badge-investigating"><i class="fa fa-info-circle"></i>Investigating</span>';
      break;
    case CONSTANTS.INCIDENT.REJECTED:
      rejected += 1;
      statusIndicator = '<span class="badge-citizen badge-status status-badge-rejected"><i class="fa fa-remove"></i>False Report</span>';
      break;
    case CONSTANTS.INCIDENT.RESOLVED:
      resolved += 1;
      statusIndicator = '<span class="badge-citizen badge-status"><i class="fa fa-check"></i>Resolved</span>';
      break;
    default:
      // TODO
  }
  return statusIndicator;
}

function getFlag(type) {
  const redFlag = '<i class="fa fa-flag flag" title="Red flag report involving corruption"></i>';
  const intervention = '<i class="fa flag fa-bullhorn flag-intervention" title="Intervention report requiring government attention"></i>';
  return type === CONSTANTS.INCIDENT.RED_FLAG ? redFlag : intervention;
}
function getState(state) {
  return state && state.toString().trim() !== '' ? `<span class="report-item-date report-item-location"><i class="fa fa-map-marker"></i> ${state}</span>` : '';
}

function getUpdate(incident) {
  return incident.status === CONSTANTS.INCIDENT.DRAFT ? `<div class="dispose toggle toggle-pointer"> 
  <a data-toggle onclick="showToggleMenu(event)"><i class="fa fa-ellipsis-h"></i></a> 
  <ul class="toggle-menu"> 
    <li data-pg-name="Menu Item"> 
      <a onclick="editIncident(this, ${incident.id}, '${incident.type}')"><i class="fa fa-edit"></i>Edit</a> 
    </li>
    <li data-pg-name="Menu Item" class="toggle-line">        
</li>
    <li data-pg-name="Menu Item"> 
      <a onclick="deleteIncident(this, ${incident.id}, '${incident.type}')"><i class="fa fa-trash-o"></i>Delete</a> 
    </li>     
  </ul>   
</div>` : '';
}

function getDetails(event, index) {
  const {
    Images, Videos, location, title,
  } = incidents[index];
  const detailsPanel = Select(event.currentTarget).prev();

  if (detailsPanel.hasClass('in')) {
    // TODO
  } else if (!detailsPanel.hasClass('opened')) {
    let mediaImages = ''; let mediaVideos = ''; let x = 0;
    const iframe = `<iframe class="map" allowfullscreen src="https://maps.google.com/maps?q=${location}&output=embed&hl=en;z=20"></iframe>`;

    Images.forEach((image) => {
      const src = `${ROOT}/${image}`;
      x += 1;
      mediaImages += `
      <div class="column column-md-4"> 
      <a href="${src}" class="media-item" target="_blank"> 
      <img src="${src}" alt ="${title}"/>
        <i class="fa fa-search-plus"></i> 
      </a>   
     </div>`;
      if (x % 3 === 0) {
        mediaImages += '<div class ="clear-float"></div>';
      }
    });

    Videos.forEach((video) => {
      // const src = `${ROOT}/videos/${video}`;
      mediaVideos += `
      <video src = "${ROOT}/${video}" controls preload="metadata"></video>
       `;
    });

    detailsPanel.html(`${iframe}${mediaVideos}<div class="row text-center">${mediaImages}</div>`).addClass('opened');
    scaleHeight('video');
  }
  toggleCollapse(event);
}

function getIncident(element, type) {
  Select('.tab a').removeClass('active');
  Select(element).addClass('active');

  Select('body').addClass('busy');
  let url = CONSTANTS.URL.INCIDENTS;
  let report = '';
  if (type === 1) {
    url = CONSTANTS.URL.RED_FLAGS;
    report = 'red flag';
  } else if (type === 2) {
    url = CONSTANTS.URL.INTERVENTIONS;
    report = 'intervention';
  }
  queryAPI(url, 'GET', null, (json) => {
    Select('body').removeClass('busy');
    let results = ''; let index = -1;
    resolved = 0; rejected = 0; investigating = 0; draft = 0; total = 0;
    incidents = json.data;

    json.data.forEach((incident) => {
      index += 1;
      results += `
     <div class = "reports-column">  
      <div class="report-item card card-sm"> 
      ${getUpdate(incident)}
      <div class="profile-img"> 
        <div class="profile-img-reports" style="background-image:url(${ROOT}/${incident.profile})"></div>
      </div>   
      <div class="report-item-content"> 
        <h5>${incident.firstname}</h5> 
        <span class="report-item-date"><i class="fa fa-calendar"></i> ${ago(new Date(incident.createdOn).getTime(), json.timestamp)} ago</span> 
        ${getState(incident.state)}        
        ${getStatus(incident.status)} 
        <h6>${incident.title}${getFlag(incident.type)}</h6> 
        <p>${incident.comment.replace(/\n/gi, '<br>')}</p> 
        <div id="v${incident.id}" class="collapse"></div>
        <a onclick ="getDetails(event,${index})" class="report-item-link" href="#v${incident.id}" data-text-less='Hide details' data-text-more="Show details">Show details <i class="fa fa-angle-double-right"></i></a>
      </div>   
    </div>
    </div>
    `;
    });

    if (json.data.length === 0) {
      Select('.empty-result').prop('style', 'display:block');
      Select('.full-result').prop('style', 'display:none');
      Select('.empty-result h4 strong').html(report);
    } else {
      Select('#results').html(results);
      Select('#pending').html(draft);
      Select('#investigating').html(investigating);
      Select('#resolved').html(resolved);
      Select('#rejected').html(rejected);
      Select('.round-info').html(`Showing all ${total} ${report} reports.`);

      Select('.empty-result').prop('style', 'display:none');
      Select('.full-result').prop('style', 'display:block');
    }
  });
}

let deleteID; let deleteType;
function deleteIncident(element, id, type) {
  deleteID = id; deleteType = type;
  Dialog.showConfirmDialog('Confirmation Required!', 'Are you sure you want to permanently delete this report?', () => {
    Select('body').addClass('busy');
    let url = deleteType === CONSTANTS.INCIDENT.RED_FLAG ? CONSTANTS.URL.RED_FLAGS
      : CONSTANTS.URL.INTERVENTIONS;
    url += `/${deleteID}`;
    queryAPI(url, 'DELETE', null, (json) => {
      if (json.status === CONSTANTS.STATUS.OK) {
        Select('.tab a.active').click();
        Dialog.showNotification(json.data[0].message);
      } else {
        Select('body').removeClass('busy');
        Dialog.showNotification(json.error);
      }
    });
  });
}

Select(window).on('resize', () => {
  scaleHeight('video');
});

init();
Select('.tab a:first-child').click();
