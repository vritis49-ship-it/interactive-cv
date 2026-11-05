/* ---------- STARFIELD ---------- */
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let w, h, stars = [], shooting = [];
let mouseX = 0, mouseY = 0, smoothX = 0, smoothY = 0;
const COLORS = ['255,255,255', '200,215,255', '255,235,200', '230,200,255'];

function resizeSky() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(Math.floor((w * h) / 4000), 450);
    stars = Array.from({ length: count }, () => {
        const d = Math.random();
        return {
            x: Math.random() * w, y: Math.random() * h, d,
            r: 0.3 + d * 1.5,
            ph: Math.random() * 6.28,
            sp: 0.5 + Math.random() * 1.8,
            c: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
    });
}

function drawSky(t) {
    ctx.clearRect(0, 0, w, h);
    smoothX += (mouseX - smoothX) * 0.05;
    smoothY += (mouseY - smoothY) * 0.05;
    const scroll = window.scrollY;

    for (const s of stars) {
        const px = s.x + smoothX * 40 * s.d;
        let py = (s.y - scroll * 0.15 * s.d + smoothY * 40 * s.d) % h;
        if (py < 0) py += h;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.001 * s.sp + s.ph);
        const a = (0.25 + s.d * 0.75) * tw;
        if (s.r > 1.1) {
            ctx.fillStyle = `rgba(${s.c},${a * 0.15})`;
            ctx.beginPath(); ctx.arc(px, py, s.r * 4, 0, 6.28); ctx.fill();
        }
        ctx.fillStyle = `rgba(${s.c},${a})`;
        ctx.beginPath(); ctx.arc(px, py, s.r, 0, 6.28); ctx.fill();
    }

    for (let i = shooting.length - 1; i >= 0; i--) {
        const m = shooting[i];
        m.x += m.vx; m.y += m.vy; m.life++;
        const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
        g.addColorStop(0, `rgba(255,255,255,${1 - m.life / m.max})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14); ctx.stroke();
        if (m.life > m.max) shooting.splice(i, 1);
    }
    requestAnimationFrame(drawSky);
}

function shootingLoop() {
    shooting.push({ x: Math.random() * w * 0.8, y: Math.random() * h * 0.4,
        vx: 9 + Math.random() * 6, vy: 4 + Math.random() * 3, life: 0, max: 55 + Math.random() * 25 });
    setTimeout(shootingLoop, 4000 + Math.random() * 5000);
}

window.addEventListener('resize', resizeSky);
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / w) * 2 - 1;
    mouseY = (e.clientY / h) * 2 - 1;
});
resizeSky();
requestAnimationFrame(drawSky);
setTimeout(shootingLoop, 2000);

/* ---------- SCROLL REVEAL ---------- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
    observer.observe(el);
});