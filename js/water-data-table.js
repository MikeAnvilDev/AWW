﻿var sitesArray = null;
var listArray = null;
var groupsArray = new Array();
var huc10Watersheds =
    [[{ huc10: '0603000602', watershed: 'Cedar Creek' }, { huc10: '0603000506', watershed: 'Cypress Creek' }, { huc10: '0603000210', watershed: 'Flint Creek' }, { huc10: '0603000108', watershed: 'Guntersville Lake-Short Creek' }, { huc10: '0603000105', watershed: 'Guntersville Lake-South Sauty Creek' }, { huc10: '0603000107', watershed: 'Guntersville Lake-Town Creek' }, { huc10: '0603000205', watershed: 'Huntsville Spring Branch-Indian Creek' }, { huc10: '0603000207', watershed: 'Limestone Creek' }, { huc10: '0603000204', watershed: 'Lower Flint River' }, { huc10: '0603000109', watershed: 'Lower Guntersville Lake' }, { huc10: '0603000202', watershed: 'Lower Paint Rock River' }, { huc10: '0603000104', watershed: 'Mud Creek-Tennessee River' }, { huc10: '0603000503', watershed: 'Mud Creek-Town Creek' }, { huc10: '0603000208', watershed: 'Piney Creek' }, { huc10: '0603000212', watershed: 'Second Creek-Wheeler Lake' }, { huc10: '0603000403', watershed: 'Sugar Creek' }, { huc10: '0603000211', watershed: 'Swan Creek-Wheeler Lake' }, { huc10: '0603000508', watershed: 'Tennessee River-Pickwick Lake' }, { huc10: '0603000209', watershed: 'Tennessee River-Wheeler Lake' }, { huc10: '0603000601', watershed: 'Upper Bear Creek' }, { huc10: '0603000203', watershed: 'Upper Flint River' }, { huc10: '0603000106', watershed: 'Upper Guntersville Lake' }, { huc10: '0603000201', watershed: 'Upper Paint Rock River' }, { huc10: '0603000206', watershed: 'Wheeler Lake-Cotaco Creek' }, { huc10: '0603000102', watershed: 'Widows Creek-Tennessee River' }, { huc10: '0603000505', watershed: 'Wilson Lake-Shoal Creek' }],
    [{ huc10: '0316011305', watershed: 'Big Brush Creek' }, { huc10: '0316011301', watershed: 'Big Sandy Creek' }, { huc10: '0316011202', watershed: 'Big Yellow Creek-Black Warrior River' }, { huc10: '0316011204', watershed: 'Black Warrior River-North River' }, { huc10: '0316011002', watershed: 'Brushy Creek' }, { huc10: '0316010906', watershed: 'Cane Creek-Mulberry Fork' }, { huc10: '0316011003', watershed: 'Clear Creek' }, { huc10: '0316011302', watershed: 'Cypress Creek-Black Warrior River' }, { huc10: '0316011203', watershed: 'Davis Creek-Black Warrior River' }, { huc10: '0316011101', watershed: 'Headwaters Locust Fork' }, { huc10: '0316011306', watershed: 'Hemphill Bend-Black Warrior River' }, { huc10: '0316011205', watershed: 'Hurricane Creek-Black Warrior River' }, { huc10: '0316010904', watershed: 'Lost Creek' }, { huc10: '0316011104', watershed: 'Lower Locust Fork' }, { huc10: '0316010703', watershed: 'Lower Sipsey Creek-Tombigbee River' }, { huc10: '0316011103', watershed: 'Middle Locust Fork' }, { huc10: '0316010902', watershed: 'Middle Mulberry Fork' }, { huc10: '0316011005', watershed: 'Mulberry Fork' }, { huc10: '0316010903', watershed: 'Mulberry Fork-Blackwater Creek' }, { huc10: '0316010302', watershed: 'Purgatory Creek-Beaver Creek' }, { huc10: '0316011004', watershed: 'Rock Creek' }, { huc10: '0316011001', watershed: 'Sipsey Fork' }, { huc10: '0316010301', watershed: 'Upper Buttahatchee River' }, { huc10: '0316011102', watershed: 'Upper Locust Fork' }, { huc10: '0316010901', watershed: 'Upper Mulberry Fork' }, { huc10: '0316011201', watershed: 'Valley Creek' }, { huc10: '0316010905', watershed: 'Wolf Creek' }],
    [{ huc10: '0315010603', watershed: 'Big Canoe Creek-Coosa River' }, { huc10: '0315010601', watershed: 'Big Willis Creek' }, { huc10: '0315010602', watershed: 'Black Creek-Coosa River' }, { huc10: '0315010906', watershed: 'Blue Creek-Lake Martin' }, { huc10: '0315010606', watershed: 'Blue Eye Creek-Coosa River' }, { huc10: '0315010501', watershed: 'Cedar Creek' }, { huc10: '0315011004', watershed: 'Channahatchee Creek' }, { huc10: '0315010907', watershed: 'Chapman Creek' }, { huc10: '0315010506', watershed: 'Chattooga River' }, { huc10: '0315011002', watershed: 'Chewacla Creek' }, { huc10: '0315010605', watershed: 'Choccolocco Creek' }, { huc10: '0315011009', watershed: 'Chubbehatchee Creek-Tallapoosa River' }, { huc10: '0315011006', watershed: 'Cubahatchee Creek' }, { huc10: '0315010707', watershed: 'Hatchet Creek' }, { huc10: '0315010904', watershed: 'Hillabee Creek' }, { huc10: '0315010810', watershed: 'Ketchepedrakee Creek-Tallapoosa River' }, { huc10: '0315011008', watershed: 'Line Creek' }, { huc10: '0315010508', watershed: 'Lower Little River' }, { huc10: '0315010510', watershed: 'Lower Terrapin Creek-Weiss Lake' }, { huc10: '0315010505', watershed: 'Mills Creek' }, { huc10: '0315010705', watershed: 'Peckerwood Creek-Coosa River' }, { huc10: '0315010905', watershed: 'Sandy Creek' }, { huc10: '0315010608', watershed: 'Shoal Creek-Coosa River' }, { huc10: '0315011001', watershed: 'Sougahatchee Creek' }, { huc10: '0315010503', watershed: 'Spring Creek' }, { huc10: '0315010507', watershed: 'Straight Creek-Upper Little River' }, { huc10: '0315010901', watershed: 'Tallapoosa River-R. L. Harris Lake' }, { huc10: '0315010701', watershed: 'Tallaseehatchee Creek' }, { huc10: '0315010604', watershed: 'Tallasseehatchee Creek-Coosa River' }, { huc10: '0315010509', watershed: 'Terrapin Creek' }, { huc10: '0315010908', watershed: 'Timbergut Creek-Tallaposa River' }, { huc10: '0315011003', watershed: 'Uphapee Creek' }, { huc10: '0315010502', watershed: 'Upper Coosa River' }, { huc10: '0315010708', watershed: 'Walnut Creek-Coosa River' }, { huc10: '0315010704', watershed: 'Waxahatchee Creek' }, { huc10: '0315010706', watershed: 'Weogufka Creek' }, { huc10: '0315010709', watershed: 'Weoka Creek-Coosa River' }],
    [{ huc10: '0315020102', watershed: 'Autauga Creek' }, { huc10: '0315020303', watershed: 'Big Swamp Creek-Alabama River' }, { huc10: '0315020202', watershed: 'Buck Creek-Cahaba River' }, { huc10: '0315020103', watershed: 'Catoma Creek' }, { huc10: '0315020201', watershed: 'Headwaters Cahaba River' }, { huc10: '0315020107', watershed: 'Jones Bluff Lake-Alabama River' }, { huc10: '0315020204', watershed: 'Little Cahaba River' }, { huc10: '0315020109', watershed: 'Little Mulberry Creek' }, { huc10: '0315020209', watershed: 'Lower Cahaba River' }, { huc10: '0315020206', watershed: 'Mill Creek-Cahaba River' }, { huc10: '0315020101', watershed: 'Mortar Creek-Alabama River' }, { huc10: '0315020110', watershed: 'Mulberry Creek' }, { huc10: '0315020304', watershed: 'Pine Barren Creek' }, { huc10: '0315020104', watershed: 'Pintlala Creek' }, { huc10: '0315020203', watershed: 'Shades Creek' }, { huc10: '0315020401', watershed: 'Silver Creek' }, { huc10: '0315020112', watershed: 'Soapstone Creek' }, { huc10: '0315020106', watershed: 'Swift Creek' }, { huc10: '0315020105', watershed: 'Tallawessee Creek-Alabama River' }, { huc10: '0315020205', watershed: 'Upper Cahaba River' }, { huc10: '0315020207', watershed: 'Waters Creek-Cahaba River' }],
    [{ huc10: '0313000313', watershed: 'Barbour Creek-Chattahoochee River' }, { huc10: '0313000401', watershed: 'Cemochehobee Creek-Chattahoochee River' }, { huc10: '0313000211', watershed: 'Chattahoochee River-Lake Harding' }, { huc10: '0313000408', watershed: 'Chattahoochee River-Lake Seminole' }, { huc10: '0313000316', watershed: 'Chattahoochee River-Walter F. George Reservoir' }, { huc10: '0313001202', watershed: 'Cowarts Creek-Chipola River' }, { huc10: '0313000309', watershed: 'Cowikee Creek-Chattahoochee River' }, { huc10: '0313000304', watershed: 'Little Uchee Creek' }, { huc10: '0313000209', watershed: 'Long Cane Creek-Chattahoochee River' }, { huc10: '0313001201', watershed: 'Marshall Creek' }, { huc10: '0313000406', watershed: 'Omusee Creek' }, { huc10: '0313000407', watershed: 'Sawhatchee Creek-Chattahoochee River' }, { huc10: '0313000305', watershed: 'Uchee Creek' }],
    [{ huc10: '0314020203', watershed: 'Buckhorn Creek' }, { huc10: '0314020112', watershed: 'Choctawatchee River' }, { huc10: '0314020208', watershed: 'Corner Creek' }, { huc10: '0314020111', watershed: 'Double Bridges Creek' }, { huc10: '0314020301', watershed: 'East Pittman Creek-Choctawhatchee River' }, { huc10: '0314020207', watershed: 'Flat Creek' }, { huc10: '0314020110', watershed: 'Hurricane Creek' }, { huc10: '0314020103', watershed: 'Judy Creek' }, { huc10: '0314020106', watershed: 'Klondike Creek-Choctawatchee River' }, { huc10: '0314020105', watershed: 'Little Choctawachee River' }, { huc10: '0314020102', watershed: 'Lower East Fork Choctawatchee River' }, { huc10: '0314020206', watershed: 'Middle Pea River' }, { huc10: '0314020201', watershed: 'Pea Creek' }, { huc10: '0314020108', watershed: 'Steep Head Creek' }, { huc10: '0314020107', watershed: 'Upper Clay Bank Creek' }, { huc10: '0314020101', watershed: 'Upper East Fork Choctawatchee River' }, { huc10: '0314020205', watershed: 'Upper Pea River' }, { huc10: '0314020104', watershed: 'West Fork Choctawatchee River' }, { huc10: '0314020204', watershed: 'Whitewater Creek' }],
    [{ huc10: '0314010602', watershed: 'Bushy Creek-Dyas Creek' }, { huc10: '0314010302', watershed: 'Five Runs Creek' }, { huc10: '0314010607', watershed: 'Lower Perdido River' }, { huc10: '0314010304', watershed: 'Middle Yellow River' }, { huc10: '0314010701', watershed: 'Perdido Bay' }, { huc10: '0314010306', watershed: 'Pond Creek-Shoal River' }, { huc10: '0314010605', watershed: 'Styx River' }, { huc10: '0314010601', watershed: 'Upper Perdido River' }, { huc10: '0314010702', watershed: 'Wolf Bay Frontal' }],
    [{ huc10: '0314030503', watershed: 'Big Escambia Creek-Escambia River' }, { huc10: '0314030403', watershed: 'Burnt Corn Creek' }, { huc10: '0314030405', watershed: 'Conecuh River' }, { huc10: '0314030105', watershed: 'Lower Conecuh River' }, { huc10: '0314030205', watershed: 'Lower Patsaliga Creek' }, { huc10: '0314030307', watershed: 'Lower Sepulga River' }, { huc10: '0314030102', watershed: 'Mannings Creek' }, { huc10: '0314030104', watershed: 'Middle Conecuh River' }, { huc10: '0314030306', watershed: 'Middle Sepulga River' }, { huc10: '0314030201', watershed: 'Olustee Creek' }, { huc10: '0314030103', watershed: 'Upper Conecuh River' }, { huc10: '0314030401', watershed: 'Upper Murder Creek' }, { huc10: '0314030301', watershed: 'Upper Persimmon Creek' }, { huc10: '0314030304', watershed: 'Upper Pigeon Creek' }],
    [{ huc10: '0316020206', watershed: 'Alamuchee Creek' }, { huc10: '0316020307', watershed: 'Bassetts Creek' }, { huc10: '0316020405', watershed: 'Bay Minette Creek-Mobile River' }, { huc10: '0316020404', watershed: 'Bayo Sara-Mobile River' }, { huc10: '0316020401', watershed: 'Cedar Creek-Tensaw River' }, { huc10: '0316020502', watershed: 'Fish River-Frontal Mobile Bay' }, { huc10: '0316020501', watershed: 'Halls Mill Creek' }, { huc10: '0316020207', watershed: 'Lower Sucarnoochee River' }, { huc10: '0316020309', watershed: 'Lower Tombigbee River' }, { huc10: '0316020204', watershed: 'Middle Sucarnoochee River' }, { huc10: '0316020503', watershed: 'Mobile Bay' }, { huc10: '0316020402', watershed: 'Rains Creek-Tensaw River' }, { huc10: '0316020311', watershed: 'Sand Hill Creek-Tombigbee River' }, { huc10: '0316020104', watershed: 'Tombigbee River-Cotahaga Creek' }]];


