
var backgroundAudio = (function() {
  var audio = new Audio();
  audio.src = './backgroundS.mp3';
  return audio;
})();

function toggleBackgroundAudio() {
  if (backgroundAudio.paused) {
    backgroundAudio.play();
  } else {
    backgroundAudio.pause();
    backgroundAudio.position = 0;
  }
}

function displayNone() {
  var i = getElementsByClassName('On')
  && getElementsByClassName('Off');

  if (i === backgroundAudio.paused) {
    
  } else {
    return audio;
  }
}
