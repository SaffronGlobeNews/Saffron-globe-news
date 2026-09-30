const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav"),searchBtn=document.getElementById("searchBtn");
menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
const searchPanel=document.getElementById("searchPanel"),closeSearch=document.getElementById("closeSearch"),siteSearch=document.getElementById("siteSearch"),searchResults=document.getElementById("searchResults");
function openSearch(){searchPanel?.classList.add("open");searchPanel?.setAttribute("aria-hidden","false");setTimeout(()=>siteSearch?.focus(),50);renderSearch("");}
function closeSearchPanel(){searchPanel?.classList.remove("open");searchPanel?.setAttribute("aria-hidden","true");}
searchBtn?.addEventListener("click",openSearch);closeSearch?.addEventListener("click",closeSearchPanel);
searchPanel?.addEventListener("click",e=>{if(e.target===searchPanel)closeSearchPanel();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSearchPanel();if(e.key==="/"&&!/input|textarea/i.test(document.activeElement?.tagName)){e.preventDefault();openSearch();}});
function renderSearch(query){
 if(!searchResults)return;
 const q=query.trim().toLowerCase();
 const items=[...document.querySelectorAll("main article")].map((a,i)=>({i,title:a.querySelector("h3,h2")?.textContent.trim()||"",label:a.querySelector("label")?.textContent.trim()||"WORLD NEWS"})).filter(x=>x.title);
 const matches=q?items.filter(x=>(x.title+" "+x.label).toLowerCase().includes(q)):items.slice(0,8);
 searchResults.innerHTML=matches.length?matches.map(x=>'<a class="search-result" href="article.html?story='+x.i+'"><small>'+x.label+'</small><strong>'+x.title+'</strong></a>').join(""):'<div class="search-empty">No stories matched your search.</div>';
}
siteSearch?.addEventListener("input",e=>renderSearch(e.target.value));

document.getElementById("subscribe")?.addEventListener("submit",e=>{e.preventDefault();const email=e.target.querySelector("input").value;const button=e.target.querySelector("button");button.textContent="Subscribed ✓";button.disabled=true;e.target.querySelector("input").value="";});
const dateLine=document.getElementById("dateLine");if(dateLine){dateLine.textContent=new Intl.DateTimeFormat("en-IN",{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(new Date());}


if(location.pathname.endsWith("index.html")||location.pathname.endsWith("/")){
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
