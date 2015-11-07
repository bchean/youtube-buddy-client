// This file depends on badge.js, so include that file first.

/**
 * We create the badge immediately because, for better UX, the badge should
 * always be visible.
 */
if (isVideoUrl(document.URL)) {
    updateBadge_scrobbling();
}

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
