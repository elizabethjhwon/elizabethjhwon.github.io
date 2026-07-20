(() => {
  const canvas = document.getElementById("orbit-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;

  const fishData = [
    { y:.63, speed:12, size:.72, start:.08, direction:1 },
    { y:.69, speed:18, size:1.05, start:.56, direction:-1 },
    { y:.76, speed:10, size:.64, start:.32, direction:1 },
    { y:.82, speed:15, size:.88, start:.78, direction:-1 },
    { y:.88, speed:8, size:.54, start:.18, direction:1 },
    { y:.72, speed:7, size:.48, start:.88, direction:1 },
  ];

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const spacedText = (text, x, y, spacing) => {
    for (const letter of text) {
      ctx.fillText(letter, x, y);
      x += ctx.measureText(letter).width + spacing;
    }
  };

  const drawStars = (seconds) => {
    const stars = [[.07,.15,1.2],[.13,.31,.8],[.21,.12,1.3],[.31,.25,.7],[.42,.11,1],[.51,.29,.9],[.61,.16,1.2],[.72,.34,.7],[.86,.12,1.1],[.93,.27,.8],[.38,.37,.6],[.67,.08,.7]];
    stars.forEach(([x,y,size], index) => {
      const alpha = .38 + Math.sin(seconds * .72 + index * 1.7) * .22;
      ctx.fillStyle = `rgba(232,241,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(width*x,height*y,size,0,Math.PI*2);
      ctx.fill();
    });
  };

  const drawMoon = (seconds) => {
    const x=width*.79, y=height*.22, r=Math.min(width,height)*.075;
    const glow=ctx.createRadialGradient(x,y,r*.25,x,y,r*2.1);
    glow.addColorStop(0,"rgba(241,199,91,.25)");
    glow.addColorStop(1,"rgba(241,199,91,0)");
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(x,y,r*2.1,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#f3d87d"; ctx.beginPath(); ctx.arc(x,y+Math.sin(seconds*.2)*2,r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="rgba(190,160,86,.18)";
    ctx.beginPath();ctx.arc(x-r*.26,y-r*.18,r*.13,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+r*.31,y+r*.22,r*.09,0,Math.PI*2);ctx.fill();
  };

  const drawHillAndGirl = () => {
    const horizon=height*.56;
    ctx.fillStyle="#071426";
    ctx.beginPath();
    ctx.moveTo(-20,horizon+80);
    ctx.bezierCurveTo(width*.12,horizon-8,width*.29,horizon-45,width*.48,horizon+24);
    ctx.lineTo(width*.56,height*.64);ctx.lineTo(-20,height*.64);ctx.closePath();ctx.fill();
    const gx=width*.31, gy=horizon-32, s=Math.max(.7,Math.min(1.1,width/1400));
    ctx.strokeStyle="#050e1b";ctx.fillStyle="#050e1b";ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();ctx.arc(gx,gy-31*s,9*s,0,Math.PI*2);ctx.fill();
    ctx.lineWidth=8*s;ctx.beginPath();ctx.moveTo(gx,gy-21*s);ctx.lineTo(gx+2*s,gy+15*s);ctx.stroke();
    ctx.lineWidth=6*s;ctx.beginPath();ctx.moveTo(gx+1*s,gy-7*s);ctx.lineTo(gx+19*s,gy+4*s);ctx.stroke();
    ctx.lineWidth=7*s;ctx.beginPath();ctx.moveTo(gx+2*s,gy+13*s);ctx.lineTo(gx+25*s,gy+24*s);ctx.lineTo(gx+47*s,gy+24*s);ctx.stroke();
    ctx.beginPath();ctx.moveTo(gx-7*s,gy-38*s);ctx.quadraticCurveTo(gx-17*s,gy-25*s,gx-8*s,gy-12*s);ctx.lineWidth=5*s;ctx.stroke();
  };

  const drawWater = (seconds) => {
    const top=height*.56;
    const gradient=ctx.createLinearGradient(0,top,0,height);
    gradient.addColorStop(0,"#0d3762");gradient.addColorStop(.45,"#092b52");gradient.addColorStop(1,"#061b36");
    ctx.fillStyle=gradient;ctx.fillRect(0,top,width,height-top);
    for(let i=0;i<14;i+=1){
      const y=top+18+i*(height-top)/15;
      ctx.beginPath();
      for(let x=-20;x<width+20;x+=12){
        const wave=Math.sin(x*.018+seconds*.35+i*.7)*2.2;
        x===-20?ctx.moveTo(x,y+wave):ctx.lineTo(x,y+wave);
      }
      ctx.strokeStyle=i<5?"rgba(145,190,227,.18)":"rgba(116,163,207,.09)";ctx.lineWidth=.75;ctx.stroke();
    }
    const mx=width*.79;
    for(let i=0;i<9;i+=1){
      const y=top+18+i*11;
      const half=18+i*7+Math.sin(seconds*.4+i)*5;
      ctx.beginPath();ctx.moveTo(mx-half,y);ctx.lineTo(mx+half,y);
      ctx.strokeStyle=`rgba(243,216,125,${.24-i*.018})`;ctx.lineWidth=1.2;ctx.stroke();
    }
  };

  const drawFish = (x,y,size,direction,seconds,index) => {
    const s=size*Math.max(.7,Math.min(1.05,width/1300));
    ctx.save();ctx.translate(x,y+Math.sin(seconds*.9+index)*4);ctx.scale(direction,1);
    ctx.strokeStyle="rgba(198,222,242,.64)";ctx.lineWidth=1.1;
    ctx.beginPath();ctx.moveTo(-32*s,0);ctx.bezierCurveTo(-13*s,-12*s,16*s,-12*s,32*s,0);ctx.bezierCurveTo(16*s,12*s,-13*s,12*s,-32*s,0);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-32*s,0);ctx.lineTo(-47*s,-12*s);ctx.lineTo(-45*s,12*s);ctx.closePath();ctx.stroke();
    ctx.fillStyle="#f1c75b";ctx.beginPath();ctx.arc(20*s,-2*s,1.8*s,0,Math.PI*2);ctx.fill();ctx.restore();
  };

  const draw = (timestamp) => {
    const seconds=reduceMotion?0:timestamp*.001;
    const sky=ctx.createLinearGradient(0,0,0,height*.58);
    sky.addColorStop(0,"#041329");sky.addColorStop(.65,"#09274b");sky.addColorStop(1,"#16436b");
    ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
    drawStars(seconds);drawMoon(seconds);drawWater(seconds);drawHillAndGirl();
    fishData.forEach((fish,index)=>{
      const travel=width+140;
      const raw=(fish.start*travel+seconds*fish.speed)%travel;
      const x=fish.direction===1?raw-70:width+70-raw;
      drawFish(x,height*fish.y,fish.size,fish.direction,seconds,index);
    });
    const fontSize=Math.max(14,Math.min(21,width*.017));
    ctx.font=`500 ${fontSize}px Inter, sans-serif`;ctx.textBaseline="middle";ctx.fillStyle="rgba(255,255,255,.9)";
    spacedText("elizabeth won",width<700?width*.08:width*.09,height*.15,Math.max(2.3,fontSize*.18));
  };

  const animate=(time)=>{draw(time);if(!reduceMotion)requestAnimationFrame(animate);};
  window.addEventListener("resize",resize);
  const start=()=>{resize();if(reduceMotion)draw(0);else requestAnimationFrame(animate);};
  if(document.fonts?.ready)document.fonts.ready.then(start);else start();
})();
