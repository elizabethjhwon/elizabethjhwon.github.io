(()=>{
  const canvas=document.querySelector('#orbit-field'),ctx=canvas.getContext('2d');
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let width,height,dpr;
  const fish=[
    {y:.62,speed:12,start:.06,dir:1,size:.78,body:'#78aee1',tail:'#d9a8cf'},
    {y:.71,speed:17,start:.64,dir:-1,size:1.05,body:'#dc806d',tail:'#f1ca64'},
    {y:.81,speed:9,start:.28,dir:1,size:.66,body:'#82c6bd',tail:'#9db2df'},
    {y:.88,speed:13,start:.82,dir:-1,size:.82,body:'#a894d1',tail:'#eaa0b8'},
    {y:.75,speed:7,start:.92,dir:1,size:.55,body:'#e2b46d',tail:'#79b9cf'}
  ];
  const scaleColors=['#efc85f','#e8897d','#83c8bc','#b59bd6','#edf0e7','#6da5d7','#e8a2bf'];
  function resize(){dpr=Math.min(devicePixelRatio||1,2);width=canvas.clientWidth;height=canvas.clientHeight;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  function path(points,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}
  function moon(){const x=width*.82,y=height*.2,r=Math.min(width,height)*.038;ctx.save();ctx.shadowColor='rgba(229,239,255,.5)';ctx.shadowBlur=16;ctx.fillStyle='#e9f1f3';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(173,194,211,.18)';ctx.beginPath();ctx.arc(x-r*.28,y-r*.18,r*.15,0,Math.PI*2);ctx.arc(x+r*.2,y+r*.22,r*.1,0,Math.PI*2);ctx.fill();ctx.restore()}
  function water(t){const top=height*.49,g=ctx.createLinearGradient(0,top,0,height);g.addColorStop(0,'#12496f');g.addColorStop(.5,'#0a345c');g.addColorStop(1,'#061a35');ctx.fillStyle=g;ctx.fillRect(0,top,width,height-top);for(let i=0;i<18;i++){const y=top+10+i*(height-top)/19;const pts=[];for(let j=0;j<34;j++)pts.push([j*width/33,y+Math.sin(j*.68+t*.34+i*.7)*1.7]);path(pts,i<7?'rgba(151,205,230,.16)':'rgba(112,160,204,.08)',.7)}}
  function storyFish(px,py,size,dir,body,tail,t,index){const s=size*.67*Math.max(.72,Math.min(1.08,width/1250));ctx.save();ctx.translate(px,py+Math.sin(t*.9+index)*5);ctx.scale(dir,1);ctx.lineWidth=1.15;ctx.strokeStyle='#dce9f2';ctx.lineJoin='round';
    const flutter=Math.sin(t*4.2+index*1.7)*.3;ctx.save();ctx.translate(-30*s,0);ctx.rotate(flutter);ctx.fillStyle=tail+'b8';for(let petal=0;petal<5;petal++){const angle=(-1.05+petal*.52)+Math.sin(t*3+petal+index)*.05;ctx.save();ctx.rotate(angle);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-13*s,-4*s,-28*s,-10*s,-34*s,0);ctx.bezierCurveTo(-26*s,11*s,-12*s,9*s,0,3*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}ctx.restore();
    ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-31*s,0);ctx.bezierCurveTo(-18*s,-11*s,18*s,-12*s,34*s,-3*s);ctx.quadraticCurveTo(40*s,1*s,34*s,5*s);ctx.bezierCurveTo(15*s,13*s,-18*s,11*s,-31*s,0);ctx.fill();ctx.stroke();
    for(let i=0;i<4;i++){ctx.fillStyle=scaleColors[(index+i*2)%scaleColors.length];ctx.beginPath();ctx.arc((-12+i*10)*s,0,3.2*s,0,Math.PI*2);ctx.fill()}
    const fin=Math.sin(t*3.4+index)*.16;ctx.fillStyle=tail+'9e';ctx.save();ctx.translate(0,-8*s);ctx.rotate(fin);ctx.beginPath();ctx.moveTo(-5*s,0);ctx.quadraticCurveTo(0,-15*s,8*s,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    ctx.fillStyle='#f3f0e7';ctx.beginPath();ctx.arc(28*s,-3*s,4.5*s,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#071d3e';ctx.beginPath();ctx.arc(29*s,-3*s,1.7*s,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f0ca63';ctx.beginPath();ctx.ellipse(37*s,3*s,4.5*s,2.1*s,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore()}
  function draw(ms){const t=reduce?0:ms/1000,g=ctx.createLinearGradient(0,0,0,height*.52);g.addColorStop(0,'#031127');g.addColorStop(.7,'#08264a');g.addColorStop(1,'#164a70');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);moon();water(t);fish.forEach((f,i)=>{const travel=width+180,raw=(f.start*travel+t*f.speed)%travel,px=f.dir>0?raw-90:width+90-raw;storyFish(px,height*f.y,f.size,f.dir,f.body,f.tail,t,i)});ctx.fillStyle='#f6f2e8';ctx.textBaseline='middle';ctx.font=`400 ${Math.max(30,Math.min(58,width*.047))}px Newsreader,Georgia,serif`;ctx.fillText('elizabeth won',width<600?width*.08:width*.1,height*.16);if(!reduce)requestAnimationFrame(draw)}
  addEventListener('resize',resize);document.fonts.ready.then(()=>{resize();requestAnimationFrame(draw)});
})();
