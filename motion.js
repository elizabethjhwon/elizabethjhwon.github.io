(() => {
  const canvas = document.getElementById("orbit-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let time = 0;
  let pointerX = 0;
  let pointerY = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    pointerX = width * 0.5;
    pointerY = height * 0.5;
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#071d3e";
    ctx.fillRect(0, 0, width, height);
    const cx = width * 0.5 + (pointerX - width * 0.5) * 0.035;
    const cy = height * 0.44 + (pointerY - height * 0.5) * 0.025;
    const base = Math.min(width, height) * 0.12;

    for (let i = 0; i < 9; i += 1) {
      const phase = time * (0.00018 + i * 0.000008) + i * 0.63;
      const radius = base + i * base * 0.36;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * (1.08 + Math.sin(phase) * 0.08), radius * (0.46 + Math.cos(phase * 1.4) * 0.07), phase * 0.32, 0, Math.PI * 2);
      ctx.strokeStyle = i % 3 === 0 ? "rgba(142,184,255,.78)" : "rgba(255,255,255,.24)";
      ctx.lineWidth = i % 3 === 0 ? 1.35 : 0.75;
      ctx.stroke();
    }

    for (let i = 0; i < 7; i += 1) {
      const angle = time * 0.00013 * (i % 2 ? -1 : 1) + i * 0.9;
      const distance = base * (1.2 + i * 0.42);
      const x = cx + Math.cos(angle) * distance;
      const y = cy + Math.sin(angle * 1.3) * distance * 0.45;
      ctx.beginPath();
      ctx.arc(x, y, i === 2 ? 5 : 2.2, 0, Math.PI * 2);
      ctx.fillStyle = i === 2 ? "#f1c75b" : "#dbe8ff";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.72);
    for (let x = width * 0.15; x <= width * 0.85; x += 5) {
      const y = height * 0.72 + Math.sin(x * 0.027 + time * 0.001) * 9 + Math.sin(x * 0.011) * 12;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(255,255,255,.52)";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const animate = (timestamp) => {
    time = timestamp;
    draw();
    if (!reduceMotion) requestAnimationFrame(animate);
  };

  canvas.addEventListener("pointermove", (event) => {
    const box = canvas.getBoundingClientRect();
    pointerX = event.clientX - box.left;
    pointerY = event.clientY - box.top;
  });
  window.addEventListener("resize", resize);
  resize();
  if (reduceMotion) draw(); else requestAnimationFrame(animate);
})();
