$(document).ready(function () {
    $('#audio').click(function () {
        var audio = document.querySelector("#audio");

        // get current class state
        var currentState = audio.getAttribute("class");

        // change class
        if (currentState === "fa fa-microphone") {
            audio.setAttribute("class", "fa fa-microphone-slash");
        } else {
            audio.setAttribute("class", "fa fa-microphone");
        }

    });
});
$(document).ready(function () {
    $('#video').click(function () {
        var video = document.querySelector("#video");

        // get current class state
        var currentState = video.getAttribute("class");

        // change class
        if (currentState === "fa fa-video-camera") {
            video.setAttribute("class", "fas fa-video-slash");
        } else {
            video.setAttribute("class", "fa fa-video-camera");
        }

    });
});