function getUserToken(validated) {
    if (validated) {

        var username = $('#Username').val();
        var password = $('#Password').val();
        var query = "?username=" + username + '&password=' + password;
        $.support.cors;
        console.log('login.js: getUserToken: retrieving token');

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

                console.log('login.js: getUserToken: ajax success');
                console.log(jsonObj);
                if (jsonObj.hasOwnProperty('access_token')) {
                    console.log(jsonObj.access_token);
                    storeToken(jsonObj.access_token);
                    location.href = '../type/index.html';
                } 
            },
            error: function (xhrObj, textStatus, errorThrown) {
                console.log('login.js: getUserToken: ajax error');
                console.log(xhrObj);
                var message = "An error has occurred with your login credentials.";

                if (xhrObj.hasOwnProperty('responseText')) {
                    reponseObj = jQuery.parseJSON(xhrObj.responseText);
                    console.log(reponseObj);
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
function validateToken(token) {
    //var query = "?token=" + token;
    //ajaxRequest = $.ajax({
    //    url: "../../response/validateToken.xml" + query,
    //    cache: false,
    //    beforeSend: function (xhr) {
    //        xhr.overrideMimeType("text/plain; charset=x-user-defined");
    //    }
    //}).done(function (data) {
    //    var $xml = $($.parseXML(data));
    //    if (checkStatus($xml)) {
    //        if ($xml.find("token").length > 0 && $xml.find("activeUser").length > 0) {
    //            if (convertToBoolean($xml.find("activeUser").text())) {
    //                storeToken($xml.find("token").text());
    //                location.href = '../type/index.html';
    //            }else
    //                clearToken();
    //        } else
    //            clearToken();
    //    } else 
    //        clearToken();

    //}).fail(function () {
    //    clearToken();
    //});
}


$(document).ready(function () {
    if (getQueryVariable('logout').length > 0)
        clearTokenWithError('You have successfully logged out.');
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
        validateToken(token);

});