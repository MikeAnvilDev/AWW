function redirectOnCompletion(validated) {
    console.log(validated);
    if (validated) {
        location.href = '../type/index.html';
    } else
        return false;
}

function validateToken(token) {
    var query = "?token=" + token;
    ajaxRequest = $.ajax({
        url: "../../response/validateToken.xml" + query,
        cache: false,
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        var $xml = $($.parseXML(data));
        if (checkStatus($xml)) {
            if ($xml.find("token").length > 0 && $xml.find("activeUser").length > 0) {
                if (convertToBoolean($xml.find("activeUser").text())) {
                    storeToken($xml.find("token").text());
                    $('#Welcome').text("Welcome " + $xml.find("FirstName").text() + ' ' + $xml.find("LastName").text());
                } else
                    alert('failed to be active'); //clearToken();
            } else
                alert('lack token and active'); //clearToken();
        } else
            alert('lack status'); //clearToken();

    }).fail(function () {
        alert('fail'); //clearToken();
    });
}
$(document).ready(function () {
    //// if token exists validate, else send to login
    //token = getToken();
    //if (token != null)
    //    validateToken(token);
    //else
    //    clearToken();
});