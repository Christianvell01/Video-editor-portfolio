const inquiryDialog=document.querySelector('#project-inquiry');
const projects=window.portfolioProjects;
const featuredProjects=projects.slice(0,4);
const grid=document.querySelector('#project-grid');
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const playIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14l11-7Z"/></svg>';
grid.innerHTML=projects.map((p,i)=>`<article class="project-card" data-category="${p.filter}"><button class="project-media" data-project="${p.id}" aria-label="Play ${escapeHTML(p.title)}"><img src="${p.image}" alt="${escapeHTML(p.alt)}" loading="lazy" decoding="async"><span class="media-shade"></span><span class="play-circle">${playIcon}</span>${p.duration?`<span class="media-time">${p.duration}</span>`:''}</button><div class="project-info"><div><h3>${escapeHTML(p.title)}</h3><p>${p.category}</p></div><span class="project-index">${String(i+1).padStart(2,'0')}</span></div></article>`).join('');
let activeFilter='all',visibleLimit=12;
const moreButton=document.querySelector('#load-more-work');
const workCount=document.querySelector('#work-count');
function showCollection(){let matched=0;grid.querySelectorAll('.project-card').forEach(card=>{const match=activeFilter==='all'||card.dataset.category===activeFilter;card.hidden=!match||matched>=visibleLimit;if(match)matched++;});const shown=Math.min(matched,visibleLimit);moreButton.hidden=shown>=matched;workCount.textContent=`Showing ${shown} of ${matched} videos`;requestAnimationFrame(()=>{if(typeof revealInView==='function')revealInView();if(typeof requestDepth==='function')requestDepth();});}
moreButton.addEventListener('click',()=>{const firstNext=[...grid.querySelectorAll('.project-card')].find(c=>c.hidden&&(activeFilter==='all'||c.dataset.category===activeFilter));visibleLimit+=12;showCollection();firstNext?.querySelector('button')?.focus({preventScroll:true});});
document.querySelectorAll('.filter').forEach(button=>{const count=projects.filter(p=>button.dataset.filter==='all'||p.filter===button.dataset.filter).length;button.querySelector('span').textContent=String(count).padStart(2,'0');button.addEventListener('click',()=>{activeFilter=button.dataset.filter;visibleLimit=12;document.querySelectorAll('.filter').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});showCollection();});});
let featuredIndex=0;
const picker=document.querySelector('#feature-picker');
picker.innerHTML=featuredProjects.map((p,i)=>`<button type="button" data-feature="${i}" class="${i===0?'active':''}" aria-label="Feature ${escapeHTML(p.title)}" aria-pressed="${i===0}"></button>`).join('');
function updateFeatured(index){featuredIndex=(index+featuredProjects.length)%featuredProjects.length;const p=featuredProjects[featuredIndex];const img=document.querySelector('#feature-image');img.src=p.image;img.alt=p.alt;document.querySelector('#feature-title').textContent=p.title;document.querySelector('#feature-category').textContent=p.category;document.querySelector('#feature-counter').textContent=`${String(featuredIndex+1).padStart(2,'0')} / ${String(featuredProjects.length).padStart(2,'0')}`;document.querySelector('#feature-play').setAttribute('aria-label','Play '+p.title);picker.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===featuredIndex);b.setAttribute('aria-pressed',String(i===featuredIndex));});}
document.querySelector('#feature-prev').addEventListener('click',()=>updateFeatured(featuredIndex-1));
document.querySelector('#feature-next').addEventListener('click',()=>updateFeatured(featuredIndex+1));
picker.addEventListener('click',event=>{const button=event.target.closest('button');if(button)updateFeatured(Number(button.dataset.feature));});
updateFeatured(0);
const dialog=document.querySelector('#video-dialog');
const video=document.querySelector('#project-video');
const drivePlayer=document.querySelector('#drive-player');
let projectTrigger=null;
function playProject(id,trigger){const p=projects.find(x=>x.id===id);if(!p)return;projectTrigger=trigger||document.activeElement;document.querySelector('#dialog-title').textContent=p.title;document.querySelector('#dialog-category').textContent=p.category;document.querySelector('#dialog-description').textContent=p.description;document.querySelector('#watch-drive').href=p.driveUrl;const local=Boolean(p.video);video.hidden=!local;drivePlayer.hidden=local;if(local){drivePlayer.removeAttribute('src');video.src=p.video;video.poster=p.image;}else{video.pause();video.removeAttribute('src');video.load();drivePlayer.title=p.title+' — video player';drivePlayer.src=p.embed;}dialog.showModal();document.body.classList.add('modal-open');if(local)video.play().catch(()=>{});}
grid.addEventListener('click',event=>{const button=event.target.closest('[data-project]');if(button)playProject(button.dataset.project,button);});
document.querySelector('#feature-play').addEventListener('click',event=>playProject(featuredProjects[featuredIndex].id,event.currentTarget));
document.querySelector('#hero-play').addEventListener('click',event=>playProject(projects[0].id,event.currentTarget));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
dialog.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();drivePlayer.removeAttribute('src');document.body.classList.remove('modal-open');projectTrigger?.focus({preventScroll:true});});
const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('#navigation');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
function closeSectionMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open section menu');}
menu.addEventListener('click',()=>menu.setAttribute('aria-label',nav.classList.contains('open')?'Close section menu':'Open section menu'));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeSectionMenu();menu.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeSectionMenu();});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeSectionMenu));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}),{rootMargin:'-10% 0px -65% 0px'});document.querySelectorAll('main>section').forEach(s=>observer.observe(s));
document.querySelector('#year').textContent=new Date().getFullYear();

