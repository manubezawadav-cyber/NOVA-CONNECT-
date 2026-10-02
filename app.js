(() => {
"use strict";
const products=[
{id:"rice",name:"Basmati Rice 5kg",price:620,stock:12,store:"Sri Lakshmi Store",confidence:96,eta:"28–35 min"},
{id:"milk",name:"Fresh Milk 1L",price:62,stock:4,store:"Village Fresh Mart",confidence:88,eta:"18–25 min"},
{id:"honey",name:"Local Honey 500g",price:280,stock:0,store:"Rythu Partner Store",confidence:0,eta:"Backup required"}
];
let events=0, activeOrder=false, rice=12;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function esc(x){return String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function bump(){events++;$("#kpi").textContent=events;}
function note(x){const n=$("#notice");n.textContent=x;n.classList.add("show");clearTimeout(note.t);note.t=setTimeout(()=>n.classList.remove("show"),2500);bump();}
function modal(title,html){$("#modalTitle").textContent=title;$("#modalBody").innerHTML=html;$("#modal").showModal();}
function render(q=""){
 const term=q.toLowerCase().trim(), list=products.filter(p=>!term||p.name.toLowerCase().includes(term));
 $("#products").innerHTML=list.length?list.map(p=>`
 <article class="product">
  <span class="badge ${p.stock?"green":"red"}">${p.stock?"Available":"Unavailable"}</span>
  <h3>${esc(p.name)}</h3><small>₹${p.price} • ${esc(p.store)}</small>
  <small>${p.stock?`Availability confidence ${p.confidence}% • ${esc(p.eta)}`:"NOVA can search a nearby partner store."}</small>
  <div class="buttons"><button class="primary book" data-id="${p.id}">${p.stock?"Pre-book":"Find backup"}</button><button class="secondary trust" data-id="${p.id}">Trust</button></div>
 </article>`).join(""):"<article class='card'><b>No product found.</b><p>Try another search or ask the Community Store.</p></article>";
}
function openTrust(p){modal("Product Trust",`<div class="callout"><b>Verified demo traceability</b><p>Source: ${esc(p.store)}<br>Batch: BAT-2026-041<br>Best before: 20 Sep 2027<br>Customer: linked to order #NSL-1042</p></div><p class="muted">In production, source, batch and expiry values should come from authenticated store/farmer/company records.</p>`);}
function book(p){
 if(!p.stock){modal("Backup Local Store",`<p><b>${esc(p.name)}</b> is unavailable in the selected store.</p><p>Recommendation: reserve from <b>Rythu Partner Store</b>.</p><button id="backup" class="primary full">Reserve backup store</button>`);return;}
 modal("Pre-book + Stock Lock",`<p><b>${esc(p.name)}</b> is currently available.</p><p>Store: ${esc(p.store)}<br>Availability confidence: ${p.confidence}%<br>Estimated delivery: ${esc(p.eta)}</p><button id="confirm" class="primary full">Confirm reservation</button>`);
}
function timeline(){
 const steps=[["✓","Booked","Customer request accepted"],["✓","Reserved","Stock locked"],["3","Local handover","Community checkpoint"],["4","Delivered","Customer receives item"]];
 $("#timeline").innerHTML=steps.map((s,i)=>`<div class="t ${i<2?"done":i===2?"current":""}"><span class="dot">${s[0]}</span><div><b>${s[1]}</b><small>${s[2]}</small></div></div>`).join("");
}
function show(id){document.getElementById(id).scrollIntoView({behavior:"smooth",block:"start"});}
$$("[data-scroll]").forEach(b=>b.onclick=()=>show(b.dataset.scroll));
$("#search").onclick=()=>render($("#q").value);
$("#q").oninput=e=>render(e.target.value);
$("#close").onclick=()=>$("#modal").close();
$("#help").onclick=()=>modal("How NOVA Smart Local works",`<p><b>1. Input:</b> customer searches or asks a Community Store.</p><p><b>2. Logic:</b> check availability, reserve stock, predict demand and find backup local fulfillment.</p><p><b>3. Action:</b> store/community/delivery roles update the order.</p><p><b>4. Output:</b> reliable fulfillment, clear tracking and measurable business signals.</p>`);
document.addEventListener("click",e=>{
 const b=e.target.closest(".book"), t=e.target.closest(".trust");
 if(b){bump();book(products.find(p=>p.id===b.dataset.id));return;}
 if(t){bump();openTrust(products.find(p=>p.id===t.dataset.id));return;}
 const o=e.target.closest("[data-open]");
 if(o){bump();const a=o.dataset.open;
  if(a==="assist") modal("Community Store Assisted Order",`<p>The operator can place the order for the customer and confirm choices.</p><div class="formrow"><label>Customer name</label><input placeholder="Enter customer name"></div><div class="formrow"><label>Village</label><input placeholder="Enter village"></div><button id="assistConfirm" class="primary full">Create assisted booking</button>`);
  if(a==="trust") openTrust(products[0]);
  if(a==="reward") modal("Experience Rewards",`<p>Instead of relying only on confusing coupons, NOVA can offer clear partner experiences.</p><p>Examples: movie, dining or travel offers, subject to partner terms.</p><div class="callout"><b>Proposed NOVA 15× Dine</b><br>15 eligible orders in a month → proposed dinner for two up to ₹1,500.</div>`);
  if(a==="call") modal("Protected Customer Contact",`<p>Use a platform-controlled or masked calling workflow so personal phone numbers are not exposed.</p><button id="call" class="primary full">Start protected call</button>`);
  if(a==="replacement") modal("Replacement",`<p>Choose a replacement from verified nearby stock.</p><button id="replace" class="primary full">Confirm replacement</button>`);
  if(a==="alternative") modal("Alternative Product",`<p>Show a similar verified product with price and availability before customer confirmation.</p><button id="alt" class="primary full">Show alternatives</button>`);
  if(a==="refund") modal("Refund / Resolution",`<p>First offer a replacement or alternative when appropriate. If the customer chooses refund, create a traceable refund request.</p><button id="refund" class="primary full">Create refund request</button>`);
 }
 if(e.target.id==="confirm"){activeOrder=true;$("#orderStatus").textContent="Reserved • #NSL-1042";$("#orderStatus").className="badge green";$("#modal").close();timeline();note("Stock reserved and inventory updated.");}
 if(e.target.id==="backup"){activeOrder=true;$("#orderStatus").textContent="Backup reserved • #NSL-1042";$("#orderStatus").className="badge blue";$("#modal").close();timeline();note("Nearby partner store reserved.");}
 if(e.target.id==="assistConfirm"){$("#modal").close();note("Assisted booking created.");}
 if(e.target.id==="call"){note("Protected call flow started.");$("#modal").close();}
 if(e.target.id==="replace"){note("Replacement confirmed.");$("#modal").close();}
 if(e.target.id==="alt"){modal("Alternatives",`<p>1. Local Honey 500g — ₹280 — verified partner stock</p><p>2. Forest Honey 500g — ₹310 — verified partner stock</p><button id="chooseAlt" class="primary full">Choose first alternative</button>`);}
 if(e.target.id==="chooseAlt"){note("Alternative selected for customer confirmation.");$("#modal").close();}
 if(e.target.id==="refund"){note("Traceable refund request created.");$("#modal").close();}
 if(e.target.matches("[data-check]")){note(`${e.target.dataset.check} checkpoint recorded.`);e.target.classList.add("done");}
});
$("#sell").onclick=()=>{rice=Math.max(0,rice-1);$("#rice").textContent=`${rice} available`;render($("#q").value);note("Stock updated immediately across the demo.");};
$("#prepare").onclick=()=>note("Demand-based stock preparation plan created.");
$("#maps").onclick=()=>{bump();window.open("https://www.google.com/maps/search/?api=1&query=Sri+Lakshmi+Store+near+me","_blank","noopener,noreferrer");};
render();timeline();
})();