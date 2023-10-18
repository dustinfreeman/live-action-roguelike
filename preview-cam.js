var video = document.querySelector("#preview");

var videoRequest = true;

if (typeof forcePreviewCamera !== 'undefined') {
    console.log("forcePreviewCamera: ", forcePreviewCamera);
}

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err0r) {
            console.log("Something went wrong!", err0r);
        });
}