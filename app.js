const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const DATA=window.APP_DATA; const STORE='task-for-ld2-v3-real';
const productOrder=['AVN','Telematics','AVS','CID/Cluster','HUD'];
const deep=x=>JSON.parse(JSON.stringify(x));
const seed={models:deep(DATA.models),projects:deep(DATA.projects||[]),ppapSummary:deep(DATA.ppapSummary),ppapParts:deep(DATA.ppapParts),issues:deep(DATA.issues),molds:[
{id:'m1',pic:'duong03.nguyen',oem:'M-Benz',model:'BR232M 2D',partName:'Panel Front',partNo:'MGC66448902',budgetType:'Local',vhEp:'done',budget:'done',supplier:'done',po:'processing',receipt:'',invoice:'',remark:'Mold modification / PO follow-up'},
{id:'m2',pic:'huong01.hoang',oem:'BMW',model:'AZV',partName:'Back Cover',partNo:'MCK71371501',budgetType:'Local',vhEp:'done',budget:'done',supplier:'processing',po:'',receipt:'',invoice:'',remark:'Supplier improvement ongoing'},
{id:'m3',pic:'minh01.pham',oem:'Bentley',model:'D-LUV',partName:'Middle Frame Assy',partNo:'TBD',budgetType:'HQ',vhEp:'done',budget:'processing',supplier:'',po:'',receipt:'',invoice:'',remark:'Budget execution in progress'}],events:[]};
const checklist21=[['Mechanical Structure Diagram/Explore view','HQ R&D Mecha'],['Milestone','HQ R&D Mecha'],['Mechanical Drawing','HQ R&D Mecha, NPDM'],['Drawing check list','LD Mecha'],['BOM','HQ R&D Mecha, NPDM'],['Mecha part list and new part list','HQ R&D Mecha, NPDM'],['DV_PV change list','HQ R&D Mecha'],['Design Specification','HQ R&D Mecha, LD Mecha'],['Mechanical Measuring Report','HQ R&D Mecha'],['Screw torque report','HQ R&D Mecha, LD Mecha'],['Part yield rate','VH Proc./ Supplier'],['Packing planning','HQ R&D Mecha'],['Tool transfer plan','HQ R&D Mecha'],['Appearance Standard','HQ R&D Mecha'],['Label Printing criteria','LD Mecha'],['DFMEA','HQ R&D Mecha'],['Lesson and Learn','LD Mecha'],['Cock pit','HQ R&D Mecha'],['Assembly Jig','LD Mecha'],['ECO list','LD Mecha'],['Review mixing part','LD Mecha']];
const readiness14=[['FA','PO release','HQ PL'],['FA','W/O release or not','SCM / PD'],['FA','PPAP of MEC parts','Mecha'],['FA','EP approval for Not closed NPA yet','Mecha'],['FA','Assembly Jig','Mecha'],['FA','Yellow labels','Mecha'],['FA','Setup inspection spec on system','SQA'],['FA','Material delivery (Sample PO or MP PO) arrives or not','Mecha/Pur'],['FA',"Incoming part inspection's result: OK",'SQA'],['SMT','Supply material into SMT line (shield can, cover PCB,…)','MAT'],['FA','Label mapping / Generate','Mecha'],['FA','QR code structure setup on GMES','Mecha/IT'],['FA','Supply material into FA line','MAT/PD'],['FA','FA Label mapping / Generate','Label']];
const mandatory=[0,1,4,5,7,11];
if(!seed.events.length) seed.events=[{id:'e1',project:'BR232M 2D / C_HW',model:'BR232M 2D',customer:'M-Benz',eventName:'PD sample build',date:'2026-08-16',wo:'6GSA0222',qty:20,fa:'26.Jun',pic:'duong03.nguyen',checks:Array.from({length:21},(_,i)=>[0,1,2,3,4,5,7,8,9,11,13,14,15,17,18,19,20].includes(i)?'done':'processing'),readiness:['done','done','done','done','done','processing','done','done','done','done','done','processing','done','done'],files:{},issues:[{id:'ei1',title:'Gap between front panel and PBM NG',status:'Processing',pic:'LD MEC',due:'Next build',symptom:'Gap out of specification',analysis:'Alignment / front panel dimension follow-up',action:'Monitor improved sample in next event'}]}];
let state; try{state=JSON.parse(localStorage.getItem(STORE))||seed}catch{state=seed}
// migrate when source dataset changes
if(!state.models||state.models.length!==seed.models.length||!state.models.every(m=>Array.isArray(m.slides))){state=seed;save()}
if(!Array.isArray(state.projects)){state.projects=deep(seed.projects);save()}
let selectedProduct='CID/Cluster', selectedPpapModel='', selectedEvent=state.events[0]?.id;
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function uniq(a){return [...new Set(a.filter(Boolean))].sort((x,y)=>String(x).localeCompare(String(y)))}
function norm(s){return String(s||'').toLowerCase().replace(/m-benz|daimler/g,'mb').replace(/huyndai/g,'hyundai').replace(/[^a-z0-9]+/g,' ').trim()}
function badge(s){let c=norm(s).includes('done')?'done':norm(s).includes('pending')?'pending':norm(s).includes('monitor')?'monitoring':'processing';return `<span class="badge ${c}">${esc(s||'Not Updated')}</span>`}
function stage(s){return `<span class="stage ${norm(s).includes('dev')?'dev':'mp'}">${esc(s)}</span>`}
function kpis(items){return items.map(([l,v])=>`<div class="kpi"><div class="label">${esc(l)}</div><div class="value">${esc(v)}</div></div>`).join('')}
function openModal(html){$('#modalBody').innerHTML=html;$('#modalBackdrop').classList.remove('hidden')}
function closeModal(){$('#modalBackdrop').classList.add('hidden');$('#modalBody').innerHTML=''}
$('#modalClose').onclick=closeModal; $('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});
const ISSUE_HIDDEN_SLIDES=[13,25,35,36,74];
function issueRenderPage(n){if(ISSUE_HIDDEN_SLIDES.includes(n))return null;return n-ISSUE_HIDDEN_SLIDES.filter(h=>h<n).length}
function slideViewer(slides,title,type='model'){
 if(type==='issue') slides=(slides||[]).filter(n=>issueRenderPage(n)!==null);
 if(!slides?.length){openModal(`<div class="modal-body"><h2>${esc(title)}</h2><p>No slide image is mapped for this record.</p></div>`);return}
 let idx=0; const render=()=>{let n=slides[idx],page=type==='issue'?issueRenderPage(n):n,src=`assets/${type==='issue'?'issue-slides':'model-slides'}/slide-${page}.png`;$('#modalBody').innerHTML=`<div class="slide-viewer"><div class="card-title"><div><div class="eyebrow">${type==='issue'?'Issue detail':'Model overview'}</div><h2>${esc(title)}</h2></div><span class="badge neutral">Source slide ${n}</span></div><img src="${src}" alt="Slide ${n}" onerror="this.outerHTML='<div class=empty>Slide image is not available in this package.</div>'"><div class="slide-controls"><button class="secondary" id="prevSlide">← Previous</button><span>${idx+1} / ${slides.length}</span><button class="secondary" id="nextSlide">Next →</button></div></div>`;$('#prevSlide').onclick=()=>{idx=(idx-1+slides.length)%slides.length;render()};$('#nextSlide').onclick=()=>{idx=(idx+1)%slides.length;render()}}
 openModal('');render();
}
// NAV
$$('.nav-item').forEach(b=>b.onclick=()=>{$$('.nav-item').forEach(x=>x.classList.toggle('active',x===b));$$('.page').forEach(p=>p.classList.remove('active'));$('#page-'+b.dataset.page).classList.add('active');$('#sidebar').classList.remove('open');renderPage(b.dataset.page)});$('#mobileMenu').onclick=()=>$('#sidebar').classList.toggle('open');
function renderPage(p){if(p==='model')renderModels();if(p==='projects')renderProjects();if(p==='ppap')renderPpap();if(p==='modelList')renderMaster();if(p==='mold')renderMold();if(p==='event')renderEvent();if(p==='issue')renderIssues()}

// PROJECT OVERVIEW — adapted from ppap-local-app dashboard Project Overview
function parseProjectDate(raw){
  if(!raw)return null;
  const s=String(raw).trim();
  let d=new Date(s);
  if(!Number.isNaN(d.getTime()))return d;
  const m=s.match(/^(\d{1,2})-([A-Za-z]{3})(?:-(\d{2,4}))?$/);
  if(m){
    const months={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
    const month=months[m[2].toLowerCase()];
    if(month!==undefined){
      let year=m[3]?Number(m[3]):new Date().getFullYear();
      if(year<100)year+=2000;
      return new Date(year,month,Number(m[1]));
    }
  }
  return null;
}
function formatProjectTimelineDate(raw){
  const d=parseProjectDate(raw);
  if(!d)return esc(raw||'-');
  return `${d.getDate()}-${d.toLocaleDateString('en-US',{month:'short'})}`;
}
function projectTimelineMarkup(project){
  const source=(project.timeline||[]).slice().sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
  const items=source.length?source:[{label:'today',date:new Date().toISOString(),isToday:true}];
  const today=new Date();today.setHours(0,0,0,0);
  const nodes=[];
  let todayInserted=false;
  const enriched=items.map(x=>({...x,parsed:parseProjectDate(x.date)}));
  enriched.forEach((item,i)=>{
    if(!todayInserted && item.parsed && item.parsed>=today){
      nodes.push({label:'today',date:new Date(),isToday:true,parsed:today});
      todayInserted=true;
    }
    nodes.push(item);
  });
  if(!todayInserted)nodes.push({label:'today',date:new Date(),isToday:true,parsed:today});
  return `<div class="project-timeline-track">${nodes.map(item=>{
    const d=item.parsed||parseProjectDate(item.date);
    const isToday=item.isToday||String(item.label).toLowerCase()==='today';
    const stateClass=isToday?'today':(d&&d<today?'passed':'upcoming');
    return `<div class="project-timeline-node ${stateClass}">
      <div class="project-timeline-label">${esc(isToday?'today':item.label||'')}</div>
      <span class="project-timeline-dot"></span>
      <div class="project-timeline-date">${isToday?formatProjectTimelineDate(new Date().toISOString()):formatProjectTimelineDate(item.date)}</div>
    </div>`;
  }).join('')}</div>`;
}
function renderProjects(){
  const q=norm($('#projectOverviewSearch')?.value||'');
  const rows=(state.projects||[]).filter(p=>!q||norm(`${p.name||''} ${p.buyer||''}`).includes(q));
  $('#projectOverviewRows').innerHTML=rows.map((p,i)=>`<tr>
    <td>${i+1}</td>
    <td><b>${esc(p.name)}</b></td>
    <td>${esc(p.buyer||'-')}</td>
    <td class="project-timeline-cell">${projectTimelineMarkup(p)}</td>
  </tr>`).join('')||'<tr><td colspan="4" class="empty">No project found.</td></tr>';
  $('#projectOverviewCount').textContent=`${rows.length} project${rows.length===1?'':'s'}`;
  const search=$('#projectOverviewSearch');
  if(search)search.oninput=renderProjects;
}

// MODEL OVERVIEW
function renderModelTabs(){ $('#modelProductTabs').innerHTML=productOrder.map(p=>`<button class="product-tab ${p===selectedProduct?'active':''}" data-p="${p}">${p==='CID/Cluster'?'◉ ':p==='Telematics'?'⌁ ':p==='AVS'?'▣ ':p==='HUD'?'▱ ':'▭ '}${esc(p)}</button>`).join(''); $$('.product-tab').forEach(b=>b.onclick=()=>{selectedProduct=b.dataset.p;renderModels()}) }
function renderModels(){
 renderModelTabs();
 let base=state.models.filter(m=>m.product===selectedProduct);
 let custs=uniq(base.map(m=>m.customer));
 let old=$('#modelCustomer').value;
 if(!custs.includes(old)) old=custs[0]||'';
 $('#modelCustomer').innerHTML=custs.map(c=>`<option>${esc(c)}</option>`).join('');
 $('#modelCustomer').value=old;
 let q=norm($('#modelSearch').value);
 let rows=base.filter(m=>(!old||m.customer===old)&&(!q||norm(m.name).includes(q)));
 $('#modelRows').innerHTML=rows.map(m=>`<tr class="clickable model-row" data-no="${esc(m.no)}"><td><b>${esc(m.name)}</b><div class="subtle">${esc(m.productionLine)} · ${esc(m.productionFloor)}</div></td><td>${esc(m.sop)}</td><td>${esc(m.eol)}</td><td>${stage(m.stage)}</td><td>${esc(m.pic)}</td><td>${m.slides?.length?`<span class="slide-ready">${m.slides.length>1?m.slides.length+' slides':'View'}</span>`:'<span class="no-slide">—</span>'}</td></tr>`).join('')||`<tr><td colspan="6" class="empty">No model found.</td></tr>`;
 $('#modelCount').textContent=`${rows.length} model(s) · ${base.length} in ${selectedProduct}`;
 $('#modelInfoTitle').textContent=selectedProduct;
 $('#modelInfoText').textContent='Select a model to open the source slide(s) matched by model name, not by list position.';
 $$('.model-row').forEach(r=>r.onclick=()=>{let m=state.models.find(x=>String(x.no)===r.dataset.no&&x.product===selectedProduct);if(m)slideViewer(m.slides||[],m.name,'model')});
 $('#modelCustomer').onchange=renderModels;
 $('#modelSearch').oninput=renderModels;
}
function modelForm(existing){openModal(`<form class="form-modal" id="modelForm"><h2>${existing?'Edit':'Add'} model</h2><div class="form-grid"><label>No<input name="no" value="${esc(existing?.no||'')}"></label><label>Customer<input name="customer" required value="${esc(existing?.customer||'')}"></label><label class="wide">Model name<input name="name" required value="${esc(existing?.name||'')}"></label><label>Product<select name="product">${productOrder.map(p=>`<option ${existing?.product===p?'selected':''}>${p}</option>`).join('')}</select></label><label>Stage<select name="stage"><option>MP</option><option ${existing?.stage==='Dev'?'selected':''}>Dev</option></select></label><label>SOP<input name="sop" value="${esc(existing?.sop||'')}"></label><label>EOL<input name="eol" value="${esc(existing?.eol||'')}"></label><label>Production line<input name="productionLine" value="${esc(existing?.productionLine||'')}"></label><label>Floor<input name="productionFloor" value="${esc(existing?.productionFloor||'')}"></label><label>VH PIC<input name="pic" value="${esc(existing?.pic||'')}"></label><label>Slide number(s)<input name="slideText" placeholder="15 or 29,30" value="${esc((existing?.slides||[]).join(','))}"></label></div><div class="form-actions"><button type="button" class="secondary" onclick="document.querySelector('#modalClose').click()">Cancel</button><button class="primary">Save</button></div></form>`);$('#modelForm').onsubmit=e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.target));d.slides=String(d.slideText||'').split(',').map(x=>+x.trim()).filter(Boolean);delete d.slideText;if(existing)Object.assign(existing,d);else state.models.push(d);save();closeModal();renderModels();renderMaster()}}
$('#addModelBtn').onclick=()=>modelForm();$('#addModelListBtn').onclick=()=>modelForm();
// MASTER
function renderMaster(){let q=norm($('#masterSearch').value);let rows=state.models.filter(m=>!q||norm(Object.values(m).join(' ')).includes(q));$('#masterRows').innerHTML=rows.map((m,i)=>`<tr><td>${esc(m.no)}</td><td>${esc(m.customer)}</td><td><b>${esc(m.name)}</b></td><td>${esc(m.product)}</td><td>${esc(m.productionLine)}</td><td>${esc(m.productionFloor)}</td><td>${stage(m.stage)}</td><td>${esc(m.sop)}</td><td>${esc(m.eol)}</td><td>${esc(m.pic)}</td><td><button class="tiny edit-model" data-i="${state.models.indexOf(m)}">Edit</button></td></tr>`).join('');$$('.edit-model').forEach(b=>b.onclick=()=>modelForm(state.models[+b.dataset.i]));$('#masterSearch').oninput=renderMaster}
// PPAP classification
function ppapClass(model){let n=norm(model),customer='Other',product='CID/Cluster';if(n.includes('jlr'))customer='JLR';else if(n.includes('mb ')||n.startsWith('br')||n.includes('br214'))customer='M-Benz';else if(n.includes('nissan'))customer='Nissan';else if(n.includes('rn ')||n.includes('renault'))customer='Renault';else if(n.includes('hkmc')||n.includes('hyundai'))customer='Hyundai';else if(n.includes('bmw'))customer='BMW';else if(n.includes('d luv'))customer='Bentley';else if(n.includes('skoda'))customer='Skoda';else if(n.includes('toyota'))customer='Toyota';else if(n.includes('vw'))customer='VW';else if(n.includes('audi'))customer='Audi';if(n.includes('chud')||n.includes('hud'))product='HUD';else if(n.includes('icon')||n.includes('vcm')||n.includes('toyota 26bev'))product='Telematics';else if(n.includes('rse27 ecu')||n.includes('nissan cdc')||n.includes('rn ')||n.includes('renault'))product='AVN';else if(n.includes('icmu')||n.includes('icc'))product='AVS';return {customer,product}}
function partsFor(model){let n=norm(model);let aliases={'jlr mla fdd':'mla fdd','jlr mla fcd':'mla fcd','jlr mla rse':'mla rse','jlr mla rccd2':'mla rccd2','bentley d luv cid':'d luv','br167 4m':'br167 4m','rn x82 xfk':'rn x82 xfk','hkmc clu':'hkmc clu','hkmc clu cn8':'hkmc clu cn8','hkmc clu nx5':'hkmc clu nx5'};let target=aliases[n]||n, exact=state.ppapParts.filter(p=>norm(p.model)===target);let sum=state.ppapSummary.find(s=>norm(s.model)===n);if(sum&&exact.length!==+sum.total){let bySource={};exact.forEach(p=>(bySource[p.source]??=[]).push(p));let match=Object.values(bySource).find(a=>a.length===+sum.total);if(match)return match}return exact}

