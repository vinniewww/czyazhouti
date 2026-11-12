(() => {
  const data = JSON.parse(document.querySelector('#construction-data').textContent);
  const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
  const slider = document.querySelector('#stage');
  const buttons = [...document.querySelectorAll('[data-stage]')];
  const prev = document.querySelector('#prev'), next = document.querySelector('#next');
  const result = document.querySelector('#status');
  const [xmin,xmax,ymin,ymax] = data.view;
  function render() {
    const stage = Number(slider.value);
    const ratio = window.devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const scale = Math.min((w-30)/(xmax-xmin),(h-30)/(ymax-ymin));
    const X = x => w/2+(x-(xmin+xmax)/2)*scale;
    const Y = y => h/2-(y-(ymin+ymax)/2)*scale;
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,w,h);
    if (data.grid) {
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.beginPath();
      for (let x=0; x<=7; x++) {ctx.moveTo(X(x),Y(0));ctx.lineTo(X(x),Y(6));}
      for (let y=0; y<=6; y++) {ctx.moveTo(X(0),Y(y));ctx.lineTo(X(7),Y(y));}
      ctx.stroke();
    }
    const groups = [data.initial, ...data.steps.slice(0,stage).map(s => s.objects)];
    if (data.grid && stage) groups.splice(1,stage-1);
    const all = groups.flat();
    const points = new Map(all.filter(o => Object.hasOwn(o,'name')).map(o => [o.name,o]));
    groups.forEach((objects,index) => objects.forEach(o => {
      const active = index === groups.length-1 && stage > 0;
      ctx.strokeStyle = active ? '#67e8f9' : '#94a3b8';
      ctx.lineWidth = active ? 2.7 : 1.8; ctx.setLineDash([]); ctx.beginPath();
      if (o.line) o.line.forEach((name,i) => {const p=points.get(name);if (i)ctx.lineTo(X(p.x),Y(p.y));else ctx.moveTo(X(p.x),Y(p.y));});
      else if (Object.hasOwn(o,'center')) {
        const p=points.get(o.center);
        if (o.end-o.start < 360 && !active && o === data.initial.find(v=>v.center==='')) ctx.strokeStyle='#cbd5e1';
        else if (!(data.title.includes('相切圆弧') && o.center==='O')) ctx.setLineDash([5,4]);
        ctx.arc(X(p.x),Y(p.y),o.r*scale,-o.end*Math.PI/180,-o.start*Math.PI/180);
      }
      ctx.stroke();
    }));
    points.forEach(p => {
      if (!p.name) return;
      ctx.fillStyle = '#f8fafc'; ctx.beginPath();ctx.arc(X(p.x),Y(p.y),3.2,0,2*Math.PI);ctx.fill();
      ctx.font = 'bold 14px system-ui';ctx.fillText(p.name,X(p.x)+7,Y(p.y)-7);
    });
    buttons.forEach(b => b.setAttribute('aria-pressed',Number(b.dataset.stage)===stage));
    prev.disabled=stage===0;next.disabled=stage===data.steps.length;
    result.textContent=stage ? '第 '+stage+' 步 · '+data.steps[stage-1].title : '初始图形';
  }
  function setStage(value) {slider.value=value;render();}
  slider.addEventListener('input',render);
  buttons.forEach(b=>b.addEventListener('click',()=>setStage(Number(b.dataset.stage))));
  prev.addEventListener('click',()=>setStage(Number(slider.value)-1));
  next.addEventListener('click',()=>setStage(Number(slider.value)+1));
  document.querySelector('#reset').addEventListener('click',()=>setStage(0));
  new ResizeObserver(render).observe(canvas);
  render();
})();