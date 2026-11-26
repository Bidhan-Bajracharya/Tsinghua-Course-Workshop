/* Crossroads simulator (title, red-light experiment, traffic-brain race). Ported from the original lesson. */
import A from './art'
import { makeCanvas, Loop, sfx } from './core'

export function makeIntersection(canvas,W,H,o={}){
  const ctx=makeCanvas(canvas,W,H);
  const cx=o.cx||W/2, cy=o.cy||H/2, LW=40, HALF=LW, BOX=HALF+6;
  const S={
    t:0, cars:[], crashes:[], flashes:[],
    violate:o.violate||0, camera:!!o.camera, mode:o.mode||'fixed',
    rate:o.rate||{E:.5,W:.5,N:.5,S:.5}, // cars per second per approach
    phase:0, phaseT:0,
    stats:{passed:0,runners:0,crashes:0,tickets:0,waitSum:0,waitN:0},
    night:!!o.night, id:0
  };
  // approaches: dir vector, lane offset, axis
  const AP={
    E:{dx:1,dy:0,ax:'EW',x0:-70,y0:cy+LW/2,stop:cx-BOX-4,ang:0},
    W:{dx:-1,dy:0,ax:'EW',x0:W+70,y0:cy-LW/2,stop:cx+BOX+4,ang:Math.PI},
    S:{dx:0,dy:1,ax:'NS',x0:cx-LW/2,y0:-70,stop:cy-BOX-4,ang:Math.PI/2},
    N:{dx:0,dy:-1,ax:'NS',x0:cx+LW/2,y0:H+70,stop:cy+BOX+4,ang:-Math.PI/2},
  };
  // phases: [axisGreen, state] ; EW/NS lights
  const PH=[
    {EW:'green',NS:'red',dur:6,kind:'g',ax:'EW'},
    {EW:'yellow',NS:'red',dur:2},
    {EW:'red',NS:'red',dur:1},
    {EW:'red',NS:'green',dur:6,kind:'g',ax:'NS'},
    {EW:'red',NS:'yellow',dur:2},
    {EW:'red',NS:'red',dur:1},
  ];
  const lightFor=ax=>PH[S.phase][ax];
  const spawnAcc={E:Math.random(),W:Math.random(),N:Math.random(),S:Math.random()};
  const kinds=['car','car','car','car','taxi','suv','van','bus'];

  function along(c){ // distance travelled along approach axis
    const a=AP[c.ap]; return a.dx? (c.x-a.x0)*a.dx : (c.y-a.y0)*a.dy;
  }
  function stopDist(c){const a=AP[c.ap];return a.dx?(a.stop-a.x0)*a.dx:(a.stop-a.y0)*a.dy}
  function spawn(ap){
    const a=AP[ap];
    const same=S.cars.filter(c=>c.ap===ap&&!c.dead);
    const last=same.reduce((m,c)=>Math.min(m,along(c)),1e9);
    if(last<70) return false;
    const kind=kinds[Math.random()*kinds.length|0];
    const effViol=S.camera?S.violate*.3:S.violate;
    const c={id:++S.id,ap,kind,x:a.x0,y:a.y0,ang:a.ang,v:70+Math.random()*25,vmax:80+Math.random()*30,
      col:kind==='bus'?'#ffb703':A.CAR_COLORS[Math.random()*A.CAR_COLORS.length|0],
      rude:Math.random()<effViol,len:A.carLen(kind),wait:0,crossed:false,ran:false,dead:false};
    if(c.rude){c.vmax+=25}
    S.cars.push(c); return true;
  }
  function phaseLogic(dt){
    S.phaseT+=dt;
    const p=PH[S.phase];
    let dur=p.dur;
    if(S.mode==='adaptive'&&p.kind==='g'){
      const q=queues(); const mine=p.ax==='EW'?q.E+q.W:q.N+q.S, other=p.ax==='EW'?q.N+q.S:q.E+q.W;
      // keep green while my side busy and other side small; switch quickly if mine is empty
      const approachingMine=S.cars.filter(c=>!c.dead&&!c.crossed&&AP[c.ap].ax===p.ax&&stopDist(c)-along(c)<160).length;
      if(S.phaseT<2.5) dur=99;
      else if(other===0 && S.phaseT<14) dur=99;
      else if(approachingMine===0) dur=0;
      else if(other<=1 && S.phaseT<10) dur=99;
      else if(other>=3 && S.phaseT>=4) dur=0;
      else dur=Math.min(12,6+mine*.6);
    }
    if(S.phaseT>=dur){S.phase=(S.phase+1)%PH.length;S.phaseT=0}
  }
  function queues(){
    const q={E:0,W:0,N:0,S:0};
    S.cars.forEach(c=>{if(!c.dead&&!c.crossed&&c.v<8)q[c.ap]++});return q;
  }
  function step(dt){
    S.t+=dt;
    phaseLogic(dt);
    // spawning
    for(const ap in AP){spawnAcc[ap]+=dt*S.rate[ap]*(0.8+Math.random()*.4); if(spawnAcc[ap]>=1){ if(spawn(ap)) spawnAcc[ap]-=1; else spawnAcc[ap]=0.9 }}
    // per car movement
    const byAp={E:[],W:[],N:[],S:[]};
    S.cars.forEach(c=>{if(!c.dead)byAp[c.ap].push(c)});
    for(const ap in byAp){
      const list=byAp[ap].sort((a,b)=>along(b)-along(a)); // leader first
      list.forEach((c,i)=>{
        if(c.crash){c.v=0;return}
        const a=AP[c.ap], s=along(c), front=s+c.len/2, sd=stopDist(c);
        let target=c.vmax;
        // leader gap
        if(i>0){const L=list[i-1];const gap=(along(L)-L.len/2)-front;if(gap<14)target=0;else if(gap<60)target=Math.min(target,(gap-14)*2.2)}
        // light
        const st=lightFor(a.ax);
        if(!c.crossed){
          const dist=sd-front;
          if(st!=='green' && dist>-2){
            const canStop = dist>c.v*c.v/(2*260)-4;
            if(st==='yellow' && !canStop){/* go through */}
            else if(!c.rude){ if(dist<4) target=0; else if(dist<130) target=Math.min(target,dist*1.3); }
          }
          if(front>sd+2){c.crossed=true; if(st==='red'){c.ran=true;S.stats.runners++; if(S.camera){S.stats.tickets++;S.flashes.push({x:c.x,y:c.y,t:0,id:c.id,plate:plate(c)});sfx('snap')} else sfx('bad');}}
        }
        // accelerate/brake
        const acc=target>c.v?120:-300;
        c.v=Math.max(0,Math.min(target>c.v?Math.min(target,c.v+acc*dt):Math.max(target,c.v+acc*dt),c.vmax));
        if(c.v<8&&!c.crossed){c.wait+=dt}
        c.brake=target<c.v-5||c.v<2;
        c.x+=a.dx*c.v*dt; c.y+=a.dy*c.v*dt;
        if(c.x<-120||c.x>W+120||c.y<-120||c.y>H+120){c.dead=true;S.stats.passed++;S.stats.waitSum+=c.wait;S.stats.waitN++}
      });
    }
    // collisions inside box
    const inBox=S.cars.filter(c=>!c.dead&&!c.crash&&Math.abs(c.x-cx)<BOX+30&&Math.abs(c.y-cy)<BOX+30);
    for(let i=0;i<inBox.length;i++)for(let j=i+1;j<inBox.length;j++){
      const p=inBox[i],q=inBox[j];if(AP[p.ap].ax===AP[q.ap].ax)continue;
      if(Math.abs(p.x-q.x)<(AP[p.ap].dx?p.len/2+12:q.len/2+12)&&Math.abs(p.y-q.y)<(AP[p.ap].dy?p.len/2+12:q.len/2+12)){
        p.crash=q.crash=true;p.v=q.v=0;S.stats.crashes++;S.crashes.push({x:(p.x+q.x)/2,y:(p.y+q.y)/2,t:0,cars:[p,q]});sfx('bad');
      }
    }
    S.crashes.forEach(k=>{k.t+=dt;if(k.t>2.6){k.cars.forEach(c=>{c.dead=true});}});
    S.crashes=S.crashes.filter(k=>k.t<=2.6);
    S.flashes.forEach(f=>{f.t+=dt;const c=S.cars.find(c=>c.id===f.id);if(c){f.x=c.x;f.y=c.y}});
    S.flashes=S.flashes.filter(f=>f.t<2);
    S.cars=S.cars.filter(c=>!c.dead);
  }
  const plate=c=>{const L='ABCDEFGHJKLMNPRSTUVWXYZ';return L[c.id*7%23]+L[c.id*13%23]+'·'+String(1000+c.id*37%9000).slice(-4)};

  // ------- static background (pre-rendered) -------
  const bg=document.createElement('canvas');bg.width=W*2;bg.height=H*2;const b=bg.getContext('2d');b.scale(2,2);
  function drawBg(){
    A.grass(b,W,H,7);
    // buildings in corners
    const blocks=[[0,0,cx-HALF-14,cy-HALF-14],[cx+HALF+14,0,W,cy-HALF-14],[0,cy+HALF+14,cx-HALF-14,H],[cx+HALF+14,cy+HALF+14,W,H]];
    const pal=['#f6c9a8','#c7d7f5','#f8e3a3','#d4c4f1','#bfe8d4','#f5c4d6'];
    let k=0;
    blocks.forEach(([x0,y0,x1,y1],bi)=>{
      const pad=28;const bw=x1-x0-pad*2,bh=y1-y0-pad*2; if(bw<60||bh<60)return;
      const n=Math.max(1,Math.floor(bw/200));
      for(let i=0;i<n;i++){const w=bw/n-20;A.building(b,x0+pad+i*(bw/n),y0+pad+(bi<2?0:20),w,Math.min(bh-20,150),pal[k++%pal.length])}
      // trees along edge
      for(let tx=x0+24;tx<x1-10;tx+=70){const ty=bi<2?y1-16:y0+16;A.tree(b,tx,ty,14,'#43b05c')}
    });
    A.roadH(b,0,W,cy,1,LW); A.roadV(b,0,H,cx,1,LW);
    // box
    b.fillStyle='#4b5063';b.fillRect(cx-HALF-12,cy-HALF-12,HALF*2+24,HALF*2+24);
    // zebras
    A.zebra(b,cx-HALF,cy-HALF-40,HALF*2,26,false);A.zebra(b,cx-HALF,cy+HALF+14,HALF*2,26,false);
    A.zebra(b,cx-HALF-40,cy-HALF,26,HALF*2,true);A.zebra(b,cx+HALF+14,cy-HALF,26,HALF*2,true);
    // stop lines
    b.fillStyle='#fff';
    b.fillRect(AP.E.stop-4,cy,5,LW);b.fillRect(AP.W.stop,cy-LW,5,LW);
    b.fillRect(cx-LW,AP.S.stop-4,LW,5);b.fillRect(cx,AP.N.stop,LW,5);
  }
  drawBg();

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.drawImage(bg,0,0,W,H);
    // cars
    S.cars.forEach(c=>{
      A.car(ctx,c.x,c.y,c.ang,c.col,c.kind,{brake:c.brake&&!c.crossed,headlights:S.night});
      if(c.ran && o.showRunners!==false){ctx.strokeStyle='#ff3b3b';ctx.lineWidth=3;ctx.setLineDash([6,4]);ctx.beginPath();ctx.arc(c.x,c.y,c.len/2+10,0,7);ctx.stroke();ctx.setLineDash([])}
    });
    // lights at the 4 corners (facing approaching traffic)
    const ls=1;
    A.light(ctx,cx-HALF-30,cy+HALF+48,lightFor('EW'),0,ls);
    A.light(ctx,cx+HALF+30,cy-HALF-48,lightFor('EW'),0,ls);
    A.light(ctx,cx-HALF-48,cy-HALF-30,lightFor('NS'),0,ls);
    A.light(ctx,cx+HALF+48,cy+HALF+30,lightFor('NS'),0,ls);
    if(S.camera){
      const fl=S.flashes.length?Math.max(0,1-S.flashes[S.flashes.length-1].t*3):0;
      A.camera(ctx,cx-HALF-80,cy+HALF+80,-Math.PI/4,{cone:150,fov:.55,flash:fl*.7});
      A.camera(ctx,cx+HALF+80,cy-HALF-80,Math.PI*3/4,{cone:150,fov:.55,flash:fl*.7});
      A.camera(ctx,cx-HALF-80,cy-HALF-80,Math.PI/4,{cone:150,fov:.55,flash:fl*.7});
      A.camera(ctx,cx+HALF+80,cy+HALF+80,-Math.PI*3/4,{cone:150,fov:.55,flash:fl*.7});
    }
    S.flashes.forEach(f=>{
      if(f.t<.25){ctx.globalAlpha=1-f.t*4;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(f.x,f.y,60,0,7);ctx.fill();ctx.globalAlpha=1}
      // targeting box
      ctx.strokeStyle='#3a86ff';ctx.lineWidth=3;const s=34+Math.max(0,.3-f.t)*60;
      ctx.strokeRect(f.x-s,f.y-s,s*2,s*2);
      A.tag(ctx,f.x,f.y-s-6,'📸 '+f.plate,'#3a86ff');
    });
    S.crashes.forEach(k=>{A.crash(ctx,k.x,k.y,1+Math.sin(k.t*12)*.08,k.t);if(k.t>.2)A.tag(ctx,k.x,k.y-36,'CRASH!','#ff3b3b')});
    if(S.night){ctx.fillStyle='rgba(10,16,50,.55)';ctx.fillRect(0,0,W,H)}
    if(o.onDraw)o.onDraw(ctx,S);
  }
  const loop=Loop((dt)=>{step(dt*(o.speed||1.6));draw();o.onTick&&o.onTick(S)});
  return {
    S, start(){loop.start()}, stop(){loop.stop()},
    reset(){S.cars=[];S.crashes=[];S.flashes=[];S.stats={passed:0,runners:0,crashes:0,tickets:0,waitSum:0,waitN:0};S.phase=0;S.phaseT=0;S.t=0;draw()},
    queues, draw, lightFor,
    warm(sec){for(let i=0;i<sec*30;i++)step(1/30);draw()}
  };
}