function partOverall(p){
 if(isPartDone(p)) return 'done';
 if([p.hsms,p.dqms,p.spr].some(v=>statClass(v,'normal')==='pending')) return 'pending';
 return 'processing';
}
function computeSummary(s){
 let ps=partsFor(s.model);
 if(!ps.length) return {...s,pending:0};
 let done=ps.filter(p=>partOverall(p)==='done').length;
 let pending=ps.filter(p=>partOverall(p)==='pending').length;
 let processing=Math.max(0,ps.length-done-pending);
 return {...s,total:ps.length,done,pending,processing,rate:ps.length?done/ps.length*100:0};
}
function isPartDone(p){return norm(p.drawing).includes('release')&&norm(p.hsms)==='done'&&norm(p.dqms)==='done'&&norm(p.spr)==='done'}
function pieStyle(x){
 let total=Math.max(1,+x.total||0),d=(+x.done||0)/total*100,p=(+x.processing||0)/total*100;
 return `--done:${d}%;--proc:${d+p}%`;
}
function renderPpap(){
 let annotated=state.ppapSummary.map(s=>({...s,...ppapClass(s.model)}));
 let psel=$('#ppapProduct').value||'CID/Cluster';
 $('#ppapProduct').innerHTML=productOrder.map(p=>`<option>${p}</option>`).join('');
 if(!productOrder.includes(psel)) psel=productOrder[0];
 $('#ppapProduct').value=psel;
 let custs=uniq(annotated.filter(x=>x.product===psel).map(x=>x.customer));
 let csel=$('#ppapCustomer').value;
 if(!custs.includes(csel)) csel=custs[0]||'';
 $('#ppapCustomer').innerHTML=custs.map(c=>`<option>${esc(c)}</option>`).join('');
 $('#ppapCustomer').value=csel;
 let q=norm($('#ppapSearch').value);
 let rows=annotated.filter(x=>x.product===psel&&x.customer===csel&&(!q||norm(x.model).includes(q))).map(computeSummary);
 let total=rows.reduce((a,x)=>a+(+x.total||0),0),done=rows.reduce((a,x)=>a+(+x.done||0),0),processing=rows.reduce((a,x)=>a+(+x.processing||0),0),pending=rows.reduce((a,x)=>a+(+x.pending||0),0);
 $('#ppapKpis').innerHTML=kpis([['Models',rows.length],['Total parts',total],['Done',done],['Processing',processing],['Complete rate',total?Math.round(done/total*100)+'%':'0%']]);
 let max=Math.max(1,...rows.map(x=>+x.total||0));
 $('#ppapChart').innerHTML=rows.map(x=>`<div class="bar-group"><div class="bars"><i class="bar complete" style="height:${(+x.done||0)/max*130}px" title="Done ${x.done||0}"></i><i class="bar processing" style="height:${(+x.processing||0)/max*130}px" title="Processing ${x.processing||0}"></i>${(+x.pending||0)?`<i class="bar pending" style="height:${(+x.pending||0)/max*130}px" title="Pending ${x.pending||0}"></i>`:''}</div><div class="bar-label" title="${esc(x.model)}">${esc(x.model)}</div></div>`).join('')||'<div class="empty">No model</div>';
 $('#ppapCards').innerHTML=rows.map(x=>`<div class="model-card ppap-card ppap-slide-card" data-model="${esc(x.model)}"><div class="ppap-card-copy"><h3>${esc(x.model)}</h3><div class="ppap-card-lines"><span>Total new parts: <b>${x.total||0}</b></span><span>Complete rate: <b>${Math.round(x.rate||0)}%</b></span><span>PIC: <b>${esc(x.pic||'-')}</b></span><span>Due: <b>${esc(x.due||'-')}</b></span></div><div class="ppap-legend"><span><i class="legend-square green"></i>Done: ${x.done||0}</span><span><i class="legend-square yellow"></i>Processing: ${x.processing||0}</span><span><i class="legend-square red"></i>Pending: ${x.pending||0}</span></div></div><div class="ppap-pie" style="${pieStyle(x)}"><div>${Math.round(x.rate||0)}%</div></div></div>`).join('')||'<div class="empty">No PPAP model found.</div>';
 $$('.ppap-card').forEach(c=>c.onclick=()=>openPpap(c.dataset.model));
 $('#ppapProduct').onchange=renderPpap;$('#ppapCustomer').onchange=renderPpap;$('#ppapSearch').oninput=renderPpap;
}
function statClass(v,type){let n=norm(v);if(type==='drawing'){if(n.includes('release'))return 'release';if(n.includes('working')||n.includes('refer'))return 'working';return ''}if(n==='done')return 'done';if(n.includes('pending'))return 'pending';if(n.includes('processing')||n.includes('working'))return 'processing';return ''}
function statLabel(v,type){let c=statClass(v,type);return c==='release'?'Release':c==='working'?'Working':c==='done'?'Done':c==='pending'?'Pending':c==='processing'?'Processing':'Not updated'}
function renderPpapPicPanel(p){
 let panel=$('#ppapPicPanel'); if(!panel)return;
 if(!p){panel.innerHTML=`<div class="pic-panel-empty"><div class="round-icon">✎</div><h3>PIC Update</h3><p>Click <b>View / update</b> on a part to show the detailed PIC update here.</p></div>`;return}
 panel.innerHTML=`<form id="flowSideForm" class="pic-update-form"><div class="eyebrow">PIC update detail</div><h3>${esc(p.partNo)} — ${esc(p.item)}</h3><p class="subtle">${esc(p.supplier||'')} · ${esc(p.source||'')}</p><label>1. LD/HQ review drawing<textarea name="dev1">${esc(p.dev1||'')}</textarea></label><label>2. Procurement / Supplier submit PPAP<textarea name="dev2">${esc(p.dev2||'')}</textarea></label><label>3. SQD review PPAP<textarea name="dev3">${esc(p.dev3||'')}</textarea></label><label>PIC<input name="pic" value="${esc(p.pic||'')}"></label><label>Due date<input name="due" value="${esc(p.due||'')}"></label><button class="primary">Save update</button></form>`;
 $('#flowSideForm').onsubmit=e=>{e.preventDefault();Object.assign(p,Object.fromEntries(new FormData(e.target)));save();openPpap(selectedPpapModel);renderPpapPicPanel(p)};
}
function openPpap(model){
 selectedPpapModel=model;
 let ps=partsFor(model),sum=state.ppapSummary.find(s=>s.model===model);
 $('#ppapDetail').classList.remove('hidden');
 $('#ppapDetailTitle').textContent=model;
 $('#ppapDetailMeta').textContent=sum?`PIC: ${sum.pic} · Target: ${sum.due} · ${sum.note||''}`:'';
 $('#ppapPartRows').innerHTML=ps.map(p=>`<tr><td><b>${esc(p.partNo)}</b><div class="subtle">${esc(p.source)} · Ver ${esc(p.drawingVer||'-')}</div></td><td>${esc(p.item)}</td><td>${esc(p.supplier)}</td>${['drawing','hsms','dqms','spr'].map(k=>`<td><div class="status-wrap"><span>${statLabel(p[k],k==='drawing'?'drawing':'normal')}</span><button class="status-dot ${statClass(p[k],k==='drawing'?'drawing':'normal')} ppap-status" title="Click to change status" data-model="${esc(p.model)}" data-part="${esc(p.partNo)}" data-k="${k}"></button></div></td>`).join('')}<td>${esc(p.due||'-')}</td><td><button class="flow-btn flow" data-part="${esc(p.partNo)}" data-model="${esc(p.model)}">View / update</button></td></tr>`).join('')||`<tr><td colspan="9" class="empty">No detailed part rows mapped to this summary model.</td></tr>`;
 renderPpapPicPanel(null);
 $$('.ppap-status').forEach(b=>b.onclick=e=>{e.stopPropagation();let p=state.ppapParts.find(x=>x.partNo===b.dataset.part&&x.model===b.dataset.model),k=b.dataset.k;if(!p)return;let cycle=k==='drawing'?['','Working','Release']:['','Processing','Done','Pending'];let cur=statLabel(p[k],k==='drawing'?'drawing':'normal');let pos=cycle.findIndex(x=>norm(x)===norm(cur));p[k]=cycle[(pos+1+cycle.length)%cycle.length];save();openPpap(model);renderPpap()});
 $$('.flow').forEach(b=>b.onclick=e=>{e.stopPropagation();let p=state.ppapParts.find(x=>x.partNo===b.dataset.part&&x.model===b.dataset.model);renderPpapPicPanel(p)});
 $('#ppapDetail').scrollIntoView({behavior:'smooth',block:'start'});
}
function openPpapFlow(p){renderPpapPicPanel(p)}

