const POPULAR_REPORTS=["cases of corruption", "election rigging", "police extortion", "excessive power outage", "fire incident", "abandoned projects", "pipeline leakage"];

let menuHidable=true;

function iteratePopularReports(){
    const len=POPULAR_REPORTS.length;
    let index=1;
    setInterval(function(){
        $(".hero h1 span").fadeOut(function(){
            $(this).text(POPULAR_REPORTS[index]).fadeIn(300);
        });
        index=index===len-1?0:index+1;
    },3000);
}

function toggleMenu(){
    $("#nav-section").toggleClass("nav-hidden");
}

function hideMenu(){
    if (menuHidable) {
        $("#nav-section").addClass("nav-hidden");
    }
}

function setMenuHidable(hidable){
    menuHidable=hidable;
}

function recoverPassword(){
    
}

function login(){
    
}

function register(){
    
}

function init(){
    iteratePopularReports();
}


init();
