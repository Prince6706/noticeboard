const API_URL = 'http://localhost:8081/notices';

let editingId = null;
let allNotices = [];

const noticeForm = document.getElementById('noticeForm');
const noticeTitleInput = document.getElementById('noticeTitle');
const noticeDescriptionInput = document.getElementById('noticeDescription');
const noticesGrid = document.getElementById('noticesGrid');
const emptyState = document.getElementById('emptyState');
const totalNoticesEl = document.getElementById('totalNotices');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const searchInput = document.getElementById('searchInput');
const toast = document.getElementById('toast');

document.addEventListener('DOMContentLoaded', ()=>{loadNotices();setup()});

function setup(){
  // Add is disabled — no button to open modal for creating new notices
  if(modalClose) modalClose.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); closeModal(); showToast('Closed'); });
  if(cancelBtn) cancelBtn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); closeModal(); });
  noticeForm.addEventListener('submit', handleSubmit);
  searchInput.addEventListener('input', handleSearch);
  // close modal when clicking on backdrop
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target === modal) { e.preventDefault(); e.stopPropagation(); closeModal(); } });
  // close modal on Escape key
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') { closeModal(); } });
}

function showModal(){ modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); }
function closeModal(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); resetForm(); }

async function loadNotices(){
  try{
    const res = await fetch(API_URL);
    if(!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    allNotices = data;
    renderNotices(data);
    totalNoticesEl.textContent = data.length;
  }catch(e){ showToast('Failed to load notices','error'); console.error(e); }
}

function renderNotices(list){
  if(!list.length){ noticesGrid.innerHTML=''; emptyState.classList.remove('hidden'); return; }
  emptyState.classList.add('hidden');
  noticesGrid.innerHTML = list.map(n => cardHtml(n)).join('');
}

function cardHtml(n){
  return `
    <article class="card" data-id="${n.id}">
      <h4>${escapeHtml(n.title)}</h4>
      <p>${escapeHtml(n.description)}</p>
      <div class="actions">
        <button class="btn edit" onclick="onEdit(${n.id})">Edit</button>
        <button class="btn delete" onclick="onDelete(${n.id})">Delete</button>
      </div>
    </article>
  `;
}

async function handleSubmit(e){
  e.preventDefault();
  const payload = { title: noticeTitleInput.value.trim(), description: noticeDescriptionInput.value.trim() };
  try{
    if(!editingId){
      // Creating new notices via UI is disabled
      return showToast('Creating new notices is disabled','error');
    }
    const r = await fetch(`${API_URL}/${editingId}`, {
      method:'PUT', headers:{'content-type':'application/json'}, body:JSON.stringify(payload)
    });
    if(!r.ok) throw new Error('update failed');
    showToast('Updated','success');
    closeModal(); loadNotices();
  }catch(err){ console.error(err); showToast('Save failed','error') }
}

function onEdit(id){
  const n = allNotices.find(x=>x.id===id);
  if(!n) return showToast('Notice not found','error');
  editingId = id;
  formTitle.textContent = 'Edit Notice';
  noticeTitleInput.value = n.title;
  noticeDescriptionInput.value = n.description;
  submitBtn.disabled = false;
  submitBtn.textContent = 'Update';
  showModal();
}

async function onDelete(id){
  if(!confirm('Delete this notice?')) return;
  try{
    const r = await fetch(`${API_URL}/${id}`,{method:'DELETE'});
    if(!r.ok) throw new Error('delete failed');
    showToast('Deleted','success'); loadNotices();
  }catch(e){ console.error(e); showToast('Delete failed','error') }
}

function resetForm(){ editingId = null; noticeForm.reset(); formTitle.textContent = ''; submitBtn.disabled = true; submitBtn.textContent = 'Save'; }
function escapeHtml(s){if(!s) return ''; return s.replace(/[&<>"']/g,c=>({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":"&#039;" })[c])}
function showToast(msg){ toast.textContent = msg; toast.classList.remove('hidden'); setTimeout(()=>toast.classList.add('hidden'),2500) }

function handleSearch(e){
  const q = e.target.value.trim().toLowerCase();
  if(!q){ renderNotices(allNotices); totalNoticesEl.textContent = allNotices.length; return; }
  const filtered = allNotices.filter(n => n.title.toLowerCase().includes(q) || n.id.toString().includes(q));
  renderNotices(filtered);
  totalNoticesEl.textContent = filtered.length;
}

// Open modal and focus the title; single definition
function openModal(){
  resetForm();
  showModal();
  setTimeout(()=>{ try{ noticeTitleInput?.focus(); }catch(e){/* ignore */} }, 60);
}
