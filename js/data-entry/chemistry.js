var storedKeyName = null;

function loadData() {
    console.log('chemistry.js: loadData');
    $('#Groupid').val(decodeURIComponent(getQueryVariable('Groupid')));
    $('#Group_Name').val(decodeURIComponent(getQueryVariable('Group_Name')));
    $('#Group_Abbreviation').val(decodeURIComponent(getQueryVariable('Group_Abbreviation')));
    $('#AwwSiteCode').val(decodeURIComponent(getQueryVariable('AwwSiteCode')));
    $('#WebMasterSiteId').val(decodeURIComponent(getQueryVariable('WebMasterSiteId')));
    $('#Watershed').val(decodeURIComponent(getQueryVariable('Watershed'))); // missing
    $('#Waterbody_Name').val(decodeURIComponent(getQueryVariable('Waterbody_Name')));
    $('#HUC11').val(decodeURIComponent(getQueryVariable('HUC11')));
    $('#HUC8').val(decodeURIComponent(getQueryVariable('HUC8')));
    $('#HUC6').val(decodeURIComponent(getQueryVariable('HUC6')));
    $('#HUC4').val(decodeURIComponent(getQueryVariable('HUC4')));
    $('#county').val(decodeURIComponent(getQueryVariable('county')));
    $('#state').val(decodeURIComponent(getQueryVariable('state'))); // missing
    $('#SamplingSiteLocation').val(decodeURIComponent(getQueryVariable('SamplingSiteLocation')));
}
function setUpCalculations() {
    console.log('chemistry.js: setUpCalculations');
    $('#DO1').keyup(calculateAverageDO);
    $('#DO1').blur(calculateAverageDO);
    $('#DO2').keyup(calculateAverageDO);
    $('#DO2').blur(calculateAverageDO);

    $('#SampleDate').keyup(combineDateTime);
    $('#SampleDate').blur(combineDateTime);
    $('#SampleTime').keyup(combineDateTime);
    $('#SampleTime').blur(combineDateTime);

    $('#Alkalinity').keyup(calculateAlkalinity);
    $('#Alkalinity').blur(calculateAlkalinity);

    $('#Hardness').keyup(calculateHardness);
    $('#Hardness').blur(calculateHardness);

    $('#Turb1').keyup(calculateTurbity);
    $('#Turb1').blur(calculateTurbity);
    $('#Turb2').keyup(calculateTurbity);
    $('#Turb2').blur(calculateTurbity);

    $('#CertificationConfirmation').click(updateAuthorization);
}

function calculateAverageDO() {
    var do1 = $('#DO1').val();
    if (do1.length > 0) {
        if (validateDecimal(do1))
            do1 = 0;
    } else
        do1 = 0;
    do1 = parseFloat(do1);

    var do2 = $('#DO2').val();
    if (do2.length > 0) {
        if (validateDecimal(do2))
            do2 = 0;
    } else
        do2 = 0;
    do2 = parseFloat(do2);

    var averageDO = 0;
    if (Math.abs(do2 - do1) > 6) {
        averageDO = '';
    } else
        averageDO = (do1 + do2) / 2;

    $('#AvgDo').val(averageDO);
    console.log('#AvgDo = ' + $('#AvgDo').val());
}
function calculateAlkalinity() {
    var drops = $('#Alkalinity').val();
    if (drops.length > 0) {
        if (validateDecimal(drops))
            drops = 0;
    } else
        drops = 0;

    var alkalinityMGperLiter = drops * 5;
    $('#Alkalinity-calculated').val(alkalinityMGperLiter);
}
function calculateHardness() {
    var drops = $('#Hardness').val();
    if (drops.length > 0) {
        if (validateDecimal(drops))
            drops = 0;
    } else
        drops = 0;

    var HardnessMGperLiter = drops * 10;
    $('#Hardness-calculated').val(HardnessMGperLiter);
}
function calculateTurbity() {
    var resultsVolume1 = $('#Turb1').val();
    if (resultsVolume1.length > 0) {
        if (validateDecimal(resultsVolume1))
            drops1 = 0;
    } else
        resultsVolume1 = 0;
    var sampleVolume = 50;
    var JTU = 50 / sampleVolume * 5 * resultsVolume1;
    $('#Turb1-calculated').val(JTU);

    var resultsVolume2 = $('#Turb2').val();
    if (resultsVolume2.length > 0) {
        if (validateDecimal(resultsVolume2))
            resultsVolume2 = 0;
    } else
        resultsVolume2 = 0;
    sampleVolume = 25;
    JTU = 50 / sampleVolume * 5 * resultsVolume2;
    $('#Turb2-calculated').val(JTU);
}

