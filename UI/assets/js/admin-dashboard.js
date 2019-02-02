let resolved = 0;
let rejected = 0;
let investigating = 0;
let draft = 0;
let total = 0;
let totalRedFlags = 0;
let totalInterventions = 0;
let incidents = [];
let rows;
let flag;
let systemTime;

function getDate(incidentDate) {
  const date = new Date(incidentDate);
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
  const day = date.getDate();
  return `${month} ${day < 10 ? '0'.concat(day) : day}, ${date.getFullYear()}`;
}

function getStatus(status) {
  let text = status;
  let checkPending = ''; let checkInvestigating = '';
  let checkRejected = ''; let checkResolved = '';
  switch (status) {
    case CONSTANTS.INCIDENT.INVESTIGATING:
      checkInvestigating = 'check-';
      text = 'investigating';
      break;
    case CONSTANTS.INCIDENT.REJECTED:
      checkRejected = 'check-';
      break;
    case CONSTANTS.INCIDENT.RESOLVED:
      checkResolved = 'check-';
      break;
    default:
      text = 'pending';
      checkPending = 'check-';
  }
  return `<div class="toggle">
  <span class="text-capitalize status status-badge-${text} transition" onclick="showDropdown(this, event)">${text} <img src="assets/images/resources/icon-select.svg" width="12px" /></span>
  <ul class="toggle-menu">
    <li class="transition disabled"> 
      <i class="fa fa-${checkPending}square-o"></i>Pending  
    </li>
    <li class="toggle-line"></li>  
    <li onclick="changeStatus(this,'under investigation')" class="transition"> 
      <i class="fa fa-${checkInvestigating}square-o"></i>Investigating   
    </li>
    <li class="toggle-line"></li>
    <li onclick="changeStatus(this,'resolved')" class="transition"> 
      <i class="fa fa-${checkResolved}square-o"></i>Resolved                             
    </li>
    <li class="toggle-line"></li>
    <li onclick="changeStatus(this,'rejected')" class="transition"> 
      <i class="fa fa-${checkRejected}square-o"></i>Rejected                             
    </li>         
  </ul>
</div>`;
}

function calculateSummary(status) {
  switch (status) {
    case CONSTANTS.INCIDENT.INVESTIGATING:
      investigating += 1;
      break;
    case CONSTANTS.INCIDENT.REJECTED:
      rejected += 1;
      break;
    case CONSTANTS.INCIDENT.RESOLVED:
      resolved += 1;
      break;
    default:
      draft += 1;
  }
}

function prePopulate() {
  rows = '';
  resolved = 0; rejected = 0; investigating = 0; draft = 0;
}

function populate(incident, index) {
  if (incident.type === CONSTANTS.INCIDENT.RED_FLAG) {
    totalRedFlags += 1;
    flag = '<i class="fa flag fa-flag" title="Red-flag report"></i>';
  } else {
    totalInterventions += 1;
    flag = '<i class="fa flag fa-bullhorn flag-intervention" title="Intervention report"></i>';
  }
  rows = rows.concat(`<tr> 
  <td onclick="showReportDetails(this,${index})" class="td-small">${getDate(incident.createdOn)}<br><small>${ago(new Date(incident.createdOn).getTime(), systemTime)}</small></td>
  <td onclick="showReportDetails(this,${index})">${flag}${incident.title}</td>
  <td onclick="showReportDetails(this,${index})"> 
  <div class="relative"> 
    <div class="profile-img"> 
      <div class="profile-img-reports" style="background-image:url(${ROOT}/${incident.profile})"></div>
    </div>       
      <span class="profile-name text-capitalize">${incident.firstname}</span> 
    </div>     
  </td>   
  <td class="text-center">
    ${getStatus(incident.status)}  
  </td>   
</tr>`);
}

function postPopulate() {
  Select('#total').html(total).parent().prop('title', `Red-Flags: ${totalRedFlags}\nInterventions: ${totalInterventions}`);
  Select('#pending').html(draft);
  Select('#investigating').html(investigating);
  Select('#resolved').html(resolved);
  Select('#rejected').html(rejected);
  Select('#reportsBody').html(rows);
}

function fetchData() {
  Select('body').addClass('busy');
  queryAPI(`${CONSTANTS.URL.INCIDENTS}/admin`, 'GET', null, (json) => {
    Select('body').removeClass('busy');

    incidents = json.data; total = incidents.length;
    systemTime = json.timestamp;

    prePopulate();
    incidents.forEach((incident, index) => {
      calculateSummary(incident.status);
      populate(incident, index);
    });
    postPopulate();
  });
}

function filterReport(element, status) {
  if (!Select(element).hasClass('active')) {
    Select('.tab a.active').removeClass('active');
    Select(element).addClass('active');
    prePopulate();
    incidents.forEach((incident, index) => {
      calculateSummary(incident.status);
      if (incident.status === status) {
        populate(incident, index);
      }
    });
    postPopulate();
  }
}

function showDropdown(element, event) {
  const top1 = element.getBoundingClientRect().top;
  const left1 = element.getBoundingClientRect().left;

  const wrapper = document.querySelector('.table-overflow');
  const top2 = wrapper.getBoundingClientRect().top;
  const left2 = wrapper.getBoundingClientRect().left;

  const top = top1 - top2 + 20;
  const left = left1 - left2 - 40;

  Select(element).next().prop('style', `top:${top}px;left:${left}px`);
  showToggleMenu(event);
}

Select('.table-wrapper').on('scroll', () => {
  Select('.table .toggle.shown').removeClass('shown');
});

Select(window).on('resize', () => {
  Select('.table .toggle.shown').removeClass('shown');
});

appendOverlay();
fetchData();
