var supportsLocalStorage = false;
function loadSiteInformation() {
    // get monitor and site info via ajax to api
    var groupName = 'Group Name';
    var groupAbbrev = 'Group Abbreviation';
    var collectors = 'Eric Reutebuch';
    var awwSiteCode = '10025046';
    var watershed = 'Warrior';
    var waterbodyName = 'Rock Creek';
    var HUC11 = '031601100403';
    var county = 'Winston';
    var state = 'AL';
    $('#groupName').val(groupName);
    $('#groupAbbrev').val(groupAbbrev);
    $('#collectors').val(collectors);
    $('#awwSiteCode').val(awwSiteCode);
    $('#watershed').val(watershed);
    $('#waterbodyName').val(waterbodyName);
    $('#HUC11').val(HUC11);
    $('#county').val(county);
    $('#state').val(state);

    // check for incomplete test
    // check local storage for siteCode
    var hasLocallyStored = false;

    var testID = getQueryVariable('testID');
    if (testID.length > 0)
        loadTestInformation();
    else {
        // instate date and time
        // reveal test input form
    }
}
function loadTestInformation() {
    // gettest info via ajax to api
    var groupName = 'Group Name';
}
function loadLocallyStored(siteID) {
    if (supportsLocalStorage) {
        var joinedArrayString = localStorage.getItem(siteID); // siteID is unique for every site
        if (joinedArrayString.length > 0) {
            // an incomplete form does exists
            var formObject = new Object();
            var inputArray = joinedArrayString.split(',');
            // break the string value into array of key:pair
            $.each(inputArray, function (value) {
                // loop through each item of the array and set the key:pair to the form object
                var inputKeyValuePair = value.split(':');
                formObject[inputKeyValuePair[0]] = inputKeyValuePair[1];
            });

            // use the form object to populate the form
            for (var property in formObject) {
                if (formObject.hasOwnProperty(property)) {
                    // because naming is kept consistent we can:
                    $('#' + property).val(formObject[property]);
                }
            }

            // radio button groups have a hidden field for api form submission, 
            // so we need to find the radio button by the hidden field value
            $("input[name='WaterbodyConditionIdGroup'][value=" + $('#WaterbodyConditionId').val() + "]").prop('checked', true);
            $("input[name='TideIdGroup'][value=" + $('#TideId').val() + "]").prop('checked', true);
        }
    }


}

function storeFormLocally() {
    var siteID = "asdasd";
    if (supportsLocalStorage) {
        // because there could be multiple incomplete/unsaved forms,
        // we will save as key = siteID, value = joined array with ',' delimit of key:value
        var inputArray = new Array();
        inputArray.push('sampleDate,' + encodeString($('#sampleDate').val()));
        inputArray.push('sampleTime,' + encodeString($('#sampleTime').val()));
        inputArray.push('WaterbodyConditionId,' + encodeString($('#WaterbodyConditionId').val()));
        inputArray.push('TideId,' + encodeString($('#TideId').val()));

        localStorage.setItem(siteID, inputArray.join(','));
    }
}
function clearLocallyStoredForm() {

}




