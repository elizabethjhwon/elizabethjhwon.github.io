(() => {
  const canvas = document.getElementById("orbit-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;

  const drawSpacedText = (text, x, y, spacing) => {
    let cursor = x;
    for (const character of text) {
      ctx.fillText(character, cursor, y);
      cursor += ctx.measureText(character).width + spacing;
    }
    return cursor - x - spacing;
  };

  const measureSpacedText = (text, spacing) => {
    return [...text].reduce((total, character, index) => {
      return total + ctx.measureText(character).width + (index === text.length - 1 ? 0 : spacing);
    }, 0);
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#071d3e";
    ctx.fillRect(0, 0, width, height);

    const fontSize = Math.max(15, Math.min(23, width * 0.018));
    const spacing = Math.max(2.5, fontSize * 0.19);
    ctx.font = `500 ${fontSize}px Inter, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,.94)";
    const name = "elizabeth won";
    const textWidth = measureSpacedText(name, spacing);
    const textX = width < 700 ? width * 0.5 - textWidth * 0.5 : width * 0.29;
    const textY = height * 0.49;
    drawSpacedText(name, textX, textY, spacing);

    const seconds = time * 0.001;
    const driftX = Math.cos(seconds * 0.31) * (textWidth * 0.68) + Math.sin(seconds * 0.17) * 22;
    const driftY = Math.sin(seconds * 0.37) * 58 + Math.cos(seconds * 0.21) * 15;
    const dotX = textX + textWidth * 0.5 + driftX;
    const dotY = textY + driftY;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#f1c75b";
    ctx.shadowColor = "rgba(241,199,91,.65)";
    ctx.shadowBlur = 13;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const animate = (timestamp) => {
    draw(timestamp);
    requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize);
  const start = () => {
    resize();
    if (reduceMotion) draw(0); else requestAnimationFrame(animate);
  };
  if (document.fonts?.ready) document.fonts.ready.then(start); else start();
})();
