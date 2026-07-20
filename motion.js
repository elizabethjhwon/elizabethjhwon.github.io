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

  const smoothTrace = (values) => {
    const result = values.slice();
    for (let pass = 0; pass < 4; pass += 1) {
      for (let x = startX + 2; x < endX - 2; x += 1) {
        result[x] = (result[x - 2] + result[x - 1] + result[x] * 2 + result[x + 1] + result[x + 2]) / 6;
      }
    }
    return result;
  };

  const buildSignature = () => {
    mask.width = Math.max(1, Math.round(width));
    mask.height = Math.max(1, Math.round(height));
    maskCtx.clearRect(0, 0, width, height);
    const fontSize = Math.min(width * 0.22, height * 0.4, 310);
    maskCtx.font = `${fontSize}px Allura, cursive`;
    maskCtx.textAlign = "center";
    maskCtx.textBaseline = "middle";
    maskCtx.fillStyle = "white";
    maskCtx.fillText("elizabeth", width * 0.5, height * 0.48);
    const metrics = maskCtx.measureText("elizabeth");
    startX = Math.max(28, Math.floor(width * 0.5 - metrics.width * 0.515));
    endX = Math.min(width - 28, Math.ceil(width * 0.5 + metrics.width * 0.515));
    const pixels = maskCtx.getImageData(0, 0, mask.width, mask.height).data;
    const raw = new Array(Math.ceil(width)).fill(height * 0.5);
    let previous = height * 0.5;
    let lastInkX = startX;

    for (let x = startX; x <= endX; x += 1) {
      const candidates = [];
      for (let y = Math.floor(height * 0.18); y < Math.ceil(height * 0.78); y += 2) {
        if (pixels[(Math.floor(y) * mask.width + Math.floor(x)) * 4 + 3] > 55) candidates.push(y);
      }
      if (candidates.length) {
        const next = candidates.reduce((best, y) => Math.abs(y - previous) < Math.abs(best - previous) ? y : best, candidates[0]);
        const gap = x - lastInkX;
        if (gap > 1) {
          for (let gx = lastInkX + 1; gx < x; gx += 1) raw[gx] = previous + (next - previous) * ((gx - lastInkX) / gap);
        }
        previous = next;
        lastInkX = x;
      }
      raw[x] = previous;
    }
    trace = smoothTrace(raw);
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

  const draw = (progress) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#071d3e";
    ctx.fillRect(0, 0, width, height);
    const revealX = startX + (endX - startX) * progress;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, revealX + 5, height);
    ctx.clip();
    ctx.drawImage(mask, 0, 0);
    ctx.restore();

    const dotX = Math.max(startX, Math.min(endX, Math.round(revealX)));
    const dotY = trace[dotX] || height * 0.5;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#f1c75b";
    ctx.shadowColor = "rgba(241,199,91,.8)";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const cycle = 9000;
    const elapsed = (timestamp - startTime) % cycle;
    const progress = elapsed < 6500 ? elapsed / 6500 : 1;
    draw(Math.min(progress, 1));
    requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize);
  const start = () => {
    resize();
    if (reduceMotion) draw(1); else requestAnimationFrame(animate);
  };
  if (document.fonts?.ready) document.fonts.ready.then(start); else start();
})();