const oldClosePpap=$('#closePpap'); if(oldClosePpap) oldClosePpap.onclick=()=>$('#ppapDetail')?.classList.add('hidden');
const oldAddPpapBtn=$('#addPpapBtn'); if(oldAddPpapBtn) oldAddPpapBtn.onclick=()=>{let model=selectedPpapModel||state.ppapSummary[0]?.model;openModal(`<form class="form-modal" id="addPpapForm"><h2>Add PPAP part</h2><div class="form-grid"><label>Model<input name="model" value="${esc(model||'')}" required></label><label>Part No<input name="partNo" required></label><label>Item name<input name="item"></label><label>Supplier<input name="supplier"></label><label>Drawing<select name="drawing"><option></option><option>Working</option><option>Release</option></select></label><label>HSMS<select name="hsms"><option></option><option>Processing</option><option>Done</option><option>Pending</option></select></label><label>DQMS<select name="dqms"><option></option><option>Processing</option><option>Done</option><option>Pending</option></select></label><label>SPR<select name="spr"><option></option><option>Processing</option><option>Done</option><option>Pending</option></select></label><label>Due<input name="due"></label><label>PIC<input name="pic"></label></div><div class="form-actions"><button class="primary">Save</button></div></form>`);$('#addPpapForm').onsubmit=e=>{e.preventDefault();state.ppapParts.push({source:'Manual',...Object.fromEntries(new FormData(e.target)),drawingVer:'',dev1:'',dev2:'',dev3:''});if(!state.ppapSummary.some(s=>s.model===e.target.model.value))state.ppapSummary.push({no:Date.now(),model:e.target.model.value,pic:e.target.pic.value,total:1,done:0,processing:1,rate:0,due:e.target.due.value,note:'Manual update'});save();closeModal();renderPpap()}}
// MOLD
const moldStatusKeys=['vhEp','budget','supplier','po','receipt','invoice'];const moldLabels=['VH EP','Budget Execution','Supplier Selection','PO','Mold Receipt','Invoice'];
function renderMold(){let pics=uniq(state.molds.map(x=>x.pic)),oems=uniq(state.molds.map(x=>x.oem));let ps=$('#moldPic').value||'All',os=$('#moldOem').value||'All';$('#moldPic').innerHTML='<option>All</option>'+pics.map(x=>`<option>${esc(x)}</option>`).join('');$('#moldOem').innerHTML='<option>All</option>'+oems.map(x=>`<option>${esc(x)}</option>`).join('');$('#moldPic').value=pics.includes(ps)?ps:'All';$('#moldOem').value=oems.includes(os)?os:'All';let q=norm($('#moldSearch').value),rows=state.molds.filter(x=>($('#moldPic').value==='All'||x.pic===$('#moldPic').value)&&($('#moldOem').value==='All'||x.oem===$('#moldOem').value)&&(!q||norm(Object.values(x).join(' ')).includes(q)));let allSteps=rows.flatMap(r=>moldStatusKeys.map(k=>r[k])),done=allSteps.filter(x=>x==='done').length,proc=allSteps.filter(x=>x==='processing').length;$('#moldKpis').innerHTML=kpis([['Items',rows.length],['Done steps',done],['Processing steps',proc],['Not updated',allSteps.length-done-proc],['PIC',uniq(rows.map(x=>x.pic)).length]]);$('#moldGroups').innerHTML=uniq(rows.map(x=>x.pic)).map(pic=>{let rr=rows.filter(x=>x.pic===pic);return `<div class="pic-group"><h2>PIC: ${esc(pic)}</h2><div class="card mold-card"><div class="table-scroll"><table><thead><tr><th>OEM</th><th>Model</th><th>Part name</th><th>Part no</th><th>Budget type</th>${moldLabels.map(x=>`<th>${x}</th>`).join('')}<th>Remark</th></tr></thead><tbody>${rr.map(r=>`<tr><td>${esc(r.oem)}</td><td>${esc(r.model)}</td><td>${esc(r.partName)}</td><td>${esc(r.partNo)}</td><td>${esc(r.budgetType)}</td>${moldStatusKeys.map(k=>`<td><button class="status-dot ${r[k]} mold-status" data-id="${r.id}" data-k="${k}"></button></td>`).join('')}<td>${esc(r.remark)}</td></tr>`).join('')}</tbody></table></div></div></div>`}).join('')||'<div class="empty">No mold item found.</div>';$$('.mold-status').forEach(b=>b.onclick=()=>{let r=state.molds.find(x=>x.id===b.dataset.id),cycle=['','processing','done'];r[b.dataset.k]=cycle[(cycle.indexOf(r[b.dataset.k])+1)%cycle.length];save();renderMold()});$('#moldPic').onchange=renderMold;$('#moldOem').onchange=renderMold;$('#moldSearch').oninput=renderMold}
$('#addMoldBtn').onclick=()=>openModal(`<form class="form-modal" id="moldForm"><h2>Add mold item</h2><div class="form-grid"><label>PIC<input name="pic" required></label><label>OEM<input name="oem" required></label><label>Model<input name="model" required></label><label>Part name<input name="partName"></label><label>Part no<input name="partNo"></label><label>Budget type<input name="budgetType"></label><label class="wide">Remark<textarea name="remark"></textarea></label></div><div class="form-actions"><button class="primary">Save</button></div></form>`);document.addEventListener('submit',e=>{if(e.target.id!=='moldForm')return;e.preventDefault();state.molds.push({id:'m'+Date.now(),...Object.fromEntries(new FormData(e.target)),vhEp:'',budget:'',supplier:'',po:'',receipt:'',invoice:''});save();closeModal();renderMold()});
// EVENTS
function eventBuild(e){let miss=mandatory.filter(i=>e.readiness[i]!=='done');let today=new Date(),d=new Date(e.date+'T00:00:00');today.setHours(0,0,0,0);let diff=Math.ceil((d-today)/86400000);if(!miss.length)return{key:'can',label:'Can Build',miss,diff};if(diff<=0)return{key:'cannot',label:"Can't Build",miss,diff};if(diff<=2)return{key:'risk',label:'At Risk',miss,diff};return{key:'risk',label:'Not Ready',miss,diff}}
function weekBounds(){let now=new Date(),day=(now.getDay()+6)%7,start=new Date(now);start.setDate(now.getDate()-day);start.setHours(0,0,0,0);let end=new Date(start);end.setDate(start.getDate()+6);return [start,end]}
function renderEvent(){let [ws,we]=weekBounds();$('#weekRange').textContent=`${ws.toLocaleDateString()} – ${we.toLocaleDateString()}`;let wk=state.events.filter(e=>{let d=new Date(e.date+'T00:00:00');return d>=ws&&d<=we});let counts={can:0,risk:0,cannot:0};wk.forEach(e=>counts[eventBuild(e).key]++);$('#eventKpis').innerHTML=kpis([['Events this week',wk.length],['Can Build',counts.can],['At Risk',counts.risk],['Can’t Build',counts.cannot],['Open issues',wk.reduce((a,e)=>a+e.issues.filter(i=>i.status!=='Done').length,0)]]);$('#weeklyEvents').innerHTML=wk.map(e=>{let b=eventBuild(e);return `<div class="week-row" data-id="${e.id}"><b>${esc(e.model)}</b><span>${esc(e.customer)}</span><span>${esc(e.eventName)}</span><span>${esc(e.date)}</span><span>Readiness ${e.readiness.filter(x=>x==='done').length}/14</span><span>${e.issues.length} issue(s)</span><span class="build-status ${b.key}">${b.label}</span></div>`}).join('')||'<div class="empty">No event in the current week. The selected historical event remains available below.</div>';$$('.week-row').forEach(r=>r.onclick=()=>{selectedEvent=r.dataset.id;renderEvent();$('.event-head').scrollIntoView({behavior:'smooth'})});let e=state.events.find(x=>x.id===selectedEvent)||state.events[0];if(!e)return;selectedEvent=e.id;$('#evtProject').value=e.project;$('#evtName').value=e.eventName;$('#evtDate').value=e.date;$('#evtWo').value=e.wo;$('#evtQty').value=e.qty;$('#evtFa').value=e.fa;let bs=eventBuild(e);$('#buildStatus').className='build-status '+bs.key;$('#buildStatus').textContent=bs.label;if(bs.miss.length&&bs.diff<=2){$('#eventWarning').classList.remove('hidden');$('#eventWarning').textContent=`⚠ Mandatory readiness item(s) ${bs.miss.map(i=>i+1).join(', ')} are not Done. Warning starts 2 days before event.`}else $('#eventWarning').classList.add('hidden');$('#check21').innerHTML=checklist21.map((x,i)=>`<div class="check-row"><span class="check-num">${i+1}</span><div><b>${esc(x[0])}</b><div class="subtle">${esc(x[1])}</div></div><div class="status-wrap"><button class="status-dot ${e.checks[i]} evt-check" data-i="${i}"></button><small>${e.checks[i]==='done'?'Done':e.checks[i]==='processing'?'Processing':'Not updated'}</small></div><div class="file-actions"><button class="tiny upload" data-i="${i}">Upload</button>${e.files[i]?`<button class="tiny view-file" data-i="${i}">View</button>`:''}</div></div>`).join('');$('#readiness').innerHTML=readiness14.map((x,i)=>`<div class="check-row ready"><span class="check-num">${i+1}</span><span>${esc(x[0])}</span><div><b>${esc(x[1])}</b>${mandatory.includes(i)?'<div class="subtle">Mandatory</div>':''}</div><span>${esc(x[2])}</span><div class="status-wrap"><button class="status-dot ${e.readiness[i]} ready-status" data-i="${i}"></button><small>${e.readiness[i]==='done'?'Done':e.readiness[i]==='processing'?'Processing':'Not updated'}</small></div></div>`).join('');$$('.evt-check').forEach(b=>b.onclick=()=>{let c=['','processing','done'];e.checks[+b.dataset.i]=c[(c.indexOf(e.checks[+b.dataset.i])+1)%c.length];save();renderEvent()});$$('.ready-status').forEach(b=>b.onclick=()=>{let c=['','processing','done'];e.readiness[+b.dataset.i]=c[(c.indexOf(e.readiness[+b.dataset.i])+1)%c.length];save();renderEvent()});$$('.upload').forEach(b=>b.onclick=()=>pickFile(e,+b.dataset.i));$$('.view-file').forEach(b=>b.onclick=()=>viewFile(e,+b.dataset.i));$('#eventIssues').innerHTML=e.issues.map(i=>`<div class="event-issue"><h3>${esc(i.title)}</h3><div>${badge(i.status)} <span class="badge neutral">PIC ${esc(i.pic)}</span></div><details><summary>View details</summary><p><b>Symptom:</b> ${esc(i.symptom)}</p><p><b>Analysis:</b> ${esc(i.analysis)}</p><p><b>Action:</b> ${esc(i.action)}</p></details></div>`).join('')||'<div class="empty">No issue linked.</div>';[['evtProject','project'],['evtName','eventName'],['evtDate','date'],['evtWo','wo'],['evtQty','qty'],['evtFa','fa']].forEach(([id,k])=>$('#'+id).onchange=()=>{e[k]=$('#'+id).value;save();renderEvent()})}
function pickFile(e,i){let f=$('#filePicker');f.value='';f.onchange=()=>{let file=f.files[0];if(!file)return;if(file.size>1500000){alert('Local prototype stores only small files. The public/backend version will support larger shared files.');return}let rd=new FileReader();rd.onload=()=>{e.files[i]={name:file.name,type:file.type,data:rd.result};save();renderEvent()};rd.readAsDataURL(file)};f.click()}
function viewFile(e,i){let f=e.files[i];if(!f)return;openModal(`<div class="modal-body"><h2>${esc(f.name)}</h2>${f.type.startsWith('image/')?`<img src="${f.data}" style="max-width:100%;max-height:75vh">`:`<a href="${f.data}" download="${esc(f.name)}">Open / download file</a>`}</div>`)}
$('#addEventBtn').onclick=()=>{let id='e'+Date.now();state.events.push({id,project:'New project',model:'New model',customer:'',eventName:'Sample build',date:new Date().toISOString().slice(0,10),wo:'',qty:0,fa:'',pic:'',checks:Array(21).fill(''),readiness:Array(14).fill(''),files:{},issues:[]});selectedEvent=id;save();renderEvent()};$('#addEventIssue').onclick=()=>{let e=state.events.find(x=>x.id===selectedEvent);openModal(`<form class="form-modal" id="eventIssueForm"><h2>Add event issue</h2><div class="form-grid"><label>Title<input name="title" required></label><label>Status<select name="status"><option>Processing</option><option>Monitoring</option><option>Done</option></select></label><label>PIC<input name="pic"></label><label>Due<input name="due"></label><label class="wide">Symptom<textarea name="symptom"></textarea></label><label class="wide">Analysis<textarea name="analysis"></textarea></label><label class="wide">Action<textarea name="action"></textarea></label></div><div class="form-actions"><button class="primary">Save</button></div></form>`);$('#eventIssueForm').onsubmit=x=>{x.preventDefault();e.issues.push({id:'ei'+Date.now(),...Object.fromEntries(new FormData(x.target))});save();closeModal();renderEvent()}}
// ISSUES
function renderIssues(){let projects=uniq(state.issues.map(x=>x.project)),ps=$('#issueProject').value||'All';$('#issueProject').innerHTML='<option>All</option>'+projects.map(x=>`<option>${esc(x)}</option>`).join('');$('#issueProject').value=projects.includes(ps)?ps:'All';let ss=$('#issueStatus').value||'All',q=norm($('#issueSearch').value),rows=state.issues.filter(i=>($('#issueProject').value==='All'||i.project===$('#issueProject').value)&&(ss==='All'||[i.analysis,i.solution,i.monitoring].includes(ss))&&(!q||norm(Object.values(i).join(' ')).includes(q)));$('#issueKpis').innerHTML=kpis([['Total issues',state.issues.length],['Analysis processing',state.issues.filter(i=>i.analysis==='Processing').length],['Solution processing',state.issues.filter(i=>i.solution==='Processing').length],['Monitoring processing',state.issues.filter(i=>i.monitoring!=='Done').length],['Done solution',state.issues.filter(i=>i.solution==='Done').length]]);$('#issueRows').innerHTML=rows.map(i=>`<tr class="clickable issue-row" data-no="${i.no}"><td>${i.no}</td><td><b>${esc(i.project)}</b></td><td>${esc(i.type)}</td><td>${esc(i.name)}</td><td>${esc(i.cause)}</td><td>${esc(i.action)}</td><td>${badge(i.analysis)}</td><td>${badge(i.solution)}</td><td>${badge(i.monitoring)}</td><td><span class="badge neutral">${i.slides.length} slide(s)</span></td></tr>`).join('')||'<tr><td colspan="10" class="empty">No issue found.</td></tr>';$$('.issue-row').forEach(r=>r.onclick=()=>{let i=state.issues.find(x=>String(x.no)===r.dataset.no);slideViewer(i.slides,`${i.project} — ${i.name}`,'issue')});$('#issueProject').onchange=renderIssues;$('#issueStatus').onchange=renderIssues;$('#issueSearch').oninput=renderIssues}
$('#addIssueBtn').onclick=()=>openModal(`<form class="form-modal" id="issueForm"><h2>Add issue</h2><div class="form-grid"><label>No<input type="number" name="no" value="${Math.max(0,...state.issues.map(x=>+x.no||0))+1}"></label><label>Project<input name="project" required></label><label>Issue type<input name="type" value="FA issue"></label><label>Issue name<input name="name" required></label><label class="wide">Root cause<textarea name="cause"></textarea></label><label class="wide">Corrective action<textarea name="action"></textarea></label><label>Analysis<select name="analysis"><option>Processing</option><option>Done</option></select></label><label>Solution<select name="solution"><option>Processing</option><option>Done</option></select></label><label>Monitoring<select name="monitoring"><option>Processing</option><option>Monitoring</option><option>Done</option></select></label><label>Slide numbers<input name="slideText" placeholder="103,104"></label></div><div class="form-actions"><button class="primary">Save</button></div></form>`);document.addEventListener('submit',e=>{if(e.target.id!=='issueForm')return;e.preventDefault();let d=Object.fromEntries(new FormData(e.target)),slides=d.slideText.split(',').map(x=>+x.trim()).filter(Boolean);delete d.slideText;d.no=+d.no;d.slides=slides;state.issues.push(d);save();closeModal();renderIssues()});
// GLOBAL search routes to current page search
$('#globalSearch').oninput=e=>{let active=$('.page.active').id.replace('page-',''),v=e.target.value;if(active==='model'){$('#modelSearch').value=v;renderModels()}else if(active==='ppap'){renderPpap()}else if(active==='modelList'){$('#masterSearch').value=v;renderMaster()}else if(active==='mold'){$('#moldSearch').value=v;renderMold()}else if(active==='issue'){$('#issueSearch').value=v;renderIssues()}}
renderModels();


