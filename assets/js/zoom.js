
let close=true;     

$(window).resize(function(){
    setSize();  
});    

$("a[rel='zoom']").click(function(e){
    e.preventDefault();
    let media=$(this).prop("href");
    
    $(".zoom").fadeIn(0,function(){
    $(".zoom iframe").prop("src",media);
       $('.zoom>div').css({"-moz-transform":"scale(1,1)","-webkit-transform":"scale(1,1)","-o-transform":"scale(1,1)","transform":"scale(1,1)"});
        setSize(); 
    });
    $(".zoom aside").show();
});

function setSize(){
    let windowWidth=$(window).width();
    let windowHeight=$(window).height();
    
    let width=$('.zoom>div').outerWidth();
    
    let left=(windowWidth-width)/2;        
    
    let height=width/1.57;
    let top=windowHeight-height;
    
    if (top<0) {
     height=windowHeight-50;
    }
    
     top=(windowHeight-height)/2; 
     $('.zoom>div').css({"left":left+"px","top":top+"px","height":height+"px"});   
}

function closeVideo(){
   
    $('.zoom>div').css({"-moz-transform":"scale(0,0)","-webkit-transform":"scale(0,0)","-o-transform":"scale(0,0)","transform":"scale(0,0)"});       
     $(".zoom").fadeOut(400);
    $(".zoom iframe").prop("src","");
    
}

function finishLoading(){
   $(".zoom aside").hide();
}

$("body").on("mouseenter",".zoom>div",function(){
       close=false; 
});

$("body").on("mouseleave",".zoom>div",function(){
   close=true; 
});

function hideVideo(){
    if (close) {
        closeVideo();
    }
}

$("body").append('<div class="zoom" onclick="hideVideo()"><div><aside><img src="assets/images/icons/loader.gif" /></aside><button type="button" class="transition" onclick="closeVideo()"><i class="fa fa-close"></i></button><div><iframe onload="finishLoading()" onerror="finishLoading()" allowfullscreen></iframe></div></div></div>');
