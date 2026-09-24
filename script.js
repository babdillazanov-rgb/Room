const CATS=["Программирование","Дизайн","Тексты","Перевод","Видео","Маркетинг","Данные","3D"];
const KEY="taskly-demo-v1";
const som=n=>Number(n).toLocaleString("ru-RU")+" сом";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const seed=()=>({role:"client",tab:"tasks",open:null,q:"",cat:"",nid:100,tasks:[
 {id:1,title:"Создать landing page для магазина",desc:"Одностраничный сайт для магазина одежды в Бишкеке: каталог, контакты, форма заявки.",cat:"Программирование",min:20000,max:40000,city:"Бишкек",owner:"other",status:"OPEN",views:41,props:[]},
 {id:2,title:"Смонтировать видео для Instagram",desc:"Три Reels по 30 секунд из готового материала, субтитры на русском.",cat:"Видео",min:6000,max:12000,city:"Онлайн",owner:"other",status:"OPEN",views:27,props:[]},
 {id:3,title:"Перевести документ с русского на английский",desc:"Договор на 8 страниц, юридическая лексика.",cat:"Перевод",min:3000,max:6000,city:"Онлайн",owner:"other",status:"OPEN",views:19,props:[]},
 {id:4,title:"Создать логотип для кофейни",desc:"Логотип и вариации для вывески и соцсетей, исходники в векторе.",cat:"Дизайн",min:5000,max:15000,city:"Ош",owner:"other",status:"OPEN",views:33,props:[]},
 {id:5,title:"Разработать Telegram bot",desc:"Бот для записи клиентов салона с напоминаниями.",cat:"Программирование",min:15000,max:30000,city:"Онлайн",owner:"other",status:"OPEN",views:52,props:[]},
 {id:6,title:"Создать Excel таблицу учёта",desc:"Учёт склада с формулами и отчётом по месяцам.",cat:"Данные",min:2500,max:5000,city:"Каракол",owner:"other",status:"OPEN",views:14,props:[]}]});
let S;try{S=JSON.parse(localStorage.getItem(KEY))||seed()}catch(e){S=seed()}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("on"),2200)}
const go=(o={})=>{Object.assign(S,o);save();render()};
const isC=()=>S.role==="client";
const STATUS={OPEN:["Открыто",""],IN_PROGRESS:["В работе","warn"],SUBMITTED:["На проверке","warn"],REVISION:["Правки","warn"],COMPLETED:["Завершено","ok"]};
const tag=s=>`<span class="tag ${STATUS[s][1]}">${STATUS[s][0]}</span>`;
const byId=id=>S.tasks.find(t=>t.id===id);
const rating=()=>{const r=S.tasks.filter(t=>t.review).map(t=>t.review);return r.length?(r.reduce((a,b)=>a+b,0)/r.length).toFixed(1):"—"};

function taskCard(t){return `<div class="card task" data-open="${t.id}"><div class="row sp"><h2>${esc(t.title)}</h2>${tag(t.status)}</div>
<p class="mute" style="margin:0 0 8px">${esc(t.cat)} · ${esc(t.city)} · ${t.views} просмотров · ${t.props.length} предложений</p>
<b>${som(t.min)} — ${som(t.max)}</b></div>`}
const empty=(t,b)=>`<div class="card empty"><p>${t}</p>${b||""}</div>`;

function viewTasks(){
 const list=S.tasks.filter(t=>t.status==="OPEN"&&(!S.cat||t.cat===S.cat)&&(t.title+t.desc).toLowerCase().includes(S.q.toLowerCase()));
 return `<h1>Найди специалиста.<br>Или найди работу.</h1><p class="sub">Заказчик публикует задание, исполнители присылают предложения.</p>
 <div class="filters"><input id="q" placeholder="Что вам нужно сделать?" value="${esc(S.q)}" aria-label="Поиск"><select id="cat"><option value="">Все категории</option>${CATS.map(c=>`<option ${S.cat===c?"selected":""}>${c}</option>`).join("")}</select></div>
 ${list.length?list.map(taskCard).join(""):empty("Ничего не найдено. Измените запрос или опубликуйте своё задание.")}`}

