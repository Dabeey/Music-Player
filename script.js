const song = document.getElementById('song');
const playPauseBtn = document.getElementById('playPauseBtn');
const ctrlIcon = document.getElementById('ctrlIcon');
const progressCircle = document.querySelector('.progress-ring__circle');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const backwardBtn = document.getElementById('backward');
const forwardBtn = document.getElementById('forward');

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Set up SVG gradient for progress ring
const svg = document.querySelector('.progress-ring');
if (svg) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", "gradient");
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "0%");
    grad.innerHTML = `
        <stop offset="0%" stop-color="#00c896"/>
        <stop offset="100%" stop-color="#fff"/>
    `;
    defs.appendChild(grad);
    svg.insertBefore(defs, svg.firstChild);
}

progressCircle.style.strokeDasharray = `${CIRCUMFERENCE}`;
progressCircle.style.strokeDashoffset = `${CIRCUMFERENCE}`;

function setProgress(percent) {
    const offset = CIRCUMFERENCE - percent * CIRCUMFERENCE;
    progressCircle.style.strokeDashoffset = offset;
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
    setProgress(song.currentTime / song.duration);
};

playPauseBtn.onclick = playPause;
function playPause() {
    if (song.paused) {
        song.play();
        ctrlIcon.classList.remove('fa-play');
        ctrlIcon.classList.add('fa-pause');
    } else {
        song.pause();
        ctrlIcon.classList.remove('fa-pause');
        ctrlIcon.classList.add('fa-play');
    }
}

backwardBtn.onclick = () => {
    song.currentTime = Math.max(0, song.currentTime - 10);
};
forwardBtn.onclick = () => {
    song.currentTime = Math.min(song.duration, song.currentTime + 10);
};

// Click on progress ring to seek
document.querySelector('.album-art-wrap').addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    const angle = Math.atan2(y, x) + Math.PI/2;
    let percent = angle / (2 * Math.PI);
    if (percent < 0) percent += 1;
    song.currentTime = percent * song.duration;
});