function validateForm(button) {
    var $button = $(button);
    var $form = $button.closest('form.ml-validation');
    var $section = $form.closest('section');

    // remove all error messaging for the form
    $('.ml-alert').removeClass('ml-alert');
    $('.ml-val-message').remove();

    var $firstError = null;
    var $fields = $('input, select, textarea');
    $fields.each(function () {
        var $field = $(this);
        if ($field.is('input')) {
            if ($field.is('[ml-val]')) {
                // field requires validation
                var validated = validateInputField($field);
                if (!validated && $firstError == null)
                    $firstError = $field;
            }
        } else if ($field.is('select')) {
            if ($field.is('[ml-val]')) {
                // field requires validation
                var validated = validateSelectField($field);
                if (!validated && $firstError == null)
                    $firstError = $field;
            }
        } 
    });

    if ($firstError != null) {
        $('body').animate({ scrollTop: ($firstError.closest('.ml-val-container').position().top - 60) });
        return false;
    } else
        return true;    
}

function validateInputField($field) {
    var validated = true;

    // trim the white-space
    $field.val($field.val().replace(/^\s+|\s+$/g, ''));
    var required = false;
    if ($field.is('[ml-val-required]'))
        required = $field.attr('ml-val-required') == 'true';
    if (required || $field.val().length > 0) {
        // field is required OR field has a value and has been set to validate
        // get the field type
        var type = "";
        if ($field.is('[ml-val-type]'))
            type = $field.attr('ml-val-type');
        // get the field format
        var format = "";
        if ($field.is('[ml-val-format]'))
            format = $field.attr('ml-val-format');
        // get the maximum
        var max = "";
        if ($field.is('[ml-val-max]'))
            max = $field.attr('ml-val-max');
        // get the minimum
        var min = "";
        if ($field.is('[ml-val-min]'))
            min = $field.attr('ml-val-min');
        // get the label
        var label = "";
        if ($field.is('[ml-val-label]'))
            label = $field.attr('ml-val-label');
        var msg = "";

        if (type == 'text') {
            msg = validateText($field.val(), label, min);
        }
        if (type == 'number') {
            msg = validateNumber($field.val(), label, format, max, min);
        }
        if (type == 'date') {
            msg = validateDate($field.val(), label, max, min);
        }
        if (type == 'time') {
            msg = validateTime($field.val(), label, max, min);
        }
        if ($field.is('[type=checkbox]')){
            msg = validateCheckbox($field, label);
        }
        if (msg.length > 0) {
            validated = false;
            $field.addClass('ml-alert');
            var $errorMessageContainer = $field.closest('.ml-val-container');
            var $errorMessage = $errorMessageContainer.find('.ml-val-message');
            if ($errorMessage.length == 0) {
                $errorMessage = $('<p class="ml-val-message"></p>');
                $errorMessage.prependTo($errorMessageContainer);
            }
            $errorMessage.append(msg + ' ');
        }
    }
    return validated;
}
function validateSelectField($field) {
    var validated = true;

    var required = false;
    if ($field.is('[ml-val-required]'))
        required = $field.attr('ml-val-required') == 'true';
    // get the label
    var label = "";
    if ($field.is('[ml-val-label]'))
        label = $field.attr('ml-val-label');
    // get the invalid indices
    var invalidIndexes = "";
    if ($field.is('[ml-val-invalid-indexes]'))
        invalidIndexes = $field.attr('ml-val-invalid-indexes');
    if (required) {
        var msg = validateSelect($field[0], label, invalidIndexes);
        if (msg.length > 0) {
            validated = false;
            $field.addClass('ml-alert');
            var $errorMessageContainer = $field.closest('.ml-val-container');
            var $errorMessage = $errorMessageContainer.find('.ml-val-message');
            if ($errorMessage.length == 0) {
                $errorMessage = $('<p class="ml-val-message"></p>')
                $errorMessage.prependTo($errorMessageContainer);
            }
            $errorMessage.append(msg + ' ');
        }
    }

    return validated;
}

