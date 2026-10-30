const $=id=>document.getElementById(id),money=n=>"₹"+Number(n).toLocaleString("en-IN"),today="2026-10-21";
const seedMenu=[["Paneer Tikka","Starters",249,"Smoky paneer with spices","🍢"],["Crispy Corn","Starters",179,"Crunchy sweet corn","🌽"],["Veg Spring Rolls","Starters",199,"Crispy vegetable rolls","🥢"],["Butter Paneer","Main course",329,"Creamy tomato gravy","🍛"],["Dal Makhani","Main course",269,"Slow-cooked lentils","🥘"],["Veg Biryani","Main course",289,"Aromatic rice and vegetables","🍚"],["Masala Dosa","Main course",199,"Crispy dosa","🥞"],["Cold Coffee","Beverages",129,"Chilled coffee","🥤"],["Fresh Lime Soda","Beverages",89,"Fresh lime and soda","🍋"],["Masala Chai","Beverages",59,"Indian spiced tea","☕"],["Chocolate Brownie","Desserts",149,"Rich chocolate brownie","🍫"],["Gulab Jamun","Desserts",99,"Classic Indian sweet","🍮"]].map((x,i)=>({id:i+1,name:x[0],category:x[1],price:x[2],description:x[3],emoji:x[4],available:true}));
const seedOrders=[{id:1048,customer:"Aarav Mehta",items:[{name:"Butter Paneer",qty:1}],time:"18:42",amount:329,status:"Preparing"},{id:1047,customer:"Ananya Shah",items:[{name:"Veg Biryani",qty:2}],time:"18:35",amount:578,status:"Ready"},{id:1046,customer:"Kabir Joshi",items:[{name:"Cold Coffee",qty:2}],time:"18:21",amount:258,status:"Completed"},{id:1045,customer:"Diya Patel",items:[{name:"Paneer Tikka",qty:1}],time:"18:10",amount:249,status:"New"},{id:1044,customer:"Reyansh Gupta",items:[{name:"Dal Makhani",qty:1}],time:"17:58",amount:269,status:"Completed"},{id:1043,customer:"Meera Jain",items:[{name:"Masala Dosa",qty:2}],time:"17:43",amount:398,status:"Cancelled"}];
const seedRes=[{id:501,guest:"Ishita Rao",date:today,time:"19:00",party:4,table:3,status:"Booked"},{id:502,guest:"Rohan Kapoor",date:today,time:"19:30",party:2,table:8,status:"Booked"},{id:503,guest:"Aanya Shah",date:today,time:"20:00",party:5,table:11,status:"Booked"},{id:504,guest:"Vihaan Jain",date:today,time:"18:00",party:2,table:5,status:"Seated"},{id:505,guest:"Sara Khan",date:today,time:"17:00",party:3,table:2,status:"Completed"},{id:506,guest:"Arjun Das",date:today,time:"20:30",party:6,table:12,status:"Booked"}],seedTables=["Available","Occupied","Available","Reserved","Available","Occupied","Available","Reserved","Available","Occupied","Reserved","Available"];
function load(k,v){try{return JSON.parse(localStorage.getItem(k))||structuredClone(v)}catch{return structuredClone(v)}}let menu=load("ash-menu",seedMenu),orders=load("ash-orders",seedOrders),reservations=load("ash-res",seedRes),tables=load("ash-tables",seedTables);
function save(){try{localStorage.setItem("ash-menu",JSON.stringify(menu));localStorage.setItem("ash-orders",JSON.stringify(orders));localStorage.setItem("ash-res",JSON.stringify(reservations));localStorage.setItem("ash-tables",JSON.stringify(tables))}catch{}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}function badge(s){return `<span class="status s-${s.toLowerCase()}">${esc(s)}</span>`}function toast(s){let t=$("toast");t.textContent=s;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2300)}function empty(n){return `<tr><td colspan="${n}" class="empty">No matching records found.</td></tr>`}
function summary(o){return o.items.map(i=>`${i.qty} × ${esc(i.name)}`).join(", ")}
function renderOrders(){let recent=orders.slice(0,5);$("recentOrders").innerHTML=recent.length?recent.map(o=>`<tr><td>#${o.id}</td><td>${esc(o.customer)}</td><td>${summary(o)}</td><td>${money(o.amount)}</td><td>${badge(o.status)}</td></tr>`).join(""):empty(5);let q=$("orderSearch").value.toLowerCase(),st=$("orderStatusFilter").value,list=orders.filter(o=>(String(o.id).includes(q)||o.customer.toLowerCase().includes(q)||o.items.some(i=>i.name.toLowerCase().includes(q)))&&(st==="All"||st===o.status));$("ordersTable").innerHTML=list.length?list.map(o=>`<tr><td>#${o.id}</td><td>${esc(o.customer)}</td><td>${summary(o)}</td><td>${esc(o.time)}</td><td>${money(o.amount)}</td><td>${badge(o.status)}</td><td><select data-order="${o.id}">${["New","Preparing","Ready","Completed","Cancelled"].map(s=>`<option ${o.status===s?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join(""):empty(7);$("ordersStat").textContent=orders.length+18;$("pendingBadge").textContent=orders.filter(o=>!["Completed","Cancelled"].includes(o.status)).length;$("statusSummary").innerHTML=["New","Preparing","Ready","Completed"].map(s=>`<div class="status-tile"><span>${s} orders</span><strong>${orders.filter(o=>o.status===s).length}</strong><small>Current sample data</small></div>`).join("")}
function renderMenu(){let q=$("menuSearch").value.toLowerCase(),cat=$("menuCategoryFilter").value,list=menu.filter(m=>m.name.toLowerCase().includes(q)&&(cat==="All"||cat===m.category));$("menuGrid").innerHTML=list.length?list.map(m=>`<article class="menu-card"><div class="menu-art">${m.emoji||"🍽️"}</div><h3>${esc(m.name)}</h3><p>${esc(m.description||m.category)}</p><div class="menu-bottom"><strong>${money(m.price)}</strong><button class="toggle ${m.available?"":"off"}" data-toggle-menu="${m.id}">${m.available?"Available":"Unavailable"}</button></div></article>`).join(""):`<div class="empty">No menu items found.</div>`;let sel=$("orderMenuItem"),prev=sel.value;sel.innerHTML=menu.filter(m=>m.available).map(m=>`<option value="${m.id}">${esc(m.name)} — ${money(m.price)}</option>`).join("");if([...sel.options].some(o=>o.value===prev))sel.value=prev;total()}
function renderTables(){$("tablesGrid").innerHTML=tables.map((s,i)=>`<article class="table-card ${s.toLowerCase()}"><div class="symbol">▦</div><strong>Table ${String(i+1).padStart(2,"0")}</strong><small>${s==="Available"?"Ready for guests":s==="Occupied"?"Guests seated":"Reservation held"}</small><button data-table="${i}">${s==="Available"?"Mark occupied":"Mark available"}</button></article>`).join("");let n=tables.filter(s=>s==="Available").length;$("availableStat").textContent=`${n} / ${tables.length}`;$("tableProgress").style.width=n/tables.length*100+"%"}
function renderReservations(){let q=$("reservationSearch").value.toLowerCase(),st=$("reservationStatusFilter").value,list=reservations.filter(r=>(String(r.id).includes(q)||r.guest.toLowerCase().includes(q))&&(st==="All"||r.status===st)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));$("reservationsTable").innerHTML=list.length?list.map(r=>`<tr><td>#R-${r.id}</td><td>${esc(r.guest)}</td><td>${esc(r.date)} · ${esc(r.time)}</td><td>${r.party} guests</td><td>Table ${r.table}</td><td>${badge(r.status)}</td><td><select data-reservation="${r.id}">${["Booked","Seated","Completed","Cancelled"].map(s=>`<option ${r.status===s?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join(""):empty(7);let tod=reservations.filter(r=>r.date===today&&r.status!=="Cancelled");$("reservationsStat").textContent=tod.length;$("upcomingReservationCount").textContent=tod.filter(r=>r.status==="Booked").length+" upcoming today";let up=tod.filter(r=>r.status==="Booked").sort((a,b)=>a.time.localeCompare(b.time)).slice(0,4);$("upcomingReservations").innerHTML=up.length?up.map(r=>`<div class="mini-res"><span class="time">${esc(r.time)}</span><div style="flex:1"><strong>${esc(r.guest)}</strong><small>${r.party} guests · Table ${r.table}</small></div>${badge(r.status)}</div>`).join(""):`<p>No upcoming reservations today.</p>`}
function renderAll(){renderOrders();renderMenu();renderTables();renderReservations()}
const names={dashboard:"Dashboard overview",orders:"Order management",menu:"Menu management",tables:"Table management",reservations:"Reservations",settings:"Settings / Profile"};function go(p){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));$(p+"Page").classList.add("active");document.querySelectorAll(".nav-link").forEach(x=>x.classList.toggle("active",x.dataset.page===p));$("pageTitle").textContent=names[p];$("breadcrumb").textContent=names[p].replace(" overview","");$("sidebar").classList.remove("open")}
document.querySelectorAll(".nav-link").forEach(b=>b.onclick=()=>go(b.dataset.page));document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));$("mobileMenu").onclick=()=>$("sidebar").classList.toggle("open");function open(id){$(id).showModal()}document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());$("quickOrder").onclick=$("addOrder").onclick=()=>open("orderDialog");$("addMenu").onclick=()=>open("menuDialog");$("addReservation").onclick=()=>{tableOptions();open("reservationDialog")};["orderSearch","orderStatusFilter"].forEach(id=>$(id).addEventListener(id==="orderSearch"?"input":"change",renderOrders));["menuSearch","menuCategoryFilter"].forEach(id=>$(id).addEventListener(id==="menuSearch"?"input":"change",renderMenu));["reservationSearch","reservationStatusFilter"].forEach(id=>$(id).addEventListener(id==="reservationSearch"?"input":"change",renderReservations));
function total(){let m=menu.find(x=>x.id===Number($("orderMenuItem").value));$("orderTotal").textContent=money((m?.price||0)*Math.max(1,Number($("orderQuantity").value)||1))}$("orderMenuItem").onchange=total;$("orderQuantity").oninput=total;$("orderTime").value="19:00";$("reservationDate").value=today;$("reservationTime").value="19:00";
$("orderForm").onsubmit=e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;let m=menu.find(x=>x.id===Number($("orderMenuItem").value)),qty=Number($("orderQuantity").value),customer=$("orderCustomer").value.trim();if(!m||!customer||qty<1){toast("Please complete all required fields.");return}let id=Math.max(1000,...orders.map(o=>o.id))+1;orders.unshift({id,customer,items:[{name:m.name,qty}],time:$("orderTime").value,amount:m.price*qty,status:"New"});save();renderAll();$("orderDialog").close();$("orderForm").reset();$("orderQuantity").value=1;total();go("orders");toast("Order #"+id+" created successfully.")};
$("menuForm").onsubmit=e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;let name=$("newMenuName").value.trim(),price=Number($("newMenuPrice").value);if(!name||price<=0){toast("Enter a valid item name and price.");return}if(menu.some(m=>m.name.toLowerCase()===name.toLowerCase())){toast("That menu item already exists.");return}let cat=$("newMenuCategory").value,em={Starters:"🍢","Main course":"🍛",Beverages:"🥤",Desserts:"🍮"};menu.push({id:Date.now(),name,category:cat,price,description:$("newMenuDescription").value.trim()||cat,emoji:em[cat],available:true});save();renderAll();$("menuDialog").close();$("menuForm").reset();toast("Menu item added successfully.")};
function tableOptions(){let date=$("reservationDate").value,booked=new Set(reservations.filter(r=>r.date===date&&["Booked","Seated"].includes(r.status)).map(r=>r.table));$("reservationTable").innerHTML=tables.map((s,i)=>({s,n:i+1})).filter(x=>x.s!=="Occupied"&&!booked.has(x.n)).map(x=>`<option value="${x.n}">Table ${x.n} (${x.s.toLowerCase()})</option>`).join("")||'<option value="">No tables available</option>'}$("reservationDate").onchange=tableOptions;
$("reservationForm").onsubmit=e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;let guest=$("guestName").value.trim(),date=$("reservationDate").value,time=$("reservationTime").value,party=Number($("partySize").value),table=Number($("reservationTable").value);if(!guest||!date||!time||party<1||!table){toast("Please complete all reservation fields.");return}if(reservations.some(r=>r.date===date&&r.time===time&&r.table===table&&["Booked","Seated"].includes(r.status))){toast("This table already has a booking at that time.");return}let id=Math.max(500,...reservations.map(r=>r.id))+1;reservations.push({id,guest,date,time,party,table,status:"Booked"});if(tables[table-1]==="Available")tables[table-1]="Reserved";save();renderAll();$("reservationDialog").close();$("reservationForm").reset();$("reservationDate").value=today;$("reservationTime").value="19:00";go("reservations");toast("Reservation saved successfully.")};
document.addEventListener("change",e=>{if(e.target.matches("[data-order]")){let o=orders.find(x=>x.id===Number(e.target.dataset.order));if(o){o.status=e.target.value;save();renderAll();toast("Order status updated.")}}if(e.target.matches("[data-reservation]")){let r=reservations.find(x=>x.id===Number(e.target.dataset.reservation));if(r){r.status=e.target.value;if(r.status==="Seated")tables[r.table-1]="Occupied";if(["Completed","Cancelled"].includes(r.status)&&tables[r.table-1]==="Reserved")tables[r.table-1]="Available";save();renderAll();toast("Reservation status updated.")}}});
document.addEventListener("click",e=>{let b=e.target.closest("[data-toggle-menu]");if(b){let m=menu.find(x=>x.id===Number(b.dataset.toggleMenu));m.available=!m.available;save();renderAll();toast(m.name+" availability updated.")}let t=e.target.closest("[data-table]");if(t){let i=Number(t.dataset.table);tables[i]=tables[i]==="Available"?"Occupied":"Available";save();renderTables();renderReservations();toast("Table "+(i+1)+" status updated.")}});
$("resetDemo").onclick=()=>{if(confirm("Reset all local changes and restore sample data?")){menu=structuredClone(seedMenu);orders=structuredClone(seedOrders);reservations=structuredClone(seedRes);tables=structuredClone(seedTables);save();renderAll();go("dashboard");toast("Sample data restored.")}};renderAll();
/* ASHIVAM: Landing page + demo admin login */
(() => {
  const css = document.createElement("style");
  css.textContent = `
    #ashLanding{font-family:Arial,sans-serif;position:fixed;inset:0;z-index:9999;
      overflow:auto;background:#fff9f0;color:#30231d}
    #ashLanding *{box-sizing:border-box}
    .ash-nav{height:78px;display:flex;align-items:center;justify-content:space-between;
      padding:0 7%;background:#fff9f0}
    .ash-brand{font-size:24px;font-weight:900;color:#b84c26}
    .ash-brand small{display:block;font-size:9px;letter-spacing:3px;color:#766257;margin-top:4px}
    .ash-btn{border:0;border-radius:30px;padding:14px 23px;background:#b84c26;
      color:white;font-weight:bold;cursor:pointer}
    .ash-hero{min-height:490px;padding:65px 8%;display:grid;grid-template-columns:1fr 1fr;
      align-items:center;gap:45px;background:linear-gradient(120deg,#fff3e1,#f9dfc4)}
    .ash-kicker{color:#b84c26;font-size:12px;font-weight:bold;letter-spacing:3px}
    .ash-hero h1{font-family:Georgia,serif;font-size:clamp(42px,5vw,70px);
      line-height:1.05;margin:18px 0}
    .ash-hero h1 em{color:#b84c26}
    .ash-hero p{color:#78665a;line-height:1.8;max-width:440px}
    .ash-food{height:350px;border-radius:48% 48% 18px 18px;overflow:hidden;
      box-shadow:0 20px 55px #76432230}
    .ash-food img{width:100%;height:100%;object-fit:cover}
    .ash-features{padding:38px 8%;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .ash-feature{padding:20px;background:white;border:1px solid #f0e3d5;border-radius:15px}
    .ash-feature b{font-family:Georgia,serif;font-size:19px}
    .ash-feature p{color:#88796d;font-size:13px;line-height:1.7}
    .ash-footer{text-align:center;padding:25px;color:#8a7768;font-size:12px}
    #ashLogin{display:none;min-height:calc(100vh - 78px);padding:35px 18px;
      align-items:center;justify-content:center;background:#f8ead9}
    .ash-login-card{background:white;padding:35px;border-radius:22px;width:min(420px,100%);
      box-shadow:0 18px 60px #70401b18}
    .ash-login-card h2{font-family:Georgia,serif;font-size:32px;margin:12px 0}
    .ash-login-card p{color:#87766b;font-size:13px;line-height:1.7}
    .ash-login-card label{display:block;font-size:12px;font-weight:bold;margin:18px 0}
    .ash-login-card input{display:block;width:100%;padding:13px;margin-top:8px;
      border:1px solid #e8d9cb;border-radius:9px;font-size:14px}
    .ash-login-card .ash-btn{width:100%;margin-top:8px}
    #ashError{color:#b3261e;font-size:12px;min-height:18px}
    @media(max-width:700px){
      .ash-hero{grid-template-columns:1fr;padding:45px 7%;gap:25px}
      .ash-food{height:250px}.ash-features{grid-template-columns:1fr}
      .ash-nav{padding:0 5%}.ash-brand{font-size:20px}
    }`;
  document.head.appendChild(css);

  const landing = document.createElement("div");
  landing.id = "ashLanding";
  landing.innerHTML = `
    <header class="ash-nav">
   
      <div class="ash-brand">
        <small>RESTAURANT & HOSPITALITY</small>
      </div>
      <button class="ash-btn" id="ashOpenLogin">Admin Login ↗</button>
    </header>

    <section id="ashHome">
      <div class="ash-hero">
        <div>
          <div class="ash-kicker">GOOD FOOD. GREAT MOMENTS.</div>
          <h1>Every meal<br>tells a <em>story.</em></h1>
          <p>Thoughtfully prepared food, warm hospitality, and memorable
          moments around the table. Welcome to Ashivam.</p>
          <button class="ash-btn" id="ashExplore">Explore Our Workspace →</button>
        </div>
        <div class="ash-food">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85"
            alt="Warm, elegant restaurant dining space">
        </div>
      </div>
      <div class="ash-features">
        <article class="ash-feature"><b>01 · Order Management</b>
          <p>Keep orders organised and track their progress.</p></article>
        <article class="ash-feature"><b>02 · Curated Menu</b>
          <p>Manage dishes, prices, and availability in one place.</p></article>
        <article class="ash-feature"><b>03 · Guest Experience</b>
          <p>Coordinate tables and reservations with ease.</p></article>
      </div>
      <div class="ash-footer">ASHIVAM · GOOD FOOD, THOUGHTFULLY MANAGED</div>
    </section>

    <section id="ashLogin">
      <div class="ash-login-card">
        <div class="ash-kicker">ASHIVAM WORKSPACE</div>
        <h2>Welcome back.</h2>
        <p>Sign in to access your restaurant management dashboard.</p>
        <form id="ashLoginForm">
          <label>Email address
            <input id="ashEmail" type="email" required
              placeholder="admin@example.com" autocomplete="username">
          </label>
          <label>Password
            <input id="ashPassword" type="password" required
              placeholder="Enter your password" autocomplete="current-password">
          </label>
          <div id="ashError" role="alert"></div>
          <button class="ash-btn" type="submit">Sign in to Dashboard →</button>
        </form>
        <p><button id="ashBack" style="border:0;background:none;color:#b84c26;cursor:pointer">
          ← Back to home</button></p>
      </div>
    </section>`;

  document.body.appendChild(landing);

  const app = document.querySelector(".layout");
  if (!app) {
    landing.innerHTML = "<p style='padding:30px'>Dashboard container not found. Check that the original website is unchanged.</p>";
    return;
  }

  app.hidden = true;

  const home = document.getElementById("ashHome");
  const login = document.getElementById("ashLogin");

  function showLogin() {
    home.style.display = "none";
    login.style.display = "flex";
    document.getElementById("ashError").textContent = "";
  }

  function showHome() {
    login.style.display = "none";
    home.style.display = "block";
  }

  document.getElementById("ashOpenLogin").onclick = showLogin;
  document.getElementById("ashExplore").onclick = showLogin;
  document.getElementById("ashBack").onclick = showHome;

  document.getElementById("ashLoginForm").onsubmit = (e) => {
    e.preventDefault();

    const email = document.getElementById("ashEmail").value.trim();
    const password = document.getElementById("ashPassword").value;

    if (email === "admin@ashivam.com" && password === "Ashivam@123") {
      landing.style.display = "none";
      app.hidden = false;

      if (!document.getElementById("ashLogout")) {
        const logout = document.createElement("button");
        logout.id = "ashLogout";
        logout.className = "btn";
        logout.textContent = "Log out";
        logout.style.marginLeft = "8px";
        document.querySelector(".top-actions").appendChild(logout);

        logout.onclick = () => {
          app.hidden = true;
          landing.style.display = "block";
          showHome();
          document.getElementById("ashLoginForm").reset();
        };
      }
    } else {
      document.getElementById("ashError").textContent =
        "Incorrect email or password. Please try again.";
    }
  };
})();

