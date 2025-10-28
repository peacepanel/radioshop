(function(){
  const cfg = window.SHEETS_CONFIG;
  const $ = s => document.getElementById(s);
  const toast = m => { const t=$('toast'); if(!t) return; t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1500); }

  // ساعة بسيطة
  setInterval(()=>{ const d=new Date(); if ($('clock')) $('clock').textContent = d.toLocaleTimeString('ar-IQ',{hour:'2-digit',minute:'2-digit'}); }, 1000);

  function getPeriod(){ const h=new Date().getHours(); return h<12? 'morning' : (h<18? 'day':'night'); }

  // تحميل الفئات من شيت Config
  async function loadCategories(){
    try{
      const names = await getCategoryNamesFromConfigSheet(cfg);
      const sel = $('categorySelect'); sel.innerHTML='';
      names.forEach((n)=>{ const o=document.createElement('option'); o.value=n; o.textContent=n; sel.appendChild(o); });
      if (names.length){ sel.value = names[0]; await loadProducts(names[0]); }
      sel.onchange = e => loadProducts(e.target.value);
    }catch(e){ console.error(e); toast('تعذر تحميل الفئات'); }
  }

  async function loadProducts(sheetName){
    const cont = $('products'); cont.innerHTML = '<div class="muted">جارِ التحميل…</div>';
    try{
      const items = await getProductsFromSheet(cfg, sheetName, getPeriod());
      if (!items.length){ cont.innerHTML = '<div class="muted">لا توجد منتجات</div>'; return; }
      cont.innerHTML='';
      items.forEach((p)=>{
        const card=document.createElement('div'); card.className='card';
        const imgWrap=document.createElement('div'); imgWrap.className='img';
        const img=new Image(); img.src=p.image; img.alt=p.name; img.onclick=()=>zoom(img.src);
        imgWrap.appendChild(img);
        const pad=document.createElement('div'); pad.className='pad';
        const row=document.createElement('div'); row.className='row sb aic';
        const name=document.createElement('div'); name.textContent=p.name; name.className='title';
        const price=document.createElement('div'); price.className='price'; price.textContent=p.price||'—';
        row.appendChild(name); row.appendChild(price);
        const btn=document.createElement('button'); btn.className='btn'; btn.textContent='🛒 أضف'; btn.onclick=()=>addToCart(p);
        pad.appendChild(row); pad.appendChild(btn);
        card.appendChild(imgWrap); card.appendChild(pad); cont.appendChild(card);
      });
    }catch(e){ console.error(e); toast('فشل تحميل المنتجات'); }
  }

  // قراءة قائمة الأغاني
  async function loadPlaylist(){
    try{
      const list = await getPlaylistFromSheet(cfg, getPeriod());
      const box = $('playlistBox'); box.innerHTML='';
      list.forEach((t,i)=>{
        const card=document.createElement('div'); card.className='card';
        const pad=document.createElement('div'); pad.className='pad';
        const title=document.createElement('div'); title.className='title'; title.textContent=t.title || ('Track '+(i+1));
        const meta=document.createElement('div'); meta.className='muted'; meta.textContent = (t.duration? (t.duration+'s • '):'') + (t.src||'');
        const btn=document.createElement('button'); btn.className='btn ghost'; btn.textContent='تشغيل هذا'; btn.onclick=()=>{ window.Radio.setPlaylist([t]); window.Radio.start(); };
        pad.appendChild(title); pad.appendChild(meta); pad.appendChild(btn);
        card.appendChild(pad); box.appendChild(card);
      });
      // اضبط الراديو على القائمة كاملة
      window.Radio.setPlaylist(list);
    }catch(e){ console.error(e); toast('تعذر تحميل قائمة الأغاني'); }
  }

  // عارض صورة بسيط
  function zoom(src){ $('bigImg').src=src; $('imgModal').hidden=false; }
  if ($('closeImg')) $('closeImg').onclick = ()=> $('imgModal').hidden=true;

  // سلة مبسطة
  const cart = JSON.parse(localStorage.getItem('radioShopCart')||'[]');
  function saveCart(){ localStorage.setItem('radioShopCart', JSON.stringify(cart)); renderCart(); }
  function addToCart(p){ cart.push(p); toast('✅ تمت الإضافة'); saveCart(); }
  function renderCart(){ const el=$('cartItems'); if(!el) return; if(!cart.length){ el.textContent='لا توجد عناصر'; return;} el.innerHTML=''; cart.forEach((it)=>{ const d=document.createElement('div'); d.className='row sb'; d.style.padding='8px 0'; d.innerHTML=`<div>${it.name}</div><div class="price">${it.price||''}</div>`; el.appendChild(d); }); }
  if ($('openCart')) $('openCart').onclick = ()=>{ $('cart').hidden=false; renderCart(); };
  if ($('closeCart')) $('closeCart').onclick = ()=>{ $('cart').hidden=true; };

  // ربط أزرار الراديو
  if ($('playBtn')) $('playBtn').onclick = ()=> window.Radio.toggle();
  if ($('nextBtn')) $('nextBtn').onclick = ()=> window.Radio.next();
  if ($('vol')) $('vol').oninput = e => window.Radio.volume(e.target.value/100);

  // إقلاع
  (async ()=>{
    try{
      await loadCategories();
      await loadPlaylist();
      toast('جاهز');
    }catch(e){ console.error(e); toast('خطأ في التهيئة'); }
  })();
})();
