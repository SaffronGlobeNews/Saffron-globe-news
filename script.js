const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav"),searchBtn=document.getElementById("searchBtn");
menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
searchBtn?.addEventListener("click",()=>{const q=prompt("Search Saffron Globe News");if(q)alert("Search is ready to connect to your news database. Query: "+q)});
document.getElementById("subscribe")?.addEventListener("submit",e=>{e.preventDefault();const email=e.target.querySelector("input").value;alert("Thanks! "+email+" has been added to the demo newsletter.");e.target.reset()});

if(location.pathname.endsWith("index.html")||location.pathname.endsWith("/")){
 const fallbacks={
  "MIDDLE EAST":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Tehran_skyline_at_night.jpg",
  "EUROPE":"https://commons.wikimedia.org/wiki/Special:Redirect/file/European_Parliament_Strasbourg_Hemicycle_-_2014-01-14.jpg",
  "ASIA-PACIFIC":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Seoul_skyline_from_Namsan.jpg",
  "UN":"https://commons.wikimedia.org/wiki/Special:Redirect/file/United_Nations_General_Assembly_hall.jpg",
  "GLOBAL":"https://commons.wikimedia.org/wiki/Special:Redirect/file/United_Nations_General_Assembly_hall.jpg",
  "UKRAINE":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Kyiv_Maidan_Nezalezhnosti_2014-01-26_01.jpg",
  "RUSSIA":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Moscow_City_Center.jpg",
  "GULF":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Doha_skyline.jpg",
  "YEMEN":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Aden_Yemen.jpg",
  "TECHNOLOGY":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Computer_server_room.jpg"
 };
 const articles=[...document.querySelectorAll("main article")];
 articles.forEach((article,i)=>{
   article.dataset.story=i;
   const label=(article.querySelector("label")?.textContent||"GLOBAL").toUpperCase();
   if(!article.querySelector("img")){
     const key=Object.keys(fallbacks).find(k=>label.includes(k))||"GLOBAL";
     const img=document.createElement("img");
     img.className="thumbimg story-thumb";
     img.src=fallbacks[key];
     img.alt="Illustrative image for "+label.toLowerCase();
     article.insertBefore(img,article.firstChild);
   }else if(article.querySelector("img:not(.thumbimg)") && article.querySelector("h3")){
     const img=article.querySelector("img");img.classList.add("story-thumb");
   }
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