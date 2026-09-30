const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav"),searchBtn=document.getElementById("searchBtn");
menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
searchBtn?.addEventListener("click",()=>{const q=prompt("Search Saffron Globe News");if(q)alert("Search is ready to connect to your news database. Query: "+q)});
document.getElementById("subscribe")?.addEventListener("submit",e=>{e.preventDefault();const email=e.target.querySelector("input").value;alert("Thanks! "+email+" has been added to the demo newsletter.");e.target.reset()});

if(location.pathname.endsWith("index.html")||location.pathname.endsWith("/")){
 const fallbacks=[
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tehran_skyline_at_night.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/European_Parliament_Strasbourg_Hemicycle_-_2014-01-14.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Seoul_skyline_from_Namsan.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/United_Nations_General_Assembly_hall.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kyiv_Maidan_Nezalezhnosti_2014-01-26_01.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Moscow_City_Center.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Doha_skyline.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Aden_Yemen.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Computer_server_room.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Beijing_skyline_at_night.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Brussels_European_Quarter.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Geneva_Palais_des_Nations.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Port_of_Rotterdam_2016.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Suez_Canal_view.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Black_Sea_map.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Gulf_of_Oman.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Arctic_Ocean_map.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/United_Nations_building_in_Geneva.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/London_skyline_from_London_Eye.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tokyo_Skyline_2019.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Singapore_skyline_2010.jpg",
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Container_ship_in_port.jpg"
 ];
 const articles=[...document.querySelectorAll("main article")];
 let fallbackIndex=0;
 articles.forEach((article,i)=>{
   article.dataset.story=i;
   const label=(article.querySelector("label")?.textContent||"GLOBAL").toUpperCase();
   if(!article.querySelector("img")){
     const src=fallbacks[fallbackIndex%fallbacks.length];
     fallbackIndex++;
     const img=document.createElement("img");
     img.className="thumbimg story-thumb";
     img.src=src;
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