function NavigationSetUp() {
    $('header nav span').click(function () { NavigationToggle(false); });
    $('header p.hamburger').click(function () { NavigationToggle(true); });
}
function NavigationToggle(view) {
    if (view) {
        $('header p.hamburger').addClass('expanded').unbind('click').click(function () { Navigation_Toggle(false); });
        $('header nav').show();
        $('header nav div').stop().animate({ 'margin-left': '0%' });
        $('header nav span').stop().css({ opacity: 0 }).show().animate({ 'opacity': '1' });
    } else {
        $('header p.hamburger').removeClass('expanded').unbind('click').click(function () { Navigation_Toggle(true); });
        $('header nav div').stop().animate({ 'margin-left': '-100%' });
        $('header nav span').stop().animate({ 'opacity': '0' }, function () { $('header nav').hide(); });
    }
}

function showContent() {
    displayContentOverlay(false);
    loadYouTubes();
}
function loadYouTubes() {
    var $wrappers = $('div.youtube-wrapper');
    $wrappers.each(function () {
        $wrapper = $(this);
        $wrapper.append('<iframe src="' + $wrapper.attr('youtube-iframe') + '" frameborder="0" allowfullscreen="allowfullscreen"></iframe>');
    });
}

function displayContentOverlay(display) {
    var $loader = $('#Loading');
    $loader.stop();
    if (display)
        $loader.css({ display: 'block', opacity: 1 });
    else
        $loader.fadeOut();

}
function displayErrorMessage(display, message) {
    var $error = $('#ErrorOverlay');
    if (display) {
        if ($error.length > 0) {
            $error.remove();
        }
        $error = $('<div id="ErrorOverlay"><div><p class="message">' + message + '</p><p class="close">close</p></div></div>');
        $('body').append($error);
        $error.find('p.close').click(function () { displayErrorMessage(false) });
        var $message = $error.find('div');
        $message.css({ marginLeft: (-1 * $message.outerWidth() / 2) + 'px', marginTop: (-1 * $message.outerHeight() / 2) + 'px' });
    } else {
        if ($error.length > 0) {
            $error.fadeOut(function () {
                $(this).remove();
            });
        }
    }
}

$(document).ready(function () {
    NavigationSetUp();
});
$(window).on('load', function () {
    showContent();
});