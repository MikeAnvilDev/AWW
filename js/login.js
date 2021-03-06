﻿function getUserToken(validated) {
    if (validated) {
        var username = $('#Username').val();
        var password = $('#Password').val();
        var query = "?username=" + username + '&password=' + password;
        $.support.cors;

        ajaxRequest = $.ajax({
            url: 'https://msapps.acesag.auburn.edu/acesauth/aww/token',
            dataType: 'json',
            type: 'POST',
            crossDomain: true,
            contentType: 'application/json',
            dataType: 'json',
            data: { 'grant_type': 'password', 'username': username, 'password': password, 'client_id': '150c58294e8a408dae9f115a9d2185c2' },
            cache: false,
            success: function (jsonObj) {
                if (jsonObj.hasOwnProperty('access_token')) {
                    storeToken(jsonObj.access_token);
                    location.href = 'data/type/index.html';
                }
            },
            error: function (xhrObj, textStatus, errorThrown) {
                displayContentOverlay(false);

                var message = "An error has occurred with your login credentials.";

                if (xhrObj.hasOwnProperty('responseText')) {
                    reponseObj = jQuery.parseJSON(xhrObj.responseText);
                    message = reponseObj.error_description;
                }

                $('#Username').addClass('ml-alert');
                $('#Password').addClass('ml-alert');
                var $errorMessageContainer = $('.ml-val-container');
                var $errorMessage = $errorMessageContainer.find('.ml-val-message');
                if ($errorMessage.length == 0) {
                    $errorMessage = $('<p class="ml-val-message"></p>');
                    $errorMessage.prependTo($errorMessageContainer);
                }
                $errorMessage.append(message + ' ');
            }
        });
    }
}
function redirectToType() {
    location.href = 'data/type/index.html';
}
function logout(message) {
    if (typeof (Storage) !== "undefined")
        localStorage.removeItem('token');
    else
        setCookie('token', '');
    location.href = "index.html?error=" + encodeURIComponent(message);
}


function validateExistingToken(callback) {
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
                    clearExpiredToken();
            },
            error: function (x, y, z) {
                clearExpiredToken();
            }
        });
    } else
        clearExpiredToken();
}
function clearExpiredToken() {
    if (typeof (Storage) !== "undefined")
        localStorage.removeItem('token');
    else
        setCookie('token', '');
}

$(document).ready(function () {
    if (getQueryVariable('logout').length > 0)
        logout('You have successfully logged out.');
    else {
        var message = getQueryVariable('error');
        if (getQueryVariable('error').length > 0) {
            var $errorMessageContainer = $('.ml-val-container');
            var $errorMessage = $errorMessageContainer.find('.ml-val-message');
            if ($errorMessage.length == 0) {
                $errorMessage = $('<p class="ml-val-message"></p>');
                $errorMessage.prependTo($errorMessageContainer);
            }
            $errorMessage.append(decodeURIComponent(message));
        }

        // if token exists validate
        token = getToken();
        if (token != null)
            validateExistingToken(redirectToType);
    }
});