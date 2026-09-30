const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav"),searchBtn=document.getElementById("searchBtn");
menuBtn?.addEventListener("click",()=>{
  nav?.classList.toggle("open");
  menuBtn?.setAttribute("aria-expanded",nav?.classList.contains("open")?"true":"false");
});
const searchPanel=document.getElementById("searchPanel"),closeSearch=document.getElementById("closeSearch"),siteSearch=document.getElementById("siteSearch"),searchResults=document.getElementById("searchResults");
function openSearch(){
  if(!searchPanel)return;
  searchPanel.classList.add("open");
  searchPanel.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  renderSearch("");
  setTimeout(()=>siteSearch?.focus(),50);
}
function closeSearchPanel(){
  searchPanel?.classList.remove("open");
  searchPanel?.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
searchBtn?.addEventListener("click",openSearch);
closeSearch?.addEventListener("click",closeSearchPanel);
searchPanel?.addEventListener("click",e=>{if(e.target===searchPanel)closeSearchPanel();});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeSearchPanel();
  if(e.key==="/"&&!/input|textarea|select/i.test(document.activeElement?.tagName)){e.preventDefault();openSearch();}
});
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function renderSearch(query){
  if(!searchResults)return;
  const q=query.trim().toLowerCase();
  const items=[...document.querySelectorAll("main article:not(.puzzle-card):not(.video-card):not(.video-feature)")].map(a=>{
    const title=a.querySelector("h3,h2")?.textContent.trim()||"";
    const label=a.querySelector("label")?.textContent.trim()||"WORLD NEWS";
    const body=a.querySelector("p")?.textContent.trim()||"";
    const story=a.dataset.story;
    return {story,title,label,body};
  }).filter(x=>x.title&&x.story!==undefined);
  const matches=q?items.filter(x=>(x.title+" "+x.label+" "+x.body).toLowerCase().includes(q)):items.slice(0,8);
  searchResults.innerHTML=matches.length
    ? matches.map(x=>'<a class="search-result" href="article.html?story='+encodeURIComponent(x.story)+'"><small>'+escapeHTML(x.label)+'</small><strong>'+escapeHTML(x.title)+'</strong><span class="search-snippet">'+escapeHTML(x.body.slice(0,150))+(x.body.length>150?"…":"")+'</span></a>').join("")
    : '<div class="search-empty">No stories matched your search. Try a broader topic, region or keyword.</div>';
}
siteSearch?.addEventListener("input",e=>renderSearch(e.target.value));

