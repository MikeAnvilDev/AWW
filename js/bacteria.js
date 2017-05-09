var storedKeyName = null;

function loadData() {
    token = getToken();
    var decodedToken = jwt_decode(token);
    $('#SubmitterContactId').val(decodedToken.role[2]);
    $('div.authorization h2').text('Submitted by: ' + decodedToken.role[1]);
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
    $('#EColi1, #EColi2, #EColi3, #ColonyCount1, #ColonyCount2, #ColonyCount3').keyup(calculateColiformAverage);
    $('#EColi1, #EColi2, #EColi3, #ColonyCount1, #ColonyCount2, #ColonyCount3').blur(calculateColiformAverage);

    $('#SampleDate, #SampleTime').keyup(combineDateTime);
    $('#SampleDate, #SampleTime').blur(combineDateTime);

    $('#CertificationConfirmation').click(updateAuthorization);
}

function calculateColiformAverage() {
    var ecoliTotal = 0;
    var ecoliCount = 0;
    var $ecoli1 = $('#EColi1');
    var $ecoli2 = $('#EColi2');
    var $ecoli3 = $('#EColi3');
    if ($ecoli1.val().length > 0) {
        ecoli1 = parseInt($ecoli1.val());
        ecoliTotal += ecoli1;
        ecoliCount++;
    }
    if ($ecoli2.val().length > 0) {
        ecoli2 = parseInt($ecoli2.val());
        ecoliTotal += ecoli2;
        ecoliCount++;
    }
    if ($ecoli3.val().length > 0) {
        ecoli3 = parseInt($ecoli3.val());
        ecoliTotal += ecoli3;
        ecoliCount++;
    }
    var ecoliAvg = "";
    if (ecoliCount > 0) {
        ecoliAvg = Math.ceil(ecoliTotal / ecoliCount);
    }
    $('#ttlecoli').val(ecoliAvg);

    var ocoliTotal = 0;
    var ocoliCount = 0;
    var $ocoli1 = $('#ColonyCount1');
    var $ocoli2 = $('#ColonyCount2');
    var $ocoli3 = $('#ColonyCount3');
    if ($ocoli1.val().length > 0) {
        ocoli1 = parseInt($ocoli1.val());
        ocoliTotal += ocoli1;
        ocoliCount++;
    }
    if ($ocoli2.val().length > 0) {
        ocoli2 = parseInt($ocoli2.val());
        ocoliTotal += ocoli2;
        ocoliCount++;
    }
    if ($ocoli3.val().length > 0) {
        ocoli3 = parseInt($ocoli3.val());
        ocoliTotal += ocoli3;
        ocoliCount++;
    }
    var ocoliAvg = "";
    if (ocoliCount > 0) {
        ocoliAvg = Math.ceil(ocoliTotal / ocoliCount);
    }
    $('#ttlocoli').val(ocoliAvg);
}
function combineDateTime() {
    var date = $('#SampleDate').val();
    var time = $('#SampleTime').val();
    if (date.length > 0 && time.length > 0)
        $('#SampleDateTime').val(date + ' ' + time);
    else
        $('#SampleDateTime').val('');
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
                var $input = $('<input type="checkbox" value="' + monitor.contactID + '" name="MonitorIDs" ml-val ml-val-required="true" ml-val-label="A monitor is required."/>');
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
function loadBacteria() {
    loadData();
    setUpCalculations();
    loadMonitors();
    loadExistingImages();
}
function loadAutoSaveAndLocal() {
    storedKeyName = $('#AwwSiteCode').val() + '-bacteria';
    loadLocallyStored(storedKeyName);
    setUpAutoSave($('form.ml-validation'), storedKeyName);
    updateMonitors();
    updateAuthorization();
}

$(window).on('load', function () {
    validateToken(loadBacteria);
    //test();
});

function submitBactForm(button, validated) {
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
                clearLocallyStoredForm(siteCode + '-bacteria');

                displayContentOverlay(false);
                $('#Success-Section').show();
            },
            error: function (x, y, z) {
                displayErrorMessage(true, 'An error has occurred.  Bacteria data could not be submitted.  Your entry is saved and can be submitted at a later time.');
                displayContentOverlay(false);
            }
        });
    } else {
        displayContentOverlay(false);
    }
}
function test() {
    $('form.ml-validation').hide();
    $('#Success-Section').show();

}
