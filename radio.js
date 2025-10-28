// منطق الراديو (Howler) + مزامنة بسيطة حسب ساعة اليوم المحلية
window.Radio = (function(){
  let tracks = []; // {title, src, duration}
  let total = 0;
  let player = null, isPlaying = false;

  const el = id => document.getElementById(id);
  const toast = msg => { const t=el('toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1500); };
  const fmt = s => new Date(s*1000).toISOString().substr(14,5);

  function secondsSinceMidnight(){
    const now = new Date();
    const z = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.floor((now - z)/1000);
  }
  function pickByPos(pos){
    let acc=0;
    for (let i=0;i<tracks.length;i++){
      const d=tracks[i].duration||120, start=acc, end=acc+d;
      if (pos>=start && pos<end) return {idx:i, seek: pos-start};
      acc=end;
    }
    return {idx:0, seek:0};
  }

  function setPlaylist(list){
    tracks = (Array.isArray(list)?list:[]).filter(t=>t&&t.src);
    total = 0; tracks.forEach(t => { t.duration = Number(t.duration||120); total += t.duration; });
  }

  function start(){
    if (!tracks.length || !total) return;
    const pos = secondsSinceMidnight() % total;
    const pick = pickByPos(pos);
    playIndex(pick.idx, pick.seek);
  }

  function playIndex(i, seek){
    const t = tracks[i];
    const volEl = document.getElementById('vol');
    const vol = volEl ? volEl.value/100 : 0.7;
    if (player){ try{ player.stop(); player.unload(); }catch(e){} }
    player = new Howl({
      src: [t.src], html5:true, volume: vol,
      onplay: () => {
        isPlaying=true; const pb=document.getElementById('playBtn'); if (pb) pb.textContent='⏸️ إيقاف مؤقت';
        const nt=document.getElementById('nowTitle'); if (nt) nt.textContent = '🎵 ' + (t.title||'Track');
        const nm=document.getElementById('nowMeta');  if (nm) nm.textContent = `${t.src.replace(/^.*\//,'')} • ${fmt(t.duration||120)} • بدء ${fmt(seek||0)}`;
      },
      onend: () => start(),
      onloaderror: (id,err) => { console.warn('onloaderror',err); toast('تعذر تحميل الصوت'); },
      onplayerror: (id,err) => { console.warn('onplayerror',err); player.once('unlock',()=>player.play()); }
    });
    player.play();
    try{ player.seek(seek||0); }catch(e){}
  }

  function toggle(){ if (!player){ start(); return; } if (isPlaying){ player.pause(); isPlaying=false; const pb=document.getElementById('playBtn'); if (pb) pb.textContent='🎵 تشغيل'; } else { player.play(); isPlaying=true; const pb=document.getElementById('playBtn'); if (pb) pb.textContent='⏸️ إيقاف مؤقت'; } }
  function next(){ start(); }
  function volume(v){ if (player) player.volume(v); }

  return { setPlaylist, start, toggle, next, volume };
})();
