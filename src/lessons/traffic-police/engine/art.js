/* Canvas drawing kit for the traffic lesson (top-down city). Ported from the original lesson art.js. */
const A={};
const rr=(ctx,x,y,w,h,r)=>{ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()};
A.rr=rr;
A.CAR_COLORS=['#ff5a5f','#3a86ff','#ffb703','#21c48d','#8338ec','#ff6fb5','#fb8500','#f1f3f8','#2d3142','#00b4d8'];
const shade=(hex,p)=>{let c=hex.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');let n=parseInt(c,16),r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(p<0?v*(1+p):v+(255-v)*p)));return`rgb(${f(r)},${f(g)},${f(b)})`};
A.shade=shade;

/* top-down vehicle, facing +x. kind: car|taxi|bus|police|ambulance|van|suv */
A.car=(ctx,x,y,ang,col,kind='car',opt={})=>{
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);
  const L=kind==='bus'?96:kind==='van'||kind==='ambulance'?62:kind==='suv'?54:50, W=kind==='bus'?30:kind==='van'||kind==='ambulance'?27:25;
  if(opt.scale)ctx.scale(opt.scale,opt.scale);
  // shadow
  ctx.fillStyle='rgba(0,0,0,.22)';rr(ctx,-L/2+3,-W/2+4,L,W,8);ctx.fill();
  // wheels
  ctx.fillStyle='#1b1d2a';
  [[-L/2+9,-W/2-2],[L/2-15,-W/2-2],[-L/2+9,W/2-4],[L/2-15,W/2-4]].forEach(([a,b])=>{rr(ctx,a,b,10,6,2);ctx.fill()});
  // body
  const g=ctx.createLinearGradient(0,-W/2,0,W/2);g.addColorStop(0,shade(col,.25));g.addColorStop(.5,col);g.addColorStop(1,shade(col,-.18));
  ctx.fillStyle=g;rr(ctx,-L/2,-W/2,L,W,kind==='bus'?6:9);ctx.fill();
  ctx.strokeStyle=shade(col,-.35);ctx.lineWidth=1.5;ctx.stroke();
  if(kind==='bus'){
    ctx.fillStyle='#bfe3ff';rr(ctx,L/2-10,-W/2+3,7,W-6,2);ctx.fill();
    ctx.fillStyle=shade(col,.35);rr(ctx,-L/2+6,-W/2+5,L-20,W-10,4);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<5;i++){rr(ctx,-L/2+10+i*14,-3,9,6,2);ctx.fill()}
  }else{
    // windscreen & rear window
    ctx.fillStyle='#bfe3ff';
    ctx.beginPath();ctx.moveTo(L/2-12,-W/2+4);ctx.lineTo(L/2-20,-W/2+5);ctx.lineTo(L/2-20,W/2-5);ctx.lineTo(L/2-12,W/2-4);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(-L/2+7,-W/2+5);ctx.lineTo(-L/2+12,-W/2+6);ctx.lineTo(-L/2+12,W/2-6);ctx.lineTo(-L/2+7,W/2-5);ctx.closePath();ctx.fill();
    // roof
    ctx.fillStyle=kind==='taxi'?'#ffd23f':kind==='police'?'#fff':kind==='ambulance'?'#fff':shade(col,.12);
    rr(ctx,-L/2+13,-W/2+4,L-34,W-8,4);ctx.fill();
    if(kind==='taxi'){ctx.fillStyle='#222';rr(ctx,-4,-3,9,6,1);ctx.fill()}
    if(kind==='police'||kind==='ambulance'){
      const on=opt.flash?((Date.now()/150|0)%2):0;
      ctx.fillStyle=kind==='police'?(on?'#ff3b3b':'#5aa0ff'):'#ff3b3b';rr(ctx,-2,-W/2+5,5,(W-10)/2,1);ctx.fill();
      ctx.fillStyle=kind==='police'?(on?'#5aa0ff':'#ff3b3b'):(on?'#ffdddd':'#ff3b3b');rr(ctx,-2,0,5,(W-10)/2,1);ctx.fill();
      if(opt.flash){ctx.globalAlpha=.35;ctx.fillStyle=on?'#ff3b3b':'#3a86ff';ctx.beginPath();ctx.arc(0,0,26,0,7);ctx.fill();ctx.globalAlpha=1}
      if(kind==='ambulance'){ctx.fillStyle='#ff3b3b';ctx.fillRect(-L/2+16,-2,12,4);ctx.fillRect(-L/2+20,-6,4,12)}
    }
  }
  // lights
  ctx.fillStyle='#fff7b0';rr(ctx,L/2-3,-W/2+2,3,5,1);ctx.fill();rr(ctx,L/2-3,W/2-7,3,5,1);ctx.fill();
  ctx.fillStyle=opt.brake?'#ff2d2d':'#b3262b';rr(ctx,-L/2,-W/2+2,2.5,5,1);ctx.fill();rr(ctx,-L/2,W/2-7,2.5,5,1);ctx.fill();
  if(opt.brake){ctx.globalAlpha=.4;ctx.fillStyle='#ff2d2d';ctx.beginPath();ctx.arc(-L/2-2,-W/2+4,6,0,7);ctx.arc(-L/2-2,W/2-4,6,0,7);ctx.fill();ctx.globalAlpha=1}
  if(opt.headlights){ctx.globalAlpha=.18;ctx.fillStyle='#fff7b0';ctx.beginPath();ctx.moveTo(L/2,-W/2+4);ctx.lineTo(L/2+60,-W/2-12);ctx.lineTo(L/2+60,W/2+12);ctx.lineTo(L/2,W/2-4);ctx.fill();ctx.globalAlpha=1}
  ctx.restore();
  return {L,W};
};
A.carLen=k=>k==='bus'?96:k==='van'||k==='ambulance'?62:k==='suv'?54:50;

