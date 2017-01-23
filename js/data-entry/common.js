function checkStatus(jsonObj) {
    if (jsonObj.hasOwnProperty('status')) {
        var status = jsonObj.status;
        return convertToBoolean(status);
    } else {
        alert('an error has occurred');
        return false;
    }
}


function checkCookie(key) {
    cookie = document.cookie;
    cookieValue = null;

    if (cookie != null) {
        var cookieKeyValues = cookie.split(';');
        for (var value = 0; value < cookieKeyValues.length; value++) {
            var cookieKeyValue = cookieKeyValues[value].split('=');
            if (cookieKeyValue[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '') == key) {
                if (cookieKeyValue[1].length > 0)
                    cookieValue = cookieKeyValue[1];
            }
        }
    }
    return cookieValue;
}
function setCookie(key, value) {
    var expDate = new Date();
    expDate.setDate(expDate.getDate() + 365);
    document.cookie = key + "=" + value + "; expires=" + expDate.toUTCString() + "; path=/";
}


function getToken() {
    console.log('common.js: getToken: retrieving token');
    var token = null;
    if (typeof (Storage) !== "undefined")
        token = window.localStorage.getItem('token');
    else
        token = checkCookie('token');
    console.log('common.js: getToken: token = ' + token);
    return token;
}
function storeToken(token) {
    console.log('common.js: storeToken: storing token');
    if (typeof (Storage) !== "undefined")
        localStorage.setItem('token', token);
    else
        setCookie('token', token);
}
function clearToken() {
    console.log('common.js: clearToken: clearing token');
    if (typeof (Storage) !== "undefined")
        localStorage.removeItem('token');
    else
        setCookie('token', '');

    location.href = "../login/index.html?error=" + encodeURIComponent("Your session has expired.");
}
function clearTokenWithError(message) {
    console.log('common.js: clearToken: clearing token');
    if (typeof (Storage) !== "undefined")
        localStorage.removeItem('token');
    else
        setCookie('token', '');

    location.href = "../login/index.html?error=" + encodeURIComponent(message);
}
function checkForToken(jsonObj) {
    console.log('common.js: checkForToken: check for token');
    if (jsonObj.hasOwnProperty('token')) {
        console.log('common.js: checkForToken: has token');
        storeToken(jsonObj.token);
        return true;
    } else {
        console.log('common.js: checkForToken: no token');
        clearToken();
        return false;
    }
}
function validateToken(callback) {
    console.log('common.js: validateToken: check token');
    token = getToken();

    if (token != null) {
        console.log('common.js: validateToken: has token');
        jQuery.support.cors = true;
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/ValidateToken',
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (jsonObj) {
                if (convertToBoolean(jsonObj.status)) {
                    console.log('common.js: validateToken: valid token');
                    storeToken(jsonObj.token);
                    if (typeof callback === "function") {
                        callback();
                    }
                } else
                    clearToken();
            },
            error: function (x, y, z) {
                clearToken();
            }
        });
    } else {
        console.log('common.js: validateToken: no token');
        clearToken();
    }
}


function setUpAutoSave($form, keyName) {
    //storeFormLocally($('#AwwSiteCode').val() + '-bacteria');
    console.log('common.js: setUpAutoSave');
    $form.find('input').blur(function () { console.log('common.js: setUpAutoSave:input fired, ' + keyName + ', ' + $form); storeFormLocally($form, keyName) });
    $form.find('textarea').blur(function () { console.log('common.js: setUpAutoSave: textarea fired, ' + keyName + ', ' + $form); storeFormLocally($form, keyName) });
    $form.find('select').change(function () { console.log('common.js: setUpAutoSave: select fired, ' + keyName + ', ' + $form); storeFormLocally($form, keyName) });
}
function loadLocallyStored(keyName) {
    console.log('common.js: loadLocallyStored: loading locally stored information');
    if (typeof (Storage) !== "undefined"){
        var joinedArrayString = localStorage.getItem(keyName); // siteID is unique for every site
        if (joinedArrayString === null) {
            console.log('common.js: loadLocallyStored: nothing locally stored');
            return false;
        } else {
            if (joinedArrayString.length > 0) {
                console.log('common.js: loadLocallyStored: something locally stored');
                // an incomplete form does exists
                var formObject = new Object();
                var inputArray = joinedArrayString.split(',');
                // break the string value into array of key:pair
                $.each(inputArray, function (increment, value) {
                    // loop through each item of the array and set the key:pair to the form object
                    var inputKeyValuePair = value.split(':');
                    formObject[inputKeyValuePair[0]] = decodeString(inputKeyValuePair[1]);
                });

                // use the form object to populate the form
                for (var property in formObject) {
                    if (formObject.hasOwnProperty(property)) {
                        console.log('common.js: loadLocallyStored: input id = ' + property);
                        if ($('#' + property).is('[type=checkbox]')) {
                            console.log('common.js: loadLocallyStored: populating checkbox');
                            $('#' + property).prop('checked', formObject[property] == 'true');
                        } else if ($('#' + property).is('[type=radio]')) {
                            console.log('common.js: loadLocallyStored: populating radio');
                            $('#' + property).prop('checked', formObject[property] == 'true');
                        } else {
                            console.log('common.js: loadLocallyStored: populating input');
                            // because naming is kept consistent we can:
                            $('#' + property).val(formObject[property]);
                        }
                    }
                }
                return true;
            } else {
                console.log('common.js: loadLocallyStored: nothing locally stored');
                return false;
            }
        }
    }else
        console.log('locally stored unavailable');
}
function clearLocallyStoredForm(keyName) {
    if (typeof (Storage) !== "undefined")
        localStorage.removeItem(keyName);
}
function storeFormLocally($form, keyName) {
    console.log('common.js: storeFormLocally: storing form');

    if (typeof (Storage) !== "undefined") {
        // because there could be multiple incomplete/unsaved forms,
        // we will save as key = siteID, value = joined array with ',' delimit of key:value
        var inputArray = new Array();
        var $inputs = $form.find('input, select, textarea');
        $inputs.each(function () {
            var $input = $(this);
            console.log('common.js: storeFormLocally: input id =' + $input.attr('id'));
            if ($input.is('[type=checkbox]')) {
                inputArray.push($input.attr('id') + ':' + $input.prop('checked'));
            } else if ($input.is('[type=radio]')) {
                inputArray.push($input.attr('id') + ':' + $input.prop('checked'));
            } else {
                inputArray.push($input.attr('id') + ':' + encodeString($input.val()));
            }
        });

        localStorage.setItem(keyName, inputArray.join(','));
        console.log('common.js: storeFormLocally: form stored');
        console.log(keyName + ': ' + localStorage.getItem(keyName));
    } else
        console.log('common.js: storeFormLocally: storage unavailable');
}


function convertToBoolean(value) {
    var value = value.toLowerCase();
    if (value == "ok" || value == "true" || value == "1" || value == "200")
        return true;
    else
        return false;
}
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return '';
}
function encodeString(string) {
    return string.replace(":", "%3A").replace(",", "%2C");
}
function decodeString(string) {
    return string.replace("%3A", ":").replace("%2C", ",");
}