
const board=document.querySelector('#geometry-svg'), out=document.querySelector('#values');
const controls=[...document.querySelectorAll('.q-controls input[type=range]')];
const f=n=>Number(n.toFixed(2));
const X=x=>320+x*38,Y=y=>220-y*38;
const line=(a,b,c='#94a3b8',dash='')=>'<line x1="'+X(a[0])+'" y1="'+Y(a[1])+'" x2="'+X(b[0])+'" y2="'+Y(b[1])+'" stroke="'+c+'" stroke-width="2.4" stroke-dasharray="'+dash+'"/>';
const mark=(p,s,c='#67e8f9')=>'<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="5" fill="'+c+'"/><text x="'+(X(p[0])+8)+'" y="'+(Y(p[1])-8)+'" fill="'+c+'">'+s+'</text>';
const poly=(ps,c)=>'<polygon points="'+ps.map(p=>X(p[0])+','+Y(p[1])).join(' ')+'" fill="'+c+'" fill-opacity=".18" stroke="'+c+'" stroke-width="2"/>';
const curve=(fn,l,r,c,w=2)=>'<polyline fill="none" stroke="'+c+'" stroke-width="'+w+'" points="'+Array.from({length:141},(_,i)=>{const x=l+(r-l)*i/140;return X(x)+','+Y(fn(x))}).join(' ')+'"/>';
function draw(){
 let s='', read='';
 const [t,u,v]=controls.map(el=>{el.parentElement.querySelector('output').textContent=el.value;return +el.value});
 for(let i=-8;i<=8;i++)s+=line([i,-6],[i,6],'#26364b');
 for(let i=-5;i<=5;i++)s+=line([-9,i],[9,i],'#26364b');
 s+=line([-9,0],[9,0],'#94a3b8')+line([0,-6],[0,6],'#94a3b8');
 if(mode.startsWith('range')){
   let h=t,l=Math.min(u,v),r=Math.max(u,v),a=1,k=-1;
   if(mode==='rangeAxis'){l=0;r=1;a=-1;k=t*t+1-t;}
   if(mode==='rangeWindow'){h=1;l=t-2;r=t;k=t+1;}
   if(mode==='rangeAlgebra'){h=u===1?-1:2;l=u===1?-5:-1;r=u===1?5:1;a=u===1?1:-1;k=u===1?1:6;}
   const fn=x=>a*(x-h)**2+k;
   const xs=[l,r,...(l<=h&&h<=r?[h]:[])], ys=xs.map(fn);
   s+=curve(fn,-8,8,'#94a3b8')+curve(fn,l,r,'#67e8f9',4)+line([h,-6],[h,6],'#a78bfa','5 5')+mark([l,fn(l)],'左端')+mark([r,fn(r)],'右端')+mark([h,fn(h)],'顶点','#c4b5fd');
   read='对称轴 x＝'+f(h)+' ｜ 区间 ['+f(l)+', '+f(r)+'] ｜ 最小值 '+f(Math.min(...ys))+' ｜ 最大值 '+f(Math.max(...ys));
   if(mode==='rangeAlgebra'&&u===1)read='x 无限制，画板显示 [−5,5] ｜ 全局最小值 1（x＝−1）';
 } else if(mode==='focus'){
   const fn=x=>x*x/(4*u),p=[t,fn(t)],F=[0,u],d=[t,-u];
   s+=curve(fn,-8,8,'#67e8f9',3)+line([-9,-u],[9,-u],'#c4b5fd','6 4')+line(p,F,'#fbbf24')+line(p,d,'#fbbf24')+mark(p,'P')+mark(F,'F')+mark(d,'D');
   read='PF＝'+f(Math.hypot(t,fn(t)-u))+' ｜ PD＝'+f(fn(t)+u)+' ｜ 准线 y＝'+f(-u);
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
 } else if(mode==='area6-1:6'){
   const A=[-2,-1],B=[2,-1],C=[2,2],D=[-2,2],r=12/5,angle=t*Math.PI/180;
   const P=[C[0]+r*Math.cos(angle),C[1]+r*Math.sin(angle)],ratio=(3*(P[0]-A[0])+4*(P[1]-A[1]))/12;
   const T=[A[0]+(P[0]-A[0])/ratio,A[1]+(P[1]-A[1])/ratio];
   s+=poly([A,B,C,D],'#94a3b8')+line(B,D)+line(A,P,'#fbbf24')+'<circle cx="'+X(C[0])+'" cy="'+Y(C[1])+'" r="'+38*r+'" fill="none" stroke="#67e8f9"/>'+mark(A,'A')+mark(B,'B')+mark(C,'C')+mark(D,'D')+mark(P,'P')+mark(T,'T');
   read='AP / AT＝'+f(ratio)+' ｜ 最大值 3';
 } else if(mode.startsWith('area6-')){
   const key=mode.slice(6), examples={
     '0:2':[x=>x*x+6*x+5,[-5,0],[-4,-3],[-1,0]],
     '0:3':[x=>-x*x+2*x+3,[-1,0],[3,0],[0,3]],
     '0:5':[x=>x*x/2+x-4,[2,0],[-4,0],[0,-4]],
     '1:1':[x=>-0.75*x*x+1.5*x+6,[-2,0],[4,0],[0,6]],
     '1:3':[x=>-x*x-2*x+3,[1,0],[-3,0],[0,3]],
     '1:5':[x=>-x*x+2*x+3,[-1,0],[3,0],[0,3]]
   };
   const [fn,A,B,C]=examples[key], P=[t,fn(t)],k=(C[1]-B[1])/(C[0]-B[0]),b=B[1]-k*B[0],Q=[t,k*t+b];
   const scale=key==='1:1'?0.7:1, project=([x,y])=>[x*scale,y*scale], name=['1:1','1:5'].includes(key)?'D':'P';
   const area=Math.abs(P[1]-Q[1])*Math.abs(B[0]-C[0])/2;
   s+=curve(x=>scale*fn(x/scale),-5,5,'#67e8f9')+poly([B,C,P].map(project),'#67e8f9')+mark(project(A),'A')+mark(project(B),'B')+mark(project(C),'C')+mark(project(P),name);
   read=name+'＝('+f(t)+', '+f(P[1])+') ｜ △'+name+'BC 面积＝'+f(area);
   if(key==='0:5'){s+=poly([A,B,C],'#c4b5fd');read+=' ｜ 四边形面积＝'+f(12+area);}
   if(key==='1:1')read+=' ｜ S_BCD / S_AOC＝'+f(area/6);
   if(key==='1:3'||key==='1:5'){
     const lambda=b/(P[1]-k*t),intersection=[lambda*t,lambda*P[1]];
     s+=line([0,0],project(P),'#fbbf24')+mark(project(intersection),key==='1:3'?'D':'F');
     read+=' ｜ 面积比＝'+f(key==='1:3'?Math.abs(intersection[0]/(intersection[0]-B[0])):lambda/(1-lambda));
   }else{s+=line(project(P),project(Q),'#fbbf24')+mark(project(Q),'Q','#fbbf24');}
 } else if(mode==='ratio'){
   const A=[-3,-2],B=[3,-2],P=[-1,t],Q=[1,2];
   s+=poly([A,B,Q],'#c4b5fd')+poly([A,B,P],'#67e8f9')+mark(A,'A')+mark(B,'B')+mark(P,example?'C':'P')+mark(Q,example?'D':'Q','#c4b5fd');
   read='△ABP＝'+f(3*(t+2))+' ｜ △ABQ＝12 ｜ 面积比＝'+f((t+2)/4);
 } else {
   const example=mode==='areaExample';
   const A=example?[1,1]:[-3,-1],B=example?[7,3]:[3,1];
   const base=x=>example?1+(x-1)/3:x/3;
   const P=[t,mode==='paraarea'?3-t*t/3+t/3:u],Q=[t,base(t)];
   if(mode==='paraarea')s+=curve(x=>3-x*x/3+x/3,-4,4,'#c4b5fd',3);
   s+=line([-8,base(-8)],[8,base(8)],'#94a3b8','4 4')+poly([A,B,P],'#67e8f9')+line(P,Q,'#fbbf24')+mark(A,'A')+mark(B,'B')+mark(P,'P')+mark(Q,'Q','#fbbf24');
   read='水平宽＝6 ｜ 铅垂高＝'+f(Math.abs(P[1]-Q[1]))+' ｜ '+(example?'△ABC':'△ABP')+' 面积＝'+f(3*Math.abs(P[1]-Q[1]));
 }
 board.innerHTML=s;out.textContent=read;
}
controls.forEach(el=>el.addEventListener('input',draw));
document.querySelector('#reset').onclick=()=>{controls.forEach(el=>el.value=el.defaultValue);draw()};
draw();
