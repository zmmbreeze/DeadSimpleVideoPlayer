function createVideo(imgId) {
    var img = document.getElementById(imgId);
    var video = img.parentNode.getElementsByTagName('video')[0];
    var a = img.parentNode.getElementsByTagName('a')[0];
    if (video && typeof video.play === 'function') {
        var tmp = {
            play: video.play
        };
        var fired = false;
        video.play = function() {
            a.style.display = 'none';
            img.style.display = 'none';
            tmp.play.apply(video, arguments);
        };

        a.onclick = function() {
            if (fired) {
                return;
            }
            fired = true;
            video.play();
        };
        return video;
    }
}
