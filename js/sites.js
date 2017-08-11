var groupsObjectArray = null;
var sitesObjectArray = null;
var currentLocation = { latitude: null, longitude: null };
var watchID = null;

function checkForLocallyStored() {
    var type = $('#SiteList').attr('data-type');
    var items = localStorage.length;
    for (var item = 0; item < items; item++) {
        var key = localStorage.key(item);
        var keyNameParts = key.split('-');
        if (keyNameParts[1] == type) {
            $('#' + keyNameParts[0]).addClass('alert');
            $('#' + keyNameParts[0]).find('div.short').prepend("<i>Incomplete</i>");
        }
    }
}

function setPositionWatch() {
    options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
    };
    watchID = navigator.geolocation.watchPosition(updateWatchedPosition, watchedPositionError, options);
    retrieveGroupList();
}
function updateWatchedPosition(position) {
    currentLocation = { latitude: parseFloat(position.coords.latitude), longitude: parseFloat(position.coords.longitude) };

    var $navBar = $('#SiteList h3');
    if ($navBar.length > 0)
        $navBar.html('<h3>current gps (' + parseFloat(currentLocation.latitude).toFixed(5) + ', ' + parseFloat(currentLocation.longitude).toFixed(5) + ')</h3>');

    if (sitesObjectArray != null) {
        for (var index = 0; index < sitesObjectArray.length; index++) {
            locationObject = sitesObjectArray[index];
            locationObject.distance = calculateDistance(locationObject);
            var $liDistance = $('ul #' + locationObject.awwSiteCode + ' span.distance');
            if ($liDistance.length > 0) {
                $liDistance.html(convertKmToEnglish(locationObject.distance));
            }
        }
    }
}
function watchedPositionError(err) {
    
}

function getCurrentLocation() {
    var $refreshButton = $('#SiteList h2.distance span');
    $refreshButton.addClass('active').unbind('click');
    setTimeout(function () { updateSiteDistance(); }, 500);
}

function retrieveGroupList() {
    displayContentOverlay(true);

    $.support.cors;
    var token = getToken();
    if (token != null) {
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/GetGroups',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (jsonObj) {
                $('#Groups').empty();
                if (checkForToken(jsonObj)) {
                    groupsObjectArray = jsonObj.awW_Groups;
                    parseGroups();
                }
            }
            ,
            error: function (xhrObj, textStatus, errorThrown) {
                var message = "Your session has expired.";

                if (xhrObj.hasOwnProperty('responseText')) {
                    reponseObj = jQuery.parseJSON(xhrObj.responseText);
                    message = reponseObj.error_description;
                }
                clearTokenWithError(message);
            }
        });
    } else
        clearToken();
}
function parseGroups() {
    console.log('parseGroups');

    var $label = $('<label for="GroupSelector">Group</label>');
    var $select = $('<select id="GroupSelector"><option value="">All My Sites</option></select>');

    // sort the array by group_Name
    groupsObjectArray.sort(function (a, b) {
        if (a.group_Name.toLowerCase() < b.group_Name.toLowerCase()) return -1;
        if (b.group_Name.toLowerCase() < a.group_Name.toLowerCase()) return 1;
        return 0;
    });

    // append to select
    for (var index = 0; index < groupsObjectArray.length; index++) {
        var groupObject = groupsObjectArray[index];
        var $option = $('<option value="' + groupObject.groupId + '">' + groupObject.group_Name + '</option>');
        $select.append($option);
    }

    $('#Groups').append($label);
    $('#Groups').append($select);

    $('#GroupSelector').change(retrieveSiteList);
    retrieveSiteList();
}

