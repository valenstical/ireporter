let resolved = 0;
let rejected = 0;
let investigating = 0;
let draft = 0;
let total = 0;
let totalRedFlags = 0;
let totalInterventions = 0;
let incidents = [];

function getDate(incidentDate) {
  const date = new Date(incidentDate);
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
  const day = date.getDate();
  return `${month} ${day < 10 ? '0'.concat(day) : day}, ${date.getFullYear()}`;
}

function getStatus(status) {
  let text = status;
  let checkInvestigating = ''; let checkRejected = ''; let checkResolved = '';
  switch (status) {
    case CONSTANTS.INCIDENT.INVESTIGATING:
      investigating += 1;
      checkInvestigating = 'check-';
      text = 'investigating';
      break;
    case CONSTANTS.INCIDENT.REJECTED:
      rejected += 1;
      checkRejected = 'check-';
      break;
    case CONSTANTS.INCIDENT.RESOLVED:
      resolved += 1;
      checkResolved = 'check-';
      break;
    default:
      draft += 1;
      text = 'pending';
  }
  return `<div class="toggle">
  <span class="text-capitalize status status-badge-${text} transition" onclick="showDropdown(this, event)">${text} <img src="assets/images/resources/icon-select.svg" width="12px" /></span>
  <ul class="toggle-menu"> 
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

function populate() {
  Select('body').addClass('busy');
  queryAPI(`${CONSTANTS.URL.INCIDENTS}/admin`, 'GET', null, (json) => {
    Select('body').removeClass('busy');
    let index = -1; let rows = '';
    incidents = json.data;
    resolved = 0; rejected = 0; investigating = 0; draft = 0; total = incidents.length;

    json.data.forEach((incident) => {
      index += 1;
      if (incident.type === CONSTANTS.INCIDENT.RED_FLAG) {
        totalRedFlags += 1;
      } else {
        totalInterventions += 1;
      }
      rows = rows.concat(`<tr> 
      <td onclick="showReportDetails(this,${index})" class="td-small">${getDate(incident.createdOn)}<br><small>${ago(new Date(incident.createdOn).getTime(), json.timestamp)}</small></td>
      <td onclick="showReportDetails(this,${index})">${incident.title}</td>
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
    });

    Select('#total').html(total).parent().prop('title', `Red-Flags: ${totalRedFlags}\nInterventions: ${totalInterventions}`);
    Select('#pending').html(draft);
    Select('#investigating').html(investigating);
    Select('#resolved').html(resolved);
    Select('#rejected').html(rejected);
    Select('#reportsBody').html(rows);
  });
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
populate();
