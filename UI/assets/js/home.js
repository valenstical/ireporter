const POPULAR_REPORTS=['corruption', 'election rigging', 'police extortion', 'power outage', 'Flooding', 'abandoned projects', 'pipeline leakage', 'bad roads'];

let menuHidable=true; let hash='';

function iteratePopularReports(){
    const len=POPULAR_REPORTS.length;
    let index=1;
    setInterval(function(){
        $('.hero h1 span').fadeOut(function(){
            $(this).text(POPULAR_REPORTS[index]).fadeIn(300);
        });
        index=index===len-1?0:index+1;
    },3000);
}

function toggleMenu(){
    $('#nav-section').toggleClass('nav-hidden');
}

function hideMenu(){
    if (menuHidable) {
        $('#nav-section').addClass('nav-hidden');
    }
}

function setMenuHidable(hidable){
    menuHidable=hidable;
}

function recoverPassword(){
    
}

function login(){
   location.assign('reports.html');
   return false;   
}


function register(){
   return login();
}

function adminLogin(){
    location.assign('admin-reports.html');
    return false;
}

function uploadProfile(){
    $('.delete-file-chooser').click();
}

function getReports(element,status){
    $(element).siblings('.active').removeClass('active');
    $(element).addClass('active');
}

function showDialog(id){
    hash=id;
    location.hash=hash; 
    $(hash).show(0,function(){
        $(this).find('.dialog-content').addClass('dialog-shown');
    }).scrollTop(0);
    $('body').addClass('no-scroll');
}

function hideDialog(){    
    $(hash).find('.dialog-content').removeClass('dialog-shown').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function() {
    $(hash).hide();
    $('body').removeClass('no-scroll');
    hash='';
    history.replaceState(null, null, ' '); 
  });    
}

function showReportDetails(row){
    //Fetch records
    showDialog($(row).attr('data-target'));
}

function init(){
    iteratePopularReports();
}


$('.dropdown>a').click(function(event){
    $(this).next().slideToggle('fast').addClass('showing');
    event.stopPropagation();
});


$(document).click(function() {   
    $('.showing').slideUp(100).removeClass('showing');
});

$('[data-share-page]').each(function(){
    let url=$(this).prop('href').replace('{url}',encodeURI(location.href));
    $(this).prop('href',url);
});

$('.dialog').click(function(){
    hideDialog();
});

$('.dialog .dialog-content').click(function(event){
    event.stopPropagation();
});

$(window).bind('hashchange',function(){
    if (location.hash===''&&hash!=='') {
        hideDialog();
    }
});

init();
