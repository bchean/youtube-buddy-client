// This content script will run on every tab with YouTube open.

var currentVideoId = getVideoIdFromUrl();
setInterval(pingServerIfVideoIsPlaying, 5000);

function getVideoIdFromUrl() {
    var currentUrl = document.URL;
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

function pingServerIfVideoIsPlaying() {
    if (videoIsPlaying()) {
        pingServer();
    }
}

function videoIsPlaying() {
    var playPauseButton = document.querySelector('.ytp-chrome-controls .ytp-play-button');
    var currentButtonAction = playPauseButton.getAttribute('aria-label');
    return (currentButtonAction === 'Pause');
}

function pingServer() {
    console.log(currentVideoId);
}