function validateDecimal(value) {
    return (value.search(/^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/) == -1);
}
function combineDateTime() {
    var date = $('#SampleDate').val();
    var time = $('#SampleTime').val();
    if (date.length > 0 && time.length > 0)
        $('#SampleDateTime').val(date + ' ' + time);
    else
        $('#SampleDateTime').val('');
    console.log('#SampleDateTime = ' + $('#SampleDateTime').val());
}

function updateMonitors() {
    var $monitors = $('#Monitors ul li input');
    $.each($monitors, function () {
        var $monitor = $(this);
        if ($monitor.prop('checked'))
            $monitor.closest('label').addClass('highlite');
        else
            $monitor.closest('label').removeClass('highlite');
    });
}
function updateAuthorization() {
    console.log('updateAuthorization');
    var $confirm = $('#CertificationConfirmation');
    console.log('updateAuthorization' + $confirm.length);
    console.log('updateAuthorization' + $confirm.prop('checked'));
    if ($confirm.prop('checked')) 
        $confirm.closest('div.authorization').addClass('highlite');
    else 
        $confirm.closest('div.authorization').removeClass('highlite');
}

function loadMonitors() {
    console.log('chemistry.js: loadMonitors: retrieving monitors');
    $.support.cors = true;
    var token = getToken();
    $.ajax({
        url: 'https://msapps.acesag.auburn.edu/aww/api/home/GetSiteMonitors',
        dataType: 'json',
        type: 'GET',
        data: { 'id': $('#WebMasterSiteId').val() },
        contentType: 'application/json',
        headers: { 'Authorization': 'Bearer ' + token },
        cache: false,
        success: function (jsonObj) {
            console.log('chemistry.js: loadMonitors: ajax success');
            var $Monitors = $('#Monitors ul');
            $.each(jsonObj.monitors, function (index, monitor) {
                var $li = $('<li></li>');
                var $label = $('<label>' + monitor.firstName + ' ' + monitor.lastName + '</label>');
                var $input = $('<input type="checkbox" value="' + monitor.contactID + '" name="MonitorIDs" ml-val ml-val-required="true" ml-val-label="A monitor is required."/>');
                $input.click(updateMonitors);
                $Monitors.append($li);
                $li.append($label);
                $label.append($input);
                $Monitors.find()
            });
        },
        error: function (x, y, z) {
            console.log(x);
        }
    });
}
function loadChemistry() {
    loadData();
    setUpCalculations();

    loadMonitors();

    storedKeyName = $('#AwwSiteCode').val() + '-chemistry';
    loadLocallyStored(storedKeyName);
    setUpAutoSave($('form.ml-validation'), storedKeyName);
}

$(document).ready(function () {
    validateToken(loadChemistry);
});


function addOverlay() {
    var $overlay = $('main div.overlay');
    if ($overlay.length > 0)
        $overlay.remove();
    $overlay = $('<div class="overlay"></div>');
    $('main').append($overlay);
    $overlay.animate({ opacity: 1 });
}
function removeOverlay() {
    var $overlay = $('main div.overlay');
    if ($overlay.length > 0) {
        $overlay.animate({ opacity: 0 }, function () {
            $overlay.remove();
        });
    }
}
function submitChemForm(button, validated) {
    addOverlay();
    console.log('chemistry.js: submitChemForm');
    if (validated) {
        console.log('chemistry.js: submitChemForm: valid');
        var $button = $(button);
        var $form = $button.closest('form.ml-validation');

        $.support.cors;
        var token = getToken();
        console.log('chemistry.js: submitChemForm: token = ' + token);
        var formData = $form.serialize();
        console.log('chemistry.js: submitChemForm: formData = ' + formData);
        var postToUrl = $form.attr('ml-post-to');

        $.ajax({
            url: postToUrl,
            type: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            data: formData,
            dataType: 'json',

            cache: false,
            success: function (data) {
                var siteCode = $('#AwwSiteCode').val();
                $form.empty();
                clearLocallyStoredForm(siteCode + '-chemistry');
                removeOverlay();
                $('#Success-Section').show();
                console.log(data);
            },
            error: function (x, y, z) {
                console.log(x);
            }
        });
    } else {
        console.log('chemistry.js: submitChemForm: not valid');
        removeOverlay();
    }


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