// A diffuse gradient follows the mouse without replacing its cursor.
const glow=document.querySelector('.cursor-glow');
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const pointerEffects=window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
let pointerX=0,pointerY=0,glowX=0,glowY=0,glowFrame=0,pointerVisible=false;
function resetGradient(){pointerVisible=false;glow.classList.remove('visible');if(glowFrame)cancelAnimationFrame(glowFrame);glowFrame=0;document.documentElement.style.setProperty('--drift-x','0px');document.documentElement.style.setProperty('--drift-y','0px');}
function followGradient(){glowX+=(pointerX-glowX)*0.12;glowY+=(pointerY-glowY)*0.12;glow.style.transform=`translate3d(${glowX}px,${glowY}px,0) translate(-50%,-50%)`;document.documentElement.style.setProperty('--drift-x',`${(glowX/window.innerWidth-.5)*40}px`);document.documentElement.style.setProperty('--drift-y',`${(glowY/window.innerHeight-.5)*30}px`);if(pointerVisible&&Math.abs(pointerX-glowX)+Math.abs(pointerY-glowY)>0.3)glowFrame=requestAnimationFrame(followGradient);else glowFrame=0;}
document.addEventListener('pointermove',event=>{if(!pointerEffects.matches||event.pointerType==='touch'){resetGradient();return;}pointerX=event.clientX;pointerY=event.clientY;if(!pointerVisible){glowX=pointerX;glowY=pointerY;pointerVisible=true;glow.classList.add('visible');}if(!glowFrame)glowFrame=requestAnimationFrame(followGradient);},{passive:true});
document.addEventListener('pointerleave',resetGradient);window.addEventListener('blur',resetGradient);pointerEffects.addEventListener('change',resetGradient);
document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('effects-paused',document.hidden);if(document.hidden)resetGradient();});
// Reveal headings line by line, then bring in each supporting element.
const headingTargets=document.querySelectorAll('.profile-copy h2,.hero-copy h1,#featured h2,#work .work-heading h2,#services .work-heading h2,#contact h2');
headingTargets.forEach(heading=>{
 heading.innerHTML=heading.innerHTML.split(/<br\s*\/?\s*>/i).map((line,index)=>`<span class="reveal-line"><span class="reveal-line-inner" style="--line-delay:${index*110}ms">${line}</span></span>`).join('');
 heading.classList.add('reveal-heading');
});
const revealTargets=document.querySelectorAll('.profile-portrait,.profile-copy>.eyebrow,.profile-copy h2,.profile-role,.profile-bio,.profile-specialties,.profile-actions,.hero-copy>.eyebrow,.hero-copy h1,.hero-copy>.intro-copy,.hero-actions,.author,.hero-visual,.approach>div,#featured .section-heading>.eyebrow,#featured h2,#featured .section-heading>.muted,#featured .text-link,.featured-controls,.feature-panel,#work .work-heading,.filters,.project-card,#services .work-heading,.services-grid article,#contact>div');
let revealObserver;
function showReveal(element){element.classList.add('is-visible');revealObserver?.unobserve(element);}
function revealInView(){if(document.body.classList.contains('intro-active'))return;revealTargets.forEach(element=>{const rect=element.getBoundingClientRect();if(rect.top<innerHeight*.94&&rect.bottom>0)showReveal(element);});}
if(!motionPreference.matches&&'IntersectionObserver' in window){
 revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting&&!document.body.classList.contains('intro-active'))showReveal(entry.target);});},{threshold:0,rootMargin:'0px 0px -6% 0px'});
 revealTargets.forEach((element,index)=>{element.classList.add('will-reveal');element.style.setProperty('--reveal-delay',`${index%3*100}ms`);revealObserver.observe(element);});
}
// Scroll-linked depth uses native scrolling and only updates visible artwork.
const depthTargets=document.querySelectorAll('.hero-reel,.featured-media,.project-media');
const visibleDepth=new Set();let depthFrame=0;
function updateDepth(){
 depthFrame=0;if(motionPreference.matches||document.hidden)return;
 visibleDepth.forEach(element=>{const rect=element.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(innerHeight/2-rect.top-rect.height/2)/(innerHeight/2+rect.height/2)));element.style.setProperty('--image-shift',`${progress*Math.min(innerWidth<=760?14:32,rect.height*.055)}px`);});
 document.documentElement.style.setProperty('--scroll-depth',`${Math.min(scrollY*.045,110)}px`);
}
function requestDepth(){if(!depthFrame&&!motionPreference.matches&&!document.hidden)depthFrame=requestAnimationFrame(updateDepth);}
if('IntersectionObserver' in window){const depthObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)visibleDepth.add(entry.target);else visibleDepth.delete(entry.target);});requestDepth();},{rootMargin:'100px'});depthTargets.forEach(element=>depthObserver.observe(element));}
window.addEventListener('scroll',requestDepth,{passive:true});window.addEventListener('resize',requestDepth,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&depthFrame){cancelAnimationFrame(depthFrame);depthFrame=0;}else requestDepth();});
motionPreference.addEventListener('change',()=>{resetGradient();if(motionPreference.matches){revealTargets.forEach(showReveal);revealObserver?.disconnect();if(depthFrame)cancelAnimationFrame(depthFrame);depthFrame=0;depthTargets.forEach(element=>element.style.removeProperty('--image-shift'));document.documentElement.style.removeProperty('--scroll-depth');}else requestDepth();});