// ===== V5 PPAP — consolidated from all user comments =====
const PPAP_STATUS_CYCLE = ['white','yellow','green','red'];
function ppapNormStatus(v){const s=norm(v||'');if(!s||s==='not updated'||s==='notupdated'||s==='blank'||s==='white')return 'white';if(s.includes('process')||s.includes('work'))return 'yellow';if(s.includes('done')||s.includes('release')||s==='green')return 'green';if(s.includes('pending')||s==='red')return 'red';return 'white'}
function ppapStatusLabel(status,col){if(status==='white')return 'Not updated';if(status==='yellow')return 'Processing';if(status==='green')return col==='drawing'?'Release':'Done';if(status==='red')return 'Pending';return ''}
function ppapNextStatus(current){const s=ppapNormStatus(current),i=PPAP_STATUS_CYCLE.indexOf(s);return PPAP_STATUS_CYCLE[(i+1)%PPAP_STATUS_CYCLE.length]}
function ppapStatusDot(status,rowId,col){const s=ppapNormStatus(status);return `<button class="status-cycle ${s}" data-ppap-row="${esc(rowId)}" data-ppap-col="${esc(col)}" title="Click to change status"><span class="status-dot"></span><span>${ppapStatusLabel(s,col)}</span></button>`}
function ppapPartStatus(part){const vals=['drawing','hsms','dqms','spr'].map(k=>ppapNormStatus(part[k]));if(vals.every(v=>v==='green'))return 'done';if(vals.some(v=>v==='red'))return 'pending';if(vals.some(v=>v==='yellow'))return 'processing';if(vals.some(v=>v==='green'))return 'processing';return 'notupdated'}
function ppapCompleteRate(parts){if(!parts.length)return 0;return Math.round(parts.filter(p=>ppapPartStatus(p)==='done').length/parts.length*100)}
function ppapGetProducts(){const vals=new Set();(state.models||[]).forEach(m=>vals.add(m.product||m.Product||'Unknown'));(state.ppapSummary||[]).forEach(x=>vals.add(x.product||x.Product||'Unknown'));return ['All',...Array.from(vals).filter(Boolean).sort((a,b)=>String(a).localeCompare(String(b)))]}
function ppapSelectedProduct(){return state.ppapSelectedProduct||'All'}
function ppapSetProduct(p){state.ppapSelectedProduct=p;state.ppapSelectedModel=null;closePpapDevDrawer();save();renderPpap()}
function ppapModelNameOfPart(p){return p.model||p.modelName||p.project||p.Project||'Unknown Model'}
function ppapProductOfPart(p){if(p.product)return p.product;const mn=ppapModelNameOfPart(p);const m=(state.models||[]).find(x=>norm(x.model||x.modelName||'')===norm(mn));return m?.product||m?.Product||'Unknown'}
function ppapFilteredParts(){const prod=ppapSelectedProduct();return (state.ppapParts||[]).filter(p=>prod==='All'||norm(ppapProductOfPart(p))===norm(prod))}
function ppapGroupedModels(){const g={};ppapFilteredParts().forEach(p=>{const m=ppapModelNameOfPart(p);(g[m]||=[]).push(p)});return g}
function ppapOverviewCounts(parts){const c={done:0,processing:0,pending:0,notupdated:0};parts.forEach(p=>c[ppapPartStatus(p)]++);return c}
function renderPpapProductTabs(){const w=$('#ppapProductTabs');if(!w)return;const cur=ppapSelectedProduct();w.innerHTML=ppapGetProducts().map(p=>`<button class="${p===cur?'active':''}" data-ppap-product="${esc(p)}">${esc(p)}</button>`).join('');$$('[data-ppap-product]',w).forEach(b=>b.onclick=()=>ppapSetProduct(b.dataset.ppapProduct))}
function renderPpapOverview(){const parts=ppapFilteredParts(),groups=ppapGroupedModels(),c=ppapOverviewCounts(parts),total=parts.length,pct=n=>total?Math.round(n/total*100):0;$('#ppapOverviewScope').textContent=ppapSelectedProduct();$('#ppapSummaryInline').innerHTML=`<span><b>${Object.keys(groups).length}</b> models</span><span><b>${total}</b> parts</span><span><b>${c.done}</b> done</span><span><b>${c.processing}</b> processing</span><span><b>${c.pending}</b> pending</span><span><b>${c.notupdated}</b> not updated</span>`;$('#ppapOverviewMetrics').innerHTML=`<div class="metric green"><b>${c.done}</b><span>Done</span><small>${pct(c.done)}%</small></div><div class="metric yellow"><b>${c.processing}</b><span>Processing</span><small>${pct(c.processing)}%</small></div><div class="metric red"><b>${c.pending}</b><span>Pending</span><small>${pct(c.pending)}%</small></div><div class="metric white"><b>${c.notupdated}</b><span>Not updated</span><small>${pct(c.notupdated)}%</small></div>`;const max=Math.max(1,c.done,c.processing,c.pending,c.notupdated);$('#ppapOverviewChart').innerHTML=`<div class="ppap-bars">${[['Done',c.done,'green'],['Processing',c.processing,'yellow'],['Pending',c.pending,'red'],['Not updated',c.notupdated,'white']].map(([l,v,cl])=>`<div class="ppap-bar-item"><div class="bar-shell"><div class="bar-fill ${cl}" style="height:${Math.max(4,v/max*100)}%"></div></div><b>${v}</b><span>${l}</span></div>`).join('')}</div>`}
function renderPpapModelCards(){const groups=ppapGroupedModels(),w=$('#ppapModelCards');if(!w)return;w.innerHTML=Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0])).map(([model,parts])=>{const c=ppapOverviewCounts(parts),rate=ppapCompleteRate(parts),info=(state.ppapSummary||[]).find(x=>norm(x.model||x.modelName||x.project||'')===norm(model))||{},due=info.dueDate||info.due||parts.find(p=>p.dueDate||p.due)?.dueDate||parts.find(p=>p.dueDate||p.due)?.due||'',pic=info.pic||parts.find(p=>p.pic)?.pic||'',total=parts.length||1,g1=c.done/total*360,g2=(c.done+c.processing)/total*360,g3=(c.done+c.processing+c.pending)/total*360;return `<button class="ppap-model-card ${state.ppapSelectedModel===model?'selected':''}" data-ppap-model="${esc(model)}"><div class="ppap-model-copy"><h3>${esc(model)}</h3><p>Total new parts: <b>${parts.length}</b></p><p>Complete rate: <b>${rate}%</b></p>${pic?`<p>PIC: <b>${esc(pic)}</b></p>`:''}${due?`<p>Due: <b>${esc(due)}</b></p>`:''}<div class="ppap-legend"><span><i class="green"></i>Done: ${c.done}</span><span><i class="yellow"></i>Processing: ${c.processing}</span><span><i class="red"></i>Pending: ${c.pending}</span><span><i class="white"></i>Not updated: ${c.notupdated}</span></div></div><div class="ppap-donut" style="background:conic-gradient(#10b981 0deg ${g1}deg,#facc15 ${g1}deg ${g2}deg,#ef4444 ${g2}deg ${g3}deg,#fff ${g3}deg 360deg)"><span></span></div></button>`}).join('')||'<div class="empty card">No PPAP model in this product.</div>';$$('[data-ppap-model]',w).forEach(b=>b.onclick=()=>{state.ppapSelectedModel=b.dataset.ppapModel;save();renderPpap();$('#ppapDetailCard')?.scrollIntoView({behavior:'smooth',block:'start'})})}
function renderPpapDetail(){const card=$('#ppapDetailCard'),model=state.ppapSelectedModel;if(!model){card?.classList.add('hidden');return}const parts=ppapGroupedModels()[model]||[];if(!parts.length){card?.classList.add('hidden');return}card.classList.remove('hidden');$('#ppapSelectedModelTitle').textContent=model;const info=(state.ppapSummary||[]).find(x=>norm(x.model||x.modelName||x.project||'')===norm(model))||{},pic=info.pic||parts.find(p=>p.pic)?.pic||'-',due=info.dueDate||info.due||parts.find(p=>p.dueDate||p.due)?.dueDate||parts.find(p=>p.dueDate||p.due)?.due||'-';$('#ppapSelectedModelMeta').textContent=`PIC: ${pic} · Target: ${due}`;$('#ppapPartRows').innerHTML=parts.map((p,i)=>{if(!p.__id)p.__id=`ppap-${norm(model)}-${i}`;return `<tr><td><b>${esc(p.partNo||p.part||p.pn||'-')}</b></td><td>${esc(p.itemName||p.item||p.description||'-')}</td><td>${esc(p.supplier||'-')}</td><td>${ppapStatusDot(p.drawing,p.__id,'drawing')}</td><td>${ppapStatusDot(p.hsms,p.__id,'hsms')}</td><td>${ppapStatusDot(p.dqms,p.__id,'dqms')}</td><td>${ppapStatusDot(p.spr,p.__id,'spr')}</td><td>${esc(p.dueDate||p.due||'-')}</td><td><button class="ghost small" data-ppap-dev="${p.__id}">View / update</button></td></tr>`}).join('');$$('[data-ppap-row]',$('#ppapPartRows')).forEach(btn=>btn.onclick=()=>{const id=btn.dataset.ppapRow,col=btn.dataset.ppapCol,part=(state.ppapParts||[]).find(x=>x.__id===id);if(!part)return;part[col]=ppapNextStatus(part[col]);save();renderPpap()});$$('[data-ppap-dev]',$('#ppapPartRows')).forEach(btn=>btn.onclick=()=>openPpapDevDrawer(btn.dataset.ppapDev))}
function openPpapDevDrawer(id){const p=(state.ppapParts||[]).find(x=>x.__id===id);if(!p)return;state.ppapDevSelected=id;$('#ppapDevPartTitle').textContent=`${p.partNo||p.part||p.pn||''} · ${p.itemName||p.item||p.description||''}`;$('#ppapDevText').value=p.devFlow||p.devNote||'';$('#ppapDevPic').value=p.devPic||p.pic||'';$('#ppapDevDate').value=p.devDate||'';$('#ppapDevDrawer').classList.remove('hidden');$('#ppapDetailWrap').classList.remove('full');$('#ppapDetailWrap').classList.add('drawer-open')}
function closePpapDevDrawer(){const d=$('#ppapDevDrawer');if(d)d.classList.add('hidden');const w=$('#ppapDetailWrap');if(w){w.classList.add('full');w.classList.remove('drawer-open')}state.ppapDevSelected=null}
function savePpapDevDrawer(){const p=(state.ppapParts||[]).find(x=>x.__id===state.ppapDevSelected);if(!p)return;p.devFlow=$('#ppapDevText').value;p.devPic=$('#ppapDevPic').value;p.devDate=$('#ppapDevDate').value;save();closePpapDevDrawer();renderPpap()}
function renderPpap(){renderPpapProductTabs();renderPpapOverview();renderPpapModelCards();renderPpapDetail();const c=$('#ppapCloseDetailBtn');if(c)c.onclick=()=>{state.ppapSelectedModel=null;closePpapDevDrawer();save();renderPpap()};const dc=$('#ppapDevCloseBtn');if(dc)dc.onclick=closePpapDevDrawer;const ds=$('#ppapDevSaveBtn');if(ds)ds.onclick=savePpapDevDrawer}