function viewTask(){
 const t=byId(S.open);if(!t)return go({open:null});
 const mine=t.owner==="me";
 let props="";
 if(mine||!isC()){props=t.props.map(p=>`<div class="card"><div class="row sp"><b>${esc(p.by)}</b><span class="tag">${p.status==="ACCEPTED"?"Выбрано":"Ожидает"}</span></div><p style="margin:6px 0">${esc(p.msg)}</p><div class="row sp"><span class="mute">${som(p.price)} · ${p.days} дн.</span>${mine&&t.status==="OPEN"?`<button class="btn" data-pick="${p.id}">Выбрать исполнителя</button>`:""}</div></div>`).join("")||empty("Пока нет предложений.")}
 const form=!isC()&&t.status==="OPEN"&&t.owner!=="me"?`<div class="card"><h2>Отправить предложение</h2>
  <div class="grid"><div><label for="pp">Цена, сом</label><input id="pp" type="number" min="1" value="${t.min}"></div><div><label for="pd">Срок, дней</label><input id="pd" type="number" min="1" value="7"></div></div>
  <label for="pm">Сообщение</label><textarea id="pm" rows="3" placeholder="Расскажите, как выполните работу"></textarea><p></p><button class="btn" id="send">Отправить предложение</button></div>`:"";
 return `<button class="btn ghost" id="back">Назад</button><div class="card" style="margin-top:12px"><div class="row sp"><h1 style="font-size:24px">${esc(t.title)}</h1>${tag(t.status)}</div>
 <p>${esc(t.desc)}</p><p class="mute">${esc(t.cat)} · ${esc(t.city)} · ${t.views} просмотров</p><b>${som(t.min)} — ${som(t.max)}</b></div>${form}
 ${mine||!isC()?`<h2>Предложения (${t.props.length})</h2>`:""}${props}`}

function viewCreate(){return `<h1 style="font-size:28px">Новое задание</h1><div class="card">
 <label for="ct">Название</label><input id="ct" placeholder="Например: сайт для магазина">
 <label for="cd">Описание</label><textarea id="cd" rows="4"></textarea>
 <div class="grid"><div><label for="cc">Категория</label><select id="cc">${CATS.map(c=>`<option>${c}</option>`).join("")}</select></div><div><label for="cy">Город</label><select id="cy">${["Онлайн","Бишкек","Ош","Джалал-Абад","Каракол","Нарын"].map(c=>`<option>${c}</option>`).join("")}</select></div>
 <div><label for="c1">Бюджет от, сом</label><input id="c1" type="number" min="0" value="5000"></div><div><label for="c2">Бюджет до, сом</label><input id="c2" type="number" min="0" value="15000"></div></div>
 <p></p><button class="btn" id="publish">Опубликовать задание</button></div>`}

function orderCard(t){
 const o=t.order,fee=Math.round(o.price*.1);let act="";
 if(t.status==="IN_PROGRESS"||t.status==="REVISION")act=!isC()?`<button class="btn" data-submit="${t.id}">Отправить результат</button>`:`<span class="mute">Ждём результат от исполнителя</span>`;
 if(t.status==="SUBMITTED")act=isC()?`<button class="btn" data-accept="${t.id}">Принять работу</button> <button class="btn ghost" data-rev="${t.id}">Запросить правки</button>`:`<span class="mute">Заказчик проверяет работу</span>`;
 if(t.status==="COMPLETED"){act=t.review?`<span class="tag ok">Отзыв: ${t.review} из 5</span>`:isC()?`<span class="stars">${[1,2,3,4,5].map(n=>`<button data-star="${t.id}:${n}" aria-label="${n}">★</button>`).join("")}</span>`:`<span class="mute">Отзыв ещё не оставлен</span>`}
 return `<div class="card"><div class="row sp"><h2>${esc(t.title)}</h2>${tag(t.status)}</div><p class="mute" style="margin:0 0 8px">Исполнитель: ${esc(o.by)} · ${som(o.price)} · комиссия 10%: ${som(fee)} · исполнителю: ${som(o.price-fee)}</p><div class="row">${act}</div></div>`}

function viewDash(){
 const my=S.tasks.filter(t=>t.owner==="me"),ords=S.tasks.filter(t=>t.order),done=ords.filter(t=>t.status==="COMPLETED");
 const sum=done.reduce((a,t)=>a+t.order.price,0);
 const st=isC()?[["Активных заданий",my.filter(t=>t.status==="OPEN").length],["Активных заказов",ords.length-done.length],["Завершено",done.length],["Потрачено",som(sum)]]
  :[["Предложений",S.tasks.reduce((a,t)=>a+t.props.filter(p=>p.by==="Вы").length,0)],["Активных заказов",ords.length-done.length],["Завершено",done.length],["Рейтинг",rating()]];
 return `<h1 style="font-size:28px">${isC()?"Кабинет заказчика":"Кабинет исполнителя"}</h1><div class="stats">${st.map(s=>`<div class="card stat"><span class="mute">${s[0]}</span><b>${s[1]}</b></div>`).join("")}</div>
 <h2>Заказы</h2>${ords.length?ords.map(orderCard).join(""):empty(isC()?"Заказов пока нет. Опубликуйте задание и выберите исполнителя.":"Заказов пока нет. Отправьте предложение на любое задание.")}
 ${isC()?`<h2>Мои задания</h2>${my.length?my.map(taskCard).join(""):empty("Вы ещё не публиковали заданий.",`<button class="btn" data-tab="create">Создать задание</button>`)}`:""}`}

