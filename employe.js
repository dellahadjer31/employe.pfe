// ===================================================
// DATE / HEURE
// ===================================================
function tick(){
  const n=new Date();
  document.getElementById('headerDate').textContent=
    n.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'});
  document.getElementById('headerTime').textContent=
    n.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}
tick(); setInterval(tick,1000);

// ===================================================
// DARK MODE
// ===================================================
const html=document.documentElement;
const themeIcon=document.getElementById('themeIcon');
const savedTheme=localStorage.getItem('unirhTheme')||'light';
html.dataset.theme=savedTheme;
applyThemeIcon(savedTheme);

document.getElementById('btnTheme').addEventListener('click',()=>{
  const dark=html.dataset.theme==='dark';
  const next=dark?'light':'dark';
  html.dataset.theme=next;
  localStorage.setItem('unirhTheme',next);
  applyThemeIcon(next);
  rebuildChart();
});
function applyThemeIcon(t){
  themeIcon.className=t==='dark'?'fa-solid fa-sun':'fa-solid fa-moon';
}

// ===================================================
// LANGUE FR / AR
// ===================================================
let currentLang=localStorage.getItem('unirhLang')||'fr';

// TITLES défini ici pour être accessible par applyLang
const TITLES={
  dashboard:{fr:'Tableau de bord',ar:'لوحة القيادة',sub:{fr:"Vue d'ensemble — Système RH Universitaire",ar:'نظرة عامة — نظام الموارد البشرية'}},
  personnel:{fr:'Gestion du Personnel',ar:'إدارة الموظفين',sub:{fr:'Gérez les comptes et profils du personnel',ar:'إدارة حسابات وملفات الموظفين'}},
  paie:{fr:'Gestion de la Paie',ar:'إدارة الرواتب',sub:{fr:'Bulletins de salaire et historique des paiements',ar:'كشوف الراتب وسجل المدفوعات'}},
  conge:{fr:'Gestion des Congés',ar:'إدارة الإجازات',sub:{fr:'Demandes, validations et suivi des congés',ar:'طلبات الإجازات والموافقة والمتابعة'}},
  absence:{fr:'Gestion des Absences',ar:'إدارة الغيابات',sub:{fr:'Suivi et justification des absences',ar:'متابعة وتبرير الغيابات'}},
};

document.getElementById('btnLang').addEventListener('click',()=>{
  currentLang=currentLang==='fr'?'ar':'fr';
  localStorage.setItem('unirhLang',currentLang);
  applyLang(currentLang);
});

function applyLang(lang){
  currentLang=lang;
  html.lang=lang;
  html.dir=lang==='ar'?'rtl':'ltr';
  document.getElementById('langLabel').textContent=lang==='fr'?'FR':'AR';

  const T={
    fr:{
      'nav-dashboard':'Tableau de bord','nav-personnel':'Gestion Personnel',
      'nav-paie':'Gestion de la Paie','nav-conge':'Gestion Congés','nav-absence':'Gestion Absences',
      'admin-role':'Administrateur',
      'dash-t1':'Total Personnel','dash-t2':'Masse Salariale','dash-t3':'Congés en cours',
      'dash-t4':'Absences non justifiées','sub-t1':'Enseignants','sub-t2':'Administratifs',
      'sub-t3':'Congés restants (j)','sub-t4':"Taux d'absentéisme",
      'chart-title':'Évolution des Salaires','act-title':'Activités Récentes','see-all':'Voir tout',
    },
    ar:{
      'nav-dashboard':'لوحة القيادة','nav-personnel':'إدارة الموظفين',
      'nav-paie':'إدارة الرواتب','nav-conge':'إدارة الإجازات','nav-absence':'إدارة الغيابات',
      'admin-role':'مدير النظام',
      'dash-t1':'إجمالي الموظفين','dash-t2':'كتلة الأجور','dash-t3':'إجازات جارية',
      'dash-t4':'غيابات غير مبررة','sub-t1':'أساتذة','sub-t2':'إداريون',
      'sub-t3':'أيام إجازة متبقية','sub-t4':'معدل الغياب',
      'chart-title':'تطور الأجور','act-title':'النشاطات الأخيرة','see-all':'عرض الكل',
    }
  };
  const t=T[lang];

  // nav labels
  document.querySelectorAll('.nav-item').forEach(item=>{
    const page=item.dataset.page;
    const lbl=item.querySelector('.nav-label');
    if(lbl&&t['nav-'+page]) lbl.textContent=t['nav-'+page];
    const tt=t['nav-'+page]||item.dataset.tooltip;
    if(tt) item.dataset.tooltip=tt;
  });
  // admin role
  const roleEl=document.querySelector('.admin-role');
  if(roleEl) roleEl.textContent=t['admin-role'];

  // dashboard stat labels
  const labels=document.querySelectorAll('.stats-grid .stat-label');
  const keys=['dash-t1','dash-t2','dash-t3','dash-t4','sub-t1','sub-t2','sub-t3','sub-t4'];
  labels.forEach((el,i)=>{ if(keys[i]&&t[keys[i]]) el.textContent=t[keys[i]]; });

  // chart / activity titles
  const chH=document.querySelectorAll('.card-header h3');
  if(chH[0]) chH[0].innerHTML=`<i class="fa-solid fa-chart-line"></i> ${t['chart-title']}`;
  if(chH[1]) chH[1].innerHTML=`<i class="fa-solid fa-clock-rotate-left"></i> ${t['act-title']}`;
  const seeAll=document.querySelector('.see-all-btn');
  if(seeAll) seeAll.textContent=t['see-all'];

  // update page title if on dashboard
  const activePage=document.querySelector('.nav-item.active')?.dataset.page||'dashboard';
  const titleMap=TITLES[activePage];
  if(titleMap){
    document.getElementById('pageTitle').textContent=titleMap[lang]||titleMap.fr;
    document.getElementById('pageSubtitle').textContent=titleMap.sub[lang]||titleMap.sub.fr;
  }
}

// ===================================================
// SIDEBAR
// ===================================================
const sidebar=document.getElementById('sidebar');
const mainEl=document.getElementById('mainContent');
document.getElementById('menuToggle').addEventListener('click',()=>{
  if(window.innerWidth<=768) sidebar.classList.toggle('mobile-open');
  else{sidebar.classList.toggle('collapsed');mainEl.classList.toggle('shifted');}
});

// ===================================================
// NAVIGATION
// ===================================================

document.querySelectorAll('.nav-item').forEach(item=>{
  item.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    item.classList.add('active');
    const p=item.dataset.page;
    document.querySelectorAll('.page').forEach(pg=>pg.classList.remove('active'));
    document.getElementById('page-'+p).classList.add('active');
    const t=TITLES[p];
    document.getElementById('pageTitle').textContent=t?t[currentLang]||t.fr:p;
    document.getElementById('pageSubtitle').textContent=t?t.sub[currentLang]||t.sub.fr:'';
    updateStats(); updateCongeStats(); updateAbsStats();
    if(p==='personnel') renderPersonnel();
    if(p==='conge') renderConge();
    if(p==='absence') renderAbsence();
    if(p==='paie') renderPaie();
    if(window.innerWidth<=768) sidebar.classList.remove('mobile-open');
  });
});

// ===================================================
// NOTIFICATIONS
// ===================================================
const NOTIFS=[
  {icon:'fa-user-plus',    color:'#2563eb',bg:'rgba(37,99,235,.12)', text:'Nouveau employé ajouté — Dr. Hamidi',   time:'5 min', unread:true},
  {icon:'fa-calendar-check',color:'#16a34a',bg:'rgba(22,163,74,.12)',text:'Congé approuvé — Mme. Benali Sara',      time:'22 min',unread:true},
  {icon:'fa-circle-exclamation',color:'#dc2626',bg:'rgba(220,38,38,.12)',text:'Absence non justifiée signalée',     time:'1h',    unread:true},
  {icon:'fa-money-bill',   color:'#d97706',bg:'rgba(217,119,6,.12)', text:'Bulletins du mois de Mars générés',      time:'2h',    unread:false},
  {icon:'fa-pen-to-square',color:'#7c3aed',bg:'rgba(124,58,237,.12)',text:'Profil mis à jour — Mme. Aouad Nadia',  time:'3h',    unread:false},
];
let unreadCount=NOTIFS.filter(n=>n.unread).length;

