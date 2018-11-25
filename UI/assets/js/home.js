const POPULAR_REPORTS=['corruption', 'election rigging', 'police extortion', 'power outage', 'Flooding', 'abandoned projects', 'pipeline leakage', 'bad roads'];

let menuHidable=true; 
const dialogDetails=new Dialog("#dialogDetails",120); 
const dialogStatus=new Dialog("#dialogStatus",121);

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

function showReportDetails(element,id){
    //Fetch records and populate dialog 
    dialogDetails.showDialog();
}

function chooseStatus(){
    dialogStatus.showDialog();
}

function changeStatus(){
    dialogStatus.hideDialog();
    return false;
}

function deleteReport(){}

function displayFileName(value){
    $(".file-upload-text").text(value);
}


function init(){
    iteratePopularReports();
}

$('.dropdown>a').click(()=>{
    $(this).next().slideToggle('fast').addClass('showing');
});


$(window).click(()=> { 
    $('.showing').slideUp(100).removeClass('showing');
    $('.toggle.shown').removeClass('shown');
    
});

$('[data-share-page]').each(function(){
    let url=$(this).prop('href').replace('{url}',encodeURI(location.href));
    $(this).prop('href',url);
});




$('[data-toggle]').click(function(event){
    $(this).parent().toggleClass('shown');
    event.stopPropagation();
});



function Dialog(id,zIndex){
    this.id=id;
    this.zIndex=zIndex;
    
    $(this.id).css({"z-index":zIndex});
    
    this.showDialog= ()=>{
    location.hash=this.id; 
    $(this.id).show(0,()=>{
        $(this.id).addClass('shown').scrollTop(0);
        $(window).addClass('no-scroll');
    });
    };

    this.hideDialog=()=>{ 
    $(this.id).removeClass('shown').find('.shown').removeClass('shown'); // Hide dropdown menu in Dialog if opened
   
    $(this.id).find('.dialog-content').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',()=> {
        $(this.id).hide();    
        $(window).removeClass('no-scroll');
         history.replaceState(null, null, ' ');
    });
     };
     
    $(window).bind('hashchange',()=>{
        if (location.hash==='') {
             this.hideDialog();   
        }
    });
    
        //Hide dialogs when click on overlay
    $(this.id).find('.dialog-overlay').click(()=>{
         this.hideDialog();
    });
    
    $(this.id).find('.close').click(()=>{
         this.hideDialog();
    });    
}


init();