/* grass with texture */
A.grass=(ctx,w,h,seed=1)=>{
  ctx.fillStyle='#9fdc8f';ctx.fillRect(0,0,w,h);
  let s=seed;const rnd=()=>(s=(s*9301+49297)%233280)/233280;
  ctx.fillStyle='rgba(60,140,60,.12)';
  for(let i=0;i<w*h/900;i++){ctx.beginPath();ctx.arc(rnd()*w,rnd()*h,2+rnd()*5,0,7);ctx.fill()}
};
A.tree=(ctx,x,y,r=22,col='#3fae5a')=>{
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(x+5,y+6,r,r*.9,0,0,7);ctx.fill();
  ctx.fillStyle=shade(col,-.2);ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(x-r*.18,y-r*.18,r*.82,0,7);ctx.fill();
  ctx.fillStyle=shade(col,.25);ctx.beginPath();ctx.arc(x-r*.35,y-r*.38,r*.35,0,7);ctx.fill();
};
/* building roof (top-down) */
A.building=(ctx,x,y,w,h,col='#e9d8c4',opt={})=>{
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(x+8,y+8,w,h);
  ctx.fillStyle=col;ctx.fillRect(x,y,w,h);
  ctx.fillStyle=shade(col,-.12);ctx.fillRect(x+w*.12,y+h*.12,w*.76,h*.76);
  ctx.fillStyle=shade(col,.15);ctx.fillRect(x+w*.12,y+h*.12,w*.76,4);
  if(opt.ac!==false){ctx.fillStyle='#cfd6e6';rr(ctx,x+w*.2,y+h*.22,Math.min(26,w*.22),Math.min(18,h*.18),3);ctx.fill();ctx.fillStyle='#9aa4bd';ctx.beginPath();ctx.arc(x+w*.2+Math.min(13,w*.11),y+h*.22+Math.min(9,h*.09),5,0,7);ctx.fill()}
  if(opt.label){ctx.fillStyle='#fff';ctx.font='600 16px "Baloo 2"';ctx.textAlign='center';ctx.fillText(opt.label,x+w/2,y+h/2+6)}
};
/* straight road, horizontal; y = center; lanes each direction */
A.roadH=(ctx,x0,x1,y,lanes=1,lw=40,opt={})=>{
  const half=lanes*lw;
  ctx.fillStyle='#cfd4e0';ctx.fillRect(x0,y-half-12,x1-x0,half*2+24);// sidewalk
  ctx.fillStyle='#4b5063';ctx.fillRect(x0,y-half,x1-x0,half*2);
  ctx.strokeStyle='#ffd23f';ctx.lineWidth=3;ctx.setLineDash([]);
  if(!opt.oneway){ctx.beginPath();ctx.moveTo(x0,y-2);ctx.lineTo(x1,y-2);ctx.moveTo(x0,y+2);ctx.lineTo(x1,y+2);ctx.stroke()}
  ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=3;ctx.setLineDash([22,18]);
  for(let i=1;i<lanes;i++){[y-i*lw,y+i*lw].forEach(yy=>{ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x1,yy);ctx.stroke()})}
  ctx.setLineDash([]);
};
A.roadV=(ctx,y0,y1,x,lanes=1,lw=40)=>{
  const half=lanes*lw;
  ctx.fillStyle='#cfd4e0';ctx.fillRect(x-half-12,y0,half*2+24,y1-y0);
  ctx.fillStyle='#4b5063';ctx.fillRect(x-half,y0,half*2,y1-y0);
  ctx.strokeStyle='#ffd23f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-2,y0);ctx.lineTo(x-2,y1);ctx.moveTo(x+2,y0);ctx.lineTo(x+2,y1);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.75)';ctx.setLineDash([22,18]);
  for(let i=1;i<lanes;i++){[x-i*lw,x+i*lw].forEach(xx=>{ctx.beginPath();ctx.moveTo(xx,y0);ctx.lineTo(xx,y1);ctx.stroke()})}
  ctx.setLineDash([]);
};
/* zebra crossing */
A.zebra=function(ctx,x,y,w,h,vertical){ctx.fillStyle='rgba(255,255,255,.9)';if(vertical){for(let i=0;i<h;i+=16)ctx.fillRect(x,y+i,w,9)}else{for(let i=0;i<w;i+=16)ctx.fillRect(x+i,y,9,h)}};

