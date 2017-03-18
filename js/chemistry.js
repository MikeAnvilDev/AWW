var storedKeyName = null;

function loadData() {
    token = getToken();
    var decodedToken = jwt_decode(token);
    $('#SubmitterContactId').val(decodedToken.role[1]);
    $('div.authorization h2').text('Submitted by: ' + decodedToken.role[2]);
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
    $('#DO1, #DO2').keyup(calculateAverageDO);
    $('#DO1, #DO2').blur(calculateAverageDO);

    $('#SampleDate, #SampleTime').keyup(combineDateTime);
    $('#SampleDate, #SampleTime').blur(combineDateTime);

    $('#Alkalinity').keyup(calculateAlkalinity);
    $('#Alkalinity').blur(calculateAlkalinity);

    $('#Hardness').keyup(calculateHardness);
    $('#Hardness').blur(calculateHardness);

    $('#Turb1, #Turb2').keyup(calculateTurbity);
    $('#Turb1, #Turb2').blur(calculateTurbity);

    $('#CertificationConfirmation').click(updateAuthorization);

    $('#TurbiditySampleSize').on('change', function () { updateTurbidity(); });
}
function updateTurbidity() {
    $('#Turb50').css({clear: 'both', overflow: 'hidden'}).slideUp();
    $('#Turb25').css({ clear: 'both', overflow: 'hidden' }).slideUp();
    if ($('#TurbiditySampleSize').val() == '50') {
        $('#Turb50').stop().slideDown();
        $('#Turb25 input').val('');
    }
    if ($('#TurbiditySampleSize').val() == '25') {
        $('#Turb25').stop().slideDown();
        $('#Turb50 input').val('');
    }
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
    if (Math.abs(do2 - do1) > .6) {
        averageDO = '';
    } else
        averageDO = (do1 + do2) / 2;

    $('#AvgDo').val(averageDO);
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
}

function specificGravityValidation() {
    // nearest .5
    var error = "";
    if ($('#SG').val().length > 0) {
        $('#SG').val($('#SG').val().trim());
        var gravity = parseFloat($('#SG').val());
        if (gravity * 10 % 5 != 0)
            error = "Please record Specific Gravity to the nearest .5.";
    }
    return error;
}
function hardnessValidation() {
    // if salinity present, no hardness test
    var error = "";
    if ($('#Salinity').val().length > 0) {
        if ($('#Hardness').val().length > 0) {
            error = "Salinity is present so do not enter hardness test.";
        }
    }
    return error;
}
function DOValidation(do1) {
    // DO should be nearest .2
    // DO1 and DO2 should be within .6
    var error = "";

    if (do1) {
        if ($('#DO1').val().length > 0) {
            $('#DO1').val($('#DO1').val().trim());
            var dissolved = parseFloat($('#DO1').val());
            console.log("do1 = " + dissolved);
            console.log("do1 = " + (dissolved * 10 % 2));
            if (dissolved * 10 % 2 != 0)
                error = "Please record Dissolved Oxygen Rep #1 to the nearest .2.";
        }
    } else {
        if ($('#DO2').val().length > 0) {
            $('#DO2').val($('#DO2').val().trim());
            var dissolved = parseFloat($('#DO2').val());
            if (dissolved * 10 % 2 != 0)
                error = "Please record Dissolved Oxygen Rep #2 to the nearest .2.";
        }
        if ($('#DO1').val().length > 0 && $('#DO2').val().length > 0) {
            var dissOxy1 = parseFloat($('#DO1').val());
            var dissOxy2 = parseFloat($('#DO2').val());
            if (Math.abs(dissOxy2 - dissOxy1) > .6) {
                error = "Dissolved Oxygen results 1 and 2 should be with 0.6.";
            }
        }
    }

    return error;
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
    var $confirm = $('#CertificationConfirmation');
    if ($confirm.prop('checked'))
        $confirm.closest('div.authorization').addClass('highlite');
    else
        $confirm.closest('div.authorization').removeClass('highlite');
}

function loadMonitors() {
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
            var $Monitors = $('#Monitors ul');
            $.each(jsonObj.monitors, function (index, monitor) {
                var $li = $('<li></li>');
                var $label = $('<label>' + monitor.firstName + ' ' + monitor.lastName + '</label>');
                if(index == 0)
                    var $input = $('<input id="Monitor_' + monitor.contactID + '" type="checkbox" value="' + monitor.contactID + '" name="MonitorIDs" ml-val ml-val-required="true" ml-val-label="A monitor is required."/>');
                else
                    var $input = $('<input id="Monitor_' + monitor.contactID + '" type="checkbox" value="' + monitor.contactID + '" name="MonitorIDs" />');
                $input.click(updateMonitors);
                $Monitors.append($li);
                $li.append($label);
                $label.append($input);
                loadAutoSaveAndLocal();
            });
        },
        error: function (x, y, z) {
            displayErrorMessage(true, 'An error has occurred.  No monitors for this site were found.  Your entry will be saved, but monitors must be added to submit.');
        }
    });
}
function loadChemistry() {
    loadData();
    setUpCalculations();
    loadMonitors();
}
function loadAutoSaveAndLocal() {
    storedKeyName = $('#AwwSiteCode').val() + '-chemistry';
    loadLocallyStored(storedKeyName);
    setUpAutoSave($('form.ml-validation'), storedKeyName);
    updateMonitors();
    updateAuthorization();
}

$(window).on('load', function () {
    validateToken(loadChemistry);
});

function submitChemForm(button, validated) {
    displayContentOverlay(true);
    if (validated) {
        var $button = $(button);
        var $form = $button.closest('form.ml-validation');

        $.support.cors;
        var token = getToken();
        var formData = $form.serialize();
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
                $form.hide();
                clearLocallyStoredForm(siteCode + '-chemistry');

                displayContentOverlay(false);
                $('#Success-Section').show();
            },
            error: function (x, y, z) {
                displayErrorMessage(true, 'An error has occurred.  Chemistry data could not be submitted.  Your entry is saved and can be submitted at a later time.');
                displayContentOverlay(false);
            }
        });
    } else {
        displayContentOverlay(false);
    }
}