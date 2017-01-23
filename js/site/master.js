function Navigation_SetUp() {
    $('header nav span').click(function () { Navigation_Toggle(false); });
    $('header p.hamburger').click(function () { Navigation_Toggle(true); });
}
function Navigation_Toggle(view) {
    if (view) {
        $('header p.hamburger').addClass('expanded').unbind('click').click(function () { Navigation_Toggle(false); });
        $('header nav').show();
        $('header nav div').stop().animate({ 'margin-left': '0%' });
        $('header nav span').stop().css({opacity: 0}).show().animate({ 'opacity': '1' });
    } else {
        $('header p.hamburger').removeClass('expanded').unbind('click').click(function () { Navigation_Toggle(true); });
        $('header nav div').stop().animate({ 'margin-left': '-100%' });
        $('header nav span').stop().animate({ 'opacity': '0' }, function () { $('header nav').hide(); });
    }
}

function showContent() {
    $('body').animate({ opacity: 1 });
    loadYouTubes();
}
function loadYouTubes() {
    var $wrappers = $('div.youtube-wrapper');
    $wrappers.each(function () {
        $wrapper = $(this);
        $wrapper.append('<iframe src="' + $wrapper.attr('youtube-iframe') + '" frameborder="0" allowfullscreen="allowfullscreen"></iframe>');
    });    
}

$(document).ready(function () {
    Navigation_SetUp();
});

$(window).on('load', function() {
    showContent();
});