function retrieveSiteList() {
    displayContentOverlay(true);

    $.support.cors;
    var token = getToken();
    var groupID = $('#GroupSelector').val();

    if (groupID.length > 0) {
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/GetGroupSites',
            type: 'GET',
            data: { 'id': groupID },
            contentType: 'application/json',
            dataType: 'json',
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (jsonObj) {
                console.log('successfully retrieved group sites');
                $('#SiteList').empty();
                if (checkForToken(jsonObj)) {
                    var sitesObj = jsonObj.webMasterSites;
                    parseLocations(sitesObj);
                }
                displayContentOverlay(false);
            },
            error: function (xhrObj, textStatus, errorThrown) {
                var message = "Your session has expired.";
                if (xhrObj.hasOwnProperty('responseText')) {
                    reponseObj = jQuery.parseJSON(xhrObj.responseText);
                    message = reponseObj.error_description;
                }
                clearTokenWithError(message);
            }
        });
    } else {
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/GetUserSites',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (jsonObj) {
                console.log('successfully retrieved user sites');
                $('#SiteList').empty();
                if (checkForToken(jsonObj)) {
                    var sitesObj = jsonObj.webMasterSites;
                    parseLocations(sitesObj);
                }
                displayContentOverlay(false);
            },
            error: function (xhrObj, textStatus, errorThrown) {
                var message = "Your session has expired.";
                if (xhrObj.hasOwnProperty('responseText')) {
                    reponseObj = jQuery.parseJSON(xhrObj.responseText);
                    message = reponseObj.error_description;
                }
                clearTokenWithError(message);
            }
        });
    }
}
function parseLocations(sitesObj) {
    sitesObjectArray = [];

    var type = $('#SiteList').attr('data-type');
    for (var index = 0; index < sitesObj.length; index++) {
        locationObject = sitesObj[index];
        var active = false;
        if (type == "bacteria")
            active = locationObject.active > 0 && locationObject.bActive > 0;
        else if (type == "chemistry")
            active = locationObject.active > 0 && locationObject.cActive > 0;

        if (active) {
            locationObject.distance = null;
            sitesObjectArray.push(locationObject);
        }
    }

    getCurrentLocation();
}
function updateSiteDistance() {
    // if no current location change order by to site name
    // retrieve order by
    var $orderBy = $('#OrderSelector');
    var orderBySiteName = $orderBy.val() == '1';
    if (currentLocation.latitude == null || currentLocation.longitude == null)
        $orderBy.val('0');

    for (var index = 0; index < sitesObjectArray.length; index++) {
        locationObject = sitesObjectArray[index];
        locationObject.distance = calculateDistance(locationObject);
    }
    if (orderBySiteName) {
        // sort the array by aww site name
        sitesObjectArray.sort(function (a, b) {
            if (a.waterbody_Name.toLowerCase() + ' ' + a.description.toLowerCase() < b.waterbody_Name.toLowerCase() + ' ' + b.description.toLowerCase()) return -1;
            if (b.waterbody_Name.toLowerCase() + ' ' + b.description.toLowerCase() < a.waterbody_Name.toLowerCase() + ' ' + a.description.toLowerCase()) return 1;
            return 0;
        });
    } else {
        // sort the array by distance
        sitesObjectArray.sort(function (a, b) {
            if (parseFloat(a.distance) < parseFloat(b.distance)) return -1;
            if (parseFloat(b.distance) < parseFloat(a.distance)) return 1;
            return 0;
        });
    }

    populateLocations();
}

