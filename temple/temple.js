(function(){
'use strict';
const button=document.getElementById('navToggle');
const menu=document.getElementById('navLinks');
if(button&&menu){
const close=()=>{menu.classList.remove('open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation')};
button.addEventListener('click',()=>{const show=menu.classList.toggle('open');button.setAttribute('aria-expanded',String(show));button.setAttribute('aria-label',show?'Close navigation':'Open navigation')});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
document.addEventListener('click',event=>{if(!menu.contains(event.target)&&!button.contains(event.target))close()});
}
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReducedMotion&&'IntersectionObserver'in window){
const candidates=Array.from(document.querySelectorAll('.program-spotlight,.program-line,.festival-piece,.studio-about-grid,.seva-links a'));
const observer=new IntersectionObserver(items=>{items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('revealed');observer.unobserve(item.target)}})},{threshold:.08,rootMargin:'0px 0px -15px 0px'});
candidates.forEach(item=>{item.setAttribute('data-animate','');observer.observe(item)});
document.body.classList.add('motion-capable');
}
})();