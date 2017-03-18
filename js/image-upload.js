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
    var $img = $('<img />');
    var $container = $('<div></div>');
    $container.append($img);
    $('#ImageLoaded').append($container);

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

$(document).ready(function () {
    $('body').find('a').click(function () {
        return checkImageSubmit();
    });

    $('#ImageUpload').change(function () {
        uploadImageData();
    });
});