function renderNotifs(){
  const list=document.getElementById('notifList');
  list.innerHTML='';
  NOTIFS.forEach((n,i)=>{
    const li=document.createElement('li');
    li.className='notif-item'+(n.unread?' unread':'');
    li.innerHTML=`
      <div class="notif-icon" style="background:${n.bg};color:${n.color}"><i class="fa-solid ${n.icon}"></i></div>
      <div class="notif-body">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">il y a ${n.time}</div>
      </div>
      ${n.unread?'<div class="notif-dot"></div>':''}`;
    li.addEventListener('click',()=>{NOTIFS[i].unread=false;updateBadge();renderNotifs();});
    list.appendChild(li);
  });
}
function updateBadge(){
  unreadCount=NOTIFS.filter(n=>n.unread).length;
  const b=document.getElementById('notifBadge');
  b.textContent=unreadCount;
  b.style.display=unreadCount?'flex':'none';
}
renderNotifs();

document.getElementById('btnNotif').addEventListener('click',e=>{
  e.stopPropagation();
  document.getElementById('notifDropdown').classList.toggle('open');
});
document.getElementById('notifReadAll').addEventListener('click',()=>{
  NOTIFS.forEach(n=>n.unread=false);updateBadge();renderNotifs();
});
document.addEventListener('click',e=>{
  if(!document.getElementById('notifWrap').contains(e.target))
    document.getElementById('notifDropdown').classList.remove('open');
});

// ===================================================
// DASHBOARD — COUNTERS + CHART
// ===================================================
function animCount(el){
  const target=+el.dataset.target,suf=el.dataset.suffix||'';
  const step=target/(1000/16);let cur=0;
  const t=setInterval(()=>{
    cur+=step;if(cur>=target){cur=target;clearInterval(t);}
    el.textContent=target>=10000?Math.floor(cur).toLocaleString('fr-FR')+suf:Math.floor(cur)+suf;
  },16);
}
document.querySelectorAll('.stat-value').forEach(el=>animCount(el));

