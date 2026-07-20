(() => {
  const cursor=document.querySelector('.star-cursor');
  if(!cursor||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  let x=-100,y=-100,currentX=-100,currentY=-100;
  addEventListener('mousemove',event=>{x=event.clientX-12;y=event.clientY-12;cursor.classList.add('is-visible')});
  document.addEventListener('mouseleave',()=>cursor.classList.remove('is-visible'));
  document.addEventListener('mouseover',event=>cursor.classList.toggle('is-hovering',Boolean(event.target.closest('a,button'))));
  const follow=()=>{currentX+=(x-currentX)*.24;currentY+=(y-currentY)*.24;cursor.style.transform=`translate3d(${currentX}px,${currentY}px,0)`;requestAnimationFrame(follow)};
  requestAnimationFrame(follow);
})();
