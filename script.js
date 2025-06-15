const song = document.getElementById('song');
const playPauseBtn = document.getElementById('playPauseBtn');
const ctrlIcon = document.getElementById('ctrlIcon');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const backwardBtn = document.getElementById('backward');
const forwardBtn = document.getElementById('forward');
const waveform = document.getElementById('waveform');

const WAVE_BARS = 40;
let bars = [];

// Create waveform bars
function createWaveform() {
    waveform.innerHTML = '';
    bars = [];
    for (let i = 0; i < WAVE_BARS; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        bar.style.height = `${Math.random() * 60 + 20}px`;
        waveform.appendChild(bar);
        bars.push(bar);
    }
}
createWaveform();

function updateWaveform(percent) {
    const activeBars = Math.round(percent * WAVE_BARS);
    bars.forEach((bar, i) => {
        bar.style.background = i < activeBars
            ? 'linear-gradient(180deg, #00c896 60%, #fff 100%)'
            : 'rgba(255,255,255,0.08)';
        bar.style.boxShadow = i < activeBars
            ? '0 0 8px #00c89688'
            : 'none';
    });
}

function formatTime(sec) {
    sec = Math.floor(sec);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

song.onloadedmetadata = function() {
    durationEl.textContent = formatTime(song.duration);
};

song.ontimeupdate = function() {
    currentTimeEl.textContent = formatTime(song.currentTime);
    updateWaveform(song.currentTime / song.duration);
    if (song.currentTime >= song.duration) {
        ctrlIcon.classList.remove('fa-pause');
        ctrlIcon.classList.add('fa-play');
    }
};

playPauseBtn.onclick = playPause;
function playPause() {
    if (song.paused) {
        song.play();
        ctrlIcon.classList.remove('fa-play');
        ctrlIcon.classList.add('fa-pause');
        playPauseBtn.classList.add('playing');
    } else {
        song.pause();
        ctrlIcon.classList.remove('fa-pause');
        ctrlIcon.classList.add('fa-play');
        playPauseBtn.classList.remove('playing');
    }
}

backwardBtn.onclick = () => {
    song.currentTime = Math.max(0, song.currentTime - 10);
};
forwardBtn.onclick = () => {
    song.currentTime = Math.min(song.duration, song.currentTime + 10);
};

// Click waveform to seek
waveform.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    song.currentTime = percent * song.duration;
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        playPause();
        e.preventDefault();
    }
    if (e.code === 'ArrowLeft') {
        song.currentTime = Math.max(0, song.currentTime - 5);
    }
    if (e.code === 'ArrowRight') {
        song.currentTime = Math.min(song.duration, song.currentTime + 5);
    }
});

// Animate play button
song.onplay = () => playPauseBtn.classList.add('playing');
song.onpause = () => playPauseBtn.classList.remove('playing');