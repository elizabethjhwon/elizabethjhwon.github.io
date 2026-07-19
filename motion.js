(() => {
  const canvas = document.getElementById("orbit-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const mask = document.createElement("canvas");
  const maskCtx = mask.getContext("2d", { willReadFrequently: true });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let startX = 0;
  let endX = 0;
  let trace = [];
  let startTime = 0;

  const buildSignature = () => {
    mask.width = Math.max(1, Math.round(width));
    mask.height = Math.max(1, Math.round(height));
    maskCtx.clearRect(0, 0, width, height);
    const fontSize = Math.min(width * 0.27, height * 0.31, 170);
    maskCtx.font = `${fontSize}px Allura, cursive`;
    maskCtx.textAlign = "center";
    maskCtx.textBaseline = "middle";
    maskCtx.fillStyle = "white";
    maskCtx.fillText("elizabeth", width * 0.5, height * 0.48);
    const metrics = maskCtx.measureText("elizabeth");
    startX = Math.max(18, Math.floor(width * 0.5 - metrics.width * 0.52));
    endX = Math.min(width - 18, Math.ceil(width * 0.5 + metrics.width * 0.52));
    const pixels = maskCtx.getImageData(0, 0, mask.width, mask.height).data;
    trace = new Array(Math.ceil(width)).fill(height * 0.48);
    let previous = height * 0.48;
    for (let x = startX; x <= endX; x += 1) {
      const candidates = [];
      for (let y = Math.floor(height * 0.24); y < Math.ceil(height * 0.72); y += 2) {
        if (pixels[(Math.floor(y) * mask.width + Math.floor(x)) * 4 + 3] > 40) candidates.push(y);
      }
      if (candidates.length) {
        previous = candidates.reduce((best, y) => Math.abs(y - previous) < Math.abs(best - previous) ? y : best, candidates[0]);
      }
      trace[x] = previous;
    }
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    buildSignature();
  };

  const draw = (progress, time) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#071d3e";
    ctx.fillRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.47;
    const base = Math.min(width, height) * 0.13;
    for (let i = 0; i < 8; i += 1) {
      const phase = time * (0.00008 + i * 0.000005) + i * 0.7;
      const radius = base + i * base * 0.37;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.12, radius * 0.48, phase * 0.24, 0, Math.PI * 2);
      ctx.strokeStyle = i % 3 === 0 ? "rgba(142,184,255,.34)" : "rgba(255,255,255,.12)";
      ctx.lineWidth = i % 3 === 0 ? 1.1 : 0.7;
      ctx.stroke();
    }

    const revealX = startX + (endX - startX) * progress;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, revealX + 4, height);
    ctx.clip();
    ctx.drawImage(mask, 0, 0);
    ctx.restore();

    const dotX = Math.max(startX, Math.min(endX, Math.round(revealX)));
    const dotY = trace[dotX] || height * 0.48;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = "#f1c75b";
    ctx.shadowColor = "rgba(241,199,91,.65)";
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const cycle = 8200;
    const elapsed = (timestamp - startTime) % cycle;
    const progress = elapsed < 6000 ? Math.min(elapsed / 6000, 1) : 1;
    draw(progress, timestamp);
    requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize);
  const start = () => {
    resize();
    if (reduceMotion) draw(1, 0); else requestAnimationFrame(animate);
  };
  if (document.fonts?.ready) document.fonts.ready.then(start); else start();
})();
