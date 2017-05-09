function uploadImageData() {
    // get the files selected
    var file = null;
    var file = $('#ImageUpload')[0].files[0];

    // Check the file type
    if (file.type.match('image/png') || file.type.match('image/jpeg') || file.type.match('image/bmp') || file.type.match('image/gif')) {
        var formData = new FormData();
        formData.append('photos[]', file, file.name);
        uploadImageFile(formData);
        displayUploadImage(file);
    } else
        alert('Invalid Image Format');
}
function displayUploadImage(file) {
    $('#ImagePreview').show().css({ opacity: 0 }).append('<img/>');
    $('#ImagePreview').append('<p>Image Preview</p>');
    var reader = new FileReader();
    reader.onload = function (e) {
        $('#ImagePreview img').attr('src', e.target.result);
        $('#ImagePreview').animate({ opacity: 1 }, 3000);
    };
    reader.readAsDataURL(file);
}
function uploadImageFile(formData) {
    $('div.imageInputs').hide();
    $('#ImageStatus').append('<div class="imageProgress"><div class="progressBar"><p class="label">uploading...</p><span class="bar"></span><p class="percentage">0<span>%</span></p></div></div>');

    jQuery.support.cors = true;
    var token = getToken();
    $.ajax({
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    updateImageUploadProgress(percentComplete * 100);
                }
            }, false);
            return xhr;
        },
        type: 'POST',
        url: 'https://msapps.acesag.auburn.edu/aww/api/home/SubmitImage?siteId=' + $('#WebMasterSiteId').val(),
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'Authorization': 'Bearer ' + token },
        success: function (data) {
            console.log('image uploaded');
            console.log(data);
            completeImageUpload(data.newfilepath);
        },
        error: function (x, y, z) {
            completeImageUpload();
            displayErrorMessage(true, 'An error has occurred. The image could not be uploaded.');
        }
    });
}
function updateImageUploadProgress(percentage) {
    var $bar = $('#ImageStatus div.progressBar span.bar');
    $bar.css({ width: percentage + '%' });
    var $text = $('#ImageStatus div.progressBar p.percentage');
    $text.html(Math.ceil(percentage) + '<span>%</span>');
}
function completeImageUpload(imgPath) {
    var imgPathParts = imgPath.replace('https://msapps.acesag.auburn.edu/files/aww/', '');
    var imageID = imgPathParts.split('/')[0];

    var $img = $('<img />');
    var $container = $('<div></div>');
    $container.append($img);

    var $delete = $('<span imageid="' + imageID + '"></span>');
    $delete.on('click', function () { deleteImage(this); });
    $container.append($delete);

    var $view = $('<a href="' + imgPath + '" target="_blank"></a>');
    $container.append($view);

    $('#ImageLoaded').prepend($container);

    $img.on('load', function () {
        $('div.imageInputs').show();
        $('#ImageStatus').empty();
        $('#ImagePreview').empty().hide();

        $container.append('<p>Image Saved</p>');
        $container.css({ height: 'auto' }).animate({ opacity: 1 }, 3000, function () {
            $(this).find('p').fadeOut(function () {
                $(this).remove();
            });
        });
    }).attr('src', imgPath);


}
function checkImageSubmit() {
    var $pending_img = $('#Image-Progress');
    if ($pending_img.length > 0)
        alert("Please do not leave the page. There is an image upload in progress.");

    return $pending_img.length == 0;
}

function loadExistingImages() {
    var token = getToken();
    $.support.cors;
    if (token != null) {
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/GetImagesBySiteID?siteId=' + $('#WebMasterSiteId').val(),
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (jsonObj) {
                populateExistingImages(jsonObj.images);
            },
            error: function (x, y, z) {
                var message = "Your session has expired.";

                if (xhrObj.hasOwnProperty('responseText')) {
                    reponseObj = jQuery.parseJSON(xhrObj.responseText);
                    message = reponseObj.error_description;
                }
                clearTokenWithError(message);
            }
        });
    } else
        clearToken();
}
function populateExistingImages(imageArray) {
    if (imageArray != null) {
        if (imageArray.length > 0) {
            token = getToken();
            var decodedToken = jwt_decode(token);
            var userID = decodedToken.unique_name.toLowerCase();

            $.each(imageArray, function (index, imageObj) {
                var $img = $('<img />');
                var $container = $('<div></div>');
                $container.css({ height: 'auto', opacity: 1 });
                $container.append($img);

                if (imageObj.userId.toLowerCase() == userID) {
                    // only allow the user that submitted the image to delete the image
                    var $delete = $('<span imageid="' + imageObj.imageId + '"></span>');
                    $delete.on('click', function () { deleteImage(this); });
                    $container.append($delete);
                }

                var $view = $('<a href="' + imageObj.fileURL + '" target="_blank"></a>');
                $container.append($view);
                $('#ImageLoaded').prepend($container);
                $img.attr('src', imageObj.fileURL);
            });
        }
    }
}
function deleteImage(obj) {

    displayContentOverlay(true);
    if (confirm('Are you sure you would like to permanently delete this image?')) {
        var imageID = $(obj).attr('imageid');
        var token = getToken();
        $.support.cors;
        $.ajax({
            url: 'https://msapps.acesag.auburn.edu/aww/api/home/deleteImagesbyimageid',
            dataType: 'json',
            type: 'GET',
            data: { 'imageId': imageID },
            headers: { 'Authorization': 'Bearer ' + token },
            cache: false,
            success: function (data) {
                $(obj).closest('div').remove();
                displayContentOverlay(false);
            },
            error: function (x, y, z) {
                displayErrorMessage(true, 'An error has occurred.  The image was not removed.');
                displayContentOverlay(false);
            }
        });
    } else
        displayContentOverlay(false);
}

$(document).ready(function () {
    $('body').find('a').click(function () {
        return checkImageSubmit();
    });

    $('#ImageUpload').change(function () {
        uploadImageData();
    });
});