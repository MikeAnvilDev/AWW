var supportsLocalStorage = false;

function submitForm(button, validated) {
    console.log('form-submission.js: submitForm');
    var $button = $(button);
    var $form = $button.closest('form.ml-validation');
    console.log('form-submission.js: submitForm: ' + $form.serialize());


    


    $.support.cors;
    var token = getToken();
    console.log('form-submission.js: submitForm: token = ' + token);
    var formData = $form.serialize();
    console.log('form-submission.js: submitForm: formData = ' + formData);

    //$.ajax({
    //    url: $form.attr('ml-post-to'),
    //    type: 'POST',
    //    headers: { 'Authorization': 'Bearer ' + token },
    //    data: formData,

    //    contentType: 'application/json',
    //    dataType: 'json',

    //    cache: false,
    //    success: function (data) {
    //        clearLocallyStoredForm($('#AwwSiteCode').val() + '-bacteria');
    //        $form.hide();
    //        $('main').append('<div>Data Entry Completed Successfully</div>');
    //    },
    //    error: function (x, y, z) {
    //        console.log(x);
    //    }
    //});



    //$.ajax({
    //    url: $form.attr('ml-post-to'),
    //    data: formData,
    //    cache: false,
    //    processData: false,
    //    contentType: false,
    //    type: 'POST',
    //    headers: {
    //        'token': 'token'
    //    },
    //    success: function (data) {
    //        // clear form locally
    //        clearLocallyStoredForm($('#AwwSiteCode').val() + '-bacteria');
    //        $('form').hide();
    //        $('main').append('<div>Data Entry Completed Successfully</div>');
    //    },
    //    error: function (jqXHR, exception) {
    //        var msg = '';
    //        if (jqXHR.status === 0) {
    //            msg = 'Not connect.\n Verify Network.';
    //        } else if (jqXHR.status == 404) {
    //            msg = 'Requested page not found. [404]';
    //        } else if (jqXHR.status == 500) {
    //            msg = 'Internal Server Error [500].';
    //        } else if (exception === 'parsererror') {
    //            msg = 'Requested JSON parse failed.';
    //        } else if (exception === 'timeout') {
    //            msg = 'Time out error.';
    //        } else if (exception === 'abort') {
    //            msg = 'Ajax request aborted.';
    //        } else {
    //            msg = 'Uncaught Error.\n' + jqXHR.responseText;
    //        }
    //    }
    //});

}




