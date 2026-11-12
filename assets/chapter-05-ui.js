(()=>{
const drawCanvas=document.getElementById('draw-canvas'); const dctx=drawCanvas.getContext('2d');
    let penMode=null,isDrawing=false,penColor='#ffffff',penSize=3,strokes=[],curStroke=null;
    function resizeDrawCanvas(){ const rect=drawCanvas.parentElement.getBoundingClientRect(); const dpr=window.devicePixelRatio||1;
        drawCanvas.width=rect.width*dpr; drawCanvas.height=rect.height*dpr; drawCanvas.style.width=rect.width+'px'; drawCanvas.style.height=rect.height+'px';
        dctx.setTransform(1,0,0,1,0,0); dctx.scale(dpr,dpr); redrawStrokes(rect.width,rect.height); }
    function redrawStrokes(w,h){ dctx.clearRect(0,0,w,h); dctx.lineCap='round'; dctx.lineJoin='round';
        strokes.forEach(s=>{ if(!s.pts.length)return; const sx=w/s.w,sy=h/s.h;
            dctx.globalCompositeOperation=s.eraser?'destination-out':'source-over'; dctx.strokeStyle=s.color; dctx.lineWidth=s.size;
            dctx.beginPath(); dctx.moveTo(s.pts[0].x*sx,s.pts[0].y*sy);
            if(s.pts.length===1) dctx.lineTo(s.pts[0].x*sx+0.01,s.pts[0].y*sy+0.01); else for(let i=1;i<s.pts.length;i++)dctx.lineTo(s.pts[i].x*sx,s.pts[i].y*sy);
            dctx.stroke(); }); dctx.globalCompositeOperation='source-over'; }
    function drawLiveSegment(){ const p=curStroke.pts,n=p.length; dctx.lineCap='round'; dctx.lineJoin='round';
        dctx.globalCompositeOperation=curStroke.eraser?'destination-out':'source-over'; dctx.strokeStyle=curStroke.color; dctx.lineWidth=curStroke.size;
        dctx.beginPath(); if(n===1){dctx.moveTo(p[0].x,p[0].y);dctx.lineTo(p[0].x+0.01,p[0].y+0.01);} else {dctx.moveTo(p[n-2].x,p[n-2].y);dctx.lineTo(p[n-1].x,p[n-1].y);} dctx.stroke(); dctx.globalCompositeOperation='source-over'; }
    const getDrawPos=e=>{const rect=drawCanvas.getBoundingClientRect(); return {x:e.clientX-rect.left,y:e.clientY-rect.top};};
    drawCanvas.addEventListener('pointerdown',e=>{ if(!penMode)return; isDrawing=true; drawCanvas.setPointerCapture(e.pointerId); const rect=drawCanvas.getBoundingClientRect();
        curStroke={color:penColor,size:penSize,eraser:penMode==='eraser',pts:[getDrawPos(e)],w:rect.width,h:rect.height}; strokes.push(curStroke); drawLiveSegment(); });
    drawCanvas.addEventListener('pointermove',e=>{ if(!isDrawing||!penMode)return; curStroke.pts.push(getDrawPos(e)); drawLiveSegment(); });
    function endStroke(){isDrawing=false;curStroke=null;}
    drawCanvas.addEventListener('pointerup',endStroke); drawCanvas.addEventListener('pointercancel',endStroke); drawCanvas.addEventListener('pointerleave',()=>{if(isDrawing)endStroke();});
    const penBtn=document.getElementById('pen-btn'),eraserBtn=document.getElementById('eraser-btn'),clearDrawBtn=document.getElementById('clear-draw-btn'),undoBtn=document.getElementById('undo-btn'),penSizeInput=document.getElementById('pen-size'),swatches=document.querySelectorAll('.draw-swatch');
    function updateToolbarUI(){ penBtn.classList.toggle('bg-slate-600',penMode==='pen'); penBtn.classList.toggle('text-white',penMode==='pen'); eraserBtn.classList.toggle('bg-slate-600',penMode==='eraser'); eraserBtn.classList.toggle('text-white',penMode==='eraser');
        if(penMode){drawCanvas.style.pointerEvents='auto'; drawCanvas.style.cursor=penMode==='eraser'?'cell':'crosshair';} else drawCanvas.style.pointerEvents='none'; }
    function setMode(m){penMode=(penMode===m)?null:m; updateToolbarUI();}
    penBtn.addEventListener('click',()=>setMode('pen')); eraserBtn.addEventListener('click',()=>setMode('eraser'));
    clearDrawBtn.addEventListener('click',()=>{strokes=[]; const rect=drawCanvas.getBoundingClientRect(); redrawStrokes(rect.width,rect.height);});
    undoBtn.addEventListener('click',()=>{if(!strokes.length)return; strokes.pop(); const rect=drawCanvas.getBoundingClientRect(); redrawStrokes(rect.width,rect.height);});
    penSizeInput.addEventListener('input',()=>{penSize=parseInt(penSizeInput.value,10);});
    swatches.forEach(sw=>sw.addEventListener('click',()=>{penColor=sw.dataset.color; swatches.forEach(s=>{s.classList.remove('ring-2','ring-white');s.classList.add('ring-1','ring-slate-600');}); sw.classList.remove('ring-1','ring-slate-600'); sw.classList.add('ring-2','ring-white'); if(penMode!=='pen')setMode('pen');}));
    updateToolbarUI();


new ResizeObserver(resizeDrawCanvas).observe(drawCanvas.parentElement);
const toggle=document.querySelector('#toggle-solution'),columns=document.querySelector('.q-columns');
toggle.addEventListener('click',()=>{const collapsed=columns.dataset.collapsed!=='true';columns.dataset.collapsed=collapsed;toggle.setAttribute('aria-expanded',String(!collapsed));toggle.textContent=collapsed?'›':'‹';});

const graph=document.querySelector('#geometry-canvas,#geometry-svg');
const sliders=[...document.querySelectorAll('.q-controls input[type=range]')];
let drag=null;
function handle(event){
  if(graph instanceof HTMLCanvasElement){
    const rect=graph.getBoundingClientRect();
    return (graph.dragPoints||[]).find(p=>Math.hypot(event.clientX-rect.left-p.x,event.clientY-rect.top-p.y)<15);
  }
  const marker=event.target.closest('circle[data-point]');
  if(!marker)return;
  const name=marker.dataset.point;
  const map={range:{顶点:[0,0],左端:[+sliders[1]?.value<=+sliders[2]?.value?1:2,0],右端:[+sliders[1]?.value<=+sliders[2]?.value?2:1,0]},rangeAxis:{顶点:[0,0]},rangeWindow:{左端:[0,2],右端:[0,0]},focus:{P:[0,0]},motion:{P:[0,3]}};
  const entry=map[mode]?.[name];
  return entry?{field:sliders[entry[0]],offset:entry[1]}:null;
}
graph.addEventListener('pointerdown',event=>{
  if(event.button!==0||drag)return;
  const target=handle(event);
  if(!target?.field)return;
  drag={...target,pointer:event.pointerId};
  graph.setPointerCapture(event.pointerId);graph.style.cursor='grabbing';
});
graph.addEventListener('pointermove',event=>{
  if(!drag){graph.style.cursor=handle(event)?'grab':'';return;}
  if(event.pointerId!==drag.pointer)return;
  let value;
  if(graph instanceof HTMLCanvasElement){
    value=(event.clientX-graph.getBoundingClientRect().left-drag.origin)/drag.scale;
  }else{
    const matrix=graph.getScreenCTM();if(!matrix)return;
    const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    const x=(point.x-320)/38,y=(220-point.y)/38;
    value=mode==='motion'?(x<1.8?x+3:Math.max(5,y+7)):x+drag.offset;
  }
  const field=drag.field;
  field.value=String(Math.max(+field.min,Math.min(+field.max,value)));
  field.dispatchEvent(new Event('input'));
});
function finishDrag(event){if(drag?.pointer===event.pointerId){drag=null;graph.style.cursor='';}}
graph.addEventListener('pointerup',finishDrag);
graph.addEventListener('pointercancel',finishDrag);
graph.addEventListener('lostpointercapture',finishDrag);

renderMathInElement(document.querySelector('.q-layout'),{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false});
})();