function validateCheckbox($field) {
    console.log('form-validation.js: validateCheckbox');
    var validated = true;

    var required = false;
    if ($field.is('[ml-val-required]'))
        required = $field.attr('ml-val-required') == 'true';
    // get the label
    var label = "";
    if ($field.is('[ml-val-label]'))
        label = $field.attr('ml-val-label');

    console.log('form-validation.js: validateCheckbox required = ' + required);

    if (required) {
        // gather all of the same name in case of list
        var fieldName = $field.attr('name');
        var checkboxes = $('input[type=checkbox][name=' + fieldName + ']:checked');
        console.log('form-validation.js: validateCheckbox checked boxes = ' + checkboxes.length);
        if (checkboxes.length == 0) {
            validated = false;
            var $errorMessageContainer = $field.closest('.ml-val-container');
            var $errorMessage = $errorMessageContainer.find('.ml-val-message');
            if ($errorMessage.length == 0) {
                $errorMessage = $('<p class="ml-val-message"></p>')
                $errorMessage.prependTo($errorMessageContainer);
            }
            $errorMessage.append(label + ' ');
        }
    }

    return validated;
}
function validateText(value, label, type, minLength) {
    var error = "";
    value = value.trim();
    if (value.length == 0) {
        error = "Please a value for " + label + ".";
    }
    else if (value.length < minLength) {
        error = "Please a value for " + label + " that is at least " + minLength + " character" + (minLength != 1 ? "s" : "") + ".";
    }
    return error;
}
function validateNumber(value, label, type, maximum, minimum) {
    var error = "";
    if (type == "integer") {
        if (value.search(/^\s*(\+|-)?\d+\s*$/) == -1) {
            if (value.length > 0)
                error = "Please a valid integer value for " + label + ".";
            else
                error = "Please enter an integer value for " + label + ".";
        } else {
            var integer = parseInt(value);
            if (maximum.length > 0 && minimum.length > 0) {
                if (integer > maximum || integer < minimum)
                    error = "Please enter an integer value for " + label + " between " + minimum + " and " + maximum + ".";
            } else if (maximum.length > 0) {
                if (integer > maximum)
                    error = "Please enter an integer value for " + label + " less than or equal to " + maximum + ".";
            } else if (minimum.length > 0) {
                if (integer < minimum)
                    error = "Please enter an integer value for " + label + " greater than or equal to " + minimum + ".";
            }
        }
    } else if (type == "decimal") {
        if (value.search(/^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/) == -1) {
            if (value.length > 0)
                error = "Please enter a valid decimal value for " + label + ".";
            else
                error = "Please enter a decimal value for " + label + ".";
        } else {
            var decimal = parseFloat(value);
            if (maximum.length > 0 && minimum.length > 0) {
                if (decimal > maximum || decimal < minimum)
                    error = "Please enter a decimal value for " + label + " between " + minimum + " and " + maximum + ".";
            } else if (maximum.length > 0) {
                if (decimal > maximum)
                    error = "Please enter a decimal value for " + label + " less than or equal to " + maximum + ".";
            } else if (minimum.length > 0) {
                if (decimal < minimum)
                    error = "Please enter a decimal value for " + label + " greater than or equal to " + minimum + ".";
            }
        }
    } else if (type == "currency") {
        if (value.search(/^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/) == -1) {
            if (value.length > 0)
                error = "Please enter a valid dollar amount for " + label + ".";
            else
                error = "Please enter a dollar amount for " + label + ".";
        } else {
            var money = parseFloat(value);
            if (maximum.length > 0 && minimum.length > 0) {
                if (money > maximum || money < minimum)
                    error = "Please enter a dollar amount for " + label + " between " + minimum + " and " + maximum + ".";
            } else if (maximum.length > 0) {
                if (decimal > maximum)
                    error = "Please enter a dollar amount for " + label + " less than or equal to " + maximum + ".";
            } else if (minimum.length > 0) {
                if (decimal < minimum)
                    error = "Please enter a dollar amount for " + label + " greater than or equal to " + minimum + ".";
            }
        }
    }

    return error;
}
function validateDate(value, label, maximum, minimum) {
    var error = "";
    // First check for the pattern
    // if date input is valid, then format will be YYYY-MM-DD
    // else format will be MM/DD/YYYY
    var utcFormat = false;
    if (value.length > 0) {
        if (value.indexOf('/') >= 0) { // if date input is not valid
            if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value))
                error = "Please a valid date for " + label + ". Enter in MM/DD/YYYY format.";
        } else { // if date input is valid
            utcFormat = true;
            if (!/^\d{4}-\d{2}-\d{2}/.test(value))
                error = "Please a valid date for " + label + ". Enter in YYYY-MM-DD format.";
        }

        if (error.length == 0) {
            // Parse the date parts to integers
            var dateParts = new Array();
            var dateDay = 0;
            var dateMonth = 0;
            var dateYear = 0;
            if (utcFormat) {
                dateParts = value.split("-");
                dateDay = parseInt(dateParts[2]);
                dateMonth = parseInt(dateParts[1]);
                dateYear = parseInt(dateParts[0]);
            } else {
                dateParts = value.split("/");
                dateDay = parseInt(dateParts[1]);
                dateMonth = parseInt(dateParts[0]);
                dateYear = parseInt(dateParts[2]);
            }
            // Check the ranges of month and year
            if (dateYear < 1000 || dateYear > 3000 || dateMonth == 0 || dateMonth > 12)
                error = "Please a valid date for " + label + ". Year or Month outside of range.";

            var daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            // Adjust for leap years
            if (dateYear % 400 == 0 || (dateYear % 100 != 0 && dateYear % 4 == 0))
                daysPerMonth[1] = 29;

            // Check the range of the day
            if (dateDay <= 0 || dateDay > daysPerMonth[dateMonth - 1]) {
                error = "Please a valid date for " + label + ". Day is not within month.";
            }

            if (error.length == 0) {
                var jsDate = new Date(dateYear, dateMonth - 1, dateDay, 23, 59, 59, 999);
                if (maximum.length > 0 && minimum.length > 0) {
                    var maxDate = new Date(this.valueOf());
                    maxDate.setDate(maxDate.getDate() + maximum);
                    var minDate = new Date(this.valueOf());
                    minDate.setDate(minDate.getDate() + minimum);
                    if (jsDate > maxDate || jsDate < minDate) {
                        error = "Please enter a date for " + label + " between " + minDate + " and " + maxDate + ".";
                    } else if (maximum.length > 0) {
                        if (jsDate > maxDate)
                            error = "Please enter a date for " + label + " before or on " + maxDate + ".";
                    } else if (minimum.length > 0) {
                        if (jsDate < minDate)
                            error = "Please enter a date for " + label + " after or on " + minDate + ".";
                    }
                }
            }
        }
    } else
        error = "Please a date for " + label + ". Enter in MM/DD/YYYY format.";

    return error;
}
function validateTime(value, label, maximum, minimum) {
    var error = "";
    // First check for the pattern
    // if time input is valid, then format will be HH:MM 24 hour clock
    // else format will be HH:MM MER 12 hour clock
    if (value.length > 0) {
        if (value.indexOf(' ') >= 0) { // if time input is not valid
            var timeParts = value.split(' ');
            if (timeParts[0].search(/^(0?[1-9]|1[012]):[0-5][0-9]$/) == -1)
                error = "Please enter a valid 12-hour time (HH:MM AM) value for " + label + ".";
            if (!(timeParts[1] == 'AM' || timeParts[1] == 'PM'))
                error = "Please enter a valid 12-hour time (HH:MM AM) value for " + label + ".";
            var timeDigits = timeParts[0].split(':');
            value = parseInt(timeDigits[0]) + (timeParts[1] == "AM" ? (timeDigits[0] != 12 ? 0 : -12) : (timeDigits[0] != 12 ? 12 : 0)) + ':' + parseInt(timeDigits[1]);
        } else if (value.search(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/) == -1) {
            if (value.length > 0)
                error = "Please enter a valid time value for " + label + ".";
            else
                error = "Please enter a time value for " + label + ".";
        }

        if (error.length == 0) {
            // convert time, maximum, and minimum to decimal to compare
            if (maximum.length > 0 && minimum.length > 0) {
                var currentTime = convertTimeToDecimal(value);
                var minimumTime = convertTimeToDecimal(minimum);
                var maximumTime = convertTimeToDecimal(maximum);

                if (currentTime < minimumTime || currentTime > maximumTime)
                    error = "Please enter a time for " + label + " between " + minimum + " and " + maximum + ".";
            }
            else if (maximum.length > 0) {
                var currentTime = convertTimeToDecimal(value);
                var maximumTime = convertTimeToDecimal(maximum);
                if (currentTime > maximumTime)
                    error = "Please enter a time for " + label + " less than or equal to " + maximum + ".";
            }
            else if (minimum.length > 0) {
                var currentTime = convertTimeToDecimal(value);
                var minimumTime = convertTimeToDecimal(minimum);
                if (currentTime < minimumTime)
                    error = "Please enter a time for " + label + " greater than or equal to " + maximum + ".";
            }
        }
    } else
        error = "Please enter a 12-hour time (HH:MM AM) value for " + label + ".";

    return error;
}
function convertTimeToDecimal(time) {
    var timeDigits = time.split(':');
    var timeAsDecimal = parseInt(timeDigits[0]) + parseInt(timeDigits[1]) / 60;
    console.log(timeAsDecimal);
    return timeAsDecimal;
}
function validateSelect(obj, label, invalidIndexCSV) {
    var error = "";
    var selectedIndex = obj.selectedIndex;
    var invalidIndexArray = invalidIndexCSV.split(',');
    if (invalidIndexCSV.indexOf(selectedIndex) > -1)
        error = "Please make a valid selection for " + label + ".";

    return error;
}