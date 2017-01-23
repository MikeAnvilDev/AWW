var apiKey = 'AIzaSyDcTMT0DVoMWt9IURdklqtRJMawlSoeoLw';
var map = null;
var center = null;
var bounds = null;
var mapInfobox = null;

var basinPoly = new Array();
var basinTable = '';
var awwSiteMarkers = new Array();
var awwSitesTable = '';
var watershedPolyArray = new Array();
var watershedsTable = '';


function initialize() {
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

	//map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend-open'));
	//map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend'));

	$('#Sites-Button').click(updateSites);
	$('#HUC-Button').click(updateWatersheds);

	fetchBasin();
		//var legend = document.getElementById('googft-legend');
		//var legendOpenButton = document.getElementById('googft-legend-open');
		//var legendCloseButton = document.getElementById('googft-legend-close');
		//legend.style.display = 'none';
		//legendOpenButton.style.display = 'block';
		//legendCloseButton.style.display = 'block';
		//legendOpenButton.onclick = function () {
		//    legend.style.display = 'block';
		//    legendOpenButton.style.display = 'none';
		//}
		//legendCloseButton.onclick = function () {
		//    legend.style.display = 'none';
		//    legendOpenButton.style.display = 'block';
		//}
}
function fetchBasin() {
	$('#MapOverlay p').text('loading basin...');
    //var query = "SELECT * FROM " + basinTable + (huc10.length > 0 ? " WHERE col4 = " + huc10 : '');
	var query = $('#BasinTableQuery').val();
	var encodedQuery = encodeURIComponent(query);
	var url = ['https://www.googleapis.com/fusiontables/v2/query'];
	url.push('?sql=' + encodedQuery);
	url.push('&key=' + apiKey);


	$.ajax({
		url: url.join(''),
		dataType: 'jsonp',
		success: function (basinObjs) {
			bounds = new google.maps.LatLngBounds();
			console.log(basinObjs);
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

					basinPoly = new google.maps.Polygon({
						paths: pointArray,
						strokeColor: '#99784a',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: '#99784a',
						fillOpacity: 0.35
					});
					basinPoly.setMap(map);
					map.fitBounds(bounds);
				}
			}
			fetchWatersheds();
		}
	});
}
function fetchWatersheds() {
	$('#MapOverlay p').text('loading watershed...');
    //var query = "SELECT * FROM " + watershedsTable + " WHERE col12 in (" + huc12Array.join(",") + ")";
	var query = $('#WatershedsTableQuery').val();
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
				}
			}
			fetchSites();
		}
	});
}
function fetchSites() {
	$('#MapOverlay p').text('loading sites...');
	var activeIcon = {
		url: '../../../res/images/icons/activeMarker.png',
		scaledSize: new google.maps.Size(24, 30),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(12, 30)
	};
	var inactiveIcon = {
		url: '../../../res/images/icons/inactiveMarker.png',
		scaledSize: new google.maps.Size(16, 20),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(8, 20)
	};

	var query = $('#AwwSitesTableQuery').val();
	var encodedQuery = encodeURIComponent(query);
	var url = ['https://www.googleapis.com/fusiontables/v2/query'];
	url.push('?sql=' + encodedQuery);
	url.push('&key=' + apiKey);

	$.ajax({
	    url: url.join(''),

		//url: 'https://www.googleapis.com/fusiontables/v2/query?sql=SELECT%20*%20FROM%20' + awwSitesTable + '%20WHERE%20WSID%20=%20' + watershedID + '&key=' + apiKey,
		dataType: 'json',
		success: function (sitesObj) {
			//console.log('retrieve sites');
			if (sitesObj.hasOwnProperty('rows')) {
				var rows = sitesObj.rows;
				//console.log('yes ');
				for (var row = 0; row < rows.length; row++) {
					var site = rows[row];
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
					awwSiteMarkers.push(marker);
					
					var infoboxContent = createInfoboxContent(site);
					google.maps.event.addListener(marker, 'click', function () {
						closeInfoBox();

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
				}
			} 
			$('#MapOverlay').animate({ opacity: 0 }, function () { $(this).remove()});
		}
	});
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
	var Active = site[11];
	var LinkChem = site[12];
	var LinkBac = site[13];
	var WSID = site[14];
	var link = "";

	var chemLink = 'plotChem.html?Sitecode=' + siteCode + '&siteID=' + siteID + '&ct=' + ChemCt;
	var bactLink = 'plotBac.html?Sitecode=' + siteCode + '&siteID=' + siteID + '&ct=' + ChemCt;
	
	return infoboxContent =
		'<div id="Infobox">' +
			'<div id="Infobox-Content">' +
			'<b>Aww Site Code:</b> ' + siteCode + '<br />' + 
			'<b>Waterbody:</b> ' + Waterbody + '<br />' + 
			'<b>Location:</b> ' + siteLocation + '<br />' + 
			'<b>HUC12:</b> ' + HUC12 + '<br />' + 
			'<b>Lat:</b> ' + Latitude + ' <b>Long:</b> ' + Longitude + '<br />' + 
			'<b>Last Date:</b> ' + LastDate + '<br />' + 
			'<b>Chemistry Samples:</b> ' + ChemCt + 
			(ChemCt > 0 ? ' <a href="' + chemLink + '">View Chart</a>' : '') + '<br />' + 
			'<b>Bacteria Samples:</b> ' + BacCt + 					
			(BacCt > 0 ? ' <a href="' + bactLink + '">View Chart</a>' : '') +
			'</div>' +
			'<span class="close" onclick="closeInfoBox();"></span>' +
			'<span class="arrow"></span>' +
		'</div>';
}

function updateSites() {
	var $button = $('#Sites-Button');
	var checked = $button.prop('checked');
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
}
function updateWatersheds() {
	var $button = $('#HUC-Button');
	var checked = $button.prop('checked');
	if (checked) {
		$button.closest('label').addClass('highlite');
		$.each(watershedPolyArray, function(index, object){
			$watershed = $(this);
			$watershed[0].setMap(map);
		});                
		basinPoly.setMap(null);
	} else {
		$button.closest('label').removeClass('highlite');
		$.each(watershedPolyArray, function (index, object) {
			$watershed = $(this);
			$watershed[0].setMap(null);
		});
		basinPoly.setMap(map);
	}
	updateSites();
}
function recenterMap() {
	if (map != null && center != null && bounds != null) {
		map.panTo(center);
		map.fitBounds(bounds);
	}
}
function sizeMap() {
	var availableHeight = $(window).height();
	var headerHeight = $('header').outerHeight();
	var titleHeight = $('main h1').outerHeight();
	var height = availableHeight - headerHeight - titleHeight;
	$('#MapWrap').css({ height: height });

	recenterMap();
}
function closeInfoBox() {
	if (mapInfobox != null)
		mapInfobox.close();
}
$(document).ready(function () {
	sizeMap();
	$(window).resize(sizeMap);

	google.maps.event.addDomListener(window, 'load', initialize);
});


