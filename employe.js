// ── NAVIGATION (patched for chart) ──
function showPage(id, navEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (navEl) navEl.classList.add('active');
    else {
        const all = document.querySelectorAll('.nav-item');
        all.forEach(n => { if (n.textContent.trim().toLowerCase().includes(id)) n.classList.add('active'); });
    }
    window.scrollTo(0, 0);
    closeSidebar();
    // chart removed
}

// ── CALENDAR ──
(function buildCal() {
    const grid = document.getElementById('calGrid');
    ['L','M','M','J','V','S','D'].forEach(d => {
        const el = document.createElement('div');
        el.className = 'cal-dname'; el.textContent = d; grid.appendChild(el);
    });
    const offset = 6; // 1 March 2026 = Sunday → Mon-based offset = 6
    for (let i = 0; i < offset; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day other-month'; el.textContent = 22 + i; grid.appendChild(el);
    }
    const conges = [15,16,17,18,19];
    const pending = [10,11,12,13,14];
    for (let d = 1; d <= 31; d++) {
        const el = document.createElement('div'); el.className = 'cal-day'; el.textContent = d;
        if (d === 5) el.classList.add('today');
        else if (conges.includes(d)) el.classList.add('conge');
        else if (pending.includes(d)) el.classList.add('pending');
        else if (d === 28) el.classList.add('absent');
        grid.appendChild(el);
    }
})();

// ── CLOCK ──
function getCurTime() {
    return new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});
}
function updateClock() {
    const now = new Date();
    const t = now.toLocaleTimeString('fr-FR');
    const d = now.toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
    const pc = document.getElementById('pointageClock');
    const pd = document.getElementById('pointageDate');
    if (pc) pc.textContent = t;
    if (pd) pd.textContent = d.charAt(0).toUpperCase() + d.slice(1);
}
setInterval(updateClock, 1000); updateClock();

// ── TOAST ──
let toastTimer;
function showToast(icon, msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ── NOTIFICATIONS ──
function toggleNotif() {
    document.getElementById('notifPanel').classList.toggle('open');
}
document.addEventListener('click', e => {
    if (!e.target.closest('#notifPanel') && !e.target.closest('.notif-btn'))
        document.getElementById('notifPanel').classList.remove('open');
});

// ── DARK MODE ──
function toggleDark() {
    const isDark = document.body.classList.toggle('dark');
    const toggle = document.getElementById('darkToggle');
    const label = document.getElementById('darkLabel');
    toggle.classList.toggle('on', isDark);
    label.innerHTML = isDark
        ? '<i class="fas fa-sun" style="margin-right:6px"></i>Mode clair'
        : '<i class="fas fa-moon" style="margin-right:6px"></i>Mode sombre';
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch(e) {}
}
// Restore saved theme
try { if (localStorage.getItem('theme') === 'dark') toggleDark(); } catch(e) {}

// ── MOBILE SIDEBAR ──
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlayMobile').classList.toggle('show');
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlayMobile').classList.remove('show');
}

// ── ABSENCE MODAL ──
function openAbsenceModal() {
    const m = document.getElementById('absenceModal');
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closeAbsenceModal() {
    document.getElementById('absenceModal').style.display = 'none';
    document.body.style.overflow = '';
}
function submitAbsence() {
    closeAbsenceModal();
    showToast('📋', 'Absence déclarée avec succès !');
}
document.getElementById('absenceModal').addEventListener('click', function(e) {
    if (e.target === this) closeAbsenceModal();
});
// Show/hide date fin field
document.getElementById('absDuree').addEventListener('change', function() {
    document.getElementById('absDateFinGroup').style.display = this.value === 'Plusieurs jours' ? 'flex' : 'none';
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeAbsenceModal(); closeCongeModal(); }
});

// ── PHOTO PROFIL ──
function changePhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById('profilAvatarImg');
        const txt = document.getElementById('profilAvatarText');
        img.src = e.target.result;
        img.style.display = 'block';
        txt.style.display = 'none';
        // Update header avatar too
        const headerAvatar = document.querySelector('.header-avatar');
        if (headerAvatar) {
            headerAvatar.innerHTML = '<img src="'+e.target.result+'" style="width:36px;height:36px;border-radius:50%;object-fit:cover">';
        }
        showToast('📸', 'Photo de profil mise à jour !');
    };
    reader.readAsDataURL(file);
}

