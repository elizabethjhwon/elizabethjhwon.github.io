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
  function moon(){const x=width*.82,y=height*.22,r=Math.min(width,height)*.075;ctx.save();ctx.shadowColor='rgba(229,239,255,.45)';ctx.shadowBlur=22;ctx.fillStyle='#e9f1f3';ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,Math.PI/2);ctx.arc(x-r*.38,y,r*.86,Math.PI/2,-Math.PI/2,true);ctx.closePath();ctx.fill();ctx.restore()}
  function water(t){const top=height*.49,g=ctx.createLinearGradient(0,top,0,height);g.addColorStop(0,'#12496f');g.addColorStop(.5,'#0a345c');g.addColorStop(1,'#061a35');ctx.fillStyle=g;ctx.fillRect(0,top,width,height-top);for(let i=0;i<18;i++){const y=top+10+i*(height-top)/19;const pts=[];for(let j=0;j<34;j++)pts.push([j*width/33,y+Math.sin(j*.68+t*.34+i*.7)*1.7]);path(pts,i<7?'rgba(151,205,230,.16)':'rgba(112,160,204,.08)',.7)}}
  function storyFish(px,py,size,dir,body,tail,t,index){const s=size*Math.max(.72,Math.min(1.08,width/1250));ctx.save();ctx.translate(px,py+Math.sin(t*.9+index)*5);ctx.scale(dir,1);ctx.lineWidth=1.35;ctx.strokeStyle='#dce9f2';ctx.lineJoin='round';
    const flutter=Math.sin(t*4.2+index*1.7)*.24;ctx.save();ctx.translate(-37*s,0);ctx.rotate(flutter);ctx.fillStyle=tail+'aa';ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-12*s,-10*s,-24*s,-34*s,-31*s,-27*s);ctx.quadraticCurveTo(-21*s,0,-32*s,29*s);ctx.bezierCurveTo(-22*s,34*s,-11*s,12*s,0,10*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-39*s,0);ctx.bezierCurveTo(-27*s,-34*s,22*s,-37*s,42*s,-8*s);ctx.quadraticCurveTo(50*s,4*s,39*s,17*s);ctx.bezierCurveTo(14*s,39*s,-29*s,30*s,-39*s,0);ctx.fill();ctx.stroke();
    ctx.save();ctx.beginPath();ctx.moveTo(-36*s,0);ctx.bezierCurveTo(-26*s,-31*s,21*s,-34*s,39*s,-7*s);ctx.quadraticCurveTo(45*s,4*s,36*s,15*s);ctx.bezierCurveTo(13*s,35*s,-27*s,28*s,-36*s,0);ctx.clip();for(let row=-2;row<3;row++){for(let col=-2;col<4;col++){const sx=(-13+col*13+(row%2)*6)*s,sy=(row*11)*s;ctx.fillStyle=scaleColors[(index*2+row+col+14)%scaleColors.length];ctx.beginPath();ctx.arc(sx,sy,6.6*s,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(7,29,62,.42)';ctx.lineWidth=.75;ctx.stroke()}}ctx.restore();
    const finFlutter=Math.sin(t*3.4+index)*.12;ctx.fillStyle=body;ctx.save();ctx.translate(5*s,-28*s);ctx.rotate(finFlutter);ctx.beginPath();ctx.moveTo(-8*s,0);ctx.quadraticCurveTo(0,-25*s,10*s,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();ctx.save();ctx.translate(10*s,27*s);ctx.rotate(-finFlutter);ctx.beginPath();ctx.moveTo(-8*s,0);ctx.quadraticCurveTo(0,22*s,11*s,-2*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    ctx.fillStyle='#f3f0e7';ctx.beginPath();ctx.arc(29*s,-9*s,8*s,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#071d3e';ctx.beginPath();ctx.arc(31*s,-8*s,2.8*s,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f0ca63';ctx.beginPath();ctx.ellipse(43*s,8*s,8*s,4*s,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(34*s,14*s);ctx.bezierCurveTo(40*s,22*s,31*s,28*s,38*s,35*s);ctx.stroke();ctx.beginPath();ctx.moveTo(29*s,15*s);ctx.bezierCurveTo(22*s,23*s,29*s,29*s,20*s,35*s);ctx.stroke();
    ctx.restore()}
  function draw(ms){const t=reduce?0:ms/1000,g=ctx.createLinearGradient(0,0,0,height*.52);g.addColorStop(0,'#031127');g.addColorStop(.7,'#08264a');g.addColorStop(1,'#164a70');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);moon();water(t);fish.forEach((f,i)=>{const travel=width+180,raw=(f.start*travel+t*f.speed)%travel,px=f.dir>0?raw-90:width+90-raw;storyFish(px,height*f.y,f.size,f.dir,f.body,f.tail,t,i)});ctx.fillStyle='#f6f2e8';ctx.textBaseline='middle';ctx.font=`400 ${Math.max(30,Math.min(58,width*.047))}px Newsreader,Georgia,serif`;ctx.fillText('elizabeth won',width<600?width*.08:width*.1,height*.16);if(!reduce)requestAnimationFrame(draw)}
  addEventListener('resize',resize);document.fonts.ready.then(()=>{resize();requestAnimationFrame(draw)});
})();