function render(){
 $("#r-client").classList.toggle("on",isC());$("#r-freelancer").classList.toggle("on",!isC());
 const tabs=[["tasks","Задания"],...(isC()?[["create","Создать"]]:[]),["dash","Кабинет"]];
 $("#nav").innerHTML=tabs.map(([k,l])=>`<button data-tab="${k}" class="${S.tab===k&&!S.open?"on":""}">${l}</button>`).join("");
 if(!isC()&&S.tab==="create")S.tab="tasks";
 $("#app").innerHTML=S.open?viewTask():S.tab==="create"?viewCreate():S.tab==="dash"?viewDash():viewTasks();
 if(S.open&&!render.seen[S.open]){render.seen[S.open]=1;const t=byId(S.open);if(t){t.views++;save()}}
}
render.seen={};

document.addEventListener("click",e=>{
 const g=k=>e.target.closest(`[data-${k}]`)?.dataset[k];
 if(e.target.id==="r-client")return go({role:"client",open:null});
 if(e.target.id==="r-freelancer")return go({role:"freelancer",open:null,tab:S.tab==="create"?"tasks":S.tab});
 if(e.target.id==="back")return go({open:null});
 const tab=g("tab");if(tab)return go({tab,open:null});
 const op=g("open");if(op)return go({open:+op});
 const t=S.open&&byId(S.open);
 if(e.target.id==="send"){const price=+$("#pp").value,days=+$("#pd").value,msg=$("#pm").value.trim();
  if(!price||!days||msg.length<5)return toast("Укажите цену, срок и сообщение");
  t.props.push({id:S.nid++,by:"Вы",price,days,msg,status:"PENDING"});toast("Предложение отправлено");return go()}
 const pick=g("pick");if(pick){const p=t.props.find(x=>x.id==+pick);p.status="ACCEPTED";t.props.forEach(x=>{if(x!==p)x.status="REJECTED"});
  t.order={by:p.by,price:p.price};t.status="IN_PROGRESS";toast("Исполнитель выбран, заказ создан");return go({open:null,tab:"dash"})}
 const sub=g("submit");if(sub){byId(+sub).status="SUBMITTED";toast("Работа отправлена");return go()}
 const acc=g("accept");if(acc){byId(+acc).status="COMPLETED";toast("Заказ завершён");return go()}
 const rev=g("rev");if(rev){byId(+rev).status="REVISION";toast("Правки запрошены");return go()}
 const star=g("star");if(star){const[id,n]=star.split(":");byId(+id).review=+n;toast("Отзыв сохранён");return go()}
 if(e.target.id==="publish"){const title=$("#ct").value.trim(),min=+$("#c1").value,max=+$("#c2").value;
  if(title.length<5)return toast("Название — минимум 5 символов");if(!max||max<min)return toast("Проверьте бюджет");
  const id=S.nid++;S.tasks.unshift({id,title,desc:$("#cd").value.trim()||"Без описания",cat:$("#cc").value,min,max,city:$("#cy").value,owner:"me",status:"OPEN",views:0,
   props:[{id:S.nid++,by:"Айбек К.",price:Math.round((min+max)/2),days:7,msg:"Делал похожие проекты, готов начать сегодня.",status:"PENDING"},{id:S.nid++,by:"Нурлан Т.",price:min,days:10,msg:"Выполню аккуратно и в срок, есть портфолио.",status:"PENDING"}]});
  toast("Задание опубликовано");return go({tab:"dash",open:id})}
});
document.addEventListener("input",e=>{if(e.target.id==="q"){S.q=e.target.value;const p=e.target.selectionStart;render();const q=$("#q");q.focus();q.setSelectionRange(p,p)}});
document.addEventListener("change",e=>{if(e.target.id==="cat")go({cat:e.target.value})});
render();
