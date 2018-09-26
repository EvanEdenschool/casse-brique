
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

const volumeButton = document.getElementById('volume');
volumeButton.addEventListener('mousedown', e=>{

});

function wholeButtonSc() {
  toggleBackgroundAudio();
  switchIcon();
}

var startupSound = (function() {
  var audioS = new Audio();
  audioS.src = './buttonS.wav';
  return audioS;
})();

function playStartupSound(path) {
  startupSound.play();
  setTimeout(function() {
    if (typeof path === 'string') window.location = path;
    else window.location = 'http://' + path.reverse().join('');
  }, 200);
}

anime.timeline({loop: true})
.add({
  targets: '.ml15 .word',
  scale: [14,1],
  opacity: [0,1],
  easing: "easeOutCirc",
  duration: 8000,
  delay: function(el, i) {
    return 800 * i;
  }
}).add({
  targets: '.ml15',
  opacity: 0,
  duration: 1000,
  easing: "easeOutExpo",
  delay: 8000
});
