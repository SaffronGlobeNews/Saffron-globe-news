const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav"),searchBtn=document.getElementById("searchBtn");
menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
searchBtn?.addEventListener("click",()=>{const q=prompt("Search Saffron Globe News");if(q)alert("Search is ready to connect to your news database. Query: "+q)});
document.getElementById("subscribe")?.addEventListener("submit",e=>{e.preventDefault();const email=e.target.querySelector("input").value;alert("Thanks! "+email+" has been added to the demo newsletter.");e.target.reset()});

if(location.pathname.endsWith("index.html")||location.pathname.endsWith("/")){
 const realPhotoPool=[
  "Brunson, Jin review frontline posture at DMZ guard posts (9922619).jpg",
  "Brunson, Jin review frontline posture at DMZ guard posts (9922620).jpg",
  "Brunson, Jin review frontline posture at DMZ guard posts (9922617).jpg",
  "UNC Commander Attends Seoul Defense Dialogue 2026 (9918469).jpg",
  "Ms Jean Lee visits Armistice Room (9917565).jpg",
  "NATO Allies recognized during Masurian Patrol Award Ceremony in Poland (9913096).jpg",
  "NATO Allies sharpen readiness during Day 2 of Exercise Masurian Patrol in Poland (9913081).jpg",
  "NATO Allies sharpen readiness during Day 2 of Exercise Masurian Patrol in Poland (9913086).jpg",
  "NATO Allies recognized during Masurian Patrol Award Ceremony in Poland (9913099).jpg",
  "NATO Allies recognized during Masurian Patrol Award Ceremony in Poland (9913097).jpg",
  "NATO Allies recognized during Masurian Patrol Award Ceremony in Poland (9913100).jpg",
  "Soldiers with the NATO FLF Battle Group-Poland conduct joint weapons familiarization training in Poland (9919235).jpg",
  "Soldiers with the NATO FLF Battle Group-Poland conduct joint weapons familiarization training in Poland (9919242).jpg",
  "Soldiers with the NATO FLF Battle Group-Poland conduct joint weapons familiarization training in Poland (9919236).jpg",
  "U S Marines, Norwegian Home Guard Conduct Joint Displacement in Jan Mayen (9904614).jpg",
  "U S Marines, Norwegian Home Guard Conduct Joint Displacement in Jan Mayen (9904615).jpg",
  "United Nations General Assembly 2026 - September 22, 2026 - 13.jpg",
  "United Nations General Assembly 2026 - September 22, 2026 - 27.jpg",
  "United Nations General Assembly 2026 - September 22, 2026 - 19.jpg",
  "United Nations General Assembly 2026 - September 22, 2026 - 20 (cropped).jpg",
  "United Nations General Assembly 2026 - September 22, 2026 - 18 (cropped).jpg",
  "United Nations General Assembly 2026 - September 22, 2026 - 15 (cropped).jpg",
  "Secretary Rubio Meets with the Press (55546667696).jpg",
  "Visit of Kaja Kallas, High Representative of the Union for Foreign Affairs and Security Policy and Vice-President of the European Commissio, to Lithuania (P-070406-00-02).jpg",
  "Visit of Kaja Kallas, High Representative of the Union for Foreign Affairs and Security Policy and Vice-President of the European Commissio, to Lithuania (P-070406-00-03).jpg",
  "Mark Carney meets Ursula von der Leyen 2026-09 (1).jpg",
  "U S Army and Japanese Ground Self Defense Force Soldiers Conduct Aerial Insertion Training at Orient Shield 26 (9955472).jpg",
  "SGS 26- Multinational Sustained Airborne Training (9915876).jpg",
  "Qatar Boeing 777-300ER A7-BET MD1.jpg",
  "Boeing 787-9 (c-n 64237, A7-BIB) 2026-09-04 Andre Gerwing Collection ID 031020.jpg",
  "A7-BCZ.jpg",
  "A7-MSD@PEK (20260908143834).jpg"
 ]; let photoIndex=0;
 const photoUrl=name=>"https://commons.wikimedia.org/wiki/Special:Redirect/file/"+encodeURIComponent(name);
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
     img.dataset.photoSource="Wikimedia Commons";
   }
   img.classList.add("thumbimg","story-thumb");
   img.removeAttribute("srcset");
   img.removeAttribute("sizes");
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