/* traffic light (top-down post with 3-lamp head drawn flat for readability) state: 'red'|'yellow'|'green' */
A.light=(ctx,x,y,state,ang=0,s=1)=>{
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  ctx.fillStyle='rgba(0,0,0,.25)';rr(ctx,-12,-34,28,72,8);ctx.fill();
  ctx.fillStyle='#1f2233';rr(ctx,-14,-36,28,72,8);ctx.fill();
  const cols={red:'#ff3b3b',yellow:'#ffc93c',green:'#2fe08a'};
  ['red','yellow','green'].forEach((c,i)=>{
    const cy=-22+i*22, on=state===c;
    if(on){ctx.fillStyle=cols[c];ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(0,cy,15,0,7);ctx.fill();ctx.globalAlpha=1}
    ctx.fillStyle=on?cols[c]:'#3a3e55';ctx.beginPath();ctx.arc(0,cy,8.5,0,7);ctx.fill();
    if(on){ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.arc(-3,cy-3,3,0,7);ctx.fill()}
  });
  ctx.restore();
};
/* pole-mounted camera seen from top, pointing ang */
A.camera=(ctx,x,y,ang,opt={})=>{
  ctx.save();ctx.translate(x,y);
  if(opt.cone){const r=opt.cone;ctx.rotate(ang);const g=ctx.createRadialGradient(0,0,4,0,0,r);g.addColorStop(0,'rgba(58,134,255,.35)');g.addColorStop(1,'rgba(58,134,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,-(opt.fov||.5),(opt.fov||.5));ctx.closePath();ctx.fill();ctx.rotate(-ang)}
  ctx.fillStyle='#6b7088';ctx.beginPath();ctx.arc(0,0,6,0,7);ctx.fill();
  ctx.rotate(ang);
  ctx.fillStyle='#f4f6fb';rr(ctx,-6,-8,24,16,4);ctx.fill();ctx.strokeStyle='#6b7088';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#1d2b64';ctx.beginPath();ctx.arc(18,0,5,0,7);ctx.fill();
  ctx.fillStyle=opt.flash?'#fff':'#ff3b3b';ctx.beginPath();ctx.arc(-2,-4,2,0,7);ctx.fill();
  if(opt.flash){ctx.globalAlpha=opt.flash;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(20,0,40,0,7);ctx.fill();ctx.globalAlpha=1}
  ctx.restore();
};
/* person top-down */
A.person=(ctx,x,y,col='#ff6fb5',t=0,ang=0)=>{
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);
  const sw=Math.sin(t*10)*4;
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(2,3,9,7,0,0,7);ctx.fill();
  ctx.fillStyle='#2d3142';ctx.beginPath();ctx.ellipse(sw,-5,4,3,0,0,7);ctx.ellipse(-sw,5,4,3,0,0,7);ctx.fill();
  ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(0,0,6,9,0,0,7);ctx.fill();
  ctx.fillStyle='#5a3a22';ctx.beginPath();ctx.arc(0,0,5.5,0,7);ctx.fill();
  ctx.restore();
};
/* soft label bubble on canvas */
A.tag=(ctx,x,y,text,bg='#1d2b64',fg='#fff',size=16)=>{
  ctx.font=`600 ${size}px "Baloo 2", Nunito, sans-serif`;
  const w=ctx.measureText(text).width+20,h=size+14;
  ctx.fillStyle=bg;rr(ctx,x-w/2,y-h,w,h,h/2);ctx.fill();
  ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+6,y);ctx.lineTo(x,y+7);ctx.fill();
  ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y-h/2+1);ctx.textBaseline='alphabetic';
};
/* explosion-ish "crash" star */
A.crash=(ctx,x,y,s=1,t=0)=>{
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(t);
  ctx.fillStyle='#ffc93c';ctx.strokeStyle='#ff5a5f';ctx.lineWidth=4;
  ctx.beginPath();for(let i=0;i<16;i++){const r=i%2?14:30,a=i/16*Math.PI*2;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.stroke();
  ctx.restore();
};
A.ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
A.lerp=(a,b,t)=>a+(b-a)*t;

A.drone=(ctx,x,y,t,s=1)=>{
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle='rgba(0,0,0,.15)';ctx.beginPath();ctx.ellipse(18,30,26,10,0,0,7);ctx.fill();
  ctx.strokeStyle='#2d3142';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-18,-18);ctx.lineTo(18,18);ctx.moveTo(18,-18);ctx.lineTo(-18,18);ctx.stroke();
  [[-18,-18],[18,-18],[-18,18],[18,18]].forEach(([a,b])=>{ctx.fillStyle='rgba(180,200,255,.45)';ctx.beginPath();ctx.arc(a,b,13,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();const r=t*40;ctx.moveTo(a+Math.cos(r)*12,b+Math.sin(r)*12);ctx.lineTo(a-Math.cos(r)*12,b-Math.sin(r)*12);ctx.stroke()});
  ctx.fillStyle='#ffc93c';A.rr(ctx,-11,-11,22,22,6);ctx.fill();ctx.fillStyle='#1d2b64';ctx.beginPath();ctx.arc(0,0,5,0,7);ctx.fill();
  ctx.fillStyle=(t*4|0)%2?'#ff3b3b':'#3a86ff';ctx.beginPath();ctx.arc(0,-8,2.5,0,7);ctx.fill();
  ctx.restore();
};
A.robot=(ctx,x,y,ang,t)=>{
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);
  ctx.fillStyle='rgba(0,0,0,.2)';A.rr(ctx,-17,-13,38,30,8);ctx.fill();
  ctx.fillStyle='#1b1d2a';[[-14,-17],[6,-17],[-14,11],[6,11]].forEach(([a,b])=>{A.rr(ctx,a,b,11,6,2);ctx.fill()});
  ctx.fillStyle='#f4f6fb';A.rr(ctx,-18,-13,36,26,8);ctx.fill();ctx.strokeStyle='#3a86ff';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#3a86ff';ctx.beginPath();ctx.arc(0,0,8,0,7);ctx.fill();
  ctx.fillStyle='#1d2b64';A.rr(ctx,8,-5,10,10,3);ctx.fill();
  ctx.fillStyle=(t*3|0)%2?'#21c48d':'#fff';ctx.beginPath();ctx.arc(-10,0,3,0,7);ctx.fill();
  ctx.restore();
};


export default A
