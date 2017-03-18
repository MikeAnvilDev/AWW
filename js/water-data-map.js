var apiKey = 'AIzaSyDcTMT0DVoMWt9IURdklqtRJMawlSoeoLw';
var map = null;
var center = null;
var bounds = null;
var mapInfobox = null;

var currentMarker = null;
var watchID = null;

var basinBounds = new Array();
var basinPolyArray = new Array();
var watershedPolyArrays = new Array();
var awwSiteMarkerArray = new Array();
var $basins = null;

var controlsTimer = null;

function setPositionWatch() {
    options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
    };
    watchID = navigator.geolocation.watchPosition(updateWatchedPosition, watchedPositionError, options);
}
function updateWatchedPosition(position) {
    current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    if (currentMarker != null)
        currentMarker.setPosition(current);
    else {
        var icon = {
            url: '../../res/images/icons/currentLocationMarker.png',
            scaledSize: new google.maps.Size(30, 33),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 33)
        };

        currentMarker = new google.maps.Marker({
            map: map,
            position: current,
            title: 'Current Location',
            icon: icon
        });
    }
}
function watchedPositionError(err) {
    console.log('Current location could not be determined.');
}


function initialize() {
    var $overlay = addMapOverlay();
    $overlay.find('p').text('initializing map...');

    google.maps.visualRefresh = true;
    var mapDiv = document.getElementById('MapCanvas');
    center = new google.maps.LatLng(34.8, -86.85);
    //center = new google.maps.LatLng(24.886, -70.268);
    map = new google.maps.Map(mapDiv, {
        center: center,
        zoom: 7,
        scaleControl: true,
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN]
        }
    });

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        setPositionWatch();
    });

    google.maps.event.addListener(map, 'tilesloaded', function () {
        $('div.gmnoprint.gm-style-mtc').css({ display: 'none' });
        clearTimeout(controlsTimer);
        controlsTimer = setTimeout(
            function () {
                $('div.gmnoprint.gm-style-mtc').css({ top: 40, left: 'auto', right: 0, zIndex: 2, display: 'block' });
            }, 1000);
    });
    google.maps.event.addListener(map, 'idle', function () {
        $('div.gmnoprint.gm-style-mtc').css({ display: 'none' });
        clearTimeout(controlsTimer);
        controlsTimer = setTimeout(
            function () {
                $('div.gmnoprint.gm-style-mtc').css({ top: 40, left: 'auto', right: 0, zIndex: 2, display: 'block' });
            }, 1000);
    });
    google.maps.event.addListener(map, 'maptypeid_changed', function () {
        $('div.gmnoprint.gm-style-mtc').css({ display: 'none' });
        clearTimeout(controlsTimer);
        controlsTimer = setTimeout(
             function () {
                 $('div.gmnoprint.gm-style-mtc').css({ top: 40, left: 'auto', right: 0, zIndex: 2, display: 'block' });
             }, 1000);
    });

    $('#Sites-Button').click(updateSites);
    $('#HUC-Button').click(updateWatersheds);
    $('#Basin-Select').change(updateBasin);

    fetchData();
}
function fetchData() {
    $basins = $('ul.basins li');
    fetchBasin(0);
}
function fetchBasin(index) {
    var $basin = $basins.eq(index);
    if ($basin.length > 0) {
        var $inputs = $basin.find('input');
        var basinName = $inputs.eq(0).val();

        var $overlay = addMapOverlay();
        $overlay.find('p').text('loading ' + basinName + '...');
        console.log('water-data-all.js: fetchBasin: fetching Basin ' + basinName);

        var query = $inputs.eq(1).val();
        var encodedQuery = encodeURIComponent(query);
        var url = ['https://www.googleapis.com/fusiontables/v2/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=' + apiKey);


        $.ajax({
            url: url.join(''),
            dataType: 'jsonp',
            success: function (basinObjs) {
                var bounds = new google.maps.LatLngBounds();
                if (basinObjs.hasOwnProperty('rows')) {
                    var basinArray = basinObjs.rows;
                    for (var row = 0; row < basinArray.length; row++) {
                        var basin = basinArray[row];
                        var basinObj = basin[0];
                        // find geometry or geometries because there is no consistency anywhere
                        if (basinObj.hasOwnProperty('geometry')) {
                            var geometry = basinObj.geometry;
                            var name = basin[4];
                            var polygonArray = geometry.coordinates;
                            var polygonCoordArray = polygonArray[0];
                        } else {
                            var geometries = basinObj.geometries;
                            var name = basin[4];
                            var polygonArray = geometries[0].coordinates;
                            var polygonCoordArray = polygonArray[0];
                        }

                        var pointArray = new Array();
                        for (var point = 0; point < polygonCoordArray.length; point++) {
                            var pointCoordArray = polygonCoordArray[point];
                            var lng = pointCoordArray[0];
                            var lat = pointCoordArray[1];
                            var latlng = new google.maps.LatLng(lat, lng);
                            pointArray.push({ lat: lat, lng: lng });
                            bounds.extend(latlng);
                        }

                        var basinPoly = new google.maps.Polygon({
                            paths: pointArray,
                            strokeColor: '#99784a',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#99784a',
                            fillOpacity: 0.35
                        });
                        basinPolyArray.push(basinPoly);
                        basinPoly.setMap(map);
                        map.fitBounds(bounds);
                        basinBounds.push(bounds);
                    }
                }
                fetchBasin(index + 1);
            }
        });
    } else {
        updateBasin();
    }

}
function fetchWatersheds(index) {
    var $basin = $basins.eq(index);
    var $inputs = $basin.find('input');
    var watershedPolyArray = new Array();
    var basinName = $inputs.eq(0).val();

    $('#MapOverlay p').text('loading ' + basinName + ' watersheds...');
    console.log('water-data-all.js: fetchWatersheds: fetching watersheds for Basin ' + basinName);

    var query = $inputs.eq(2).val();
    var encodedQuery = encodeURIComponent(query);
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=' + apiKey);


    $.ajax({
        url: url.join(''),
        dataType: 'jsonp',
        success: function (watershedObjs) {
            if (watershedObjs.hasOwnProperty('rows')) {
                var watershedArray = watershedObjs.rows;
                for (var row = 0; row < watershedArray.length; row++) {
                    var watershed = watershedArray[row];
                    var watershedObj = watershed[0];
                    var geometry = watershedObj.geometry;
                    var polygonArray = geometry.coordinates;
                    var polygonCoordArray = polygonArray[0];
                    var pointArray = new Array();

                    for (var point = 0; point < polygonCoordArray.length; point++) {
                        var pointCoordArray = polygonCoordArray[point];
                        var lng = pointCoordArray[0];
                        var lat = pointCoordArray[1];
                        var latlng = new google.maps.LatLng(lat, lng);
                        pointArray.push({ lat: lat, lng: lng });
                    }

                    var watershedPoly = new google.maps.Polygon({
                        paths: pointArray,
                        strokeColor: '#99784a',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#99784a',
                        fillOpacity: 0.35
                    });

                    watershedPolyArray.push(watershedPoly);
                    watershedPolyArrays[index] = watershedPolyArray;
                }
                updateWatersheds();
            }
        }
    });
}
function fetchSites(index) {
    var $basin = $basins.eq(index);
    var $inputs = $basin.find('input');
    var awwSiteMarkers = new Array();
    var basinName = $inputs.eq(0).val();

    $('#MapOverlay p').text('loading ' + basinName + ' sites...');
    console.log('water-data-all.js: fetchSites: fetching sites for Basin ' + basinName);



    var query = $inputs.eq(3).val();
    var encodedQuery = encodeURIComponent(query);
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=' + apiKey);

    $.ajax({
        url: url.join(''),
        dataType: 'json',
        success: function (sitesObj) {
            if (sitesObj.hasOwnProperty('rows')) {
                var rows = sitesObj.rows;
                for (var row = 0; row < rows.length; row++) {
                    var site = rows[row];
                    awwSiteMarkers.push(addMarker(site));
                }
                awwSiteMarkerArray[index] = awwSiteMarkers;
                updateSites();
            }
        }
    });
}
function addMarker(site) {
    var activeIcon = {
        url: '../../res/images/icons/activeMarker.png',
        scaledSize: new google.maps.Size(24, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 30)
    };
    var inactiveIcon = {
        url: '../../res/images/icons/inactiveMarker.png',
        scaledSize: new google.maps.Size(16, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(8, 20)
    };

    var Latitude = site[6];
    var Longitude = site[7];
    var Waterbody = site[4];
    var Active = site[11];
    var latlng = new google.maps.LatLng(Latitude, Longitude);
    var marker = new google.maps.Marker({
        position: latlng,
        title: Waterbody,
        icon: Active == "1" ? activeIcon : inactiveIcon
    });

    var infoboxContent = createInfoboxContent(site);
    google.maps.event.addListener(marker, 'click', function () {
        closeInfoBox();

        console.log(marker.title);

        mapInfobox = new InfoBox({
            content: infoboxContent,
            disableAutoPan: false,
            pixelOffset: new google.maps.Size(-140, -186),
            maxWidth: 110,
            closeBoxURL: "",
            boxStyle: { width: "280px" }
        });

        mapInfobox.open(map, this);
        map.panTo(marker.getPosition());
    });

    return marker;
}
function createInfoboxContent(site) {
    var siteID = site[0];
    var siteCode = site[1];
    var HUC12 = site[2];
    var HUC10 = site[3];
    var Waterbody = site[4];
    var siteLocation = site[5];
    var Latitude = site[6];
    var Longitude = site[7];
    var LastDate = site[8];
    var ChemCt = site[9];
    ChemCt = parseInt(ChemCt);
    var BacCt = site[10];
    BacCt = parseInt(BacCt);
    console.log(' BacCt = ' + BacCt + ' siteCode = ' + siteCode);
    var Active = site[11];
    var LinkChem = site[12];
    var LinkBac = site[13];
    var WSID = site[14];
    var link = "";

    //var chemLink = 'plotChem.html?Sitecode=' + siteCode + '&siteID=' + siteID + '&ct=' + ChemCt;
    var chemLink = 'https://web.auburn.edu/aww/charts/plotChem.aspx?Sitecode=' + siteCode + '&siteID=' + siteID + '&ct=' + ChemCt;
    //var bactLink = 'plotBac.html?Sitecode=' + siteCode + '&siteID=' + siteID + '&ct=' + ChemCt;
    var bactLink = 'https://web.auburn.edu/aww/charts/plotBac.aspx?Sitecode=' + siteCode + '&siteID=' + siteID + '&ct=' + BacCt;

    var infoboxContent =
		'<div id="Infobox">' +
			'<div id="Infobox-Content">' +
			'<b>Aww Site Code:</b> ' + siteCode + '<br />' +
			'<b>Waterbody:</b> ' + Waterbody + '<br />' +
			'<b>Location:</b> ' + siteLocation + '<br />' +
			'<b>HUC12:</b> ' + HUC12 + '<br />' +
			'<b>Lat:</b> ' + Latitude + ' <b>Long:</b> ' + Longitude + '<br />' +
			'<b>Last Date:</b> ' + LastDate + '<br />' +
			'<b>Chemistry Samples:</b> ' + ChemCt +
			(ChemCt > 0 ? ' <a href="' + chemLink + '" target="_blank">View Chart</a>' : '') + '<br />' +
			'<b>Bacteria Samples:</b> ' + BacCt +
			(BacCt > 0 ? ' <a href="' + bactLink + '" target="_blank">View Chart</a>' : '') +
			'</div>' +
			'<span class="close" onclick="closeInfoBox();"></span>' +
			'<span class="arrow"></span>' +
		'</div>';

    return infoboxContent;
}

function updateSites() {
    closeInfoBox();

    var $select = $('#Basin-Select');
    var index = $select.val();
    var $inputs = $basins.eq(index).find('input');
    var basinName = $inputs.eq(0).val();

    var $overlay = addMapOverlay();
    $overlay.find('p').text('loading ' + basinName + ' watersheds...');

    var $button = $('#Sites-Button');
    var checked = $button.prop('checked');
    var awwSiteMarkers = awwSiteMarkerArray[index];
    if (awwSiteMarkers != null) {
        if (checked) {
            $button.closest('label').addClass('highlite');
            $.each(awwSiteMarkers, function (index, object) {
                $awwSiteMarker = $(this);
                $awwSiteMarker[0].setMap(map);
            });
        } else {
            closeInfoBox();
            $button.closest('label').removeClass('highlite');
            $.each(awwSiteMarkers, function (index, object) {
                $awwSiteMarker = $(this);
                $awwSiteMarker[0].setMap(null);
            });
        }

        $overlay.remove();
    } else
        fetchSites(index);
}
function updateWatersheds() {
    closeInfoBox();

    var $select = $('#Basin-Select');
    var index = $select.val();
    var $inputs = $basins.eq(index).find('input');
    var basinName = $inputs.eq(0).val();

    var $overlay = addMapOverlay();
    $overlay.find('p').text('loading ' + basinName + ' watersheds...');

    var $button = $('#HUC-Button');
    var checked = $button.prop('checked');
    var watershedPolyArray = watershedPolyArrays[index];
    console.log('water-data-all.js: updateWatersheds; ');
    if (watershedPolyArray != null) {
        var basinPoly = basinPolyArray[index];
        if (checked) {
            $button.closest('label').addClass('highlite');
            $.each(watershedPolyArray, function () {
                $watershed = $(this);
                $watershed[0].setMap(map);
            });
            basinPoly.setMap(null);
        } else {
            $button.closest('label').removeClass('highlite');
            $.each(watershedPolyArray, function () {
                $watershed = $(this);
                $watershed[0].setMap(null);
            });
            basinPoly.setMap(map);
        }
        updateSites();
    } else
        fetchWatersheds(index);
}
function updateBasin() {
    closeInfoBox();

    var $select = $('#Basin-Select');
    var index = $select.val();
    var $inputs = $basins.eq(index).find('input');
    var basinName = $inputs.eq(0).val();

    var $overlay = addMapOverlay();
    $overlay.find('p').text('loading ' + basinName + ' watersheds...');
    $('h1.heading').text(basinName);

    // first hide all
    $.each(basinPolyArray, function () {
        var $basinPoly = $(this);
        $basinPoly[0].setMap(null);
    });
    // watershedPolyArrays: array containing an array of polygon objects
    $.each(watershedPolyArrays, function (indarrs, watershedPolyArray) {
        // watershedPolyArray: an array of polygon objects
        if (watershedPolyArray != null) {
            $.each(watershedPolyArray, function (indarr, watershed) {
                // watershed: polygon object
                watershed.setMap(null);
            });
        }
    });
    // awwSiteMarkerArray: array containg arrays of marker objects
    $.each(awwSiteMarkerArray, function (indarrs, awwSiteMarkers) {
        // awwSiteMarkers: an array of polygon objects;
        if (awwSiteMarkers != null) {
            $.each(awwSiteMarkers, function (indarr, site) {
                // site: marker object
                site.setMap(null);
            });
        }
    });

    // display selected
    basinPolyArray[index].setMap(map);
    updateWatersheds();
    setTimeout(function () { recenterMap(); }, 600);

}

function recenterMap() {
    var $select = $('#Basin-Select');
    var index = $select.val();
    var bounds = basinBounds[index];
    if (map != null && center != null) {
        map.fitBounds(bounds);
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
function closeInfoBox() {
    if (mapInfobox != null)
        mapInfobox.close();
}
function addMapOverlay() {
    var $overlay = $('#MapOverlay');
    if ($overlay.length == 0) {
        $overlay = $('<div id="MapOverlay"><div class="loader"><div><div></div><div></div></div></div><p></p></div>');
        $('#MapWrap').append($overlay);
    }
    return $overlay;
}

function setUpMap() {
    sizeMap();
    $(window).resize(sizeMap);

    initialize();
}

$(window).on('load', function () {
    validateToken(setUpMap);
});


