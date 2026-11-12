
const board=document.querySelector('#geometry-svg'), out=document.querySelector('#values');
const controls=[...document.querySelectorAll('.q-controls input[type=range]')];
const f=n=>Number(n.toFixed(2));
const X=x=>320+x*38,Y=y=>220-y*38;
const line=(a,b,c='#94a3b8',dash='')=>'<line x1="'+X(a[0])+'" y1="'+Y(a[1])+'" x2="'+X(b[0])+'" y2="'+Y(b[1])+'" stroke="'+c+'" stroke-width="2.4" stroke-dasharray="'+dash+'"/>';
const mark=(p,s,c='#67e8f9')=>'<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="5" fill="'+c+'"/><text x="'+(X(p[0])+8)+'" y="'+(Y(p[1])-8)+'" fill="'+c+'">'+s+'</text>';
const poly=(ps,c)=>'<polygon points="'+ps.map(p=>X(p[0])+','+Y(p[1])).join(' ')+'" fill="'+c+'" fill-opacity=".18" stroke="'+c+'" stroke-width="2"/>';
const curve=(fn,l,r,c,w=2)=>'<polyline fill="none" stroke="'+c+'" stroke-width="'+w+'" points="'+Array.from({length:141},(_,i)=>{const x=l+(r-l)*i/140;return X(x)+','+Y(fn(x))}).join(' ')+'"/>';

