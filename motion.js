(() => {
  const canvas = document.getElementById("orbit-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const spacedWidth = (text, spacing) => [...text].reduce((sum, letter, index) => {
    return sum + ctx.measureText(letter).width + (index < text.length - 1 ? spacing : 0);
  }, 0);

  const drawName = (text, x, y, spacing) => {
    let cursor = x;
    for (const letter of text) {
      ctx.fillText(letter, cursor, y);
      cursor += ctx.measureText(letter).width + spacing;
    }
  };

  const crescent = (x, y, radius, drift) => {
    ctx.save();
    ctx.translate(0, drift);
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x + radius * .4, y - radius * .12, radius * .92, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.globalCompositeOperation = "source-over";
  };

  const door = (x, y, scale, drift) => {
    ctx.save();
    ctx.translate(0, drift);
    ctx.strokeStyle = "rgba(255,255,255,.68)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x, y, 40 * scale, 70 * scale);
    const glow = ctx.createLinearGradient(x, y, x + 40 * scale, y);
    glow.addColorStop(0, "rgba(241,199,91,.02)");
    glow.addColorStop(1, "rgba(241,199,91,.48)");
    ctx.fillStyle = glow;
    ctx.fillRect(x + 4 * scale, y + 4 * scale, 32 * scale, 62 * scale);
    ctx.fillStyle = "#f1c75b";
    ctx.beginPath();
    ctx.arc(x + 31 * scale, y + 37 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const fish = (x, y, scale, drift) => {
    ctx.save();
    ctx.translate(0, drift);
    ctx.strokeStyle = "rgba(255,255,255,.38)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 25 * scale, y - 16 * scale, x + 58 * scale, y - 16 * scale, x + 78 * scale, y);
    ctx.bezierCurveTo(x + 58 * scale, y + 16 * scale, x + 25 * scale, y + 16 * scale, x, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x - 19 * scale, y - 14 * scale);
    ctx.lineTo(x - 17 * scale, y + 14 * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.72)";
    ctx.beginPath();
    ctx.arc(x + 61 * scale, y - 3 * scale, 1.8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const stars = (seconds) => {
    [[.11,.2,1.3],[.21,.77,1],[.69,.18,1.2],[.9,.67,1.4],[.63,.8,.8],[.44,.23,.9]].forEach(([x,y,size], index) => {
      const alpha = .3 + Math.sin(seconds * .8 + index) * .16;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(width * x, height * y, size, size);
    });
  };

  const draw = (timestamp) => {
    const seconds = reduceMotion ? 0 : timestamp * .001;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#071d3e";
    ctx.fillRect(0, 0, width, height);

    const fontSize = Math.max(15, Math.min(23, width * .018));
    const spacing = Math.max(2.5, fontSize * .19);
    const name = "elizabeth won";
    ctx.font = `500 ${fontSize}px Inter, sans-serif`;
    ctx.textBaseline = "middle";
    const nameWidth = spacedWidth(name, spacing);
    const nameX = width < 700 ? (width - nameWidth) / 2 : width * .29;
    const nameY = height * .49;
    ctx.fillStyle = "rgba(255,255,255,.94)";
    drawName(name, nameX, nameY, spacing);

    crescent(width * .79, height * .27, Math.min(width,height) * .052, Math.sin(seconds * .34) * 7);
    door(width * .79, height * .68, Math.max(.72, Math.min(1.08, width / 1400)), Math.sin(seconds * .27 + 2) * 5);
    fish(width * .14, height * .7, Math.max(.68, Math.min(1, width / 1500)), Math.sin(seconds * .23 + 4) * 9);
    stars(seconds);

    const dotX = nameX + nameWidth * .5 + Math.cos(seconds * .31) * nameWidth * .66 + Math.sin(seconds * .17) * 20;
    const dotY = nameY + Math.sin(seconds * .37) * 54 + Math.cos(seconds * .21) * 14;
    ctx.fillStyle = "#f1c75b";
    ctx.shadowColor = "rgba(241,199,91,.68)";
    ctx.shadowBlur = 13;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const animate = (time) => {
    draw(time);
    if (!reduceMotion) requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize);
  const start = () => {
    resize();
    if (reduceMotion) draw(0); else requestAnimationFrame(animate);
  };
  if (document.fonts?.ready) document.fonts.ready.then(start); else start();
})();