const openingIntro=document.querySelector('#opening-intro');
let introTimer=0;
function finishIntro(){clearTimeout(introTimer);if(openingIntro.open)openingIntro.close();document.body.classList.remove('intro-active');revealInView();requestDepth();}
function startIntro(){if(openingIntro.open)return;document.body.classList.add('intro-active');openingIntro.showModal();introTimer=setTimeout(finishIntro,motionPreference.matches?250:4000);}
document.querySelector('#skip-intro').addEventListener('click',finishIntro);
document.querySelector('#replay-intro').addEventListener('click',startIntro);
openingIntro.addEventListener('close',()=>{clearTimeout(introTimer);document.body.classList.remove('intro-active');revealInView();requestDepth();});
motionPreference.addEventListener('change',()=>{if(motionPreference.matches)finishIntro();});
// Play on every visit and reload, including links to a section.
startIntro();
window.addEventListener('pageshow',event=>{if(event.persisted&&!dialog.open&&!inquiryDialog.open)startIntro();});

// Keep the top navigation in the background, then fade it as the page moves.
const fadingHeader=document.querySelector('.gallery-header');
let headerFrame=0;
function updateHeaderFade(){
 headerFrame=0;
 const progress=Math.min(1,Math.max(0,window.scrollY/180));
 fadingHeader.style.setProperty('--header-opacity',String(motionPreference.matches?(progress<1?1:0):1-progress));
 fadingHeader.classList.toggle('header-away',progress>=1);
 if(progress>=1)closeSectionMenu();
}
function requestHeaderFade(){if(!headerFrame)headerFrame=requestAnimationFrame(updateHeaderFade);}
window.addEventListener('scroll',requestHeaderFade,{passive:true});
window.addEventListener('pageshow',requestHeaderFade);
motionPreference.addEventListener('change',requestHeaderFade);
updateHeaderFade();