let chartInstance=null;
function rebuildChart(){
  const ctx=document.getElementById('salaryChart').getContext('2d');
  if(chartInstance) chartInstance.destroy();
  const dark=html.dataset.theme==='dark';
  chartInstance=new Chart(ctx,{
    type:'line',
    data:{
      labels:['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
      datasets:[{
        data:[980000,1020000,1050000,1030000,1100000,1150000,1120000,1180000,1200000,1250000,1270000,1285000],
        borderColor:'#2563eb',
        backgroundColor:c=>{const g=c.chart.ctx.createLinearGradient(0,0,0,260);g.addColorStop(0,'rgba(37,99,235,0.15)');g.addColorStop(1,'rgba(37,99,235,0)');return g;},
        fill:true,tension:0.4,
        pointBackgroundColor:'#2563eb',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:3,pointHoverRadius:6,
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{display:false},tooltip:{backgroundColor:'#1e293b',titleColor:'#fff',bodyColor:'#94a3b8',borderColor:'#334155',borderWidth:1,callbacks:{label:c=>' '+c.raw.toLocaleString('fr-FR')+' DA'}}},
      scales:{
        x:{grid:{display:false},ticks:{color:dark?'#64748b':'#94a3b8',font:{size:11}}},
        y:{grid:{color:dark?'#334155':'#f1f5f9'},ticks:{color:dark?'#64748b':'#94a3b8',font:{size:11},callback:v=>(v/1000000).toFixed(1)+'M'}}
      }
    }
  });
}
rebuildChart();

[
  {icon:'fa-user-plus',          color:'#2563eb',bg:'rgba(37,99,235,0.1)', text:'Nouveau compte créé',  sub:'Dr. Hamidi Kamel',    time:'5 min'},
  {icon:'fa-calendar-check',     color:'#16a34a',bg:'rgba(22,163,74,0.1)',text:'Congé approuvé',        sub:'Mme. Benali Sara',    time:'22 min'},
  {icon:'fa-file-invoice-dollar',color:'#d97706',bg:'rgba(217,119,6,0.1)',text:'Bulletins générés',     sub:'342 bulletins — Mars',time:'1h'},
  {icon:'fa-circle-exclamation', color:'#dc2626',bg:'rgba(220,38,38,0.1)',text:'Absence signalée',      sub:'M. Zerrouki Ahmed',   time:'2h'},
  {icon:'fa-pen-to-square',      color:'#2563eb',bg:'rgba(37,99,235,0.1)',text:'Profil mis à jour',     sub:'Mme. Aouad Nadia',    time:'3h'},
  {icon:'fa-calendar-xmark',     color:'#dc2626',bg:'rgba(220,38,38,0.1)',text:'Congé refusé',          sub:'M. Lounis Mehdi',     time:'4h'},
].forEach(a=>{
  const li=document.createElement('li');li.className='activity-item';
  li.innerHTML=`<div class="act-icon" style="background:${a.bg};color:${a.color}"><i class="fa-solid ${a.icon}"></i></div><div class="act-info"><strong>${a.text}</strong><span>${a.sub}</span></div><span class="act-time">il y a ${a.time}</span>`;
  document.getElementById('activityList').appendChild(li);
});

// ===================================================
// DONNÉES PARTAGÉES
// ===================================================
const DEPT_COLOR={
  'Informatique':'#2563eb','Mathématiques':'#7c3aed',
  'Physique':'#0891b2','Scolarité':'#16a34a',
  'RH':'#d97706','Maintenance':'#64748b',
};
const DEPT_CYCLE=['Tous','Informatique','Maintenance','Mathématiques','Physique','RH','Scolarité'];
const MOIS_CYCLE=['Tous','Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const RPP=8;

// ===================================================
// GESTION PERSONNEL
// ===================================================
let employees=[
  {id:1, nom:'Aouad',     prenom:'Nadia',   email:'n.aouad@univ.dz',     poste:'Enseignant',    dept:'Mathématiques',salaire:90000,statut:'Actif'   },
  {id:2, nom:'Benali',    prenom:'Sara',    email:'s.benali@univ.dz',    poste:'Administratif', dept:'Scolarité',    salaire:55000,statut:'Actif'   },
  {id:3, nom:'Benmoussa', prenom:'Rania',   email:'r.benmoussa@univ.dz', poste:'Responsable RH',dept:'RH',           salaire:72000,statut:'Actif'   },
  {id:4, nom:'Boudiaf',   prenom:'Amina',   email:'a.boudiaf@univ.dz',   poste:'Enseignant',    dept:'Mathématiques',salaire:82000,statut:'Actif'   },
  {id:5, nom:'Cherifi',   prenom:'Leila',   email:'l.cherifi@univ.dz',   poste:'Enseignant',    dept:'Physique',     salaire:88000,statut:'Actif'   },
  {id:6, nom:'Hamidi',    prenom:'Kamel',   email:'k.hamidi@univ.dz',    poste:'Enseignant',    dept:'Informatique', salaire:85000,statut:'Actif'   },
  {id:7, nom:'Lounis',    prenom:'Mehdi',   email:'m.lounis@univ.dz',    poste:'Responsable RH',dept:'RH',           salaire:68000,statut:'Absent'  },
  {id:8, nom:'Mekki',     prenom:'Yacine',  email:'y.mekki@univ.dz',     poste:'Technicien',    dept:'Informatique', salaire:47000,statut:'Actif'   },
  {id:9, nom:'Rahmani',   prenom:'Omar',    email:'o.rahmani@univ.dz',   poste:'Administratif', dept:'Scolarité',    salaire:53000,statut:'En congé'},
  {id:10,nom:'Sadouki',   prenom:'Bilal',   email:'b.sadouki@univ.dz',   poste:'Technicien',    dept:'Maintenance',  salaire:39000,statut:'Absent'  },
  {id:11,nom:'Tlemcani',  prenom:'Fatima',  email:'f.tlemcani@univ.dz',  poste:'Enseignant',    dept:'Physique',     salaire:86000,statut:'Actif'   },
  {id:12,nom:'Zerrouki',  prenom:'Ahmed',   email:'a.zerrouki@univ.dz',  poste:'Technicien',    dept:'Maintenance',  salaire:42000,statut:'En congé'},
  {id:13,nom:'Khelil',    prenom:'Sofiane', email:'s.khelil@univ.dz',    poste:'Enseignant',    dept:'Informatique', salaire:83000,statut:'Actif'   },
  {id:14,nom:'Meziane',   prenom:'Houria',  email:'h.meziane@univ.dz',   poste:'Administratif', dept:'Scolarité',    salaire:51000,statut:'Actif'   },
  {id:15,nom:'Djaballah', prenom:'Tarek',   email:'t.djaballah@univ.dz', poste:'Enseignant',    dept:'Physique',     salaire:87000,statut:'Actif'   },
  {id:16,nom:'Fekir',     prenom:'Lynda',   email:'l.fekir@univ.dz',     poste:'Enseignant',    dept:'Mathématiques',salaire:80000,statut:'Actif'   },
  {id:17,nom:'Ghoul',     prenom:'Rachid',  email:'r.ghoul@univ.dz',     poste:'Technicien',    dept:'Maintenance',  salaire:41000,statut:'Actif'   },
  {id:18,nom:'Hadjadj',   prenom:'Samira',  email:'s.hadjadj@univ.dz',   poste:'Administratif', dept:'RH',           salaire:58000,statut:'Actif'   },
  {id:19,nom:'Ibrir',     prenom:'Mourad',  email:'m.ibrir@univ.dz',     poste:'Enseignant',    dept:'Informatique', salaire:84000,statut:'Absent'  },
  {id:20,nom:'Jelloul',   prenom:'Asma',    email:'a.jelloul@univ.dz',   poste:'Enseignant',    dept:'Physique',     salaire:85000,statut:'Actif'   },
  {id:21,nom:'Kerboua',   prenom:'Nassim',  email:'n.kerboua@univ.dz',   poste:'Technicien',    dept:'Informatique', salaire:46000,statut:'Actif'   },
  {id:22,nom:'Laidouni',  prenom:'Wafa',    email:'w.laidouni@univ.dz',  poste:'Administratif', dept:'Scolarité',    salaire:54000,statut:'En congé'},
  {id:23,nom:'Maache',    prenom:'Djamel',  email:'d.maache@univ.dz',    poste:'Enseignant',    dept:'Mathématiques',salaire:89000,statut:'Actif'   },
  {id:24,nom:'Nacer',     prenom:'Imane',   email:'i.nacer@univ.dz',     poste:'Responsable RH',dept:'RH',           salaire:70000,statut:'Actif'   },
  {id:25,nom:'Ouali',     prenom:'Farid',   email:'f.ouali@univ.dz',     poste:'Technicien',    dept:'Maintenance',  salaire:40000,statut:'Actif'   },
  {id:26,nom:'Rabia',     prenom:'Nour',    email:'n.rabia@univ.dz',     poste:'Enseignant',    dept:'Physique',     salaire:83000,statut:'Actif'   },
  {id:27,nom:'Saadaoui',  prenom:'Khaled',  email:'k.saadaoui@univ.dz',  poste:'Administratif', dept:'Scolarité',    salaire:52000,statut:'Actif'   },
  {id:28,nom:'Tahir',     prenom:'Meriem',  email:'m.tahir@univ.dz',     poste:'Enseignant',    dept:'Informatique', salaire:82000,statut:'Actif'   },
  {id:29,nom:'Yahia',     prenom:'Bilel',   email:'b.yahia@univ.dz',     poste:'Technicien',    dept:'Maintenance',  salaire:38000,statut:'Absent'  },
  {id:30,nom:'Ziane',     prenom:'Farida',  email:'f.ziane@univ.dz',     poste:'Enseignant',    dept:'Mathématiques',salaire:88000,statut:'Actif'   },
];
let nextEmpId=employees.length+1,fDept='Tous',fStatus='Tous',fSearch='',curPage=1;

let dIdx=0;
const btnDept=document.getElementById('btnDept'),txtDept=document.getElementById('txtDept');
btnDept.addEventListener('click',()=>{dIdx=(dIdx+1)%DEPT_CYCLE.length;fDept=DEPT_CYCLE[dIdx];txtDept.textContent=fDept==='Tous'?'Département':fDept;btnDept.classList.toggle('on',fDept!=='Tous');curPage=1;renderPersonnel();});

const STAT_CYCLE=['Tous','Absent','Actif','En congé'];
let sIdx=0;
const btnStatut=document.getElementById('btnStatut'),txtStatut=document.getElementById('txtStatut');
btnStatut.addEventListener('click',()=>{sIdx=(sIdx+1)%STAT_CYCLE.length;fStatus=STAT_CYCLE[sIdx];txtStatut.textContent=fStatus==='Tous'?'Statut':fStatus;btnStatut.classList.toggle('on',fStatus!=='Tous');curPage=1;renderPersonnel();});

const searchInput=document.getElementById('searchInput'),searchClear=document.getElementById('searchClear');
searchInput.addEventListener('input',e=>{fSearch=e.target.value.toLowerCase().trim();searchClear.style.display=fSearch?'flex':'none';curPage=1;renderPersonnel();});
searchClear.addEventListener('click',()=>{searchInput.value='';fSearch='';searchClear.style.display='none';curPage=1;renderPersonnel();});

function updateStats(){
  document.getElementById('sTotal').textContent=employees.length;
  document.getElementById('sActif').textContent=employees.filter(e=>e.statut==='Actif').length;
  document.getElementById('sConge').textContent=employees.filter(e=>e.statut==='En congé').length;
  document.getElementById('sAbsent').textContent=employees.filter(e=>e.statut==='Absent').length;
}

function renderChips(){
  const row=document.getElementById('chipsRow');row.innerHTML='';
  const chips=[];
  if(fDept!=='Tous')   chips.push({l:fDept,fn:'clearDept'});
  if(fStatus!=='Tous') chips.push({l:fStatus,fn:'clearStatus'});
  if(fSearch)          chips.push({l:`"${fSearch}"`,fn:'clearSearch'});
  row.style.display=chips.length?'flex':'none';
  chips.forEach(c=>{const s=document.createElement('span');s.className='chip';s.innerHTML=`${c.l} <button onclick="${c.fn}()"><i class="fa-solid fa-xmark"></i></button>`;row.appendChild(s);});
}
window.clearDept=()=>{fDept='Tous';dIdx=0;txtDept.textContent='Département';btnDept.classList.remove('on');curPage=1;renderPersonnel();};
window.clearStatus=()=>{fStatus='Tous';sIdx=0;txtStatut.textContent='Statut';btnStatut.classList.remove('on');curPage=1;renderPersonnel();};
window.clearSearch=()=>{fSearch='';searchInput.value='';searchClear.style.display='none';curPage=1;renderPersonnel();};

function renderPersonnel(){
  const list=employees.filter(e=>
    (fDept==='Tous'||e.dept===fDept)&&
    (fStatus==='Tous'||e.statut===fStatus)&&
    (!fSearch||[e.nom,e.prenom,e.email,e.poste,e.dept].some(v=>v.toLowerCase().includes(fSearch)))
  );
  const total=list.length,totalPg=Math.max(1,Math.ceil(total/RPP));
  if(curPage>totalPg)curPage=totalPg;
  const start=(curPage-1)*RPP,slice=list.slice(start,start+RPP);
  const tbody=document.getElementById('personnelBody');
  const empty=document.getElementById('tableEmpty');
  tbody.innerHTML='';
  renderChips();
  if(!slice.length){empty.style.display='block';}
  else{
    empty.style.display='none';
    slice.forEach((emp,idx)=>{
      const sc=emp.statut==='Actif'?'ok':emp.statut==='En congé'?'aw':'ab';
      const dc=DEPT_COLOR[emp.dept]||'#64748b';
      const tr=document.createElement('tr');tr.style.animationDelay=(idx*.04)+'s';
      tr.innerHTML=`
        <td><span class="id-val">${String(emp.id).padStart(3,'0')}</span></td>
        <td><div class="emp-cell">
          <div class="emp-avatar" style="background:${dc}20;color:${dc}">${emp.photo?`<img src="${emp.photo}" alt="">`:emp.prenom[0]+emp.nom[0]}</div>
          <div><span class="nc-nom">${emp.nom}</span><span class="nc-prenom">${emp.prenom}</span></div>
        </div></td>
        <td><span class="email-col">${emp.email}</span></td>
        <td>${emp.poste}</td>
        <td><span class="dept-col" style="color:${dc}">${emp.dept}</span></td>
        <td><span class="sal-n">${(+emp.salaire).toLocaleString('fr-FR')}</span><span class="sal-u">DA</span></td>
        <td><span class="s-badge ${sc}">${emp.statut}</span></td>
        <td><div class="row-acts">
          <button class="row-btn" title="Voir"      onclick="viewEmp(${emp.id})"><i class="fa-solid fa-eye"></i></button>
          <button class="row-btn" title="Modifier"  onclick="editEmp(${emp.id})"><i class="fa-solid fa-pen"></i></button>
          <button class="row-btn del" title="Supprimer" onclick="delEmp(${emp.id})"><i class="fa-solid fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }
  document.getElementById('pgInfo').textContent=total===0?'':`${start+1}–${Math.min(start+RPP,total)} / ${total}`;
  buildPg('pgBtns',curPage,Math.max(1,Math.ceil(total/RPP)),(i)=>{curPage=i;renderPersonnel();});
  updateStats();
}

function buildPg(containerId,cur,total,cb){
  const c=document.getElementById(containerId);c.innerHTML='';
  const mk=(h,dis,fn,on=false)=>{const b=document.createElement('button');b.className='pg'+(on?' on':'');b.innerHTML=h;b.disabled=dis;if(!dis)b.onclick=fn;return b;};
  c.appendChild(mk('‹',cur===1,()=>cb(cur-1)));
  for(let i=1;i<=total;i++)c.appendChild(mk(i,false,()=>cb(i),i===cur));
  c.appendChild(mk('›',cur===total,()=>cb(cur+1)));
}
renderPersonnel();
updateStats();

// Modals personnel
let editId=null;
const modalOv=document.getElementById('modalOverlay'),addForm=document.getElementById('addForm');
document.getElementById('btnAjouter').addEventListener('click',()=>{editId=null;addForm.reset();document.getElementById('modalTitleEl').textContent='Ajouter un employé';document.getElementById('modalSubEl').textContent='Remplissez les informations ci-dessous';document.getElementById('modalIconEl').className='fa-solid fa-user-plus';modalOv.classList.add('open');});
document.getElementById('modalClose').addEventListener('click',()=>modalOv.classList.remove('open'));
document.getElementById('btnCancel').addEventListener('click',()=>modalOv.classList.remove('open'));
modalOv.addEventListener('click',e=>{if(e.target===modalOv)modalOv.classList.remove('open');});
addForm.addEventListener('submit',e=>{
  e.preventDefault();
  const d={nom:document.getElementById('fNom').value.trim(),prenom:document.getElementById('fPrenom').value.trim(),email:document.getElementById('fEmail').value.trim(),poste:document.getElementById('fPoste').value.trim(),dept:document.getElementById('fDept').value,salaire:+document.getElementById('fSalaire').value,statut:document.getElementById('fStatut').value};
  if(editId){const emp=employees.find(e=>e.id===editId);if(emp)Object.assign(emp,d);editId=null;}
  else{d.id=nextEmpId++;employees.push(d);}
  modalOv.classList.remove('open');renderPersonnel();
});
const viewOv=document.getElementById('viewOverlay');
window.viewEmp=id=>{
  const emp=employees.find(e=>e.id===id);if(!emp)return;
  document.getElementById('viewName').textContent=emp.prenom+' '+emp.nom;
  document.getElementById('viewPoste').textContent=emp.poste+' — '+emp.dept;
  document.getElementById('viewGrid').innerHTML=[
    {l:'ID',v:String(emp.id).padStart(3,'0')},{l:'Statut',v:emp.statut},
    {l:'Nom',v:emp.nom},{l:'Prénom',v:emp.prenom},
    {l:'Email',v:emp.email},{l:'Poste',v:emp.poste},
    {l:'Département',v:emp.dept},{l:'Salaire',v:(+emp.salaire).toLocaleString('fr-FR')+' DA'},
  ].map(f=>`<div class="view-field"><div class="view-field-label">${f.l}</div><div class="view-field-value">${f.v}</div></div>`).join('');
  viewOv.classList.add('open');
};
document.getElementById('viewClose').addEventListener('click',()=>viewOv.classList.remove('open'));
viewOv.addEventListener('click',e=>{if(e.target===viewOv)viewOv.classList.remove('open');});
window.editEmp=id=>{
  const emp=employees.find(e=>e.id===id);if(!emp)return;
  editId=id;
  document.getElementById('fNom').value=emp.nom;document.getElementById('fPrenom').value=emp.prenom;
  document.getElementById('fEmail').value=emp.email;document.getElementById('fPoste').value=emp.poste;
  document.getElementById('fDept').value=emp.dept;document.getElementById('fSalaire').value=emp.salaire;
  document.getElementById('fStatut').value=emp.statut;
  document.getElementById('modalTitleEl').textContent="Modifier l'employé";
  document.getElementById('modalSubEl').textContent='ID '+String(emp.id).padStart(3,'0')+' — '+emp.prenom+' '+emp.nom;
  document.getElementById('modalIconEl').className='fa-solid fa-pen-to-square';
  modalOv.classList.add('open');
};
window.delEmp=id=>{if(!confirm('Supprimer cet employé ?'))return;employees=employees.filter(e=>e.id!==id);renderPersonnel();};

// ===================================================
// GESTION DES CONGÉS — INCHANGÉ
// ===================================================
let conges=[
  {id:1,empId:2, nom:'Benali',   prenom:'Sara',   dept:'Scolarité',    type:'Annuel',    debut:'2024-04-15',fin:'2024-04-20',jours:5, statut:'Accepté'  },
  {id:2,empId:5, nom:'Cherifi',  prenom:'Leila',  dept:'Physique',     type:'Annuel',    debut:'2024-04-25',fin:'2024-05-02',jours:7, statut:'En attente'},
  {id:3,empId:9, nom:'Rahmani',  prenom:'Omar',   dept:'Scolarité',    type:'Maladie',   debut:'2024-03-10',fin:'2024-03-17',jours:7, statut:'Accepté'  },
  {id:4,empId:7, nom:'Lounis',   prenom:'Mehdi',  dept:'RH',           type:'Sans solde',debut:'2024-05-01',fin:'2024-05-05',jours:5, statut:'Refusé'   },
  {id:5,empId:1, nom:'Aouad',    prenom:'Nadia',  dept:'Mathématiques',type:'Annuel',    debut:'2024-07-01',fin:'2024-07-15',jours:15,statut:'En attente'},
  {id:6,empId:3, nom:'Benmoussa',prenom:'Rania',  dept:'RH',           type:'Maternité', debut:'2024-06-01',fin:'2024-08-31',jours:91,statut:'Accepté'  },
  {id:7,empId:11,nom:'Tlemcani', prenom:'Fatima', dept:'Physique',     type:'Annuel',    debut:'2024-08-01',fin:'2024-08-10',jours:10,statut:'En attente'},
  {id:8,empId:6, nom:'Hamidi',   prenom:'Kamel',  dept:'Informatique', type:'Maladie',   debut:'2024-02-05',fin:'2024-02-08',jours:3, statut:'Accepté'  },
];
let nextCongeId=conges.length+1,fcDept='Tous',fcStatut='Tous',fcSearch='',congeCP=1;
const CONGE_STAT=['Tous','Accepté','En attente','Refusé'];
const TYPE_COLOR={'Annuel':'#2563eb','Maladie':'#dc2626','Maternité':'#7c3aed','Sans solde':'#64748b'};
let cgdIdx=0,cgsIdx=0;

const btnCongeDept=document.getElementById('btnCongeDept'),txtCongeDept=document.getElementById('txtCongeDept');
btnCongeDept.addEventListener('click',()=>{cgdIdx=(cgdIdx+1)%DEPT_CYCLE.length;fcDept=DEPT_CYCLE[cgdIdx];txtCongeDept.textContent=fcDept==='Tous'?'Département':fcDept;btnCongeDept.classList.toggle('on',fcDept!=='Tous');congeCP=1;renderConge();});
const btnCongeStatut=document.getElementById('btnCongeStatut'),txtCongeStatut=document.getElementById('txtCongeStatut');
btnCongeStatut.addEventListener('click',()=>{cgsIdx=(cgsIdx+1)%CONGE_STAT.length;fcStatut=CONGE_STAT[cgsIdx];txtCongeStatut.textContent=fcStatut==='Tous'?'Statut':fcStatut;btnCongeStatut.classList.toggle('on',fcStatut!=='Tous');congeCP=1;renderConge();});
const searchConge=document.getElementById('searchConge'),searchCongeClear=document.getElementById('searchCongeClear');
searchConge.addEventListener('input',e=>{fcSearch=e.target.value.toLowerCase().trim();searchCongeClear.style.display=fcSearch?'flex':'none';congeCP=1;renderConge();});
searchCongeClear.addEventListener('click',()=>{fcSearch='';searchConge.value='';searchCongeClear.style.display='none';congeCP=1;renderConge();});

function updateCongeStats(){
  document.getElementById('cTotal').textContent  =conges.length;
  document.getElementById('cAttente').textContent=conges.filter(c=>c.statut==='En attente').length;
  document.getElementById('cAccepte').textContent=conges.filter(c=>c.statut==='Accepté').length;
  document.getElementById('cRefuse').textContent =conges.filter(c=>c.statut==='Refusé').length;
}
function renderCongeChips(){
  const row=document.getElementById('chipsConge');row.innerHTML='';
  const chips=[];
  if(fcDept!=='Tous')   chips.push({l:fcDept,   fn:'clearCongeDept'});
  if(fcStatut!=='Tous') chips.push({l:fcStatut,  fn:'clearCongeStatut'});
  if(fcSearch)          chips.push({l:'"'+fcSearch+'"',fn:'clearCongeSearch'});
  row.style.display=chips.length?'flex':'none';
  chips.forEach(c=>{const s=document.createElement('span');s.className='chip';s.innerHTML=c.l+' <button onclick="'+c.fn+'()"><i class="fa-solid fa-xmark"></i></button>';row.appendChild(s);});
}
window.clearCongeDept=()=>{fcDept='Tous';cgdIdx=0;txtCongeDept.textContent='Département';btnCongeDept.classList.remove('on');congeCP=1;renderConge();};
window.clearCongeStatut=()=>{fcStatut='Tous';cgsIdx=0;txtCongeStatut.textContent='Statut';btnCongeStatut.classList.remove('on');congeCP=1;renderConge();};
window.clearCongeSearch=()=>{fcSearch='';searchConge.value='';searchCongeClear.style.display='none';congeCP=1;renderConge();};

function renderConge(){
  const list=conges.filter(c=>
    (fcDept==='Tous'||c.dept===fcDept)&&
    (fcStatut==='Tous'||c.statut===fcStatut)&&
    (!fcSearch||[c.nom,c.prenom,c.dept,c.type].some(v=>v.toLowerCase().includes(fcSearch)))
  );
  const total=list.length,totalPg=Math.max(1,Math.ceil(total/RPP));
  if(congeCP>totalPg)congeCP=totalPg;
  const start=(congeCP-1)*RPP,slice=list.slice(start,start+RPP);
  const tbody=document.getElementById('congeBody');
  const empty=document.getElementById('congeEmpty');
  tbody.innerHTML='';renderCongeChips();updateCongeStats();
  if(!slice.length){empty.style.display='block';}
  else{
    empty.style.display='none';
    slice.forEach((c,idx)=>{
      const sc=c.statut==='Accepté'?'ok':c.statut==='Refusé'?'ab':'aw';
      const dc=DEPT_COLOR[c.dept]||'#64748b';
      const tc=TYPE_COLOR[c.type]||'#64748b';
      const deb=c.debut.split('-').reverse().join('/');
      const fin=c.fin.split('-').reverse().join('/');
      const tr=document.createElement('tr');tr.style.animationDelay=(idx*.04)+'s';
      tr.innerHTML=
        '<td><span class="id-val">'+String(c.id).padStart(3,'0')+'</span></td>'+
        '<td><div class="emp-cell"><div class="emp-avatar" style="background:'+dc+'20;color:'+dc+'">'+c.prenom[0]+c.nom[0]+'</div><div><span class="nc-nom">'+c.nom+'</span><span class="nc-prenom">'+c.prenom+'</span></div></div></td>'+
        '<td><span class="dept-col" style="color:'+dc+'">'+c.dept+'</span></td>'+
        '<td><span class="type-badge" style="color:'+tc+';background:'+tc+'18">'+c.type+'</span></td>'+
        '<td>'+deb+'</td><td>'+fin+'</td>'+
        '<td><span class="jours-num">'+c.jours+'j</span></td>'+
        '<td><span class="s-badge '+sc+'">'+c.statut+'</span></td>'+
        '<td><div class="row-acts"><button class="row-btn" onclick="editConge('+c.id+')"><i class="fa-solid fa-pen"></i></button><button class="row-btn del" onclick="delConge('+c.id+')"><i class="fa-solid fa-trash"></i></button></div></td>';
      tbody.appendChild(tr);
    });
  }
  document.getElementById('congePgInfo').textContent=total===0?'':(start+1)+'–'+Math.min(start+RPP,total)+' / '+total;
  buildPg('congePgBtns',congeCP,Math.max(1,Math.ceil(total/RPP)),function(i){congeCP=i;renderConge();});
}
renderConge();
updateCongeStats();

// Modal congé
const modalCongeOv=document.getElementById('modalCongeOv');
const congeForm=document.getElementById('congeForm');
let editCongeId=null;
function fillEmpSelect(selId){
  const sel=document.getElementById(selId);
  sel.innerHTML='<option value="">— Choisir un employé —</option>';
  employees.forEach(e=>sel.innerHTML+='<option value="'+e.id+'">'+e.nom+' '+e.prenom+' — '+e.dept+'</option>');
}
document.getElementById('cDebut').addEventListener('change',calcJours);
document.getElementById('cFin').addEventListener('change',calcJours);
function calcJours(){
  const d=document.getElementById('cDebut').value,f=document.getElementById('cFin').value;
  if(d&&f){const diff=Math.round((new Date(f)-new Date(d))/(86400000))+1;document.getElementById('cJours').value=diff>0?diff:0;}
}
document.getElementById('btnAjouterConge').addEventListener('click',()=>{
  editCongeId=null;congeForm.reset();fillEmpSelect('cEmpId');
  document.getElementById('congeTitleEl').textContent='Ajouter un congé';
  document.getElementById('congeSubEl').textContent='Remplissez les informations ci-dessous';
  document.getElementById('congeIconEl').className='fa-solid fa-calendar-plus';
  modalCongeOv.classList.add('open');
});
document.getElementById('congeModalClose').addEventListener('click',()=>modalCongeOv.classList.remove('open'));
document.getElementById('congeCancel').addEventListener('click',()=>modalCongeOv.classList.remove('open'));
modalCongeOv.addEventListener('click',e=>{if(e.target===modalCongeOv)modalCongeOv.classList.remove('open');});
congeForm.addEventListener('submit',e=>{
  e.preventDefault();
  const empId=+document.getElementById('cEmpId').value;
  const emp=employees.find(x=>x.id===empId);if(!emp)return;
  const d={empId,nom:emp.nom,prenom:emp.prenom,dept:emp.dept,type:document.getElementById('cType').value,debut:document.getElementById('cDebut').value,fin:document.getElementById('cFin').value,jours:+document.getElementById('cJours').value,statut:document.getElementById('cStatut').value};
  if(editCongeId){const c=conges.find(x=>x.id===editCongeId);if(c)Object.assign(c,d);editCongeId=null;}
  else{d.id=nextCongeId++;conges.push(d);}
  modalCongeOv.classList.remove('open');renderConge();
});
window.editConge=id=>{
  const c=conges.find(x=>x.id===id);if(!c)return;
  editCongeId=id;fillEmpSelect('cEmpId');
  document.getElementById('cEmpId').value=c.empId;document.getElementById('cType').value=c.type;
  document.getElementById('cDebut').value=c.debut;document.getElementById('cFin').value=c.fin;
  document.getElementById('cJours').value=c.jours;document.getElementById('cStatut').value=c.statut;
  document.getElementById('congeTitleEl').textContent='Modifier le congé';
  document.getElementById('congeSubEl').textContent='ID '+String(c.id).padStart(3,'0')+' — '+c.prenom+' '+c.nom;
  document.getElementById('congeIconEl').className='fa-solid fa-calendar-pen';
  modalCongeOv.classList.add('open');
};
window.delConge=id=>{if(!confirm('Supprimer ce congé ?'))return;conges=conges.filter(x=>x.id!==id);renderConge();};

// ===================================================
// GESTION DES ABSENCES — CRUD COMPLET
// ===================================================
let absences=[
  {id:1,empId:7, nom:'Lounis',  prenom:'Mehdi', dept:'RH',          date:'2024-04-08',type:'Non justifiée',motif:'',          justifie:'Non'},
  {id:2,empId:12,nom:'Zerrouki',prenom:'Ahmed', dept:'Maintenance', date:'2024-04-09',type:'Maladie',      motif:'Maladie',    justifie:'Oui'},
  {id:3,empId:10,nom:'Sadouki', prenom:'Bilal', dept:'Maintenance', date:'2024-04-10',type:'Retard',        motif:'Transport',  justifie:'Oui'},
  {id:4,empId:2, nom:'Benali',  prenom:'Sara',  dept:'Scolarité',   date:'2024-04-11',type:'Non justifiée',motif:'',           justifie:'Non'},
  {id:5,empId:8, nom:'Mekki',   prenom:'Yacine',dept:'Informatique',date:'2024-04-12',type:'Demi-journée', motif:'RDV médical',justifie:'Oui'},
];
let nextAbsId=absences.length+1,fabDept='Tous',fabMois='Tous',fabType='Tous',fabSearch='',absCP=1;
const ABS_TYPE_CYCLE=['Tous','Non justifiée','Maladie','Retard','Absence totale','Demi-journée'];
const ABS_TYPE_COLOR={'Non justifiée':'#dc2626','Maladie':'#d97706','Retard':'#f59e0b','Absence totale':'#7c3aed','Demi-journée':'#0891b2'};
let abdIdx=0,abmIdx=0,abtIdx=0;

const btnAbsDept=document.getElementById('btnAbsDept'),txtAbsDept=document.getElementById('txtAbsDept');
btnAbsDept.addEventListener('click',()=>{abdIdx=(abdIdx+1)%DEPT_CYCLE.length;fabDept=DEPT_CYCLE[abdIdx];txtAbsDept.textContent=fabDept==='Tous'?'Département':fabDept;btnAbsDept.classList.toggle('on',fabDept!=='Tous');absCP=1;renderAbsence();});
const btnAbsMois=document.getElementById('btnAbsMois'),txtAbsMois=document.getElementById('txtAbsMois');
btnAbsMois.addEventListener('click',()=>{abmIdx=(abmIdx+1)%MOIS_CYCLE.length;fabMois=MOIS_CYCLE[abmIdx];txtAbsMois.textContent=fabMois==='Tous'?'Mois':fabMois;btnAbsMois.classList.toggle('on',fabMois!=='Tous');absCP=1;renderAbsence();});
const btnAbsType=document.getElementById('btnAbsType'),txtAbsType=document.getElementById('txtAbsType');
btnAbsType.addEventListener('click',()=>{abtIdx=(abtIdx+1)%ABS_TYPE_CYCLE.length;fabType=ABS_TYPE_CYCLE[abtIdx];txtAbsType.textContent=fabType==='Tous'?'Type':fabType;btnAbsType.classList.toggle('on',fabType!=='Tous');absCP=1;renderAbsence();});
const searchAbs=document.getElementById('searchAbs'),searchAbsClear=document.getElementById('searchAbsClear');
searchAbs.addEventListener('input',e=>{fabSearch=e.target.value.toLowerCase().trim();searchAbsClear.style.display=fabSearch?'flex':'none';absCP=1;renderAbsence();});
searchAbsClear.addEventListener('click',()=>{fabSearch='';searchAbs.value='';searchAbsClear.style.display='none';absCP=1;renderAbsence();});

function updateAbsStats(){
  document.getElementById('abTotal').textContent      =absences.length;
  document.getElementById('abJustifie').textContent   =absences.filter(a=>a.justifie==='Oui').length;
  document.getElementById('abNonJustifie').textContent=absences.filter(a=>a.justifie==='Non').length;
  document.getElementById('abRetard').textContent     =absences.filter(a=>a.type==='Retard').length;
}
function renderAbsChips(){
  const row=document.getElementById('chipsAbs');row.innerHTML='';
  const chips=[];
  if(fabDept!=='Tous')  chips.push({l:fabDept,  fn:'clearAbsDept'});
  if(fabMois!=='Tous')  chips.push({l:fabMois,  fn:'clearAbsMois'});
  if(fabType!=='Tous')  chips.push({l:fabType,  fn:'clearAbsType'});
  if(fabSearch)         chips.push({l:'"'+fabSearch+'"',fn:'clearAbsSearch'});
  row.style.display=chips.length?'flex':'none';
  chips.forEach(c=>{const s=document.createElement('span');s.className='chip';s.innerHTML=c.l+' <button onclick="'+c.fn+'()"><i class="fa-solid fa-xmark"></i></button>';row.appendChild(s);});
}
window.clearAbsDept  =()=>{fabDept='Tous';abdIdx=0;txtAbsDept.textContent='Département';btnAbsDept.classList.remove('on');absCP=1;renderAbsence();};
window.clearAbsMois  =()=>{fabMois='Tous';abmIdx=0;txtAbsMois.textContent='Mois';btnAbsMois.classList.remove('on');absCP=1;renderAbsence();};
window.clearAbsType  =()=>{fabType='Tous';abtIdx=0;txtAbsType.textContent='Type';btnAbsType.classList.remove('on');absCP=1;renderAbsence();};
window.clearAbsSearch=()=>{fabSearch='';searchAbs.value='';searchAbsClear.style.display='none';absCP=1;renderAbsence();};

function getMoisFromDate(dateStr){
  if(!dateStr)return'';
  const m=+dateStr.split('-')[1];
  return MOIS_CYCLE[m]||'';
}

function renderAbsence(){
  const list=absences.filter(a=>
    (fabDept==='Tous'||a.dept===fabDept)&&
    (fabMois==='Tous'||getMoisFromDate(a.date)===fabMois)&&
    (fabType==='Tous'||a.type===fabType)&&
    (!fabSearch||[a.nom,a.prenom,a.dept,a.type,a.motif].some(v=>v.toLowerCase().includes(fabSearch)))
  );
  const total=list.length,totalPg=Math.max(1,Math.ceil(total/RPP));
  if(absCP>totalPg)absCP=totalPg;
  const start=(absCP-1)*RPP,slice=list.slice(start,start+RPP);
  const tbody=document.getElementById('absenceBody');
  const empty=document.getElementById('absenceEmpty');
  tbody.innerHTML='';renderAbsChips();updateAbsStats();
  if(!slice.length){empty.style.display='block';}
  else{
    empty.style.display='none';
    slice.forEach((a,idx)=>{
      const dc=DEPT_COLOR[a.dept]||'#64748b';
      const tc=ABS_TYPE_COLOR[a.type]||'#64748b';
      const jsc=a.justifie==='Oui'?'ok':'ab';
      const dateF=a.date.split('-').reverse().join('/');
      const tr=document.createElement('tr');tr.style.animationDelay=(idx*.04)+'s';
      tr.innerHTML=
        '<td><span class="id-val">'+String(a.id).padStart(3,'0')+'</span></td>'+
        '<td><div class="emp-cell"><div class="emp-avatar" style="background:'+dc+'20;color:'+dc+'">'+a.prenom[0]+a.nom[0]+'</div><div><span class="nc-nom">'+a.nom+'</span><span class="nc-prenom">'+a.prenom+'</span></div></div></td>'+
        '<td><span class="dept-col" style="color:'+dc+'">'+a.dept+'</span></td>'+
        '<td><span class="date-val">'+dateF+'</span></td>'+
        '<td><span class="type-badge" style="color:'+tc+';background:'+tc+'18">'+a.type+'</span></td>'+
        '<td><span class="motif-txt">'+(a.motif||'—')+'</span></td>'+
        '<td><span class="s-badge '+jsc+'">'+a.justifie+'</span></td>'+
        '<td><div class="row-acts"><button class="row-btn" onclick="editAbs('+a.id+')"><i class="fa-solid fa-pen"></i></button><button class="row-btn del" onclick="delAbs('+a.id+')"><i class="fa-solid fa-trash"></i></button></div></td>';
      tbody.appendChild(tr);
    });
  }
  document.getElementById('absPgInfo').textContent=total===0?'':(start+1)+'–'+Math.min(start+RPP,total)+' / '+total;
  buildPg('absPgBtns',absCP,Math.max(1,Math.ceil(total/RPP)),function(i){absCP=i;renderAbsence();});
}
renderAbsence();
updateAbsStats();

// Modal absence
const modalAbsOv=document.getElementById('modalAbsOv');
const absForm=document.getElementById('absForm');
let editAbsId=null;

document.getElementById('btnAjouterAbs').addEventListener('click',()=>{
  editAbsId=null;absForm.reset();fillEmpSelect('aEmpId');
  document.getElementById('absTitleEl').textContent='Ajouter une absence';
  document.getElementById('absSubEl').textContent='Remplissez les informations ci-dessous';
  document.getElementById('absIconEl').className='fa-solid fa-clock-rotate-left';
  modalAbsOv.classList.add('open');
});
document.getElementById('absModalClose').addEventListener('click',()=>modalAbsOv.classList.remove('open'));
document.getElementById('absCancel').addEventListener('click',()=>modalAbsOv.classList.remove('open'));
modalAbsOv.addEventListener('click',e=>{if(e.target===modalAbsOv)modalAbsOv.classList.remove('open');});

absForm.addEventListener('submit',e=>{
  e.preventDefault();
  const empId=+document.getElementById('aEmpId').value;
  const emp=employees.find(x=>x.id===empId);if(!emp)return;
  const d={empId,nom:emp.nom,prenom:emp.prenom,dept:emp.dept,date:document.getElementById('aDate').value,type:document.getElementById('aType').value,motif:document.getElementById('aMotif').value.trim(),justifie:document.getElementById('aJustifie').value};
  if(editAbsId){const a=absences.find(x=>x.id===editAbsId);if(a)Object.assign(a,d);editAbsId=null;}
  else{d.id=nextAbsId++;absences.push(d);}
  modalAbsOv.classList.remove('open');renderAbsence();
});

window.editAbs=id=>{
  const a=absences.find(x=>x.id===id);if(!a)return;
  editAbsId=id;fillEmpSelect('aEmpId');
  document.getElementById('aEmpId').value=a.empId;
  document.getElementById('aType').value=a.type;
  document.getElementById('aDate').value=a.date;
  document.getElementById('aMotif').value=a.motif;
  document.getElementById('aJustifie').value=a.justifie;
  document.getElementById('absTitleEl').textContent="Modifier l'absence";
  document.getElementById('absSubEl').textContent='ID '+String(a.id).padStart(3,'0')+' — '+a.prenom+' '+a.nom;
  document.getElementById('absIconEl').className='fa-solid fa-pen-to-square';
  modalAbsOv.classList.add('open');
};
window.delAbs=id=>{if(!confirm('Supprimer cette absence ?'))return;absences=absences.filter(x=>x.id!==id);renderAbsence();};

// ===================================================
// GESTION DE LA PAIE — INCHANGÉ
// ===================================================
let paies=[
  {id:1, empId:6, nom:'Hamidi',   prenom:'Kamel',  email:'k.hamidi@univ.dz',   dept:'Informatique', mois:'Mars',    base:85000,primes:12000,retenues:8500, statut:'Payé'      },
  {id:2, empId:2, nom:'Benali',   prenom:'Sara',   email:'s.benali@univ.dz',   dept:'Scolarité',    mois:'Mars',    base:55000,primes:5000, retenues:5500, statut:'Payé'      },
  {id:3, empId:5, nom:'Cherifi',  prenom:'Leila',  email:'l.cherifi@univ.dz',  dept:'Physique',     mois:'Mars',    base:88000,primes:10000,retenues:8800, statut:'Payé'      },
  {id:4, empId:1, nom:'Aouad',    prenom:'Nadia',  email:'n.aouad@univ.dz',    dept:'Mathématiques',mois:'Mars',    base:90000,primes:11000,retenues:9000, statut:'En attente'},
  {id:5, empId:8, nom:'Mekki',    prenom:'Yacine', email:'y.mekki@univ.dz',    dept:'Informatique', mois:'Mars',    base:47000,primes:3000, retenues:4700, statut:'En attente'},
  {id:6, empId:11,nom:'Tlemcani', prenom:'Fatima', email:'f.tlemcani@univ.dz', dept:'Physique',     mois:'Février', base:86000,primes:10000,retenues:8600, statut:'Payé'      },
  {id:7, empId:3, nom:'Benmoussa',prenom:'Rania',  email:'r.benmoussa@univ.dz',dept:'RH',           mois:'Février', base:72000,primes:8000, retenues:7200, statut:'Payé'      },
  {id:8, empId:4, nom:'Boudiaf',  prenom:'Amina',  email:'a.boudiaf@univ.dz',  dept:'Mathématiques',mois:'Février', base:82000,primes:9000, retenues:8200, statut:'Rejeté'    },
];
let nextPaieId=paies.length+1,fpDept='Tous',fpMois='Tous',fpSearch='',paieCP=1;

let pdIdx=0;
const btnPaieDept=document.getElementById('btnPaieDept'),txtPaieDept=document.getElementById('txtPaieDept');
btnPaieDept.addEventListener('click',()=>{pdIdx=(pdIdx+1)%DEPT_CYCLE.length;fpDept=DEPT_CYCLE[pdIdx];txtPaieDept.textContent=fpDept==='Tous'?'Département':fpDept;btnPaieDept.classList.toggle('on',fpDept!=='Tous');paieCP=1;renderPaie();});
let pmIdx=0;
const btnPaieMois=document.getElementById('btnPaieMois'),txtPaieMois=document.getElementById('txtPaieMois');
btnPaieMois.addEventListener('click',()=>{pmIdx=(pmIdx+1)%MOIS_CYCLE.length;fpMois=MOIS_CYCLE[pmIdx];txtPaieMois.textContent=fpMois==='Tous'?'Mois':fpMois;btnPaieMois.classList.toggle('on',fpMois!=='Tous');paieCP=1;renderPaie();});
const searchPaie=document.getElementById('searchPaie'),searchPaieClear=document.getElementById('searchPaieClear');
searchPaie.addEventListener('input',e=>{fpSearch=e.target.value.toLowerCase().trim();searchPaieClear.style.display=fpSearch?'flex':'none';paieCP=1;renderPaie();});
searchPaieClear.addEventListener('click',()=>{fpSearch='';searchPaie.value='';searchPaieClear.style.display='none';paieCP=1;renderPaie();});

function renderPaieChips(){
  const row=document.getElementById('chipsPaie');row.innerHTML='';
  const chips=[];
  if(fpDept!=='Tous')  chips.push({l:fpDept,fn:'clearPaieDept'});
  if(fpMois!=='Tous')  chips.push({l:fpMois,fn:'clearPaieMois'});
  if(fpSearch)         chips.push({l:`"${fpSearch}"`,fn:'clearPaieSearch'});
  row.style.display=chips.length?'flex':'none';
  chips.forEach(c=>{const s=document.createElement('span');s.className='chip';s.innerHTML=`${c.l} <button onclick="${c.fn}()"><i class="fa-solid fa-xmark"></i></button>`;row.appendChild(s);});
}
window.clearPaieDept=()=>{fpDept='Tous';pdIdx=0;txtPaieDept.textContent='Département';btnPaieDept.classList.remove('on');paieCP=1;renderPaie();};
window.clearPaieMois=()=>{fpMois='Tous';pmIdx=0;txtPaieMois.textContent='Mois';btnPaieMois.classList.remove('on');paieCP=1;renderPaie();};
window.clearPaieSearch=()=>{fpSearch='';searchPaie.value='';searchPaieClear.style.display='none';paieCP=1;renderPaie();};

function renderPaie(){
  const list=paies.filter(p=>
    (fpDept==='Tous'||p.dept===fpDept)&&
    (fpMois==='Tous'||p.mois===fpMois)&&
    (!fpSearch||[p.nom,p.prenom,p.email,p.dept,p.mois].some(v=>v.toLowerCase().includes(fpSearch)))
  );
  const total=list.length,totalPg=Math.max(1,Math.ceil(total/RPP));
  if(paieCP>totalPg)paieCP=totalPg;
  const start=(paieCP-1)*RPP,slice=list.slice(start,start+RPP);
  const tbody=document.getElementById('paieBody');
  const empty=document.getElementById('paieEmpty');
  tbody.innerHTML='';renderPaieChips();
  if(!slice.length){empty.style.display='block';}
  else{
    empty.style.display='none';
    slice.forEach((p,idx)=>{
      const sc=p.statut==='Payé'?'ok':p.statut==='Rejeté'?'ab':'aw';
      const dc=DEPT_COLOR[p.dept]||'#64748b';
      const net=p.base+p.primes-p.retenues;
      const tr=document.createElement('tr');tr.style.animationDelay=(idx*.04)+'s';
      tr.innerHTML=`
        <td><span class="id-val">${String(p.id).padStart(3,'0')}</span></td>
        <td><div class="emp-cell"><div class="emp-avatar" style="background:${dc}20;color:${dc}">${p.prenom[0]+p.nom[0]}</div><div><span class="nc-nom">${p.nom}</span><span class="nc-prenom">${p.prenom}</span></div></div></td>
        <td><span class="email-col">${p.email}</span></td>
        <td><span class="dept-col" style="color:${dc}">${p.dept}</span></td>
        <td><span class="mois-badge">${p.mois}</span></td>
        <td><span class="amt">${p.base.toLocaleString('fr-FR')}</span><span class="sal-u">DA</span></td>
        <td><span class="amt">+${p.primes.toLocaleString('fr-FR')}</span><span class="sal-u">DA</span></td>
        <td><span class="amt ret">-${p.retenues.toLocaleString('fr-FR')}</span><span class="sal-u">DA</span></td>
        <td><span class="amt net">${net.toLocaleString('fr-FR')}</span><span class="sal-u">DA</span></td>
        <td><span class="s-badge ${sc}">${p.statut}</span></td>
        <td><div class="row-acts">
          <button class="row-btn fiche" title="Fiche de paie" onclick="viewPaie(${p.id})"><i class="fa-solid fa-file-invoice"></i></button>
          <button class="row-btn" onclick="editPaie(${p.id})"><i class="fa-solid fa-pen"></i></button>
          <button class="row-btn del" onclick="delPaie(${p.id})"><i class="fa-solid fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }
  document.getElementById('paiePgInfo').textContent=total===0?'':`${start+1}–${Math.min(start+RPP,total)} / ${total}`;
  buildPg('paiePgBtns',paieCP,Math.max(1,Math.ceil(total/RPP)),(i)=>{paieCP=i;renderPaie();});
}
renderPaie();

document.getElementById('btnAjouterPaie').addEventListener('click',()=>alert('Cette fonctionnalité sera traitée côté serveur (PHP).'));
document.getElementById('btnPaieStats').addEventListener('click',()=>alert('Module Statistiques — à implémenter.'));

window.viewPaie=id=>{
  const p=paies.find(x=>x.id===id);if(!p)return;
  const net=p.base+p.primes-p.retenues;
  const sc=p.statut==='Payé'?'ok':p.statut==='Rejeté'?'ab':'aw';
  const today=new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'});
  document.getElementById('ficheBody').innerHTML=`
    <div class="fiche-header">
      <div class="fiche-univ">
        <div class="fiche-logo"><i class="fa-solid fa-landmark"></i></div>
        <div><div class="fiche-univ-name">Université — UniRH</div><div class="fiche-univ-sub">Direction des Ressources Humaines</div></div>
      </div>
      <div class="fiche-title-block">
        <div class="fiche-title">Fiche de Paie</div>
        <div class="fiche-period">Période : ${p.mois} 2024</div>
        <div style="margin-top:4px"><span class="fiche-statut ${sc}">${p.statut}</span></div>
      </div>
    </div>
    <div class="fiche-emp-row">
      <div><div class="fiche-field-label">Nom &amp; Prénom</div><div class="fiche-field-value">${p.prenom} ${p.nom}</div></div>
      <div><div class="fiche-field-label">Email</div><div class="fiche-field-value">${p.email}</div></div>
      <div><div class="fiche-field-label">Département</div><div class="fiche-field-value">${p.dept}</div></div>
      <div><div class="fiche-field-label">ID Bulletin</div><div class="fiche-field-value">#${String(p.id).padStart(4,'0')}</div></div>
    </div>
    <table class="fiche-table">
      <thead><tr><th>Désignation</th><th>Base</th><th>Montant</th></tr></thead>
      <tbody>
        <tr class="cat-row"><td colspan="3">Rémunération</td></tr>
        <tr><td>Salaire de base</td><td>Mensuel</td><td>${p.base.toLocaleString('fr-FR')} DA</td></tr>
        <tr><td>Primes &amp; Indemnités</td><td>—</td><td>+${p.primes.toLocaleString('fr-FR')} DA</td></tr>
        <tr class="cat-row"><td colspan="3">Retenues</td></tr>
        <tr class="ret"><td>Retenues diverses</td><td>—</td><td>-${p.retenues.toLocaleString('fr-FR')} DA</td></tr>
      </tbody>
    </table>
    <div class="fiche-net"><span class="fiche-net-label">NET À PAYER</span><span class="fiche-net-amount">${net.toLocaleString('fr-FR')} DA</span></div>
    <div class="fiche-footer">
      <div class="fiche-sig"><div class="fiche-sig-line"></div><div class="fiche-sig-label">L'Employé</div></div>
      <div style="text-align:center;font-size:.7rem;color:var(--muted);align-self:flex-end">Édité le ${today}</div>
      <div class="fiche-sig"><div class="fiche-sig-line"></div><div class="fiche-sig-label">Direction RH</div></div>
    </div>`;
  document.getElementById('ficheOverlay').classList.add('open');
};
window.printFiche=()=>window.print();
document.getElementById('ficheClose').addEventListener('click',()=>document.getElementById('ficheOverlay').classList.remove('open'));
document.getElementById('ficheOverlay').addEventListener('click',e=>{if(e.target===document.getElementById('ficheOverlay'))document.getElementById('ficheOverlay').classList.remove('open');});
window.editPaie=id=>alert('Modification côté serveur (PHP) — ID '+id);
window.delPaie=id=>{if(!confirm('Supprimer cette paie ?'))return;paies=paies.filter(x=>x.id!==id);renderPaie();};

// ===== INIT FINAL =====
// Appel après que tout soit défini
updateStats();
updateCongeStats();
updateAbsStats();
applyLang(currentLang);
