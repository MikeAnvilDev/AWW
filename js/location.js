var map = null;
var center = null;
var watchID = null;
var marker = null;

function setPositionWatch() {
    options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
    };
    watchID = navigator.geolocation.watchPosition(updateWatchedPosition, watchedPositionError, options);
}
function updateWatchedPosition(position) {
    center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    recenterMap();
}
function watchedPositionError(err) {
    console.log('Current location could not be determined.');
}

function recenterMap() {
    console.log('recenterMap');
    if (center != null) {
        map.setCenter(center);
        marker.setPosition(center);
    }
}
function sizeMap() {
    var availableHeight = $(window).height();
    var headerHeight = $('header').outerHeight();
    var crumbsHeight = $('main p.breadcrumbs').outerHeight();
    var height = availableHeight - headerHeight - crumbsHeight;
    $('#MapWrap').css({ height: height });

    recenterMap();
}

function setUpMap() {
    sizeMap();
    $(window).resize(sizeMap);
    initialize();
}
function initialize() {
    var mapDiv = document.getElementById('MapCanvas');
    center = new google.maps.LatLng(34.8, -86.85);
    map = new google.maps.Map(mapDiv, {
        center: center,
        zoom: 16,
        scaleControl: true,
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN]
        }
    });

    addMarker();

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        $('#MapWrap span.capture').show();
        $('#MapWrap span.capture').on('click', function () { captureLocation(); });
        setPositionWatch();
    });
}
function addMarker() {
    var icon = {
        url: '../../res/images/icons/activeMarker.png',
        scaledSize: new google.maps.Size(24, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 30)
    };

    marker = new google.maps.Marker({
        map: map,
        position: center,
        title: 'Current Location',
        icon: icon
    });
}

function captureLocation() {
    $('#Latitude').val(center.lat());
    $('#Longitude').val(center.lng());
    $('#SiteInformationForm').show();
    $('#SubmitButton').on('click', function () { createEmail(); return false; });
    $('#SiteInformationMap').fadeOut();
}

function createEmail() {
    window.location.href = 'mailto:wwprog@auburn.edu?' +
    'subject=Alabama%20Water%20Watch%20Sampling%20Site%20Data&body=' + encodeURIComponent(getEmailBody());
}
function getEmailBody(){
    return getMonitors() + 
        'Phone: ' + $('#Phone').val() + '\n' +
        'AWW Group Affiliation: ' + $('#GroupName').val() + '\n' +
        'Waterbody: ' + $('#Waterbody').val() + '\n' +
        'Watershed: ' + $('#Watershed').val() + '\n' +
        'State where Site is Located: ' + $('#State').val() + '\n' +
        'County where Site is Located: ' + $('#County').val() + '\n' +
        'Latitude: ' + $('#Latitude').val() + '\n' +
        'Longitude: ' + $('#Longitude').val() + '\n' +
        'Site Location Description: ' + $('#Description').val() + '\n';
}
function getMonitors(){
    var monitors = '';
    if ($('#Monitors').val().length > 0) {
        $('#Monitors').val($('#Monitors').val().trim());
        var monitorArray = $('#Monitors').val().split("\n");
        for (var monitor = 0; monitor < monitorArray.length; monitor++) {
            var name = monitorArray[monitor].trim();
            if(name.length > 0)
                monitors += 'Monitor ' + (monitor + 1) + ': ' + name + '\n';
        }
    }
    return monitors;
}

document.addEventListener("deviceready", function () { alert('actually freaking loaded'); }, false);

$(window).on('load', function () {
    validateToken(setUpMap);
});