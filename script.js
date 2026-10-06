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
    const href=a.querySelector("h3 a,h2 a")?.getAttribute("href") || ("article.html?story="+encodeURIComponent(a.dataset.story||""));
    return {href,title,label,body};
  }).filter(x=>x.title&&x.href);
  const matches=q?items.filter(x=>(x.title+" "+x.label+" "+x.body).toLowerCase().includes(q)):items.slice(0,8);
  searchResults.innerHTML=matches.length
    ? matches.map(x=>'<a class="search-result" href="'+escapeHTML(x.href)+'"><small>'+escapeHTML(x.label)+'</small><strong>'+escapeHTML(x.title)+'</strong><span class="search-snippet">'+escapeHTML(x.body.slice(0,150))+(x.body.length>150?"…":"")+'</span></a>').join("")
    : '<div class="search-empty">No stories matched your search. Try a broader topic, region or keyword.</div>';
}
let archiveSearchCache = null;
async function loadArchiveSearch(){
  if(archiveSearchCache)return archiveSearchCache;
  try{
    const index=await fetch("data/news-archive-index.json",{cache:"no-store"}).then(r=>r.json());
    const dates=(index.dates||[]).slice(0,14);
    const days=await Promise.all(dates.map(d=>fetch("data/archive/"+encodeURIComponent(d)+".json",{cache:"no-store"}).then(r=>r.ok?r.json():{stories:[]}).catch(()=>({stories:[]}))));
    archiveSearchCache=days.flatMap(d=>d.stories||[]);
  }catch{archiveSearchCache=[]}
  return archiveSearchCache;
}
async function renderArchiveSearch(query){
  const q=query.trim().toLowerCase(); if(!q)return;
  const archived=await loadArchiveSearch();
  if(!archived.length||!searchResults)return;
  const matches=archived.filter(x=>(x.title+" "+(x.description||"")+" "+(x.category||"")).toLowerCase().includes(q)).slice(0,30);
  if(!matches.length)return;
  const html=matches.map(x=>'<a class="search-result" href="article.html?auto='+encodeURIComponent(x.id)+'"><small>'+escapeHTML(x.category||"ARCHIVE")+'</small><strong>'+escapeHTML(x.title||"")+'</strong><span class="search-snippet">'+escapeHTML((x.description||x.content||"").slice(0,150))+'…</span></a>').join("");
  searchResults.innerHTML=html;
}
siteSearch?.addEventListener("input",e=>{renderSearch(e.target.value);renderArchiveSearch(e.target.value)});

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
 Object.entries(sectionStoryMap).forEach(([section])=>{
   const root=document.getElementById(section);
   if(!root)return;
   root.querySelectorAll("article").forEach(article=>article.dataset.choiceSection=section);
 });

 /*
  * Story identity rule:
  * - Static editorial cards keep their numbered story= links.
  * - Automated cards always use their stable news-feed ID.
  * - Never assign a random photograph to a story. An image must belong to
  *   the story data that rendered the card.
  */
 const articles=[...document.querySelectorAll("main article")];
 articles.forEach((article,i)=>{
   if(!article.dataset.story) article.dataset.story=String(i);

   const img=article.querySelector("img");
   if(img){
     img.classList.add("thumbimg","story-thumb");
     img.loading="lazy";
     img.decoding="async";
     img.removeAttribute("srcset");
     img.removeAttribute("sizes");
     img.style.maxWidth="100%";
     img.style.display="block";
   }

   const headline=article.querySelector("h3");
   if(headline && !headline.querySelector("a")){
     const link=document.createElement("a");
     link.href="article.html?story="+encodeURIComponent(article.dataset.story);
     link.textContent=headline.textContent.trim();
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
    const headline=article?.querySelector("h3,h2")?.textContent?.trim();
    if(headline){
      const overlay=document.createElement("span");
      overlay.className="image-headline";
      overlay.textContent=headline;
      wrapper.appendChild(overlay);
    }
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

/* Live SGN editorial feed: data/news.json is a manually reviewed SGN feed; no third-party feed API is fetched here. */
(async()=>{try{const r=await fetch("data/news.json",{cache:"no-store"});if(!r.ok)return;const f=await r.json();window.SAFFRON_NEWS=f;window.dispatchEvent(new Event("newsFeedUpdated"));}catch(e){console.warn("News feed unavailable",e);}})();

/* Render live feed into the main desks */
window.addEventListener("newsFeedUpdated",()=>{
 const feed=window.SAFFRON_NEWS?.stories||[]; if(!feed.length)return;
 const esc=v=>escapeHTML(v||"");
 const label=v=>({world:"WORLD NEWS",business:"BUSINESS & MARKETS",entertainment:"ENTERTAINMENT",sports:"SPORTS"}[v]||"GLOBAL NEWS");
 const put=(el,s)=>{
  if(!el)return;
  const fallback=({world:"news-world.svg",business:"news-business.svg",entertainment:"news-entertainment.svg",sports:"news-sports.svg"}[s.category]||"news-world.svg");
  const image='<div class="choice-image auto-news-image"><img src="'+esc(s.image||fallback)+'" alt="'+esc(s.title)+'" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\''+fallback+'\';"><span class="image-headline">'+esc(s.title)+'</span></div>';
  const storyId=s.id||btoa(unescape(encodeURIComponent(s.url||s.title))).replace(/[^a-zA-Z0-9_-]/g,"").slice(0,40);
  el.innerHTML=image+'<label>'+esc(label(s.category))+'</label><h3><a href="article.html?auto='+encodeURIComponent(storyId)+'">'+esc(s.title)+'</a></h3><p>'+esc(s.description||s.content)+'</p><a class="source" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">Source / verification · '+esc(s.source)+' →</a>';
 };
 feed.filter(x=>x.category==="world").slice(0,3).forEach((s,i)=>put(document.querySelectorAll("#latest .cards article")[i],s));
 ["entertainment","sports"].forEach(cat=>feed.filter(x=>x.category===cat).slice(0,3).forEach((s,i)=>put(document.querySelectorAll("#"+cat+" .choice-grid article")[i],s)));
 feed.filter(x=>x.category==="business").slice(0,3).forEach((s,i)=>put(document.querySelectorAll("#markets .market-cards article")[i],s));
 renderCurrentDeskCards(feed);
});


/* Keep every editorial desk synchronized with the live feed.
 * Static cards are replaced with current, source-linked stories when data/news.json loads.
 */ 
function renderCurrentDeskCards(feed){
  const safe=(v)=>escapeHTML(v||"");
  const fallbackFor=(category)=>({world:"news-world.svg",business:"news-business.svg",entertainment:"news-entertainment.svg",sports:"news-sports.svg"}[category]||"news-world.svg");
  const makeImage=(story)=>{
    const fallback=fallbackFor(story.category);
    return '<div class="choice-image auto-news-image"><img src="'+safe(story.image||fallback)+'" alt="'+safe(story.title||"News photograph")+'" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\''+fallback+'\';"><span class="image-headline">'+safe(story.title||"")+'</span></div>';
  };
  const makeLink=(story)=>'article.html?auto='+encodeURIComponent(story.id||"");
  const fill=(article,story,index)=>{
    if(!article||!story)return;
    const label=({world:"WORLD NEWS",business:"BUSINESS & MARKETS",entertainment:"ENTERTAINMENT",sports:"SPORTS"}[story.category]||"GLOBAL NEWS");
    const num=article.querySelector("b")?.textContent||String(index+1).padStart(2,"0");
    article.innerHTML=(article.querySelector("b")?'<b>'+safe(num)+'</b>':'')+
      '<div class="desk-story">'+makeImage(story)+'<label>'+safe(label)+'</label><h3><a href="'+makeLink(story)+'">'+safe(story.title)+'</a></h3><p>'+safe(story.description||story.content)+'</p><a class="source" href="'+safe(story.url)+'" target="_blank" rel="noopener noreferrer">Source / verification · '+safe(story.source||"Source")+' →</a></div>';
  };
  const world=feed.filter(x=>x.category==="world");
  const business=feed.filter(x=>x.category==="business");
  const security=[...world].slice(0,2);
  document.querySelectorAll("#security .list article").forEach((a,i)=>fill(a,security[i],i));
  document.querySelectorAll("#diplomacy .business article").forEach((a,i)=>fill(a,world[i+2]||world[i],i));
  document.querySelectorAll("#economy .business article").forEach((a,i)=>fill(a,business[i],i));
  const heroStory=world[0];
  const hero=document.querySelector(".editorial-hero .feature");
  if(hero&&heroStory){
    const img=hero.querySelector("img"); if(img){img.src=heroStory.image||fallbackFor("world");img.alt=heroStory.title||"World news";}
    const label=hero.querySelector("label"); if(label)label.textContent="LATEST WORLD NEWS";
    const h=hero.querySelector("h2"); if(h){h.innerHTML='<a href="'+makeLink(heroStory)+'">'+safe(heroStory.title)+'</a>';}
    const p=hero.querySelector("p"); if(p)p.textContent=heroStory.description||heroStory.content||"";
    const source=hero.querySelector(".source"); if(source){source.href=heroStory.url||"#";source.textContent="Source / verification · "+(heroStory.source||"Source")+" →";}
  }
}

/* Modern newsroom interactions */
(function(){
 const theme=document.getElementById("themeToggle");
 const stored=localStorage.getItem("sgn-theme");
 if(stored==="dark")document.body.classList.add("dark-mode");
 function sync(){if(!theme)return;theme.textContent=document.body.classList.contains("dark-mode")?"☀":"◐";theme.setAttribute("aria-label",document.body.classList.contains("dark-mode")?"Switch to light mode":"Switch to dark mode")}
 theme?.addEventListener("click",()=>{document.body.classList.toggle("dark-mode");localStorage.setItem("sgn-theme",document.body.classList.contains("dark-mode")?"dark":"light");sync()});sync();

 const rail=document.getElementById("liveRailItems"), ticker=document.getElementById("latestTicker");
 function renderLive(){
  const stories=(window.SAFFRON_NEWS?.stories||[]);
  if(!stories.length)return;
  const items=stories.slice(0,8);
  const make=(s)=>'<a href="article.html?auto='+encodeURIComponent(s.id||"")+'">'+escapeHTML(s.title||"Latest story")+'</a>';
  const build=(list,sep)=>list.map(make).join('<span aria-hidden="true">'+sep+'</span>');
  if(rail){
    const row=items.slice(0,5);
    rail.innerHTML=build(row,"•")+build(row,"•");
    rail.setAttribute("aria-live","off");
  }
  if(ticker){
    const row=items.slice(0,8);
    ticker.innerHTML=build(row,"·")+build(row,"·");
    ticker.setAttribute("aria-live","off");
  }
 }
 window.addEventListener("newsFeedUpdated",renderLive);
 renderLive();

 const form=document.getElementById("newsletterProForm");
 form?.addEventListener("submit",e=>{e.preventDefault();const btn=form.querySelector("button");btn.textContent="Subscribed ✓";btn.disabled=true;form.reset()});
})();

/* Premium UI interactions */
(function(){
 const top=document.getElementById("backTop");
 if(!top)return;
 const sync=()=>top.classList.toggle("show",window.scrollY>650);
 window.addEventListener("scroll",sync,{passive:true});
 top.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
 sync();
})();

/* Global image-error guard: applies to static and dynamically inserted stories. */
document.addEventListener("error",function(e){
 const img=e.target;
 if(!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied)return;
 if(img.closest(".site-brand"))return;
 img.dataset.fallbackApplied="1";
 const article=img.closest("article");
 const text=((article?.querySelector("label")?.textContent||"")+" "+(article?.querySelector("h3,h2")?.textContent||"")).toLowerCase();
 const fallback=(text.includes("sport")||text.includes("football")||text.includes("cricket")||text.includes("tennis"))?"news-sports.svg":
   (text.includes("market")||text.includes("business")||text.includes("stock")||text.includes("econom"))?"news-business.svg":
   (text.includes("film")||text.includes("celebr")||text.includes("entertain")||text.includes("culture"))?"news-entertainment.svg":"news-world.svg";
 img.src=fallback;
},true);

/* Universal image safety: never leave a news card blank or broken. */
(function(){
 const fallbackFor=(img)=>{
   const article=img.closest("article");
   const href=article?.querySelector("h3 a")?.href||"";
   const text=((article?.querySelector("label")?.textContent||"")+" "+(article?.querySelector("h3")?.textContent||"")).toLowerCase();
   if(text.includes("sport")||text.includes("football")||text.includes("cricket")||text.includes("tennis")) return "news-sports.svg";
   if(text.includes("market")||text.includes("business")||text.includes("stock")||text.includes("econom")) return "news-business.svg";
   if(text.includes("film")||text.includes("celebr")||text.includes("entertain")||text.includes("culture")) return "news-entertainment.svg";
   return "news-world.svg";
 };
 document.querySelectorAll("main img:not(.site-brand img)").forEach(img=>{
   img.addEventListener("error",function(){
     if(this.dataset.fallbackApplied)return;
     this.dataset.fallbackApplied="1";
     this.src=fallbackFor(this);
   });
 });
})();


/* SGN editorial curation: keep the homepage visually complete and give the lead story real feed data. */
(function(){
  const fallbackFor=(text)=>{
    text=(text||"").toLowerCase();
    if(/sport|football|cricket|tennis|athlete|match/.test(text))return "news-sports.svg";
    if(/market|business|stock|econom|trade|oil|finance/.test(text))return "news-business.svg";
    if(/film|celebr|entertain|music|culture|actor/.test(text))return "news-entertainment.svg";
    return "news-world.svg";
  };
  function ensureVisuals(){
    document.querySelectorAll("main article").forEach(article=>{
      if(article.closest("#todayspaper")||article.closest("#puzzles"))return;
      if(article.querySelector("img,.image-ui,.choice-image,.auto-news-image"))return;
      const label=article.querySelector("label")?.textContent||"GLOBAL NEWS";
      const title=article.querySelector("h3,h2")?.textContent||"";
      const wrap=document.createElement("div");
      wrap.className="choice-image editorial-fallback-image";
      const img=document.createElement("img");
      img.src=fallbackFor(label+" "+title);
      img.alt=title||label;
      img.loading="lazy";
      img.decoding="async";
      wrap.appendChild(img);
      const heading=article.querySelector("h3,h2");
      if(heading)article.insertBefore(wrap,heading);
      else article.prepend(wrap);
    });
  }
  function updateLead(){
    const stories=window.SAFFRON_NEWS?.stories||[];
    const top=stories[0];
    const feature=document.querySelector(".editorial-hero .feature");
    if(!top||!feature)return;
    const fallback=fallbackFor(top.category+" "+top.title);
    const image=feature.querySelector("img");
    if(image){
      image.src=top.image||fallback;
      image.alt=top.title||"SGN lead story";
      image.onerror=()=>{image.onerror=null;image.src=fallback};
    }
    const label=feature.querySelector("label");
    const h=feature.querySelector("h2");
    const p=feature.querySelector("p");
    const a=feature.querySelector(".source");
    if(label)label.textContent=(top.category||"WORLD").toUpperCase()+" · LATEST EDITION";
    if(h)h.textContent=top.title||h.textContent;
    if(p)p.textContent=top.description||top.content||p.textContent;
    if(a){
      const id=top.id||"";
      a.href="article.html?auto="+encodeURIComponent(id);
      a.textContent="Read full SGN report →";
      a.removeAttribute("target");
    }
  }
  window.addEventListener("newsFeedUpdated",()=>{updateLead();setTimeout(ensureVisuals,80)});
  document.addEventListener("DOMContentLoaded",ensureVisuals);
  setTimeout(ensureVisuals,1200);
  updateLead();
})();



/* Archived third-party feed disabled pending editorial review.
 * Older syndicated/scraped archive stories are intentionally not rendered.
 * A reviewed SGN archive can be added later without importing publisher copy.
 */
(function(){
  const grid=document.getElementById("archiveGrid");
  const status=document.getElementById("archiveStatus");
  const sentinel=document.getElementById("archiveSentinel");
  if(grid)grid.innerHTML="";
  if(status)status.textContent="Archive paused while older stories are reviewed.";
  if(sentinel)sentinel.innerHTML='<div class="archive-end">Older syndicated stories are temporarily hidden while Saffron Globe News reviews them for originality and image rights.</div>';
})();