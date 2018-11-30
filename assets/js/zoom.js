function setSize() {
  const windowWidth = $(window).width();
  const windowHeight = $(window).height();

  const width = $('.zoom>div').outerWidth();

  const left = (windowWidth - width) / 2;

  let height = width / 1.57;
  let top = windowHeight - height;

  if (top < 0) {
    height = windowHeight - 50;
  }

  top = (windowHeight - height) / 2;
  $('.zoom>div').css({ left: `${left}px`, top: `${top}px`, height: `${height}px` });
}
let close = true;

$(window).resize(() => {
  setSize();
});

$(document).on('click', '[data-zoom]', (e) => {
  e.preventDefault();
  const media = $(e.currentTarget).prop('href');

  $('.zoom').fadeIn(0, () => {
    $('.zoom iframe').prop('src', media);
    $('.zoom>div').css({
      '-moz-transform': 'scale(1,1)', '-webkit-transform': 'scale(1,1)', '-o-transform': 'scale(1,1)', transform: 'scale(1,1)',
    });
    setSize();
  });
  $('.zoom aside').show();
});

function closeVideo() {
  $('.zoom>div').css({
    '-moz-transform': 'scale(0,0)', '-webkit-transform': 'scale(0,0)', '-o-transform': 'scale(0,0)', transform: 'scale(0,0)',
  });
  $('.zoom').fadeOut(400);
  $('.zoom iframe').prop('src', '');
}

function finishLoading() {
  $('.zoom aside').hide();
}

$('body').on('mouseenter', '.zoom>div', () => {
  close = false;
});

$('body').on('mouseleave', '.zoom>div', () => {
  close = true;
});

function hideVideo() {
  if (close) {
    closeVideo();
  }
}

$('body').append('<div class="zoom" onclick="hideVideo()"><div><aside><img src="assets/images/icons/loader.gif" /></aside><button type="button" class="transition" onclick="closeVideo()"><i class="fa fa-close"></i></button><div><iframe onload="finishLoading()" onerror="finishLoading()" allowfullscreen></iframe></div></div></div>');
