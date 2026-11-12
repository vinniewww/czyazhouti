
const board=document.querySelector('#geometry-svg'), out=document.querySelector('#values');
const controls=[...document.querySelectorAll('.q-controls input[type=range]')];
const f=n=>Number(n.toFixed(2));
const X=x=>320+x*38,Y=y=>220-y*38;
const line=(a,b,c='#94a3b8',dash='')=>'<line x1="'+X(a[0])+'" y1="'+Y(a[1])+'" x2="'+X(b[0])+'" y2="'+Y(b[1])+'" stroke="'+c+'" stroke-width="2.4" stroke-dasharray="'+dash+'"/>';
const mark=(p,s,c='#67e8f9')=>'<circle data-point="'+s+'" cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="5" fill="'+c+'"/><text x="'+(X(p[0])+8)+'" y="'+(Y(p[1])-8)+'" fill="'+c+'">'+s+'</text>';
const poly=(ps,c)=>'<polygon points="'+ps.map(p=>X(p[0])+','+Y(p[1])).join(' ')+'" fill="'+c+'" fill-opacity=".18" stroke="'+c+'" stroke-width="2"/>';
const curve=(fn,l,r,c,w=2)=>'<polyline fill="none" stroke="'+c+'" stroke-width="'+w+'" points="'+Array.from({length:141},(_,i)=>{const x=l+(r-l)*i/140;return X(x)+','+Y(fn(x))}).join(' ')+'"/>';
function draw(){
 let s='', read='';
 const [t=Number(board.dataset.fixedParameter),u,v]=controls.map(el=>{el.parentElement.querySelector('output').textContent=el.value;return +el.value});
 for(let i=-8;i<=8;i++)s+=line([i,-6],[i,6],'#26364b');
 for(let i=-5;i<=5;i++)s+=line([-9,i],[9,i],'#26364b');
 s+=line([-9,0],[9,0],'#94a3b8')+line([0,-6],[0,6],'#94a3b8');
 if(mode.startsWith('range')){
   let h=t,l=Math.min(u,v),r=Math.max(u,v),a=1,k=-1;
   if(mode==='rangeAxis'){l=0;r=1;a=-1;k=t*t+1-t;}
   if(mode==='rangeWindow'){h=1;l=t-2;r=t;k=t+1;}
   if(mode==='rangeAlgebra'){h=t===1?-1:2;l=t===1?-5:-1;r=t===1?5:1;a=t===1?1:-1;k=t===1?1:6;}
   const fn=x=>a*(x-h)**2+k;
   const xs=[l,r,...(l<=h&&h<=r?[h]:[])], ys=xs.map(fn);
   s+=curve(fn,-8,8,'#94a3b8')+curve(fn,l,r,'#67e8f9',4)+line([h,-6],[h,6],'#a78bfa','5 5')+mark([l,fn(l)],'左端')+mark([r,fn(r)],'右端')+mark([h,fn(h)],'顶点','#c4b5fd');
   read='对称轴 x＝'+f(h)+' ｜ 区间 ['+f(l)+', '+f(r)+'] ｜ 最小值 '+f(Math.min(...ys))+' ｜ 最大值 '+f(Math.max(...ys));
   if(mode==='rangeAlgebra'&&t===1)read='x 无限制，画板显示 [−5,5] ｜ 全局最小值 1（x＝−1）';
 } else if(mode==='focus'){
   const example=Number(board.dataset.focusExample);
   const distance=example===1?4:example===2?0.5:example===3?1:u;
   const h=example===2?1:0,k=example===2?0.5:0;
   const fn=x=>k+(x-h)**2/(4*distance),p=[t,fn(t)],F=[h,k+distance],d=[t,k-distance];
   const focusName=example===1?'A':example===2?'M':'F';
   const footName=example===1?'Q':example===3?'M':'D';
   s+=curve(fn,-8,8,'#67e8f9',3)+line([-9,d[1]],[9,d[1]],'#c4b5fd','6 4')+line(p,F,'#fbbf24')+line(p,d,'#fbbf24')+mark(p,'P')+mark(F,focusName)+mark(d,footName);
   read='P'+focusName+'＝'+f(Math.hypot(t-h,p[1]-F[1]))+' ｜ P'+footName+'＝'+f(p[1]-d[1])+' ｜ 准线 y＝'+f(d[1]);
   if(example===1||example===3){
     const target=example===1?[1,8]:[1,5],name=example===1?'D':'Q';
     s+=line(p,target,'#67e8f9')+mark(target,name);
     read+=' ｜ 距离之和＝'+f(Math.hypot(t-target[0],p[1]-target[1])+p[1]-d[1]);
   }
   if(example===2&&Math.abs(t-h)>1e-8){
     const x=h-1/(t-h),q=[x,fn(x)];
     s+=line(F,q,'#67e8f9')+mark(q,'Q');
     read+=' ｜ 1/PM＋1/QM＝'+f(1/p[1]+1/q[1]);
   }
 } else if(mode==='motionLesson0'||mode==='motionLesson1'){
   const A=[0,2],B=[1,2],C=[4,-2],D=[0,-2];
   const P=t<=1?[t,2]:t<=6?[1+3*(t-1)/5,2-4*(t-1)/5]:[10-t,-2];
   s+=poly([A,B,C,D],'#94a3b8')+poly([P,A,D],'#67e8f9')+mark(A,'A')+mark(B,'B')+mark(C,'C')+mark(D,'D')+mark(P,'P','#fbbf24');
   read='t＝'+f(t)+' ｜ △PAD 面积＝'+f(2*P[0]);
 } else if(mode==='motionLesson2'){
   const A=[2,0],B=[-2,0],C=[2,4],D=[0,2],z=0.5*t;
   const P=[2,z],Q=[z-2,z],M=[z-2,2*z-4];
   const area=t<=4?t*t/2:t<=16/3?(8-t)**2-(16-3*t)**2/2:(8-t)**2;
   s+=poly([A,B,C],'#94a3b8')+poly([A,D,C],'#c4b5fd')+poly([P,Q,M],'#67e8f9')+mark(A,'A')+mark(B,'B')+mark(C,'C')+mark(D,'D')+mark(P,'P')+mark(Q,'Q')+mark(M,'M');
   read='x＝'+f(t)+' ｜ PQ＝'+f(Math.SQRT2*(8-t))+' ｜ 重叠面积＝'+f(area);
 } else if(mode==='motionLesson3'){
   const p=5-t, shift=([x,y])=>[x,y-1];
   const [A,B,C,D,P,E,F]=[[0,5],[2,5],[2,0],[0,0],[0,p],[2-p,-2],[-p,p-2]].map(shift);
   s+=poly([A,B,C,D],'#94a3b8')+poly([P,C,E,F],'#67e8f9')+poly([D,E,F],'#fbbf24')+mark(A,'A')+mark(B,'B')+mark(C,'C')+mark(D,'D')+mark(P,'P')+mark(E,'E')+mark(F,'F');
   read='t＝'+f(t)+' ｜ △PCD 面积＝'+f(p)+' ｜ △DEF 面积＝'+f(((t-4)**2+3)/2);
 } else if(mode==='motion'){
   const A=[-3,-2],B=[2,-2],C=[2,2],D=[-3,2],P=t<=5?[-3+t,-2]:[2,t-7];
   s+=poly([A,B,C,D],'#94a3b8')+poly([A,D,P],'#67e8f9')+mark(A,'A')+mark(B,'B')+mark(C,'C')+mark(D,'D')+mark(P,'P','#fbbf24');
   read='t＝'+f(t)+' ｜ '+(t<5?'沿 AB':t===5?'到达 B':'沿 BC')+' ｜ △ADP 面积＝'+f(2*(P[0]+3));
 } else if(mode==='similar'){
   const A=[-3,-2],B=[3,-2],C=[-1,3],D=[-3+6*t,-2],E=[-3+2*t,-2+5*t];
   s+=poly([A,B,C],'#c4b5fd')+poly([A,D,E],'#67e8f9')+mark(A,'A')+mark(B,'B')+mark(C,'C')+mark(D,'D')+mark(E,'E');
   read='AD / AB＝'+f(t)+' ｜ △ADE / △ABC＝'+f(t*t);
 } else if(mode==='quad'){
   const A=[-3,-2],B=[3,-2],C=[3,2],D=[t,2],s1=12,s2=2*(3-t);
   s+=poly([A,B,C],'#c4b5fd')+poly([A,C,D],'#67e8f9')+mark(A,'A')+mark(B,'B')+mark(C,'C')+mark(D,'D');
   read='△ABC＝'+s1+' ｜ △ACD＝'+f(s2)+' ｜ 四边形面积＝'+f(s1+s2)+' ｜ 两三角形面积比＝'+f(s1/s2);
 } else if(mode==='ratio'){
   const A=[-3,-2],B=[3,-2],P=[-1,t],Q=[1,2];
   s+=poly([A,B,Q],'#c4b5fd')+poly([A,B,P],'#67e8f9')+mark(A,'A')+mark(B,'B')+mark(P,'P')+mark(Q,'Q','#c4b5fd');
   read='△ABP＝'+f(3*(t+2))+' ｜ △ABQ＝12 ｜ 面积比＝'+f((t+2)/4);
 } else {
   const A=[-3,-1],B=[3,1],P=[t,mode==='area'?u:3-t*t/3+t/3],Q=[t,t/3];
   if(mode==='paraarea')s+=curve(x=>3-x*x/3+x/3,-4,4,'#c4b5fd',3);
   s+=line([-8,-8/3],[8,8/3],'#94a3b8','4 4')+poly([A,B,P],'#67e8f9')+line(P,Q,'#fbbf24')+mark(A,'A')+mark(B,'B')+mark(P,'P')+mark(Q,'Q','#fbbf24');
   read='水平宽＝6 ｜ 铅垂高＝'+f(Math.abs(P[1]-Q[1]))+' ｜ △ABP 面积＝'+f(3*Math.abs(P[1]-Q[1]));
 }
 board.innerHTML=s;out.textContent=read;
}
controls.forEach(el=>el.addEventListener('input',draw));
document.querySelector('#reset').onclick=()=>{controls.forEach(el=>el.value=el.defaultValue);draw()};
draw();