function populateLocations() {
    $('#SiteList').empty();
    var groupID = $('#GroupSelector').val();
    var siteCount = sitesObjectArray.length;

    var orderBySiteName = $('#OrderSelector').val() == '1';

    var $titleBar = $('<h2>' + (groupID.length > 0 ? '' : 'Your ') + siteCount + ' Site' + (siteCount != 1 ? 's' : '') + (groupID.length > 0 ? ' for ' + $('#GroupSelector option:selected').text() : '') + '</h2>');
    $('#SiteList').append($titleBar);
    if (!orderBySiteName) {
        $titleBar.addClass('distance');
        var $refreshIcon = $('<span></span>');
        $refreshIcon.on('click', function () { getCurrentLocation(); });
        $titleBar.append($refreshIcon);
        var $navBar = $('<h3>current gps (' + parseFloat(currentLocation.latitude).toFixed(5) + ', ' + parseFloat(currentLocation.longitude).toFixed(5) + ')</h3>');
    }
    $('#SiteList').append($navBar);


    var $ul = $('<ul class="name-link-list site-list"></ul>');
    var type = $('#SiteList').attr('data-type');

    for (var index = 0; index < sitesObjectArray.length; index++) {
        locationObject = sitesObjectArray[index];

        var $li = $('<li id="' + locationObject.awwSiteCode + '"></li>');
        var $details = $('<div class="details"><table cellpadding="0" cellspacing="0"><tbody>' +
            '<tr><th>Site Code:</th><td>' + locationObject.awwSiteCode + '</td></tr>' +
            '<tr><th>Waterbody:</th><td>' + locationObject.waterbody_Name + '</td></tr>' +
            '<tr><th>Description:</th><td>' + locationObject.description + '</td></tr>' +
            '<tr><th>County:</th><td>' + locationObject.county + '</td></tr>' +
            '<tr><th>Latitude:</th><td>' + locationObject.latitude + '</td></tr>' +
            '<tr><th>Longitude:</th><td>' + locationObject.longitude + '</td></tr>' +
            '</tbody></table></div>');
        $li.append($details);

        var $short = $('<div class="short">' + locationObject.waterbody_Name + '<br /><span class="distance">' + convertKmToEnglish(locationObject.distance) + '</span><p>' + locationObject.description + '</p></div>');
        $li.append($short);

        var $cover = $('<span></span>');
        $li.append($cover);

        var $link = null;
        if (type == "bacteria")
            $link = $('<a href="../bacteria/default.html' + buildLinkQuery(locationObject) + '"><span>Select</span></a>');
        else
            $link = $('<a href="../chemistry/default.html' + buildLinkQuery(locationObject) + '"><span>Select</span></a>');

        $li.append($link);
        $ul.append($li);
    }

    $('#SiteList').append($ul);
    setupSiteList();
    checkForLocallyStored();
}
function buildLinkQuery(locationObject) {
    var query = '?AwwSiteCode=' + locationObject.awwSiteCode +
        '&WebMasterSiteId=' + locationObject.site_ID +
        '&Waterbody_Name=' + encodeURIComponent(locationObject.waterbody_Name) +
        // missing '&Watershed=' + encodeURIComponent(locationObject.Watershed) + 
        '&HUC11=' + locationObject.huC11 +
        '&HUC8=' + locationObject.huC8 +
        '&HUC6=' + locationObject.huC6 +
        '&HUC4=' + locationObject.huC4 +
        '&county=' + encodeURIComponent(locationObject.county) +
        // missing '&state=' + locationObject.state + 
        '&SamplingSiteLocation=' + encodeURIComponent(locationObject.description);

    var $groupSelector = $('#GroupSelector');
    if ($groupSelector.length > 0) {
        var selectedIndex = $groupSelector[0].selectedIndex;
        if (selectedIndex > 0) {
            groupObject = groupsObjectArray[selectedIndex - 1];
            query += '&Groupid=' + encodeURIComponent(groupObject.groupId) +
            '&Group_Name=' + encodeURIComponent(groupObject.group_Name) +
            '&Group_Abbreviation=' + encodeURIComponent(groupObject.group_Abbreviation);
        }
    }

    return query;
}
function setupSiteList() {
    var $covers = $('ul.site-list li > span');
    $covers.each(function () {
        var $cover = $(this);
        $cover.click(function () { toggleListDetail($(this), true); });
    });
}
function toggleListDetail($cover, display) {
    var $details = $cover.parent().find('div.details');
    var $short = $cover.parent().find('div.short');
    if (display) {
        $cover.unbind('click').click(function () { toggleListDetail($(this), false); });
        $short.stop().addClass('trans').slideUp(function () { $(this).removeClass('trans'); });
        $details.stop().addClass('trans').slideDown(function () { $(this).removeClass('trans'); });
    } else {
        $cover.unbind('click').click(function () { toggleListDetail($(this), true); });
        $short.stop().addClass('trans').slideDown(function () { $(this).removeClass('trans'); });
        $details.stop().addClass('trans').slideUp(function () { $(this).removeClass('trans'); });
    }
}

// nearby functions (haversine formula)
function calculateDistance(siteLocation) {
    if (siteLocation.latitude != null && siteLocation.longitude != null && currentLocation.latitude != null && currentLocation.longitude != null) {
        var distLat = degsToRads(siteLocation.latitude - currentLocation.latitude);
        var distLng = degsToRads(siteLocation.longitude - currentLocation.longitude);

        var a = Math.sin(distLat / 2) * Math.sin(distLat / 2) +
            Math.cos(degsToRads(currentLocation.latitude)) * Math.cos(degsToRads(siteLocation.latitude)) *
            Math.sin(distLng / 2) * Math.sin(distLng / 2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var distance = 6371 * c;
        return distance;
    } else {
        return null;
    }

}
function degsToRads(degrees) {
    return degrees * (Math.PI / 180);
}
function convertKmToEnglish(distance) {
    distance = parseFloat(distance);
    if (distance > .810) {
        return (distance / 1.609344).toFixed(2) + " mi";
    } else {
        return (distance * 3280.84).toFixed(0) + " ft";
    }
}

$(window).on('load', function () {
    validateToken(setPositionWatch);

    $('#OrderSelector').on('change', function () { getCurrentLocation(); });
});