// ===== V5.5: V3 CLICK MECHANISM + V5 COLOR LOGIC =====
// Reuses the click mechanism that worked in V3:
//   <button class="status-dot ... ppap-status" data-model data-part data-k>
// and binds b.onclick directly to every circle.
// Required infinite cycle for every PPAP status:
//   white -> yellow(Processing) -> green(Done/Release) -> red(Pending) -> white -> ...

function v55StatusClass(value){
  const s = ppapNormStatus(value);
  return s; // white | yellow | green | red
}

function v55StatusLabel(value, key){
  const s = ppapNormStatus(value);
  if(s === 'white') return 'Not updated';
  if(s === 'yellow') return 'Processing';
  if(s === 'green') return key === 'drawing' ? 'Release' : 'Done';
  if(s === 'red') return 'Pending';
  return 'Not updated';
}

function v55NextValue(value, key){
  const s = ppapNormStatus(value);
  const next = {
    white: 'yellow',
    yellow: 'green',
    green: 'red',
    red: 'white'
  }[s] || 'yellow';

  // Store readable values in the existing data structure.
  if(next === 'white') return '';
  if(next === 'yellow') return 'Processing';
  if(next === 'green') return key === 'drawing' ? 'Release' : 'Done';
  if(next === 'red') return 'Pending';
  return '';
}

