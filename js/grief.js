
const audio = new Audio("audio/Grief.wav");
audio.loop = true;
audio.crossOrigin = "anonymous";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const source = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

analyser.fftSize = 512;

source.connect(analyser);
analyser.connect(audioContext.destination);

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

audio.play().catch(() => {});

audio.addEventListener("canplay", () => {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
});

document.addEventListener("pointerdown", () => {
    if (audioContext.state === "suspended") audioContext.resume();
    if (audio.paused) audio.play();
}, { once: true });

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = "50%";
canvas.style.left = "50%";
canvas.style.transform = "translate(-50%, -50%)";
canvas.style.pointerEvents = "none";

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const scaleFactor = 2.3; 

const baseRadius = 140 * scaleFactor;
const amplitude = 90 * scaleFactor;

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const bars = 180;
    const step = Math.PI * 2 / bars;
    const time = performance.now() * 0.002;

      for (let i = 0; i < bars; i++) {
        const angle = i * step;
        const freqIndex = Math.floor((i / bars) * bufferLength * 0.75);
        const value = dataArray[freqIndex] / 255;

        const noise =
            Math.sin(angle * 2 + time) * 14 * scaleFactor +
            Math.sin(angle * 5 + time * 1.3) * 6 * scaleFactor;

        const innerRadius =
            baseRadius * 0.55 +
            Math.sin(angle * 8) * 24 * scaleFactor;

        const outerRadius =
            innerRadius +
            value * amplitude * 1.1 +
            noise;

        const x1 = cx + Math.cos(angle) * innerRadius;
        const y1 = cy + Math.sin(angle) * innerRadius;

        const x2 = cx + Math.cos(angle) * outerRadius;
        const y2 = cy + Math.sin(angle) * outerRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#4352A5";
        ctx.lineWidth = 3 * scaleFactor;
        ctx.stroke();
    }

       ctx.beginPath();

    for (let i = 0; i <= bars; i++) {
        const angle = i * step;
        const freqIndex = Math.floor((i / bars) * bufferLength * 0.75);
        const value = dataArray[freqIndex] / 255;

        const radius =
            baseRadius * 0.55 +
            value * amplitude * 1.3 +
            Math.sin(angle * 8 + time * 1.4) * 28 * scaleFactor;

        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2 * scaleFactor;
    ctx.shadowBlur = 12 * scaleFactor;
    ctx.shadowColor = "#4352A5";
    ctx.stroke();
}

drawVisualizer();
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});