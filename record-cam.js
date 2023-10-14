function wait(delayInMS) {
    return new Promise((resolve) => setTimeout(resolve, delayInMS));
}

const log = (msg) => console.log(msg);

// https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element
function startRecording(stream, lengthInMS) {
    let recorder = new MediaRecorder(stream);
    let data = [];

    console.log('start recording', stream);

    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.start();
    console.log(`${recorder.state} for ${lengthInMS / 1000} seconds…`);

    let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(event.name);
    });

    let recorded = wait(lengthInMS).then(() => {
        if (recorder.state === "recording") {
            recorder.stop();
            console.log('recording finished');
        }
    });

    return Promise.all([stopped, recorded]).then(() => data);
}

let recordButton = document.getElementById("recordButton");
let preview = document.getElementById("preview");
let recording = document.getElementById("recording");
let downloadButton = document.getElementById("downloadButton");

recordButton.onclick = () => {
    console.log('clicked');

    startRecording(
        preview.captureStream(),
        2 * 1000
    ).then((recordedChunks) => {
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        recording.src = URL.createObjectURL(recordedBlob);
        downloadButton.href = recording.src;
        downloadButton.download = "RecordedVideo.webm";

        console.log(
            `Successfully recorded ${recordedBlob.size} bytes of ${recordedBlob.type} media.`,
        );
    })
        .catch((error) => {
            if (error.name === "NotFoundError") {
                log("Camera or microphone not found. Can't record.");
            } else {
                log(error);
            }
        });

};