// Override the V5 detail renderer with the working V3 event-binding style.
renderPpapDetail = function(){
  const card = $('#ppapDetailCard');
  const model = state.ppapSelectedModel;

  if(!model){
    card?.classList.add('hidden');
    return;
  }

  const parts = ppapGroupedModels()[model] || [];
  if(!parts.length){
    card?.classList.add('hidden');
    return;
  }

  card.classList.remove('hidden');
  $('#ppapSelectedModelTitle').textContent = model;

  const info = (state.ppapSummary || []).find(
    x => norm(x.model || x.modelName || x.project || '') === norm(model)
  ) || {};

  const pic = info.pic || parts.find(p => p.pic)?.pic || '-';
  const due = info.dueDate || info.due ||
              parts.find(p => p.dueDate || p.due)?.dueDate ||
              parts.find(p => p.dueDate || p.due)?.due || '-';

  $('#ppapSelectedModelMeta').textContent = `PIC: ${pic} · Target: ${due}`;

  $('#ppapPartRows').innerHTML = parts.map((p, i) => {
    const partNo = p.partNo || p.part || p.pn || '-';
    const item = p.itemName || p.item || p.description || '-';

    const statusCells = ['drawing','hsms','dqms','spr'].map(k => `
      <td>
        <div class="status-wrap v55-status-wrap">
          <span class="v55-status-text">${v55StatusLabel(p[k], k)}</span>
          <button
            type="button"
            class="status-dot ${v55StatusClass(p[k])} ppap-status v55-ppap-status"
            title="Click circle to change status"
            data-model="${esc(ppapModelNameOfPart(p))}"
            data-part="${esc(partNo)}"
            data-k="${k}">
          </button>
        </div>
      </td>
    `).join('');

    // keep the drawer id mechanism for Dev Flow
    if(!p.__id) p.__id = `ppap-${norm(model)}-${i}`;

    return `<tr>
      <td><b>${esc(partNo)}</b></td>
      <td>${esc(item)}</td>
      <td>${esc(p.supplier || '-')}</td>
      ${statusCells}
      <td>${esc(p.dueDate || p.due || '-')}</td>
      <td><button class="ghost small" data-ppap-dev="${esc(p.__id)}">View / update</button></td>
    </tr>`;
  }).join('');

  // EXACT V3 STYLE: bind direct onclick to each colored circle.
  $$('.v55-ppap-status', $('#ppapPartRows')).forEach(b => {
    b.onclick = e => {
      e.preventDefault();
      e.stopPropagation();

      const partNo = b.dataset.part;
      const modelName = b.dataset.model;
      const key = b.dataset.k;

      const p = (state.ppapParts || []).find(x =>
        String(x.partNo || x.part || x.pn || '-') === partNo &&
        ppapModelNameOfPart(x) === modelName
      );

      if(!p) return;

      p[key] = v55NextValue(p[key], key);
      save();

      // Re-render PPAP so chart, card counts, labels and colors all stay synced.
      renderPpap();
    };
  });

  $$('[data-ppap-dev]', $('#ppapPartRows')).forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      openPpapDevDrawer(btn.dataset.ppapDev);
    };
  });
};


