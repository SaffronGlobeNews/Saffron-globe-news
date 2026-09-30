const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav"),searchBtn=document.getElementById("searchBtn");
menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
searchBtn?.addEventListener("click",()=>{const q=prompt("Search Saffron Globe News");if(q)alert("Search is ready to connect to your news database. Query: "+q)});
document.getElementById("subscribe")?.addEventListener("submit",e=>{e.preventDefault();const email=e.target.querySelector("input").value;alert("Thanks! "+email+" has been added to the demo newsletter.");e.target.reset()});

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
   img.classList.add("thumbimg","story-thumb");
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