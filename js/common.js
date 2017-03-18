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
    var token = null;
    if (typeof (Storage) !== "undefined")
        token = window.localStorage.getItem('token');
    else
        token = checkCookie('token');
    return token;
}
function storeToken(token) {
    if (typeof (Storage) !== "undefined")
        localStorage.setItem('token', token);
    else
        setCookie('token', token);
}
function clearToken() {
    if (typeof (Storage) !== "undefined")
        localStorage.removeItem('token');
    else
        setCookie('token', '');
    location.href = "../../index.html?error=" + encodeURIComponent("Your session has expired.");
}
function clearTokenWithError(message) {
    if (typeof (Storage) !== "undefined")
        localStorage.removeItem('token');
    else
        setCookie('token', '');
    location.href = "../../index.html?error=" + encodeURIComponent(message);
}
function checkForToken(jsonObj) {
    if (jsonObj.hasOwnProperty('token')) {
        storeToken(jsonObj.token);
        return true;
    } else {
        clearToken();
        return false;
    }
}
function validateToken(callback) {
    token = getToken();

    if (token != null) {
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
                    storeToken(jsonObj.token);
                    if (typeof callback === "function")
                        callback();
                } else
                    clearToken();
            },
            error: function (x, y, z) {
                clearToken();
            }
        });
    } else
        clearToken();
}


function setUpAutoSave($form, keyName) {
    $form.find('input').blur(function () { storeFormLocally($form, keyName) });
    $form.find('textarea').blur(function () { storeFormLocally($form, keyName) });
    $form.find('select').change(function () { storeFormLocally($form, keyName) });
}
function loadLocallyStored(keyName) {
    if (typeof (Storage) !== "undefined") {
        var joinedArrayString = localStorage.getItem(keyName); // siteID is unique for every site
        if (joinedArrayString === null) {
            return false;
        } else {
            if (joinedArrayString.length > 0) {
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
                        if ($('#' + property).is('[type=checkbox]')) {
                            $('#' + property).prop('checked', formObject[property] == 'true');
                        } else if ($('#' + property).is('[type=radio]')) {
                            $('#' + property).prop('checked', formObject[property] == 'true');
                        } else {
                            // because naming is kept consistent we can:
                            $('#' + property).val(formObject[property]);
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        }
    }
}
function clearLocallyStoredForm(keyName) {
    if (typeof (Storage) !== "undefined")
        localStorage.removeItem(keyName);
}
function storeFormLocally($form, keyName) {
    if (typeof (Storage) !== "undefined") {
        // because there could be multiple incomplete/unsaved forms,
        // we will save as key = siteID, value = joined array with ',' delimit of key:value
        var inputArray = new Array();
        var $inputs = $form.find('input, select, textarea');
        $inputs.each(function () {
            var $input = $(this);
            if ($input.is('[type=checkbox]')) {
                inputArray.push($input.attr('id') + ':' + $input.prop('checked'));
            } else if ($input.is('[type=radio]')) {
                inputArray.push($input.attr('id') + ':' + $input.prop('checked'));
            } else {
                inputArray.push($input.attr('id') + ':' + encodeString($input.val()));
            }
        });
        localStorage.setItem(keyName, inputArray.join(','));
    }
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