function retrieveSites() {
    $.support.cors;
    var token = getToken();
    if (token != null) {
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/GetUserSitesForPublic',
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (jsonObj) {
                sitesArray = jsonObj.webMasterSites;
                populateSitesList();
                retrieveGroups();
            },
            error: function (x, y, z) {
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

function sortSitesArrayByAWWSiteCode(a, b) {
    var aAwwSiteCode = parseInt(a.awwSiteCode);
    var bAwwSiteCode = parseInt(b.awwSiteCode);
    return ((aAwwSiteCode < bAwwSiteCode) ? -1 : ((aAwwSiteCode > bAwwSiteCode) ? 1 : 0));
}
function sortSitesArrayByHUC(a, b) {
    var aHuc11 = parseInt(a.huC11);
    var bHuc11 = parseInt(b.huC11);
    return ((aHuc11 < bHuc11) ? -1 : ((aHuc11 > bHuc11) ? 1 : 0));
}
function removeDuplicatesFromSortedArray(array) {
    for (var index = array.length - 1; index > 0; index--) {
        if (array[index].huC11 == array[index - 1].huC11 && array[index].awwSiteCode == array[index - 1].awwSiteCode) {
            console.log('removed');
            array.splice(index, 1);
        }
    }
    return array;
}
function retrieveMonth(number) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(number) - 1];
}

function populateSitesList() {
    displayContentOverlay(true);

    // paramaters
    var searchType = parseInt($('#Search-Type').val());
    var dataType = parseInt($('#Data-Type').val());
    //var plotPage = dataType == 0 ? 'chemistry.html' : 'bacteria.html';
    var plotPage = dataType == 0 ? 'https://web.auburn.edu/aww/charts/plotChem.aspx' : 'https://web.auburn.edu/aww/charts/plotBac.aspx';
    var awwWatershed = $('#AWW-Watershed').val();
    var huc6Basin = $('#HUC6-Basin').val();
    var huc10Watershed = $('#HUC10-Watershed').val();


    // array manipulations
    listArray = jQuery.extend(true, [], sitesArray);

    // sort the array by HUC11 or AWWSiteCode
    if (searchType == 0)
        listArray.sort(sortSitesArrayByAWWSiteCode);
    else
        listArray.sort(sortSitesArrayByHUC);

    // remove duplicates for array
    listArray = removeDuplicatesFromSortedArray(listArray);


    var $SitesList = $('#Sites-List');
    $SitesList.empty();
    $SitesList.append('<thead><tr><th><span>Site </span>Code</th><th>Waterbody</th><th>Location</th><th>Lat, Lng</th><th><span>Last </span>Date</th><th>Records</th><th>View</th></tr></thead>');
    var $SitesListBody = $('<tbody></tbody>');
    $SitesList.append($SitesListBody);
    $.each(listArray, function (index, site) {
        var display = true;

        // only display with a valid sample count
        var sampleCount = parseInt((dataType == 0 ? site.chemCt : site.bacCt));
        display = sampleCount == 0 ? false : display;

        // if aww watershed, match to watershed
        if (searchType == 0) {
            // check the first 2 digits of awwsitecode to watershed id
            if (site.awwSiteCode != null)
                display = site.awwSiteCode.slice(0, 2) != awwWatershed ? false : display;
            else
                display = false;
        }
        // if huc watershed, match to huc6
        if (searchType == 1) {
            // check the first 6 digits of huc11 to huc6
            if (site.huC11 != null) {
                display = site.huC11.slice(0, 6) != huc6Basin ? false : display;
                if (huc10Watershed.length > 0) {
                    // check the first 10 digits of huc11 to huc10
                    display = site.huC11.slice(0, 10) != huc10Watershed ? false : display;
                }
            } else
                display = false;
        }

        if (display) {
            var $tr = $('<tr siteCode="' + site.awwSiteCode + '"></tr>');
            $tr.append('<td><a href="' + plotPage + '?SiteCode=' + site.awwSiteCode + '&siteID=' + (site.site_ID) +
                '&Waterbody=' + encodeURIComponent(site.waterbody_Name) + '&Latitude=' + site.latitude + '&Longitude=' + site.longitude +
                '&Description=' + encodeURIComponent(site.description) + '" target="_blank">' + site.awwSiteCode + '</a></td> ');
            $tr.append('<td>' + site.waterbody_Name + '</td> ');
            $tr.append('<td>' + site.description + '</td> ');
            $tr.append('<td>' + site.latitude + ', ' + site.longitude + '</td> ');
            var dateString = dataType == 0 ? site.lastCDate : site.lastBDate;
            if (dateString != null) {
                var dateTimeParts = dateString.split('T');
                var dateParts = dateTimeParts[0].split('-');
                $tr.append('<td>' + dateParts[2] + ' ' + retrieveMonth(dateParts[1]) + ' ' + dateParts[0] + '</td> ');
            } else {
                $tr.append('<td>None</td> ');
            }
            $tr.append('<td>' + sampleCount + '</td> ');

            var $images = $('<span class="image" siteid="' + site.site_ID + '" title="' + site.waterbody_Name + ' ' + site.description + '"></span>');
            $images.click(function () {
                displayImages($(this));
            });

            var $map = $('<span class="map" geo="' + site.latitude + ',' + site.longitude + '" title="' + site.waterbody_Name + ' ' + site.description + '"></span>');
            $map.click(function () {
                displayMap($(this));
            });
            var $icons = $('<td></td>');
            $icons.append($images);
            $icons.append($map);
            $tr.append($icons);
            $SitesListBody.append($tr);
        }
    });

    populateGroupSelect();
}
function populateHUCWatersheds() {
    var huc6BasinIndex = $('#HUC6-Basin')[0].selectedIndex;
    var $huc10Watershed = $('#HUC10-Watershed');
    $huc10Watershed.empty();
    $huc10Watershed.append('<option value="">All</option>');
    var hucWatersheds = huc10Watersheds[huc6BasinIndex]
    $.each(hucWatersheds, function (index, watershed) {
        $huc10Watershed.append('<option value="' + watershed.huc10 + '">' + watershed.watershed + '</option>');
    });
    populateSitesList();
}
function updateSearchType() {
    displayContentOverlay(true);

    var searchType = parseInt($('#Search-Type').val());
    if (searchType == 0) {
        $('#HUC-Search').stop().hide();
        $('#AWW-Search').stop().fadeIn(function () {
            populateSitesList();
        });
    } else {
        $('#HUC-Search').stop().fadeIn(function () {
            populateHUCWatersheds();
        });
        $('#AWW-Search').stop().hide();
    }
}

function retrieveGroups() {
    $.support.cors;
    var token = getToken();
    if (token != null) {
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/GetGroupSitesForPublic',
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (jsonObj) {
                populateGroupsList(jsonObj.awW_Groups);
            },
            error: function (x, y, z) {
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
function populateGroupsList(groupArray) {
    $.each(groupArray, function (index, group) {
        var awwWatersheds = "";
        var awwSites = "";
        var hucs = "";
        var siteArray = group.sites;

        $.each(siteArray, function (index, site) {
            if (site.awwSiteCode != null) {
                if (site.awwSiteCode.length >= 2) {
                    awwWatersheds += site.awwSiteCode.slice(0, 2) + ',';
                    awwSites += site.awwSiteCode + ',';
                }
            }
            if (site.huC11 != null) {
                if (site.huC11.length >= 2) {
                    hucs += site.huC11 + ',';
                }
            }
        });

        var groupObject = { groupID: group.groupId, groupName: group.group_Name, awwWatersheds: awwWatersheds, awwSites: awwSites, huc11s: hucs };
        groupsArray.push(groupObject);
    });

    groupsArray.sort(sortGroupsByName);
    populateGroupSelect();

    $('div.group-loading').remove();
    displayContentOverlay(false);
}
function populateGroupSelect() {
    var awwWatershed = $('#AWW-Watershed').val();
    var $groupSelect = $('#AWW-Group');
    $groupSelect.empty();
    $groupSelect.append('<option value="">All Groups</option>');
    // filter groups
    $.each(groupsArray, function (index, groupObject) {
        // check to make sure group is in site selection
        var groupWatersheds = groupObject.awwWatersheds;
        if (groupWatersheds.indexOf(awwWatershed + ',') > -1) {
            $groupSelect.append('<option value="' + index + '">' + groupObject.groupName + '</option>');
        }
    });

    displayContentOverlay(false);
}
function sortGroupsByName(a, b) {
    var aGroupName = a.groupName;
    var bGroupName = b.groupName;
    return (aGroupName < bGroupName ? -1 : (aGroupName > bGroupName ? 1 : 0));
}
function updateSitesViewByGroup() {
    var groupIndex = $('#AWW-Group').val();
    if (groupIndex.length > 0) {
        $('#Sites-List tbody tr').hide();
        groupIndex = parseInt(groupIndex);
        var groupObject = groupsArray[groupIndex];
        var awwSites = groupObject.awwSites.split(',');
        $.each(awwSites, function (index, value) {
            if (value.length > 0)
                $('#Sites-List tr[siteCode="' + value + '"]').slideDown();
        })
    } else
        $('#Sites-List tr').slideDown();
}

var mapcenter = null;
var map = null;
function displayMap($obj) {
    var $viewer = openDetailView();
    $viewer.stop().fadeIn();
    var geo = $obj.attr('geo').split(',');
    $viewer.append('<h2>' + $obj.attr('title') + '</h2>');
    $viewer.append('<a class="directions" href="https://www.google.com/maps/dir/121+Bragg+Avenue,+Auburn,+AL/' + geo[0] + ',' + geo[1] + '/" target="_blank">Get Directions</a>');
    $viewer.append('<div id="MapCanvas"></div>');
    initializeMap(geo);

    $(window).resize(recenterMap);
}
function initializeMap(geo) {

    google.maps.visualRefresh = true;
    var mapDiv = document.getElementById('MapCanvas');
    mapcenter = new google.maps.LatLng(geo[0], geo[1]);
    map = new google.maps.Map(mapDiv, {
        center: mapcenter,
        zoom: 12,
        scaleControl: true,
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN]
        }
    });
    addMarker();
}
function addMarker() {
    var icon = {
        url: '../../res/images/icons/activeMarker.png',
        scaledSize: new google.maps.Size(24, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 30)
    };

    var marker = new google.maps.Marker({
        map: map,
        position: mapcenter,
        icon: icon
    });
}
function recenterMap() {
    if (map != null && mapcenter != null) {
        map.setCenter(mapcenter);
    }
}

function displayImages($obj) {
    var $viewer = openDetailView();
    $viewer.append('<div id="Image-Loader"><div><div></div><div></div></div></div>');
    $viewer.append('<h2>' + $obj.attr('title') + '</h2>');
    $viewer.append('<div id="ImageCanvas"></div>');
    $viewer.fadeIn();
    retrieveImages($obj);
}
function retrieveImages($obj) {
    var siteID = $obj.attr('siteid');
    var token = getToken();

    $.support.cors;
    if (token != null) {
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/GetImagesBySiteID?siteId=' + siteID,
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (jsonObj) {
                console.log('json images');
                console.log(jsonObj);
                populateImages(jsonObj.images);
                $('#Image-Loader').fadeOut(function () { $(this).remove(); });
            },
            error: function (x, y, z) {
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
function populateImages(images) {
    var $canvas = $('#ImageCanvas');
    if (images != null) {
        if (images.length > 0) {
            $.each(images, function (index, imageObj) {
                console.log(imageObj);
                var $img = $('<img />');
                $canvas.append($img);
                $img.on('load', function () {
                    var $wrap = $('<div class="imageWrap"></div>');
                    var $holder = $('<a target="_blank"></a>');
                    $holder.css({ 'background-image': 'url(' + $(this).attr('src') + ')' });
                    $holder.attr('href', $(this).attr('src'));
                    $wrap.append($holder);
                    $canvas.append($wrap);
                    $img.remove();
                    $wrap.hide().fadeIn();
                }).css({ height: 0, width: 0 }).attr('src', imageObj.fileURL);

            });
        } else
            $canvas.append('<p>There are no images at this time.</p>');
    } else
        $canvas.append('<p>There are no images at this time.</p>');

}

function openDetailView() {
    var $close = $('<p class="detail-close"><span class="top"></span><span class="bottom"></span></p>');
    $close.click(closeDetailView);
    var $viewer = $('<div class="detail-view"></div>');
    $viewer.append($close);
    $('body').append($viewer);

    return $viewer;
}
function closeDetailView() {
    mapcenter = null;
    map = null;

    $('div.detail-view').stop().fadeOut(function () { $(this).remove(); });
}

function setUpTable() {
    $('#Search-Type').change(updateSearchType);
    $('#Data-Type').change(populateSitesList);
    $('#HUC6-Basin').change(populateHUCWatersheds);
    $('#HUC10-Watershed').change(populateSitesList);
    $('#AWW-Watershed').change(populateSitesList);
    $('#AWW-Group').change(updateSitesViewByGroup);
    displayContentOverlay(true);
    retrieveSites();
}

$(window).on('load', function () {
    validateToken(setUpTable);
});