// ── DOCUMENT MODAL ──
let docsList = [];
function openDocModal() {
    document.getElementById('docModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closeDocModal() {
    document.getElementById('docModal').style.display = 'none';
    document.body.style.overflow = '';
}
function submitDoc() {
    const type = document.getElementById('docType').value;
    if (!type) { showToast('⚠️', 'Veuillez sélectionner un type de document'); return; }
    const today = new Date().toLocaleDateString('fr-FR');
    docsList.push({ type, date: today, statut: 'En attente' });
    renderDocs();
    closeDocModal();
    showToast('✅', 'Demande "' + type + '" envoyée au service RH !');
    document.getElementById('docType').value = '';
}
function renderDocs() {
    const empty = document.getElementById('emptyDocsMsg');
    const list = document.getElementById('docsList');
    const tbody = document.getElementById('docsTableBody');
    if (docsList.length === 0) {
        empty.style.display = 'block';
        list.style.display = 'none';
    } else {
        empty.style.display = 'none';
        list.style.display = 'block';
        tbody.innerHTML = docsList.map((d, i) => `
            <tr>
                <td><i class="fas fa-file-alt" style="color:var(--primary);margin-right:8px"></i><b>${d.type}</b></td>
                <td>${d.date}</td>
                <td><span class="badge badge-pending">En attente</span></td>
                <td><button class="btn btn-outline btn-sm" onclick="showToast('📥','${d.type} téléchargé !')"><i class="fas fa-download"></i> Télécharger</button></td>
            </tr>`).join('');
    }
}
document.getElementById('docModal').addEventListener('click', function(e) {
    if (e.target === this) closeDocModal();
});

// ── DOWNLOAD BULLETIN ──
function downloadBulletin(periode) {
    showToast('📥', 'Bulletin ' + periode + ' téléchargé !');
    // Simulation téléchargement PDF
    const content = `BULLETIN DE PAIE - ${periode}\nEmployé: Sami Khelifa\nSalaire brut: 95 200 DA\nPrimes: +7 770 DA\nDéductions: -7 770 DA\nSalaire net: 87 430 DA`;
    const blob = new Blob([content], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bulletin_' + periode.replace(' ','_') + '.txt';
    a.click();
}

// ── CONGÉ MODAL ──
function openCongeModal() {
    const m = document.getElementById('congeModal');
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closeCongeModal() {
    const m = document.getElementById('congeModal');
    m.style.display = 'none';
    document.body.style.overflow = '';
}
function submitConge() {
    closeCongeModal();
    showToast('✅', 'Demande de congé envoyée avec succès !');
}
document.getElementById('congeModal').addEventListener('click', function(e) {
    if (e.target === this) closeCongeModal();
});


// ── PRÉSENCE CHART ──
let presenceChartInstance = null;
function initPresenceChart() {
    const canvas = document.getElementById('presenceChart');
    if (!canvas) return;
    if (presenceChartInstance) { presenceChartInstance.destroy(); presenceChartInstance = null; }
    const labels = ['20/02','21/02','24/02','25/02','26/02','27/02','28/02','03/03','04/03','05/03'];
    const status = [1,1,1,1,1,2,0,1,1,1]; // 0=absent 1=présent 2=retard
    const colors = status.map(v => v===1?'#2563eb':v===2?'#f59e0b':'#ef4444');
    const heights = status.map(v => v===0?25:v===2?60:100);
    presenceChartInstance = new Chart(canvas, {
        type:'bar',
        data:{ labels, datasets:[{ data:heights, backgroundColor:colors, borderRadius:6, borderSkipped:false }] },
        options:{
            responsive:true,
            plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: ctx => status[ctx.dataIndex]===1?'Présent':status[ctx.dataIndex]===2?'Retard':'Absent' }}},
            scales:{ y:{display:false,max:120}, x:{grid:{display:false}, ticks:{font:{size:10},color:'#64748b'}} }
        }
    });
}

// Init chart on page load
initPresenceChart();

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.stat-card, .obj-card, .white-card, .bulletin-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});