const circle=(p,r,c)=>'<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="'+(r*38)+'" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="6 4"/>';
const len=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const cyan='#67e8f9', purple='#c4b5fd';
const point=(deg,r=4)=>[r*Math.cos(deg*Math.PI/180),r*Math.sin(deg*Math.PI/180)];
function draw(){
 const [t,u]=controls.map(el=>{el.parentElement.querySelector('output').textContent=el.value;return +el.value});
 let s='',read='';
 for(let i=-8;i<=8;i++)s+=line([i,-6],[i,6],'#26364b');
 for(let i=-5;i<=5;i++)s+=line([-9,i],[9,i],'#26364b');
 s+=line([-9,0],[9,0],'#94a3b8')+line([0,-6],[0,6],'#94a3b8');
 const A=[-2,0],B=[2,0],O=[0,0];


 if(mode==='lastBook'){
   const angle=(a,b,c)=>{
     const u=[a[0]-b[0],a[1]-b[1]],v=[c[0]-b[0],c[1]-b[1]];
     return Math.atan2(Math.abs(u[0]*v[1]-u[1]*v[0]),u[0]*v[0]+u[1]*v[1])*180/Math.PI;
   };
   const foot=([x,y],k,b)=>{const h=(x+k*(y-b))/(1+k*k);return [h,k*h+b];};
   const sortedLengths=tri=>tri.map((p,i)=>len(p,tri[(i+1)%3])).sort((a,b)=>a-b);
   const ratios=tri=>{const a=sortedLengths(tri);return a.map(x=>f(x/a[2])).join(' : ');};
   let fn,range,pts,edges,scale=1;
   switch(scenario){
     case '0:1':{
       fn=x=>-x*x+6*x-5;range=[-1,6];
       const a=[1,0],b=[5,0],c=[0,-5],m=[t,t-5];
       pts={A:a,B:b,C:c,M:m,H:[3,-2]};
       edges=[['B','C'],['A','C'],['A','M'],['A','H']];
       const current=angle(a,m,b);
       read='两直线夹角＝'+f(Math.min(current,180-current))+'° ｜ 2∠ACB＝'+f(2*angle(a,c,b))+'°';
       break;
     }
     case '0:2':{
       fn=x=>x*x+2*x-3;range=[-4.2,2.1];
       const a=[1,0],b=[-3,0],c=[0,-3],p=[t,fn(t)];
       pts={A:a,B:b,C:c,P:p,O};
       edges=[['A','P'],['A','C'],['C','O']];
       read='∠PAB＝'+f(angle(p,a,b))+'° ｜ 2∠ACO＝'+f(2*angle(a,c,O))+'°';
       break;
     }
     case '0:3':{
       fn=x=>x*x/2-1.5*x-2;range=[-2,5];
       const b=[4,0],c=[0,-2],d=[t,fn(t)],m=foot(d,.5,-2);
       pts={A:[-1,0],B:b,C:c,D:d,M:m};
       edges=[['B','C'],['C','D'],['D','M']];
       read='∠MCD＝'+f(angle(m,c,d))+'° ｜ ∠MDC＝'+f(angle(m,d,c))+'° ｜ 2∠ABC＝'+f(2*angle(pts.A,b,c))+'°';
       break;
     }
     case '1:1':{
       fn=x=>-x*x+6*x-5;range=[-.4,6];
       const a=[1,0],b=[4,3],d=[5,0],q=[t,t-5];
       pts={A:a,B:b,C:[0,-5],D:d,Q:q};
       edges=[['A','B'],['B','D'],['D','A'],['D','C'],['A','Q']];
       read='△ADQ 边长比 '+ratios([a,d,q])+' ｜ △ABD 边长比 '+ratios([a,b,d]);
       break;
     }
     case '1:2':{
       fn=x=>-x*x/8+x/4+3;range=[-13,13];scale=.38;
       const a=[-4,0],b=[6,0],c=[0,3],q=[t,fn(t)];
       pts={A:a,B:b,C:c,Q:q};
       edges=[['A','B'],['A','C'],['B','C'],['A','Q'],['B','Q']];
       read='△ABQ 边长比 '+ratios([a,b,q])+' ｜ △ABC 边长比 '+ratios([a,b,c]);
       break;
     }
     case '2:1':{
       fn=x=>-x*x+3*x+4;range=[-2,5];scale=.76;
       const p=[t,4-t],q=[t,fn(t)],c=[0,4];
       pts={A:[-1,0],B:[4,0],C:c,P:p,Q:q};
       edges=[['A','C'],['B','C'],['P','Q'],['Q','C']];
       read='CP / PQ＝'+f(len(c,p)/len(p,q))+' ｜ △PQC 面积＝'+f(t*len(p,q)/2);
       break;
     }
     case '2:2':{
       fn=x=>x*x/2+2.5*x+3;range=[-5,2.3];scale=.49;
       const p=[t,fn(t)],a=[0,3],q=[0,p[1]+t*t/(p[1]-3)];
       pts={A:a,B:[-4,1],C:[-3,0],P:p,Q:q,H:[0,p[1]]};
       edges=[['A','B'],['B','C'],['C','A'],['A','P'],['P','Q'],['Q','A'],['P','H']];
       read='AP / PQ＝'+f(len(a,p)/len(p,q))+' ｜ AC / BC＝3';
       break;
     }
     case '2:3':{
       fn=x=>x*x/2-2*x-6;range=[-2.5,6.5];scale=.58;
       const b=[6,0],e=[t,fn(t)],d=[2,e[1]-(6-t)*(2-t)/(-e[1])];
       pts={A:[-2,0],B:b,C:[0,-6],O,E:e,D:d};
       edges=[['A','C'],['C','O'],['O','A'],['B','E'],['E','D'],['B','D']];
       read='DE / BE＝'+f(len(d,e)/len(b,e))+' ｜ ∠BED＝'+f(angle(b,e,d))+'°';
       break;
     }
     case '2:4':{
       fn=x=>-x*x/4+1.5*x+4;range=[-2.5,8.5];scale=.7;
       const a=[-2,0],b=[8,0],c=[0,4],p=[t,fn(t)],d=foot(p,-.5,4);
       pts={A:a,B:b,C:c,O,P:p,D:d};
       edges=[['A','C'],['C','O'],['B','C'],['P','D'],['C','P']];
       read='PD＝'+f(len(p,d))+' ｜ tan ∠PCD＝'+f(Math.tan(angle(p,c,d)*Math.PI/180));
       break;
     }
   }
   const project=([x,y])=>[scale*x,scale*y];
   s+=curve(x=>scale*fn(x/scale),scale*range[0],scale*range[1],purple);
   for(const [a,b] of edges)s+=line(project(pts[a]),project(pts[b]),cyan);
   for(const [label,p] of Object.entries(pts))s+=mark(project(p),label);
 }else if(mode==='equalBook'){
   const angle=(a,b,c)=>{const u=a.map((x,i)=>x-b[i]),v=c.map((x,i)=>x-b[i]);return f(Math.atan2(Math.abs(u[0]*v[1]-u[1]*v[0]),u[0]*v[0]+u[1]*v[1])*180/Math.PI);};
   let pts,labels,segments,fn,left,right,center;
   if(scenario===1){fn=x=>x*x/2-x-4;left=-4;right=5;pts=[[4,0],[-2,0],[0,-4],[2,-4],[t,fn(t)]];labels=['A','B','C','C₁','P'];segments=[[0,1],[0,2],[0,3],[0,4]];read='∠CAC₁＝'+angle(pts[2],pts[0],pts[3])+'° ｜ ∠PAB＝'+angle(pts[4],pts[0],pts[1])+'°';}
   if(scenario===2){fn=x=>-x*x+2*x+3;left=-2.5;right=4;pts=[[-1,0],[3,0],[1,4],[1,0],[t,fn(t)]];labels=['A','B','D','E','F'];segments=[[0,3],[1,2],[3,4],[1,4],[2,4]];read='∠DBE＝'+angle(pts[2],pts[1],pts[3])+'° ｜ ∠AEF＝'+angle(pts[0],pts[3],pts[4])+'°';}
   if(scenario===3){fn=x=>2*x*x/3-4*x/3-2;left=-2;right=4;pts=[[3,0],[0,-2],[0,0],[t,fn(t)]];labels=['A','B','O','M'];segments=[[0,1],[1,2],[1,3]];read='∠ABO＝'+angle(pts[0],pts[1],pts[2])+'° ｜ ∠ABM＝'+angle(pts[0],pts[1],pts[3])+'°';}
   if(scenario===4){fn=x=>-(x+1)*(x-3)/3;left=-4;right=5;pts=[[-1,0],[3,0],[0,1],[1,t]];labels=['A','B','C','Q'];segments=[[0,1],[0,2],[3,1],[3,2]];center=[1,-1];read='∠BAC＝'+angle(pts[1],pts[0],pts[2])+'° ｜ ∠BQC＝'+angle(pts[1],pts[3],pts[2])+'°';}
   s+=curve(fn,left,right,purple);if(center)s+=circle(center,Math.sqrt(5),purple);
   segments.forEach(([a,b])=>s+=line(pts[a],pts[b],cyan));pts.forEach((point,i)=>s+=mark(point,labels[i]));
 }else if(mode==='specialBook'){
   if(scenario===1){
     const a=[-2,0],b=[3,0],p=[0,t];
     s+=poly([a,p,b],cyan)+mark(a,'A')+mark(b,'B')+mark(p,'P');
     read='两角之和＝'+f((Math.atan(t/2)+Math.atan(t/3))*180/Math.PI)+'°';
   }else if(scenario===2){
     const a=[1,0],b=[1,2],c=[0,2],p=[1-1.6*t,.8*t];
     s+=poly([O,a,b,c],purple)+poly([O,p,b],cyan)+line(O,b)+mark(a,'A')+mark(b,'B')+mark(c,'C')+mark(p,'折叠点');
     read='折叠点的投影＝('+p.map(f).join(', ')+')';
   }else if(scenario===3){
     const a=[-4,-2],b=[4,2],p=point(-t),c=p.map(x=>-x);
     s+=line(a,b,cyan)+line(c,p,purple)+mark(a,'A')+mark(b,'B')+mark(c,'C')+mark(p,'D')+mark(O,'O');
     read='tan ∠BOD＝'+f(Math.tan(Math.atan(.5)+t*Math.PI/180));
   }else if(scenario===4||scenario===5){
     const k=scenario===4?2:.5, m=scenario===4?[0,-1]:[2,1],j=Math.tan(Math.atan(k)-t*Math.PI/180);
     const drawLine=(slope,color)=>line([-5,m[1]+slope*(-5-m[0])],[5,m[1]+slope*(5-m[0])],color);
     s+=drawLine(k,purple)+drawLine(j,cyan)+mark(m,scenario===4?'B':'M');
     read='新斜率＝'+f(j)+' ｜ 旋转角＝'+f(t)+'°';
   }else{
     const a=[3,2],m=[1,4],h=[1,2],q=[0,t];
     s+=curve(x=>-.5*x*x+x+3.5,-3,5,purple)+circle(h,2,purple)+poly([q,a,m],cyan)+mark(a,'A')+mark(m,'M')+mark(h,'H')+mark(q,'Q');
     const dot=3+(2-t)*(4-t), cross=Math.abs(3*(4-t)-(2-t));
     read='∠AQM＝'+f(Math.atan2(cross,dot)*180/Math.PI)+'°';
   }
 }else if(mode==='book7'){
   let ps, labels, detail='', scale=1;
   const quad=(a,b,c,d)=>[a,b,c,d];
   switch(scenario){
     case '0:1': ps=[[1,1],[5,3],[t,0]];labels='ABC';break;
     case '0:2': {const p=t===1?[1,-1]:[3,3],d=[p[0],-(p[0]+1)*(p[0]-4)/2];ps=[[4,0],[0,2],p];labels='BCP';s+=curve(x=>-(x+1)*(x-4)/2,-2,5,purple)+line([p[0],0],d,purple,'5 4')+mark(d,'D');detail='D＝('+d.join(', ')+')';break;}
     case '1:1': ps=[[1,-2],[t,t-3],[t,t*t-2*t-3],[1,-4]];labels='EMNC';s+=curve(x=>x*x-2*x-3,-2,4.4,purple)+line([-2,-5],[5,2]);detail='EC＝2 ｜ MN＝'+f(Math.abs(t*t-3*t));break;
     case '1:2': {const a=[1,2],b=[5,3],c=[3,5],d=[[7,6],[-1,4],[3,0]][t-1];ps=[quad(a,b,d,c),quad(a,b,c,d),quad(a,c,b,d)][t-1];labels=['ABDC','ABCD','ACBD'][t-1];detail='D＝('+d.join(', ')+')';scale=.8;break;}
     case '1:3': {const a=[1,1],b=[3,2],c=[[4,0],[2,0],[-2,0]][t-1],d=[[0,3],[0,-1],[0,1]][t-1];ps=[quad(a,c,b,d),quad(a,b,c,d),quad(a,b,d,c)][t-1];labels=['ACBD','ABCD','ABDC'][t-1];detail='C＝('+c.join(', ')+') ｜ D＝('+d.join(', ')+')';break;}
     case '1:4': {const b=[-1,0],c=[0,-3],m=[2,2,1+Math.sqrt(7),1-Math.sqrt(7)][t-1],p=[m,t<3?-3:3],q=[[ -3,0],[1,0],[m+1,0],[m+1,0]][t-1];ps=[quad(b,p,c,q),quad(b,c,p,q),quad(b,c,q,p),quad(b,c,q,p)][t-1];labels=['BPCQ','BCPQ','BCQP','BCQP'][t-1];s+=curve(x=>x*x-2*x-3,-2,4,purple);detail='P＝('+p.map(f).join(', ')+') ｜ Q＝('+q.map(f).join(', ')+')';break;}
     case '2:1': {const a=[1,1],b=[4,2],c=[[4/3,0],[14/3,0],[2,0],[3,0]][t-1],d=[[13/3,1],[5/3,-1],[3,3],[2,3]][t-1];ps=[quad(a,b,d,c),quad(a,b,c,d),quad(a,c,b,d),quad(a,c,b,d)][t-1];labels=['ABDC','ABCD','ACBD','ACBD'][t-1];detail='D＝('+d.map(f).join(', ')+')';break;}
     case '2:2': {const b=[0,-3],c=[6,0],p=t===1?[-4,5]:[-10,32],q=t===1?[2,8]:[-16,29];ps=t===1?quad(b,c,q,p):quad(c,b,q,p);labels=t===1?'BCQP':'CBQP';scale=.15;s+=curve(x=>scale*((x/scale)**2/4-x/scale-3),-2,1.4,purple);detail='P＝('+p.join(', ')+') ｜ Q＝('+q.join(', ')+')';break;}
     case '3:1': {const a=[1,1],b=[5,4],c=[[1+2*Math.sqrt(6),0],[1-2*Math.sqrt(6),0],[2,0],[8,0],[39/8,0]][t-1],d=[[5+2*Math.sqrt(6),3],[5-2*Math.sqrt(6),3],[-2,-3],[4,-3],[9/8,5]][t-1];ps=t<3?quad(a,b,d,c):t<5?quad(a,b,c,d):quad(a,c,b,d);labels=t<3?'ABDC':t<5?'ABCD':'ACBD';scale=.72;detail='D＝('+d.map(f).join(', ')+')';break;}
     case '3:2': {const p=[t,4-2*t],d=[t,-2*t*t+2*t+4];ps=quad([.5,4.5],[.5,3],p,d);labels='MNPD';s+=curve(x=>-2*x*x+2*x+4,-1.4,2.4,purple)+line([0,4],[2,0]);detail='MN＝1.5 ｜ PD＝'+f(len(p,d))+' ｜ NP＝'+f(len(ps[1],p));break;}
   }
   const project=([x,y])=>[x*scale,y*scale];
   s+=poly(ps.map(project),cyan);ps.forEach((p,i)=>s+=mark(project(p),labels[i]));
   if(ps.length===4){s+=line(project(ps[0]),project(ps[2]),purple,'5 4')+line(project(ps[1]),project(ps[3]),purple,'5 4');}
   read=detail||ps.map((p,i)=>labels[i]+labels[(i+1)%ps.length]+'＝'+f(len(p,ps[(i+1)%ps.length]))).join(' ｜ ');
 }else if(mode==='isoBook'){
   let pts, labels, guides='';
   if(scenario===1){pts=[[1,1],[4,3],[t,0]];labels=['A','B','C'];}
   if(scenario===2){pts=[[-4,0],[0,-2],[-1,t]];labels=['A','E','P'];guides=curve(x=>-0.75*(x+4)*(x-2),-5,3,purple)+line([-1,-6],[-1,6],purple,'6 4');}
   if(scenario===3){pts=[[t,t*t-2*t-3],[0,-3],[t,t-3]];labels=['P','C','M'];guides=curve(x=>x*x-2*x-3,-2,4,purple)+line([0,-3],[3,0]);}
   if(scenario===4){const x=4-t;pts=[[x,t],[(4-t)/(1+t),4-(4-t)/(1+t)],[x,-x*x+3*x+4]];labels=['P','D','M'];guides=curve(x=>-x*x+3*x+4,-2,5,purple)+line([0,4],[4,0])+line([-1,0],pts[2]);}
   const scale=scenario===2||scenario===4?0.8:1, project=([x,y])=>[scale*x,scale*y];
   if(scenario===2)guides=curve(x=>scale*(-0.75*(x/scale+4)*(x/scale-2)),-4,2.5,purple)+line([-scale,-6],[-scale,6],purple,'6 4');
   if(scenario===4)guides=curve(x=>scale*(-((x/scale)**2)+3*x/scale+4),-1.6,4,purple)+line(project([0,4]),project([4,0]))+line(project([-1,0]),project(pts[2]));
   s+=guides+poly(pts.map(project),cyan);pts.forEach((p,i)=>s+=mark(project(p),labels[i]));
   read=[[0,1],[1,2],[2,0]].map(([a,b])=>labels[a]+labels[b]+'＝'+f(len(pts[a],pts[b]))).join(' ｜ ');
 }else if(mode==='iso'||mode==='right'){
   const P=[t,u];
   if(mode==='iso')s+=circle(A,4,purple)+circle(B,4,purple)+line([0,-6],[0,6],purple,'6 4');
   else s+=circle(O,2,purple)+line([-2,-6],[-2,6],purple,'6 4')+line([2,-6],[2,6],purple,'6 4');
   s+=poly([A,B,P],cyan)+mark(A,'A')+mark(B,'B')+mark(P,'P');
   read=mode==='iso'?'AB＝4 ｜ AP＝'+f(len(A,P))+' ｜ BP＝'+f(len(B,P)):'顶点 A、B、P 处的邻边点积依次为 '+[4*(t+2),4*(2-t),t*t+u*u-4].map(f).join('，');
 }else if(['para','rect','rhomb'].includes(mode)){
   let ps, labels=['A','B','C','D'];
   if(mode==='para'){
    const C=[t,u];
    const options=[[[t-4,u],A,B,C],[A,[t+4,u],C,B],[A,C,B,[-t,-u]]];
    const ordered=[[C,B,A,options[0][0]],[A,B,options[1][1],C],[A,C,B,options[2][3]]];
    ps=ordered[scenario-1];
    labels=[['C','B','A','D'],['A','B','D','C'],['A','C','B','D']][scenario-1];
   }else if(mode==='rect')ps=[[-3,-1],[1,-1],[1+t,u],[-3+t,u]];
   else ps=[A,[t,u],B,[-t,-u]];
   s+=poly(ps,cyan)+line(ps[0],ps[2],purple,'5 4')+line(ps[1],ps[3],purple,'5 4');
   ps.forEach((p,i)=>s+=mark(p,labels[i]));
   let mid=[(ps[0][0]+ps[2][0])/2,(ps[0][1]+ps[2][1])/2];s+=mark(mid,'M',purple);
   if(mode==='para'){let D=ps[labels.indexOf('D')];read='D＝('+f(D[0])+', '+f(D[1])+') ｜ 共同中点 M＝('+f(mid[0])+', '+f(mid[1])+')';}
   if(mode==='rect')read='两条对角线＝'+f(len(ps[0],ps[2]))+'、'+f(len(ps[1],ps[3]))+' ｜ '+(t===0?'矩形':'斜平行四边形');
   if(mode==='rhomb')read='对角线方向向量点积＝'+f(-8*t)+' ｜ '+(t===0?'菱形':'斜平行四边形');
 }else if(mode==='sim'||mode==='rotate'){
   const points=[[-2,-1],[1,-1],[-1,1.6]];
   const a=(mode==='rotate'?u:0)*Math.PI/180;
   const mapped=points.map(([x,y])=>[3+t*(x*Math.cos(a)-y*Math.sin(a)),t*(x*Math.sin(a)+y*Math.cos(a))]);
   s+=poly(points,cyan)+poly(mapped,purple);
   points.forEach((p,i)=>s+=mark(p,'ABC'[i])+mark(mapped[i],'ABC'[i]+'′',purple));
   read='三组对应边的长度比均为 '+f(t)+' ｜ 面积比＝'+f(t*t)+(mode==='rotate'?' ｜ 旋转 '+f(u)+'°':'');
 }else{
   const angles=mode==='special'?[0,t]:mode==='equal'?[-t,0,t]:[0,t,2*t];
   angles.forEach((a,i)=>{const P=point(a);s+=line(O,P,i===1?purple:cyan)+mark(P,['A','B','C'][i]);});
   s+=mark(O,'O');
   if(mode==='special'){const P=point(t);s+=line(P,[P[0],0],purple,'5 4')+mark([P[0],0],'H');read='角＝'+f(t)+'° ｜ 水平边 '+f(P[0])+' ｜ 竖直边 '+f(P[1])+' ｜ 正切 '+f(P[1]/P[0]);}
   if(mode==='equal')read='∠AOB＝∠BOC＝'+f(t)+'°';
   if(mode==='double')read='∠AOB＝∠BOC＝'+f(t)+'° ｜ ∠AOC＝'+f(2*t)+'°';
 }
 board.innerHTML=s;out.textContent=read;
}
controls.forEach(el=>el.addEventListener('input',draw));
document.querySelector('#reset').onclick=()=>{controls.forEach(el=>el.value=el.defaultValue);draw()};
draw();
