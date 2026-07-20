(() => {
  const canvas = document.getElementById("orbit-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const nameCanvas = document.createElement("canvas");
  const nameCtx = nameCanvas.getContext("2d", { willReadFrequently:true });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width=0, height=0, nameStars=[];

  const fishData=[
    {y:.59,speed:12,size:.78,start:.08,direction:1,color:"#f0c86e"},
    {y:.66,speed:18,size:1.08,start:.56,direction:-1,color:"#e88b79"},
    {y:.73,speed:10,size:.66,start:.32,direction:1,color:"#78c7c4"},
    {y:.81,speed:15,size:.9,start:.78,direction:-1,color:"#ae9cdb"},
    {y:.88,speed:8,size:.58,start:.18,direction:1,color:"#d9e8ef"},
    {y:.69,speed:7,size:.5,start:.88,direction:1,color:"#75a9df"},
    {y:.84,speed:13,size:.7,start:.46,direction:-1,color:"#e5a4be"},
  ];

  const buildStarName=()=>{
    nameCanvas.width=Math.max(1,Math.round(width));nameCanvas.height=Math.max(1,Math.round(height));
    nameCtx.clearRect(0,0,width,height);
    const fontSize=Math.max(16,Math.min(25,width*.019));
    const spacing=Math.max(2.6,fontSize*.18);
    nameCtx.font=`500 ${fontSize}px Inter, sans-serif`;nameCtx.textBaseline="middle";nameCtx.fillStyle="#fff";
    const text="elizabeth won";
    let x=width<700?width*.08:width*.09;
    const y=height*.16;
    for(const letter of text){nameCtx.fillText(letter,x,y);x+=nameCtx.measureText(letter).width+spacing;}
    const pixels=nameCtx.getImageData(0,0,nameCanvas.width,nameCanvas.height).data;
    nameStars=[];
    const step=3;
    for(let py=Math.max(0,Math.floor(y-fontSize));py<Math.min(height,Math.ceil(y+fontSize));py+=step){
      for(let px=0;px<Math.min(width,x+3);px+=step){
        if(pixels[(py*nameCanvas.width+px)*4+3]>85){
          const seed=(px*17+py*31)%97;
          nameStars.push({x:px,y:py,r:.55+(seed%7)*.09,phase:seed*.19,speed:.35+(seed%11)*.025});
        }
      }
    }
  };

  const resize=()=>{
    const ratio=Math.min(window.devicePixelRatio||1,2);width=canvas.clientWidth;height=canvas.clientHeight;
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
    buildStarName();
  };

  const drawNameStars=(seconds)=>{
    nameStars.forEach((star,index)=>{
      const shimmer=reduceMotion?.78:.48+.4*(.5+.5*Math.sin(seconds*star.speed+star.phase));
      ctx.fillStyle=index%9===0?`rgba(241,199,91,${shimmer*.82})`:`rgba(225,239,255,${shimmer})`;
      ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill();
    });
  };

  const drawSkyStars=(seconds)=>{
    [[.06,.26,1.1],[.13,.36,.7],[.22,.12,1.2],[.34,.3,.7],[.44,.1,.9],[.53,.34,.8],[.64,.18,1.1],[.72,.39,.7],[.87,.11,1],[.94,.29,.8],[.39,.41,.6],[.68,.07,.7]].forEach(([x,y,r],i)=>{
      const a=.32+Math.sin(seconds*.6+i*1.4)*.17;ctx.fillStyle=`rgba(232,241,255,${a})`;
      ctx.beginPath();ctx.arc(width*x,height*y,r,0,Math.PI*2);ctx.fill();
    });
  };

  const drawMoon=(seconds)=>{
    const x=width*.8,y=height*.21,r=Math.min(width,height)*.07;
    const glow=ctx.createRadialGradient(x,y,r*.25,x,y,r*2.2);glow.addColorStop(0,"rgba(241,211,127,.24)");glow.addColorStop(1,"rgba(241,211,127,0)");
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,r*2.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#f1d886";ctx.beginPath();ctx.arc(x,y+Math.sin(seconds*.2)*2,r,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(168,141,76,.15)";ctx.beginPath();ctx.arc(x-r*.25,y-r*.16,r*.12,0,Math.PI*2);ctx.fill();
  };

  const drawPond=(seconds)=>{
    const top=height*.48;const water=ctx.createLinearGradient(0,top,0,height);
    water.addColorStop(0,"#124a73");water.addColorStop(.45,"#0b345f");water.addColorStop(1,"#061a35");ctx.fillStyle=water;ctx.fillRect(0,top,width,height-top);
    for(let i=0;i<17;i+=1){
      const y=top+12+i*(height-top)/18;ctx.beginPath();
      for(let x=-20;x<width+20;x+=10){const wave=Math.sin(x*.018+seconds*.34+i*.68)*2.1;x===-20?ctx.moveTo(x,y+wave):ctx.lineTo(x,y+wave);}
      ctx.strokeStyle=i<7?"rgba(148,199,231,.17)":"rgba(112,160,204,.08)";ctx.lineWidth=.75;ctx.stroke();
    }
    const mx=width*.8;
    for(let i=0;i<11;i+=1){const y=top+13+i*10;const half=16+i*7+Math.sin(seconds*.38+i)*5;ctx.beginPath();ctx.moveTo(mx-half,y);ctx.lineTo(mx+half,y);ctx.strokeStyle=`rgba(241,216,134,${.24-i*.015})`;ctx.lineWidth=1.1;ctx.stroke();}
  };

  const drawFish=(x,y,size,direction,color,seconds,index)=>{
    const s=size*Math.max(.7,Math.min(1.08,width/1300));ctx.save();ctx.translate(x,y+Math.sin(seconds*.85+index)*4);ctx.scale(direction,1);
    ctx.fillStyle=color+"33";ctx.strokeStyle=color;ctx.lineWidth=1.25;
    ctx.beginPath();ctx.moveTo(-32*s,0);ctx.bezierCurveTo(-13*s,-12*s,16*s,-12*s,32*s,0);ctx.bezierCurveTo(16*s,12*s,-13*s,12*s,-32*s,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-32*s,0);ctx.lineTo(-47*s,-12*s);ctx.lineTo(-45*s,12*s);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="#071d3e";ctx.beginPath();ctx.arc(20*s,-2*s,1.7*s,0,Math.PI*2);ctx.fill();ctx.restore();
  };

  const draw=(timestamp)=>{
    const seconds=reduceMotion?0:timestamp*.001;const sky=ctx.createLinearGradient(0,0,0,height*.5);
    sky.addColorStop(0,"#031127");sky.addColorStop(.62,"#08264a");sky.addColorStop(1,"#164b72");ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
    drawSkyStars(seconds);drawMoon(seconds);drawPond(seconds);drawNameStars(seconds);
    fishData.forEach((fish,index)=>{const travel=width+150;const raw=(fish.start*travel+seconds*fish.speed)%travel;const x=fish.direction===1?raw-75:width+75-raw;drawFish(x,height*fish.y,fish.size,fish.direction,fish.color,seconds,index);});
  };

  const animate=time=>{draw(time);if(!reduceMotion)requestAnimationFrame(animate);};
  window.addEventListener("resize",resize);
  const start=()=>{resize();if(reduceMotion)draw(0);else requestAnimationFrame(animate);};
  if(document.fonts?.ready)document.fonts.ready.then(start);else start();
})();
