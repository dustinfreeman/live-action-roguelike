var video = document.querySelector("#preview");

function startStreamingVideo(videoRequest = true) {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: videoRequest })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (err0r) {
                console.log("Something went wrong!", err0r);
            });
    }
}

if (typeof forcePreviewCamera !== 'undefined') {
    console.log("forcePreviewCamera: ", forcePreviewCamera);

    navigator.mediaDevices.enumerateDevices().then((value) => {
        var webcams = value.filter(device => device.kind === 'videoinput');
        for (const [index, w] of webcams.entries()) {
            console.log(w);
            if (w.label === forcePreviewCamera) {
                startStreamingVideo({
                    deviceId: { exact: w.deviceId }
                })
            }
        };
    })

} else {
    startStreamingVideo();
}