// ===== V5.6 runtime-safe bindings =====
const v56AddPpapPartBtn = $('#addPpapPartBtn');
if(v56AddPpapPartBtn){
  v56AddPpapPartBtn.onclick = ()=>{
    const model = state.ppapSelectedModel || Object.keys(ppapGroupedModels())[0] || '';
    openModal(`<form class="form-modal" id="v56AddPpapForm">
      <h2>Add PPAP part</h2>
      <div class="form-grid">
        <label>Model<input name="model" value="${esc(model)}" required></label>
        <label>Part No<input name="partNo" required></label>
        <label>Item name<input name="itemName"></label>
        <label>Supplier<input name="supplier"></label>
        <label>Due date<input name="dueDate"></label>
        <label>PIC<input name="pic"></label>
      </div>
      <div class="form-actions"><button class="primary">Save</button></div>
    </form>`);
    const form = $('#v56AddPpapForm');
    if(form) form.onsubmit = e=>{
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target));
      state.ppapParts.push({
        source:'Manual',
        ...d,
        drawing:'',
        hsms:'',
        dqms:'',
        spr:'',
        devFlow:'',
        devPic:d.pic||'',
        devDate:''
      });
      save();
      closeModal();
      renderPpap();
    };
  };
}


// ===== V5.6 status logic override =====
// Click directly on the circle:
// White -> Yellow/Processing -> Green/Done(Release for Drawing) -> Red/Pending -> White -> ...
function v56NextStatusReadable(value, key){
  const s = ppapNormStatus(value);
  if(s === 'white')  return 'Processing';
  if(s === 'yellow') return key === 'drawing' ? 'Release' : 'Done';
  if(s === 'green')  return 'Pending';
  return '';
}
function v56BindStatusCircles(){
  const body = $('#ppapPartRows');
  if(!body) return;
  $$('.v55-ppap-status', body).forEach(circle=>{
    circle.onclick = e=>{
      e.preventDefault();
      e.stopPropagation();
      const modelName = circle.dataset.model;
      const partNo = circle.dataset.part;
      const key = circle.dataset.k;
      const part = (state.ppapParts||[]).find(x =>
        ppapModelNameOfPart(x) === modelName &&
        String(x.partNo || x.part || x.pn || '-') === partNo
      );
      if(!part) return;
      part[key] = v56NextStatusReadable(part[key], key);
      save();
      renderPpap();
    };
  });
}
const v56RenderPpapDetailBase = renderPpapDetail;
renderPpapDetail = function(){
  v56RenderPpapDetailBase();
  v56BindStatusCircles();
};