/* ASHIVAM PUBLIC CUSTOMER WEBSITE */
(() => {
  const home = document.getElementById("ashHome");
  if (!home) return;

  home.innerHTML = `
    <style>
      #ashHome{background:#fffaf3;color:#30231d}
      .pub-navlinks{display:flex;gap:20px;align-items:center}
      .pub-navlinks a{color:#5d483b;text-decoration:none;font-size:13px}
      .pub-section{padding:65px 8%}
      .pub-heading{text-align:center;margin-bottom:32px}
      .pub-heading small{color:#b84c26;letter-spacing:2px;font-weight:bold}
      .pub-heading h2{font:40px Georgia,serif;margin:12px 0}
      .pub-heading p{color:#857367;line-height:1.7}
      .pub-menu{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
      .pub-card{background:white;border:1px solid #eee1d2;border-radius:16px;overflow:hidden}
      .pub-card img{width:100%;height:190px;object-fit:cover}
      .pub-card-body{padding:18px}
      .pub-card-body h3{font:22px Georgia,serif;margin:0 0 8px}
      .pub-card-body p{font-size:13px;color:#87766b;line-height:1.6;min-height:40px}
      .pub-price{font-weight:bold;color:#b84c26;font-size:18px}
      .pub-buy{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:14px}
      .pub-form{background:white;padding:26px;border:1px solid #eee1d2;border-radius:16px}
      .pub-form label{display:block;font-size:12px;font-weight:bold;margin:13px 0}
      .pub-form input,.pub-form select,.pub-form textarea{display:block;width:100%;padding:12px;margin-top:7px;border:1px solid #e5d6c8;border-radius:8px;background:#fffdf9}
      .pub-form .ash-btn{margin-top:12px}
      .pub-grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}
      .pub-notice{font-size:12px;color:#78665a;line-height:1.7}
      .pub-contact{background:#f5e3d0;border-radius:18px;padding:30px}
      .pub-contact h3{font:28px Georgia,serif}
      .pub-contact p{line-height:1.8;color:#705c4e}
      .pub-footer{background:#30231d;color:#fff2e5;padding:28px 8%;display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap;font-size:12px}
      .pub-cartline{display:flex;gap:12px;align-items:center}
      .pub-cartline input{width:75px}
      @media(max-width:750px){
        .pub-menu{grid-template-columns:1fr 1fr}
        .pub-grid2{grid-template-columns:1fr}
        .pub-section{padding:45px 6%}
        .pub-navlinks{gap:10px;flex-wrap:wrap;justify-content:flex-end}
        .pub-navlinks a{font-size:11px}
        .pub-heading h2{font-size:32px}
      }
      @media(max-width:460px){.pub-menu{grid-template-columns:1fr}}
    </style>

    <div class="ash-hero" id="pubTop">
      <div>
        <div class="ash-kicker">WELCOME TO ASHIVAM</div>
        <h1>Good food.<br>Great <em>moments.</em></h1>
        <p>Discover delicious dishes, order your favourites, and reserve a table for your next special moment.</p>
        <button class="ash-btn" onclick="document.getElementById('pubMenu').scrollIntoView({behavior:'smooth'})">Explore our menu ↓</button>
        <button class="ash-btn" style="margin:10px;background:#fff;color:#b84c26;border:1px solid #b84c26" onclick="document.getElementById('pubBooking').scrollIntoView({behavior:'smooth'})">Reserve a table</button>
      </div>
      <div class="ash-food">
        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85" alt="Restaurant dining ambience">
      </div>
    </div>

    <nav class="ash-nav" style="position:sticky;top:0;z-index:5;border-bottom:1px solid #eee1d2">
      <div class="ash-brand">Ashivam<small>FOOD · FAMILY · FLAVOUR</small></div>
      <div class="pub-navlinks">
        <a href="#pubMenu">Menu</a>
        <a href="#pubOrder">Order</a>
        <a href="#pubBooking">Reservations</a>
        <a href="#pubContact">Contact</a>
        <button class="ash-btn" id="pubAdmin">Admin ↗</button>
      </div>
    </nav>

    <section class="pub-section" id="pubMenu">
      <div class="pub-heading">
        <small>MADE WITH LOVE</small>
        <h2>Our Favourite Dishes</h2>
        <p>Explore our sample menu and choose something delicious.</p>
      </div>
      <div class="pub-menu" id="pubMenuCards"></div>
    </section>

    <section class="pub-section" id="pubOrder" style="background:#f8ecdf">
      <div class="pub-heading">
        <small>YOUR FAVOURITES, YOUR WAY</small>
        <h2>Order Online</h2>
        <p>Choose your dishes and submit an order request.</p>
      </div>
      <div class="pub-grid2">
        <div class="pub-form">
          <h3 style="font-family:Georgia,serif">Your order</h3>
          <form id="pubOrderForm">
            <label>Your name<input id="pubCustomer" required maxlength="70" placeholder="Enter your name"></label>
            <label>Phone number<input id="pubPhone" required type="tel" pattern="[0-9+() -]{8,18}" placeholder="Your contact number"></label>
            <label>Dish<select id="pubDish" required></select></label>
            <label>Quantity<input id="pubQty" type="number" min="1" max="30" value="1" required></label>
            <label>Order type
              <select id="pubFulfilment"><option>Takeaway request</option><option>Dine-in request</option></select>
            </label>
            <p>Total: <strong id="pubTotal">₹0</strong></p>
            <button class="ash-btn" type="submit">Place order request →</button>
          </form>
        </div>
        <div>
          <h3 style="font:32px Georgia,serif">Freshly made, just for you.</h3>
          <p class="pub-notice">After you submit your request, it will be saved in this website's demo order records. This prototype does not process payments or send orders to a real kitchen.</p>
          <img style="width:100%;height:250px;object-fit:cover;border-radius:15px;margin-top:15px" src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85" alt="Freshly prepared food">
        </div>
      </div>
    </section>

    <section class="pub-section" id="pubBooking">
      <div class="pub-heading">
        <small>LET US SAVE YOU A SEAT</small>
        <h2>Reserve a Table</h2>
        <p>Plan your visit and send a reservation request.</p>
      </div>
      <div class="pub-grid2">
        <div class="pub-contact">
          <h3>A table is waiting for you.</h3>
          <p>Celebrating something special or just catching up? Send your preferred date, time and group size.</p>
          <p>✦ Reservations are requests, not confirmed bookings. The restaurant team must confirm availability.</p>
        </div>
        <form class="pub-form" id="pubBookingForm">
          <label>Full name<input id="pubGuest" required maxlength="70" placeholder="Your name"></label>
          <label>Booking date<input id="pubDate" type="date" required></label>
          <label>Preferred time<input id="pubTime" type="time" required></label>
          <label>Number of guests<input id="pubParty" type="number" min="1" max="30" value="2" required></label>
          <button class="ash-btn" type="submit">Request reservation →</button>
          <p class="pub-notice" id="pubBookingMsg" role="status"></p>
        </form>
      </div>
    </section>

    <section class="pub-section" id="pubContact" style="padding-top:20px">
      <div class="pub-grid2">
        <div>
          <div class="ash-kicker">COME SAY HELLO</div>
          <h2 style="font:40px Georgia,serif">Visit Ashivam.</h2>
          <p style="line-height:1.9;color:#78665a">We look forward to welcoming you.</p>
          <p><strong>Address:</strong> <span id="pubAddress">Restaurant address to be added</span></p>
          <p><strong>Phone:</strong> <span id="pubContactPhone">Restaurant contact number to be added</span></p>
          <p><strong>Hours:</strong> Please confirm the restaurant's operating hours.</p>
        </div>
        <div class="pub-contact">
          <h3>Good food brings us together.</h3>
          <p>For enquiries, bookings and order requests, contact the restaurant team using its verified contact details.</p>
        </div>
      </div>
    </section>

    <footer class="pub-footer">
      <strong>✦ ASHIVAM</strong>
      <span>Good food. Great moments.</span>
      <a href="#pubTop" style="color:#fff2e5">Back to top ↑</a>
    </footer>
  `;

  const dishes = [
    {name:"Paneer Tikka", price:249, category:"Starter", img:"photo-1567188040759-fb8a883dc6d8", desc:"Smoky paneer with aromatic Indian spices."},
    {name:"Margherita Pizza", price:299, category:"Pizza", img:"photo-157 pizza", desc:"A classic cheesy favourite."},
    {name:"Creamy Pasta", price:279, category:"Main course", img:"photo- pasta", desc:"Comforting pasta in a rich, creamy sauce."},
    {name:"Veg Biryani", price:229, category:"Main course", img:"photo-1563379091339-03246963d96c", desc:"Fragrant rice with spices and vegetables."},
    {name:"Garden Salad", price:179, category:"Fresh", img:"photo-1512621776951-a57141f2eefd", desc:"A fresh mix of seasonal vegetables."},
    {name:"Chocolate Dessert", price:159, category:"Dessert", img:"photo-160 chocolate", desc:"A sweet finish to your meal."}
  ];

  // Replace the two illustrative image IDs below with valid Unsplash photo IDs.
  dishes[1].img = "photo-1574071318508-1cdbab80d002";
  dishes[2].img = "photo-1473093295043-cdd812d0e601";
  dishes[5].img = "photo-1606313564200-e75d5e30476c";

  const money = n => "₹" + Number(n).toLocaleString("en-IN");
  const dishSelect = document.getElementById("pubDish");
  const menuCards = document.getElementById("pubMenuCards");

  menuCards.innerHTML = dishes.map((d,i) => `
    <article class="pub-card">
      <img loading="lazy" src="https://images.unsplash.com/${d.img}?auto=format&fit=crop&w=700&q=80" alt="${d.name}">
      <div class="pub-card-body">
        <small style="color:#b84c26">${d.category}</small>
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <div class="pub-buy">
          <span class="pub-price">${money(d.price)}</span>
          <button class="ash-btn" data-pub-dish="${i}">Order</button>
        </div>
      </div>
    </article>`).join("");

  dishSelect.innerHTML = dishes.map((d,i) =>
    `<option value="${i}">${d.name} — ${money(d.price)}</option>`).join("");

  function updateTotal() {
    const dish = dishes[Number(dishSelect.value)] || dishes[0];
    document.getElementById("pubTotal").textContent =
      money(dish.price * Number(document.getElementById("pubQty").value || 1));
  }
  dishSelect.onchange = updateTotal;
  document.getElementById("pubQty").oninput = updateTotal;
  updateTotal();

  menuCards.querySelectorAll("[data-pub-dish]").forEach(button => {
    button.onclick = () => {
      dishSelect.value = button.dataset.pubDish;
      updateTotal();
      document.getElementById("pubOrder").scrollIntoView({behavior:"smooth"});
    };
  });

  const dateInput = document.getElementById("pubDate");
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  dateInput.min = localDate;
  dateInput.value = localDate;

  document.getElementById("pubOrderForm").onsubmit = e => {
    e.preventDefault();
    const customer = document.getElementById("pubCustomer").value.trim();
    const phone = document.getElementById("pubPhone").value.trim();
    const dish = dishes[Number(dishSelect.value)];
    const qty = Number(document.getElementById("pubQty").value);
    if (!customer || !phone || !dish || qty < 1) return;

    const orders = JSON.parse(localStorage.getItem("ash-orders") || "[]");
    const id = Math.max(1000, ...orders.map(o => Number(o.id) || 0)) + 1;
    orders.unshift({
      id, customer: customer + " · " + phone,
      items:[{name:dish.name,qty}],
      time: new Date().toTimeString().slice(0,5),
      amount:dish.price * qty,
      status:"New"
    });
    localStorage.setItem("ash-orders", JSON.stringify(orders));
    alert("Order request saved! Reference #" + id +
      ". This is a demo: please contact the restaurant to confirm.");
    e.target.reset();
    document.getElementById("pubQty").value = 1;
    updateTotal();
  };

  document.getElementById("pubBookingForm").onsubmit = e => {
    e.preventDefault();
    const guest = document.getElementById("pubGuest").value.trim();
    const date = document.getElementById("pubDate").value;
    const time = document.getElementById("pubTime").value;
    const party = Number(document.getElementById("pubParty").value);
    if (!guest || !date || !time || party < 1 || date < localDate) {
      document.getElementById("pubBookingMsg").textContent = "Please check your booking details.";
      return;
    }

    const reservations = JSON.parse(localStorage.getItem("ash-res") || "[]");
    const id = Math.max(500, ...reservations.map(r => Number(r.id) || 0)) + 1;
    reservations.push({id, guest, date, time, party, table:1, status:"Booked"});
    localStorage.setItem("ash-res", JSON.stringify(reservations));
    document.getElementById("pubBookingMsg").textContent =
      "Request saved! Reference #R-" + id + ". The restaurant must confirm your booking.";
    e.target.reset();
    dateInput.value = localDate;
    dateInput.min = localDate;
    document.getElementById("pubParty").value = 2;
  };

  document.getElementById("pubAdmin").onclick = () => {
    document.getElementById("ashOpenLogin")?.click();
  };
})();