// Responsive HD ribbon loop with an explicit pause control.
const ribbonVideo=document.querySelector('.ribbon-background');
const ambientToggle=document.querySelector('#ambient-toggle');
const ribbonViewport=window.matchMedia('(max-width:760px)');
let backgroundPaused=false;
ribbonVideo.muted=true;
function syncRibbonMotion(){
 const reduced=motionPreference.matches;
 ambientToggle.disabled=reduced;
 ambientToggle.setAttribute('aria-pressed',String(backgroundPaused||reduced));
 ambientToggle.setAttribute('aria-label',backgroundPaused?'Play background animation':'Pause background animation');
 ambientToggle.querySelector('.motion-label').textContent=reduced?'Motion reduced':backgroundPaused?'Play motion':'Pause motion';
 ambientToggle.querySelector('.motion-symbol').textContent=backgroundPaused?'▷':'Ⅱ';
 const pause=backgroundPaused||reduced||document.hidden||dialog.open||openingIntro.open||inquiryDialog.open;
 if(pause){ribbonVideo.pause();return;}
 const source=ribbonViewport.matches?ribbonVideo.dataset.mobile:ribbonVideo.dataset.desktop;
 if(ribbonVideo.getAttribute('src')!==source)ribbonVideo.src=source;
 ribbonVideo.play().catch(()=>{});
}
ambientToggle.addEventListener('click',()=>{backgroundPaused=!backgroundPaused;syncRibbonMotion();});
motionPreference.addEventListener('change',syncRibbonMotion);
ribbonViewport.addEventListener('change',syncRibbonMotion);
document.addEventListener('visibilitychange',syncRibbonMotion);
for(const modal of [dialog,openingIntro,inquiryDialog]){new MutationObserver(syncRibbonMotion).observe(modal,{attributes:true,attributeFilter:['open']});}
syncRibbonMotion();

