

function checkForLocallyStored() {
    console.log('site.js: checkForLocallyStored: check for locally stored');
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

function retrieveGroupList() {
    console.log('sites.js: retrieveGroupList: retrieving group list');


    $.support.cors;
    var token = getToken();
    console.log('sites.js: retrieveGroupList: token = ' + token);
    if (token != null) {
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/GetGroups',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (jsonObj) {
                console.log('sites.js: retrieveGroupList: ajax success');
                console.log(jsonObj);
                $('#Groups').empty();
                console.log('sites.js: retrieveGroupList: checking json');
                if (checkForToken(jsonObj)) {
                    console.log('sites.js: retrieveGroupList: token passed');
                    var groupsObj = jsonObj.awW_Groups;
                    parseGroups(groupsObj);
                }
            }
            ,
            error: function (xhrObj, textStatus, errorThrown) {
                console.log('sites.js: retrieveGroupList: ajax error');
                console.log(xhrObj);
                var message = "Your session has expired.";

                if (xhrObj.hasOwnProperty('responseText')) {
                    reponseObj = jQuery.parseJSON(xhrObj.responseText);
                    console.log(reponseObj);
                    message = reponseObj.error_description;
                }
                clearTokenWithError(message);
            }
        });
    } else 
        clearToken();
}
function parseGroups(groupsObj) {
    console.log('sites.js: parseGroups: parse groups object');

    var $label = $('<label for="GroupSelector">Group</label>');
    var $select = $('<select id="GroupSelector"><option value="">All My Sites</option></select>');
    
    console.log(groupsObj);
    console.log(groupsObj.length);
    for (var index = 0; index < groupsObj.length; index++) {
        groupObject = groupsObj[index];
        console.log(groupObject);
        var $option = $('<option value="' + groupObject.groupId + '">' + groupObject.group_Name + '</option>');
        $select.append($option);
    }

    $('#Groups').append($label);
    $('#Groups').append($select);

    $('#GroupSelector').change(retrieveSiteList);
    retrieveSiteList();
}

function retrieveSiteList() {
    console.log('site.js: retrieveSiteList: retrieving site list');

    $.support.cors;
    var token = getToken();
    console.log('site.js: retrieveSiteList: token = ' + token);
    var groupID = $('#GroupSelector').val();

    addOverlay();

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
                console.log('site.js: retrieveSiteList: ajax success');
                console.log(jsonObj);
                $('#SiteList').empty();
                console.log('site.js: retrieveSiteList: checking json');
                if (checkForToken(jsonObj)) {
                    console.log('site.js: retrieveSiteList: token passed');
                    var sitesObj = jsonObj.webMasterSites;
                    parseLocations(sitesObj);
                } 
                removeOverlay();
            },
            error: function (xhrObj, textStatus, errorThrown) {
                console.log('sites.js: retrieveSiteList: ajax error');
                console.log(xhrObj);
                var message = "Your session has expired.";

                if (xhrObj.hasOwnProperty('responseText')) {
                    reponseObj = jQuery.parseJSON(xhrObj.responseText);
                    console.log(reponseObj);
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
                console.log('site.js: retrieveSiteList: ajax success');
                console.log(jsonObj);
                $('#SiteList').empty();
                console.log('site.js: retrieveSiteList: checking json');
                if (checkForToken(jsonObj)) {
                    console.log('site.js: retrieveSiteList: token passed');
                    var sitesObj = jsonObj.webMasterSites;
                    parseLocations(sitesObj);
                } 
                removeOverlay();
            },
            error: function (xhrObj, textStatus, errorThrown) {
                console.log('sites.js: retrieveSiteList: ajax error');
                console.log(xhrObj);
                var message = "Your session has expired.";

                if (xhrObj.hasOwnProperty('responseText')) {
                    reponseObj = jQuery.parseJSON(xhrObj.responseText);
                    console.log(reponseObj);
                    message = reponseObj.error_description;
                }
                clearTokenWithError(message);
            }
        });
    }
}
function parseLocations(sitesObj) {
    console.log('sites.js: parseLocations: parse sites object');
    console.log(sitesObj);

    var groupID = $('#GroupSelector').val();
    var siteCount = sitesObj.length;
    $('#SiteList').append('<h2>' + (groupID.length > 0 ? '' : 'Your ') + siteCount + ' Site' + (siteCount != 1 ? 's' : '') + (groupID.length > 0 ? ' for ' + $('#GroupSelector option:selected').text() : '') + '</h2>');

    var $ul = $('<ul class="name-link-list site-list"></ul>');
    var type = $('#SiteList').attr('data-type');

    for (var index = 0; index < sitesObj.length; index++) {
        locationObject = sitesObj[index];
        console.log(locationObject);

        var active = false;
        if (type == "bacteria")
            active = locationObject.active > 0 && locationObject.bActive > 0;
        else if (type == "chemistry")
            active = locationObject.active > 0 && locationObject.cActive > 0;

        if (active) {
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

            var $short = $('<div class="short">' + locationObject.waterbody_Name + '<p>' + locationObject.description + '</p></div>');
            $li.append($short);

            var $cover = $('<span></span>');
            $li.append($cover);

            var $link = null;
            if (type == "bacteria")
                $link = $('<a href="../bacteria/default.html?AwwSiteCode=' + locationObject.awwSiteCode + '"><span>Select</span></a>');
            else
                $link = $('<a href="../chemistry/default.html?AwwSiteCode=' + locationObject.awwSiteCode + '"><span>Select</span></a>');

            $li.append($link);
            $ul.append($li);
        }
    }

    $('#SiteList').append($ul);
    setupSiteList();
    checkForLocallyStored();
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

function addOverlay() {
    var $overlay = $('#SiteList div.overlay');
    if ($overlay.length > 0)
        $overlay.remove();
    $overlay = $('<div class="overlay"></div>');
    $('#SiteList').append($overlay);
    $overlay.animate({ opacity: 1 });
}
function removeOverlay() {
    var $overlay = $('#SiteList div.overlay');
    if ($overlay.length > 0) {
        $overlay.animate({ opacity: 0 }, function () {
            $overlay.remove();
        });
    }
}

$(document).ready(function () {
    retrieveGroupList();
});