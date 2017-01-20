function SectionSelector_SetUp() {
    var $sectionSelectors = $('div.section-selector');
    $sectionSelectors.each(function (index) {
        var $sectionSelector = $(this);
        var $selectorListItems = $sectionSelector.find('> div.ss-nav li');
        $selectorListItems.each(function (index) {
            var $item = $(this);
            $item.attr('index', index);
            $item.click(function () {
                SectionSelector_StartSelection($(this));
            });
        });

        var $selectorSelect = $sectionSelector.find('> div.ss-select select');
        $selectorSelect.find('option').each(function (index) {
            $(this).attr('value', index);
        });
        $selectorSelect.change(function () { SectionSelector_UpdateSelection($(this)); });
        
    });
}
function SectionSelector_StartSelection($obj) {
    var selectedIndex = $obj.attr('index');
    var $sectionSelector = $obj.closest('div.section-selector');
    var $select = $sectionSelector.find('> div.ss-select select');
    $select.val(selectedIndex);
    SectionSelector_UpdateSelection($select);
    $sectionSelector.find('> div.ss-nav').stop().animate({ height: '0px', paddingBottom: '0px' }, function () { $(this).hide(); });
    $sectionSelector.find('> div.ss-select').stop().show().animate({ top: 50 });
    $sectionSelector.find('> div.ss-sections').stop().animate({ top: 90 });
    

}
function SectionSelector_UpdateSelection($obj) {
    var selectedIndex = $obj[0].selectedIndex;
    var $sections = $obj.closest('div.section-selector').find('> div.ss-sections > section');
    var $currentSection = $obj.closest('div.section-selector').find('> div.ss-sections > section.ss-active');
    var $nextSection = $sections.eq(selectedIndex);
    if ($currentSection.length == 0) {
        $nextSection.addClass('ss-active');
    } else {
        $currentSection.stop().addClass('ss-shift').animate({ 'left': '-100%' }, function () {
            $(this).removeClass('ss-shift').removeClass('ss-active');
        });
        $nextSection.stop().addClass('ss-active ss-upper ss-shift').css({ 'left': '100%' }).animate({ 'left': '0%' }, function () {
            $(this).removeClass('ss-shift').removeClass('ss-upper');
        });
    }
}
$(document).ready(function () {
    SectionSelector_SetUp();
});


function DetailView_SetUp() {
    var $viewers = $('div.detail-viewer');
    $viewers.each(function (index) {
        var $labels = $viewers.find('ul li span.detail-label');
        $labels.each(function () {
            $label = $(this);
            var $detail = $label.closest('li').find('div.detail-view');
            var $close = $('<p class="detail-close"><span class="top"></span><span class="bottom"></span></p>');
            $close.click(function () {
                DetailView_CloseView($(this));
            });
            $detail.append($close);
            $label.click(function () {
                DetailView_UpdateView($(this));
            });
        });
        
    });
}
function DetailView_UpdateView($obj) {
    var $detail = $obj.closest('li').find('div.detail-view');
    $('body').css({'overflow':'hidden'});
    $detail.fadeIn();
}
function DetailView_CloseView($obj) {
    var $detail = $obj.closest('div.detail-view');
    $('body').css({ 'overflow': 'auto' });
    $detail.css({ 'overflow': 'hidden' }).fadeOut();
}
$(document).ready(function () {
    DetailView_SetUp();
});