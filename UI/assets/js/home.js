
const POPULAR_REPORTS = ['corruption', 'election rigging', 'police extortion', 'power outage', 'Flooding', 'abandoned projects', 'pipeline leakage', 'bad roads'];

function Dialog(id, zIndex) {
  this.id = id;
  this.zIndex = zIndex;

  $(this.id).css({ 'z-index': zIndex });

  this.showDialog = () => {
    window.location.hash = this.id;
    $(this.id).show(0, () => {
      $(this.id).addClass('shown').scrollTop(0);
      $('body').addClass('no-scroll');
    });
  };

  this.hideDialog = () => {
    $(this.id).removeClass('shown').find('.shown').removeClass('shown'); // Hide dropdown menu in Dialog if opened

    $(this.id).find('.dialog-content').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
      $(this.id).hide();
      $('body').removeClass('no-scroll');
      window.history.replaceState(null, null, ' ');
    });
  };

  $(window).bind('hashchange', () => {
    if (window.location.hash === '') {
      this.hideDialog();
    }
  });

  // Hide dialogs when click on overlay
  $(this.id).find('.dialog-overlay').click(() => {
    this.hideDialog();
  });

  $(this.id).find('.close').click(() => {
    this.hideDialog();
  });
}


let menuHidable = true;
const dialogDetails = new Dialog('#dialogDetails', 120);
const dialogStatus = new Dialog('#dialogStatus', 121);

function iteratePopularReports() {
  const len = POPULAR_REPORTS.length;
  let index = 1;
  setInterval(() => {
    $('.hero h1 span').fadeOut(function fade() {
      $(this).text(POPULAR_REPORTS[index]).fadeIn(300);
    });
    index = index === len - 1 ? 0 : index + 1;
  }, 3000);
}

/* exported show */
function toggleMenu() {
  $('#nav-section').toggleClass('nav-hidden');
}

/* exported */
function hideMenu() {
  if (menuHidable) {
    $('#nav-section').addClass('nav-hidden');
  }
}

/* exported */
function setMenuHidable(hidable) {
  menuHidable = hidable;
}

/* exported */
function recoverPassword() {

}

/* exported */
function login() {
  window.location.assign('reports.html');
  return false;
}

/* exported */
function register() {
  return login();
}

/* exported */
function adminLogin() {
  window.location.assign('admin-reports.html');
  return false;
}

/* exported */
function uploadProfile() {
  $('.delete-file-chooser').click();
}

/* exported */
function getReports(element, status) {
  $(element).siblings('.active').removeClass('active');
  $(element).addClass('active');
}

/* exported */
function showReportDetails(element, id) {
  // Fetch records and populate dialog
  dialogDetails.showDialog();
}

/* exported */
function chooseStatus() {
  dialogStatus.showDialog();
}

/* exported */
function changeStatus() {
  dialogStatus.hideDialog();
  return false;
}

/* exported */
function deleteReport() {}

/* exported */
function displayFileName(value) {
  $('.file-upload-text').text(value);
}


function init() {
  iteratePopularReports();
}

$('.dropdown>a').click(() => {
  $(this).next().slideToggle('fast').addClass('showing');
});


$(window).click(() => {
  $('.showing').slideUp(100).removeClass('showing');
  $('.toggle.shown').removeClass('shown');
});

$('[data-share-page]').each((index, element) => {
  const url = $(element).prop('href').replace('{url}', encodeURI(window.location.href));
  $(element).prop('href', url);
});


$(document).on('click', '[data-toggle]', (event) => {
  $(event.currentTarget).parent().toggleClass('shown');
  event.stopPropagation();
});


init();
