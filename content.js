setInterval(function() {
    var currentUrl = document.URL;
    /**
     * Content script file matching doesn't always work for YouTube! For some
     * reason, clicking on a video from the search results page DOESN'T
     * register as a page navigation in Chrome.
     *
     * As a workaround, we have to check the url ourselves.
     */
    if (isVideoUrl(currentUrl)) {
        var currentVideoId = getVideoIdFromUrl(currentUrl);
        pingServerIfVideoIsPlaying(currentVideoId);
    }
}, 5000);

function isVideoUrl(currentUrl) {
    return currentUrl.includes('watch?v=');
}

function getVideoIdFromUrl(currentUrl) {
    var urlIndexOfId = currentUrl.indexOf('v=') + 2;
    var urlIndexOfAmp = currentUrl.indexOf('&');
    var currentVideoId;

    if (urlIndexOfAmp >= 0) {
        currentVideoId = currentUrl.substring(urlIndexOfId, urlIndexOfAmp);
    } else {
        currentVideoId = currentUrl.substring(urlIndexOfId);
    }

    return currentVideoId;
}

function pingServerIfVideoIsPlaying(currentVideoId) {
    if (videoIsPlaying()) {
        pingServer(currentVideoId);
    }
}

function videoIsPlaying() {
    var playPauseButton = document.querySelector('.ytp-chrome-controls .ytp-play-button');
    var currentButtonAction = playPauseButton.getAttribute('aria-label');
    return (currentButtonAction === 'Pause');
}

function pingServer(currentVideoId) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            console.log(xmlHttp.responseText);
        }
    }
    xmlHttp.open('PUT', makeRestEndpoint(currentVideoId), true);
    xmlHttp.send(null);
}

function makeRestEndpoint(currentVideoId) {
    return 'https://youtube-buddy.herokuapp.com/api/videos/' + currentVideoId;
}