// Subtle depth and silver highlights respond to the pointer, never touch scroll.
const interactiveMedia=document.querySelectorAll('.hero-reel,.featured-media,.project-media');
interactiveMedia.forEach(element=>{const spotlight=document.createElement('span');spotlight.className='media-spotlight';spotlight.setAttribute('aria-hidden','true');element.append(spotlight);});
const interactiveSurfaces=document.querySelectorAll('.hero-reel,.featured-media,.project-media,.interactive-surface');
let surfaceFrame=0,pendingSurface=null;
function clearSurface(element){element.style.removeProperty('--light-x');element.style.removeProperty('--light-y');element.style.removeProperty('--tilt-x');element.style.removeProperty('--tilt-y');}
interactiveSurfaces.forEach(element=>{
 element.addEventListener('pointermove',event=>{
  if(!pointerEffects.matches||event.pointerType==='touch')return;
  const rect=element.getBoundingClientRect();pendingSurface={element,x:(event.clientX-rect.left)/rect.width,y:(event.clientY-rect.top)/rect.height};
  if(!surfaceFrame)surfaceFrame=requestAnimationFrame(()=>{surfaceFrame=0;if(!pendingSurface)return;const {element,x,y}=pendingSurface;element.style.setProperty('--light-x',`${x*100}%`);element.style.setProperty('--light-y',`${y*100}%`);element.style.setProperty('--tilt-x',`${(.5-y)*3}deg`);element.style.setProperty('--tilt-y',`${(x-.5)*3}deg`);});
 },{passive:true});
 element.addEventListener('pointerleave',()=>{if(pendingSurface?.element===element)pendingSurface=null;clearSurface(element);});
});
pointerEffects.addEventListener('change',()=>{pendingSurface=null;interactiveSurfaces.forEach(clearSurface);});
// The inquiry form composes an email for the visitor to review; nothing is sent here.
const inquiryButton=document.querySelector('#open-inquiry');
let inquiryTrigger=inquiryButton;
function openProjectInquiry(trigger){inquiryTrigger=trigger;closeSectionMenu();inquiryDialog.showModal();document.body.classList.add('modal-open');}
inquiryButton.addEventListener('click',()=>openProjectInquiry(inquiryButton));
document.querySelector('#contact-inquiry').addEventListener('click',event=>openProjectInquiry(event.currentTarget));
document.querySelector('#close-inquiry').addEventListener('click',()=>inquiryDialog.close());
inquiryDialog.addEventListener('click',event=>{const rect=inquiryDialog.getBoundingClientRect();if(event.target===inquiryDialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))inquiryDialog.close();});
inquiryDialog.addEventListener('close',()=>{if(!dialog.open)document.body.classList.remove('modal-open');inquiryTrigger.focus({preventScroll:true});});
function composeProjectEmail(details){
 const subject=`Project inquiry — ${details.projectType}`;
 const body=[`Name: ${details.name}`,`Email: ${details.email}`,`Company / Brand: ${details.company||'Not specified'}`,`Project type: ${details.projectType}`,'',details.message].join('\n');
 return `mailto:belarmachristian@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
document.querySelector('#inquiry-form').addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
 const details=Object.fromEntries(new FormData(form));
 window.location.href=composeProjectEmail(details);
 document.querySelector('#inquiry-form-status').textContent='Your email draft is ready to open in your email app. Review it there before sending.';
});
document.querySelector('#copy-discord').addEventListener('click',async()=>{const status=document.querySelector('#discord-status');try{await navigator.clipboard.writeText('veloz01_');status.textContent='Discord username copied.';}catch{status.textContent='Discord username: veloz01_';}});

document.querySelector('#contact-discord').addEventListener('click',async()=>{const status=document.querySelector('#contact-chip-status');try{await navigator.clipboard.writeText('veloz01_');status.textContent='Discord username copied.';}catch{status.textContent='Discord username: veloz01_';}});

// Preview only while its hero is visible; the complete edit opens on request.
const heroPreview=document.querySelector('#hero-preview');
let heroOnScreen=false;
function syncHeroPreview(){const pause=!heroOnScreen||backgroundPaused||motionPreference.matches||document.hidden||dialog.open||openingIntro.open||inquiryDialog.open;if(pause){heroPreview.pause();return;}if(!heroPreview.getAttribute('src'))heroPreview.src=heroPreview.dataset.src;heroPreview.muted=true;heroPreview.play().catch(()=>{});}
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{heroOnScreen=entries[0].isIntersecting;syncHeroPreview();},{threshold:.15}).observe(heroPreview);
else{heroOnScreen=true;syncHeroPreview();}
for(const modal of [dialog,openingIntro,inquiryDialog])new MutationObserver(syncHeroPreview).observe(modal,{attributes:true,attributeFilter:['open']});
ambientToggle.addEventListener('click',syncHeroPreview);motionPreference.addEventListener('change',syncHeroPreview);document.addEventListener('visibilitychange',syncHeroPreview);
showCollection();