document.getElementById("subscribe")?.addEventListener("submit",e=>{e.preventDefault();const email=e.target.querySelector("input").value;const button=e.target.querySelector("button");button.textContent="Subscribed ✓";button.disabled=true;e.target.querySelector("input").value="";});
function updateSiteDates(){
 const now=new Date();
 const opts={timeZone:"Asia/Kolkata"};
 const full=new Intl.DateTimeFormat("en-IN",{...opts,weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(now);
 const short=new Intl.DateTimeFormat("en-IN",{...opts,month:"long",day:"numeric"}).format(now);
 const time=new Intl.DateTimeFormat("en-IN",{...opts,hour:"2-digit",minute:"2-digit",hour12:false,timeZoneName:"short"}).format(now);
 const dateLine=document.getElementById("dateLine");
 if(dateLine) dateLine.textContent=full;
 document.querySelectorAll(".site-date").forEach(el=>el.textContent=full);
 document.querySelectorAll(".site-date-short").forEach(el=>el.textContent=short.toUpperCase());
 document.querySelectorAll(".site-time").forEach(el=>el.textContent=time);
}
updateSiteDates();
function scheduleNextDateRefresh(){
 const now=new Date();
 const istNow=new Date(now.toLocaleString("en-US",{timeZone:"Asia/Kolkata"}));
 const next=new Date(istNow);
 next.setHours(24,0,2,0);
 setTimeout(()=>{updateSiteDates();scheduleNextDateRefresh();},Math.max(1000,next-istNow));
}
scheduleNextDateRefresh();


if(location.pathname.endsWith("index.html")||location.pathname.endsWith("/")){
 const sectionStoryMap={
   entertainment:["Films & Celebrities","Celebrity desk","Reviews & Culture"],
   sports:["Global Sport","Cricket","Football · Tennis · More"],
   markets:["Stocks","Markets","Personal Finance"]
 };
 Object.entries(sectionStoryMap).forEach(([section,labels])=>{
   const root=document.getElementById(section);
   if(!root)return;
   root.querySelectorAll("article").forEach((article,i)=>article.dataset.choiceSection=section);
 });

 const realPhotoPool=[
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9922619.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9922617.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9922620.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9913079.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9913090.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9913096.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9968174.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9968176.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9968175.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9926689.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9926683.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9926673.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9923573.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9959626.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9943540.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9943508.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9943542.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9943494.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9915832.jpg",
  "https://d34w7g4gy10iej.cloudfront.net/photos/2609/9925475.jpg"
 ];let photoIndex=0;
 const photoUrl=url=>url;
 const articles=[...document.querySelectorAll("main article")];
 articles.forEach((article,i)=>{
   article.dataset.story=i;
   let img=article.querySelector("img");
   if(!img){
     img=document.createElement("img");
     article.insertBefore(img,article.firstChild);
     const name=realPhotoPool[photoIndex%realPhotoPool.length];
     photoIndex++;
     img.src=photoUrl(name);
     img.alt="News photograph";
     img.dataset.photoSource="Public-domain U.S. government photography via DVIDS/Wikimedia Commons";
   }
   img.classList.add("thumbimg","story-thumb"); img.loading="lazy"; img.decoding="async";
   img.removeAttribute("srcset");
   img.removeAttribute("sizes");
   img.addEventListener("error",()=>{ if(!img.dataset.fallbackTried){ img.dataset.fallbackTried="1"; const name=realPhotoPool[(i+photoIndex)%realPhotoPool.length]; photoIndex++; img.src=photoUrl(name); img.dataset.photoSource="Public-domain fallback photography"; } });
   const headline=article.querySelector("h3");
   if(headline&&!headline.querySelector("a")){
     const link=document.createElement("a");
     link.href="article.html?story="+i;
     link.textContent=headline.textContent;
     headline.textContent="";
     headline.appendChild(link);
   }
 });
}

/* Premium newsroom controls */
(function(){
  const progress=document.createElement("div");
  progress.id="readingProgress";
  document.body.appendChild(progress);

  const topBtn=document.createElement("button");
  topBtn.id="backToTop";
  topBtn.type="button";
  topBtn.setAttribute("aria-label","Back to top");
  topBtn.innerHTML="↑";
  document.body.appendChild(topBtn);

  function updateProgress(){
    const doc=document.documentElement;
    const max=doc.scrollHeight-window.innerHeight;
    const pct=max>0 ? (window.scrollY/max)*100 : 0;
    progress.style.width=Math.min(100,Math.max(0,pct))+"%";
    topBtn.classList.toggle("visible",window.scrollY>520);
  }
  window.addEventListener("scroll",updateProgress,{passive:true});
  window.addEventListener("resize",updateProgress);
  topBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  updateProgress();
})();


/* Premium image presentation */
(function(){
  const images=[...document.querySelectorAll("main img")].filter(img=>{
    return !img.closest(".site-brand") && !img.closest(".image-ui");
  });

  function makeImageUI(img){
    const wrapper=document.createElement("div");
    wrapper.className="image-ui";
    const parent=img.parentNode;
    parent.insertBefore(wrapper,img);
    wrapper.appendChild(img);

    const article=img.closest("article");
    const label=article ? article.querySelector("label") : null;
    const badge=document.createElement("span");
    badge.className="image-badge";
    badge.textContent=(label?.textContent||"WORLD").split("·")[0].trim().slice(0,24);
    wrapper.appendChild(badge);

    const meta=document.createElement("div");
    meta.className="image-meta";
    const caption=document.createElement("span");
    caption.className="image-caption";
    caption.textContent=img.alt||"Saffron Globe News";
    const credit=document.createElement("span");
    credit.className="image-credit";
    credit.textContent=img.dataset.photoSource?"FILE / LICENSE":"SAFFRON GLOBE";
    meta.append(caption,credit);
    wrapper.appendChild(meta);

    const zoom=document.createElement("button");
    zoom.className="image-zoom";
    zoom.type="button";
    zoom.setAttribute("aria-label","View image larger");
    zoom.innerHTML="⤢";
    zoom.addEventListener("click",()=>openLightbox(img));
    wrapper.appendChild(zoom);
  }

  const lightbox=document.createElement("div");
  lightbox.className="image-lightbox";
  lightbox.setAttribute("aria-hidden","true");
  lightbox.innerHTML='<button class="lightbox-close" type="button" aria-label="Close image">×</button><img alt=""><div class="lightbox-caption"></div>';
  document.body.appendChild(lightbox);
  const lbImg=lightbox.querySelector("img");
  const lbCaption=lightbox.querySelector(".lightbox-caption");

  function openLightbox(img){
    lbImg.src=img.currentSrc||img.src;
    lbImg.alt=img.alt||"";
    lbCaption.textContent=img.alt||"";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
  }
  function closeLightbox(){
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
    lbImg.removeAttribute("src");
  }
  lightbox.querySelector(".lightbox-close").addEventListener("click",closeLightbox);
  lightbox.addEventListener("click",e=>{if(e.target===lightbox) closeLightbox()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape") closeLightbox()});

  images.forEach(makeImageUI);
})();


/* Newspaper puzzle interactions */
(function(){
 const check=document.querySelector('.puzzle-check[data-puzzle="crossword"]');
 const result=document.getElementById('crosswordResult');
 check?.addEventListener('click',()=>{
   const cells=[...document.querySelectorAll('.crossword input')];
   const correct=cells.filter(x=>x.value.trim().toUpperCase()===x.dataset.answer).length;
   result.textContent=correct===cells.length?'Perfect — crossword solved!':correct+' of '+cells.length+' letters correct.';
 });
 document.querySelector('.puzzle-reset')?.addEventListener('click',()=>{
   document.querySelectorAll('.crossword input').forEach(x=>x.value='');
   if(result) result.textContent='';
 });
 document.querySelector('.word-reveal')?.addEventListener('click',()=>{
   document.querySelectorAll('.word-grid button').forEach((b,i)=>{if(i<5||i>=6&&i<12||i>=12&&i<17||i>=18&&i<22||i>=24&&i<28)b.classList.add('found')});
   const r=document.getElementById('wordResult');if(r)r.textContent='Words revealed: WORLD, PEACE, TRADE, ASIA, NEWS.';
 });
 document.querySelectorAll('.word-grid button').forEach(btn=>btn.addEventListener('click',()=>btn.classList.toggle('found')));
 document.querySelector('.sudoku-check')?.addEventListener('click',()=>{
   const vals=[...document.querySelectorAll('.sudoku-grid input')].slice(0,6).map(x=>x.value.trim());
   const r=document.getElementById('sudokuResult');
   r.textContent=vals.length===6&&new Set(vals).size===6?'Row looks good.':'Fill the row with six different numbers.';
 });
})();

/* Today's Newspaper compositor */
(function(){
 const paper=document.getElementById("dailyPaper"); if(!paper)return;
 const sourceArticles=[...document.querySelectorAll("main article")].filter(a=>!a.closest("#todayspaper")&&!a.classList.contains("puzzle-card")&&!a.classList.contains("video-card")&&!a.classList.contains("video-feature"));
 const lead=paper.querySelector(".paper-lead");
 const cards=sourceArticles.slice(0,4);
 function copyCard(target,source){
   if(!target||!source)return;
   const img=source.querySelector("img"); const h=source.querySelector("h3,h2"); const p=source.querySelector("p"); const label=source.querySelector("label");
   if(img){const pi=target.querySelector("img");if(pi){pi.src=img.currentSrc||img.src;pi.alt=img.alt||"News photograph"}}
   if(h){const t=target.querySelector("h3,h4");if(t)t.textContent=h.textContent.replace(/\s+/g," ").trim()}
   if(p){const pt=target.querySelector("p");if(pt)pt.textContent=p.textContent.replace(/\s+/g," ").trim()}
   if(label){const l=target.querySelector(".paper-section");if(l)l.textContent=label.textContent}
 }
 copyCard(lead,cards[0]);
 const sourceLink=cards[0]?.querySelector(".source");
 if(sourceLink){const s=lead.querySelector(".paper-source");s.textContent="Reporting / source: "+(sourceLink.textContent||"Original publisher").replace("→","").trim()}
 const cols=[...paper.querySelectorAll(".paper-columns article")]; cols.forEach((el,i)=>copyCard(el,cards[i+1]));
 const briefBox=document.getElementById("paperBriefs");
 if(briefBox){briefBox.innerHTML=sourceArticles.slice(4,10).map(a=>{const h=a.querySelector("h3,h2")?.textContent.trim()||"";const p=a.querySelector("p")?.textContent.trim()||"";const l=a.querySelector("label")?.textContent.trim()||"WORLD";return '<article class="paper-brief"><small>'+escapeHTML(l)+'</small><strong>'+escapeHTML(h)+'</strong><p>'+escapeHTML(p.slice(0,115))+(p.length>115?"…":"")+'</p></article>'}).join("")}
 document.getElementById("printPaper")?.addEventListener("click",()=>window.print());
})();

/* Live feed hook */
(async()=>{try{const r=await fetch("data/news.json",{cache:"no-store"});if(!r.ok)return;const f=await r.json();window.SAFFRON_NEWS=f;window.dispatchEvent(new Event("newsFeedUpdated"));}catch(e){console.warn("News feed unavailable",e);}})();

/* Render live feed into the main desks */
window.addEventListener("newsFeedUpdated",()=>{
 const feed=window.SAFFRON_NEWS?.stories||[]; if(!feed.length)return;
 const esc=v=>escapeHTML(v||"");
 const label=v=>({world:"WORLD NEWS",business:"BUSINESS & MARKETS",entertainment:"ENTERTAINMENT",sports:"SPORTS"}[v]||"GLOBAL NEWS");
 const put=(el,s,i)=>{
  if(!el)return;
  const image=s.image?'<div class="choice-image auto-news-image"><img src="'+esc(s.image)+'" alt="'+esc(s.title)+'" loading="lazy"></div>':'';
  el.innerHTML=image+'<label>'+esc(label(s.category))+'</label><h3><a href="article.html?auto='+i+'">'+esc(s.title)+'</a></h3><p>'+esc(s.description||s.content)+'</p><a class="source" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">Original report · '+esc(s.source)+' →</a>';
 };
 feed.filter(x=>x.category==="world").slice(0,3).forEach((s,i)=>put(document.querySelectorAll("#latest .cards article")[i],s,i));
 ["entertainment","sports"].forEach(cat=>feed.filter(x=>x.category===cat).slice(0,3).forEach((s,i)=>put(document.querySelectorAll("#"+cat+" .choice-grid article")[i],s,i)));
 feed.filter(x=>x.category==="business").slice(0,3).forEach((s,i)=>put(document.querySelectorAll("#markets .market-cards article")[i],s,i));
});
