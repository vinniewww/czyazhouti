
(() => {
  const lesson=JSON.parse(document.querySelector('#plot-data').textContent);
  const canvas=document.querySelector('#geometry-canvas'), ctx=canvas.getContext('2d');
  const fields=[...document.querySelectorAll('.q-controls input[type=range]')];
  const palette=['#67e8f9','#fbbf24','#f0abfc'];
  const fmt=n=>Math.abs(n)<1e-9?'0':Number(n.toFixed(3)).toString();
  function roots(a,b,c) {
    if(Math.abs(a)<1e-10)return Math.abs(b)<1e-10?[]:[-c/b];
    const delta=b*b-4*a*c;
    if(delta<-1e-9)return [];
    if(Math.abs(delta)<1e-9)return [-b/(2*a)];
    return [(-b-Math.sqrt(delta))/(2*a),(-b+Math.sqrt(delta))/(2*a)].sort((x,y)=>x-y);
  }
  function render(){
    const v=Object.fromEntries(fields.map(f=>[f.id,Number(f.value)]));
    fields.forEach(f=>document.querySelector('output[for="'+f.id+'"]').textContent=fmt(v[f.id]));
    let a=1,b=-2,c=-3, xmin=-5,xmax=5,ymin=-7,ymax=7;
    const curves=[],segments=[],points=[],notes=[];
    let line=null, interval=null, marked=false;
    const note=(label,value)=>notes.push([label,typeof value==='number'?fmt(value):value]);
    switch(lesson.mode){
      case 'coeff': ({a,b,c}=v); break;
      case 'zhang':
        a=-v.t;b=2*v.t;c=3*v.t;
        curves.push([x=>a*x+b,1,xmin,xmax],[x=>-c/x,2,xmin,-.025],[x=>-c/x,2,.025,xmax]);
        note('黄色直线','y＝ax＋b');note('紫色双曲线','y＝−c/x'); break;
      case 'expr': a=-.75;b=1.5;c=2;marked=true;break;
      case 'bijie': a=v.t;b=-2*a;c=-3*a;v.t=2;marked=true;line=[0,0];break;
      case 'guang': a=-1;b=-2;c=2;marked=true;note('f(−2)',2);note('f(1)',-1);break;
      case 'line': a=1;b=0;c=-2;line=[v.m,v.n]; break;
      case 'zibo': a=1;b=2*v.a;c=v.a+v.b;line=[0,0];note('任意 a 下的最小 Δ',-4*v.b-1);break;
      case 'segment': a=1;b=0;c=-2;line=[0,v.h];interval=[v.m,v.n];break;
      case 'nanjing':
        a=v.a;b=-1;c=-1-4*a;line=[0,0];interval=[-1,3];points.push([-2,1,'已知点'],[2,-3,'已知点']);break;
      case 'ziyang': {
        a=v.a;b=-2*a;c=a+2;const m=v.t,n=-2-2*m/3;
        line=[0,n];segments.push([0,-2,3,-4,2]);points.push([0,-2,'B'],[3,-4,'A'],[m,n,'M']);
        note('当前位置的高度差',a*(m-1)**2+2-n);
        note('整段最小高度差',Math.min(a+4,4*a+6));
        note('整段是否满足',Math.min(a+4,4*a+6)>=-1e-9?'满足':'不满足');break;
      }
    }
    const f=x=>a*x*x+b*x+c;
    curves.unshift([f,0,xmin,xmax]);
    note('a、b、c',[a,b,c].map(fmt).join('，'));
    if(a){
      const h=-b/(2*a),k=f(h);points.push([h,k,'顶点']);
      segments.push([h,ymin,h,ymax,0,true]);
      note('对称轴','x＝'+fmt(h));note('顶点纵坐标',k);
    }else{note('图像类型',b?'退化为直线':'退化为常函数');}
    if(marked){points.push([v.t,f(v.t),'取点']);note('f('+fmt(v.t)+')',f(v.t));}
    if(lesson.mode==='coeff'){points.push([0,c,'纵截距']);note('开口',a>0?'向上':a<0?'向下':'无');}
    if(line){
      const [m,n]=line, g=x=>m*x+n, xs=roots(a,b-m,c-n);
      const coincident=!a&&Math.abs(b-m)<1e-10&&Math.abs(c-n)<1e-10;
      if(a)note('联立方程的 Δ',(b-m)**2-4*a*(c-n));
      note('直线交点数',coincident?'无穷多个':xs.length);
      if(interval){
        const [left,right]=interval;
        segments.push([left,g(left),right,g(right),1]);points.push([left,g(left),'A'],[right,g(right),'B']);
        note('开区间内的交点数',coincident?'无穷多个':xs.filter(x=>x>left+1e-8&&x<right-1e-8).length);
        note('左、右端点的高度差',[f(left)-g(left),f(right)-g(right)].map(fmt).join('，'));
      }else curves.push([g,1,xmin,xmax]);
      for(const [i,x] of xs.entries())points.push([x,g(x),lesson.mode==='ziyang'?(i?'Q':'P'):'交点']);
    }
    document.querySelector('#readouts').replaceChildren(...notes.map(([label,value])=>{
      const row=document.createElement('div'), dt=document.createElement('dt'), dd=document.createElement('dd');
      row.className='flex justify-between gap-3 border-b border-slate-100 py-1.5';
      dt.textContent=label;dd.textContent=value;dd.className='text-right font-semibold';row.append(dt,dd);return row;
    }));
    const w=canvas.clientWidth,h=canvas.clientHeight,dpr=devicePixelRatio||1;
    if(!w||!h)return;
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    const s=Math.min((w-42)/(xmax-xmin),(h-38)/(ymax-ymin));
    const X=x=>w/2+x*s,Y=y=>h/2-y*s;
    ctx.fillStyle='#0f172a';ctx.fillRect(0,0,w,h);
    ctx.font='12px system-ui';ctx.fillStyle='#94a3b8';
    function segment(x,y,u,v,color,width=1,dash=[]){
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(X(x),Y(y));ctx.lineTo(X(u),Y(v));ctx.stroke();ctx.setLineDash([]);
    }
    for(let x=xmin;x<=xmax;x++){segment(x,ymin,x,ymax,x?'#26364b':'#8291a8');if(x)ctx.fillText(x,X(x)-4,Y(0)+15);}
    for(let y=ymin;y<=ymax;y++){segment(xmin,y,xmax,y,y?'#26364b':'#8291a8');if(y)ctx.fillText(y,X(0)+5,Y(y)+4);}
    ctx.fillText('x',X(xmax)+7,Y(0)+4);ctx.fillText('y',X(0)+5,Y(ymax)-4);
    ctx.save();ctx.beginPath();ctx.rect(X(xmin),Y(ymax),(xmax-xmin)*s,(ymax-ymin)*s);ctx.clip();
    for(const [x,y,u,v,k,dash] of segments)segment(x,y,u,v,palette[k],dash?1:3,dash?[5,5]:[]);
    for(const [fn,k,left,right] of curves){
      ctx.strokeStyle=palette[k];ctx.lineWidth=2.6;ctx.beginPath();
      for(let i=0;i<=400;i++){const x=left+(right-left)*i/400,y=fn(x);if(i)ctx.lineTo(X(x),Y(y));else ctx.moveTo(X(x),Y(y));}ctx.stroke();
    }
    ctx.restore();
    const handles={expr:{取点:'t'},guang:{取点:'t'},ziyang:{M:'t'},segment:{A:'m',B:'n'}}[lesson.mode]||{};
    canvas.dragPoints=points.filter(([x,y,label])=>handles[label]&&x>=xmin&&x<=xmax&&y>=ymin&&y<=ymax).map(([x,y,label])=>({x:X(x),y:Y(y),field:document.getElementById(handles[label]),offset:0,scale:s,origin:w/2}));
    for(const [x,y,label] of points){
      if(x<xmin||x>xmax||y<ymin||y>ymax)continue;
      ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.arc(X(x),Y(y),3.7,0,2*Math.PI);ctx.fill();ctx.fillText(label,X(x)+6,Y(y)-8);
    }
  }
  fields.forEach(field=>field.addEventListener('input',render));
  document.querySelector('#reset').addEventListener('click',()=>{fields.forEach(f=>f.value=f.defaultValue);render();});
  new ResizeObserver(render).observe(canvas);render();
})();
