const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav"),searchBtn=document.getElementById("searchBtn");
menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
searchBtn?.addEventListener("click",()=>{const q=prompt("Search Saffron Globe News");if(q)alert("Search is ready to connect to your news database. Query: "+q)});
document.getElementById("subscribe")?.addEventListener("submit",e=>{e.preventDefault();const email=e.target.querySelector("input").value;alert("Thanks! "+email+" has been added to the demo newsletter.");e.target.reset()});

if(location.pathname.endsWith("index.html")||location.pathname.endsWith("/")){
 const themes=[
  ["MIDDLE EAST","E5 6B 1F"],["EUROPE","315C72"],["ASIA-PACIFIC","6B4E71"],["UN","536A5A"],
  ["UKRAINE","7A4E3A"],["RUSSIA","394B59"],["GULF","7B684B"],["YEMEN","6D5B4D"],
  ["TECHNOLOGY","435B65"],["ARCTIC","526B73"],["GLOBAL TRADE","6A5848"],["DIPLOMACY","5B5268"],
  ["ENERGY","7B5E35"],["RED SEA","53646B"],["EUROPEAN SECURITY","48566B"],["GLOBAL ECONOMY","665B4D"],
  ["KOREAN PENINSULA","5D5365"],["NORTH ATLANTIC","52616B"],["GLOBAL GOVERNANCE","5B6658"],["AI SECURITY","4D5D63"],
  ["EASTERN EUROPE","66534B"],["INTERNATIONAL LAW","5C5964"],["MARITIME SECURITY","4F6265"],["WORLD AFFAIRS","625A50"],
  ["STRATEGIC POWER","5B5361"],["GLOBAL DIPLOMACY","5C6659"],["CRITICAL INFRASTRUCTURE","66574D"],["GEOPOLITICS","4E5965"]
 ];
 const makeEditorialImage=(index,label)=>{
   const theme=themes[index%themes.length], parts=theme[1].split(" "), color="#"+parts.join("");
   const safe=label.replace(/[^A-Z0-9 ·&-]/gi,"").slice(0,28);
   const angle=(index*29)%360;
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="${color}"/></linearGradient>
       <pattern id="p" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})"><path d="M0 21H42" stroke="#fff" stroke-opacity=".07" stroke-width="2"/></pattern>
     </defs>
     <rect width="1200" height="675" fill="url(#g)"/><rect width="1200" height="675" fill="url(#p)"/>
     <circle cx="910" cy="325" r="205" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>
     <ellipse cx="910" cy="325" rx="205" ry="82" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="3"/>
     <path d="M705 325h410M910 120c-72 70-72 340 0 410M910 120c72 70 72 340 0 410" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="3"/>
     <path d="M90 530H1110" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
     <text x="90" y="120" fill="#E56B1F" font-family="Arial,sans-serif" font-size="26" font-weight="700" letter-spacing="5">SAFFRON GLOBE</text>
     <text x="90" y="185" fill="#fff" font-family="Georgia,serif" font-size="54" font-weight="700">WORLD DESK</text>
     <text x="90" y="580" fill="#fff" fill-opacity=".78" font-family="Arial,sans-serif" font-size="24" letter-spacing="3">${safe}</text>
     <text x="90" y="620" fill="#fff" fill-opacity=".42" font-family="Arial,sans-serif" font-size="17">INTERNATIONAL · GEOPOLITICS · NEWS</text>
   </svg>`;
   return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
 };
 const articles=[...document.querySelectorAll("main article")];
 articles.forEach((article,i)=>{
   article.dataset.story=i;
   const label=(article.querySelector("label")?.textContent||"GLOBAL").toUpperCase();
   let img=article.querySelector("img");
   if(!img){
     img=document.createElement("img");
     article.insertBefore(img,article.firstChild);
   }
   img.classList.add("thumbimg","story-thumb");
   img.src=makeEditorialImage(i,label);
   img.alt="Editorial illustration for "+label.toLowerCase();
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