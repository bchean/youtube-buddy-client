var SERVER_URL = 'https://youtube-buddy.herokuapp.com';
var BADGE_CLASS_NAME = 'ytb-badge';

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
    } else {
        updateBadge_paused();
    }
}

function videoIsPlaying() {
    var currentButtonAction = $('.ytp-chrome-controls .ytp-play-button').attr('aria-label');
    return (currentButtonAction === 'Pause');
}

function pingServer(currentVideoId) {
    $.ajax({
        url: makeRestEndpoint(currentVideoId),
        method: 'PUT'
    }).done(function(data) {
        console.log(JSON.stringify(data));
        updateBadge_scrobbling();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        updateBadge_offline();
    });
}

function makeRestEndpoint(currentVideoId) {
    return SERVER_URL + '/api/videos/' + currentVideoId;
}

function updateBadge_paused() {
    var badge = createBadgeIfNecessaryAndGet();
    badge.text('YTB | Paused');
    badge.css('color', 'white');
}

function updateBadge_scrobbling() {
    var badge = createBadgeIfNecessaryAndGet();
    badge.text('YTB | Scrobbling');
    badge.css('color', '#55FF55');
}

function updateBadge_offline() {
    var badge = createBadgeIfNecessaryAndGet();
    badge.text('YTB | Offline');
    badge.css('color', 'red');
}

function createBadgeIfNecessaryAndGet() {
    var videoContainer = $('.html5-video-content');
    var badge = videoContainer.find('.' + BADGE_CLASS_NAME);

    if (!badge.length) {
        var outerLink = $('<a></a>')
            .attr('href', SERVER_URL)
            .attr('target', '_blank');

        badge = $('<span></span>')
            .addClass(BADGE_CLASS_NAME)
            .css({
                'position': 'absolute',
                'z-index': 1000,
                'background-color': 'rgba(0, 0, 0, 0.7)',
                'font-size': '1.125em',
                'font-weight': 'bold',
                'padding': '1px 2px 0px'
            });

        outerLink.append(badge);
        videoContainer.append(outerLink);
    }

    return badge;
}
