// @ts-nocheck
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import './style.css';

function main() {
// Marquee
  var tech=["Java","Groovy","Grails","TypeScript","Next.js","React","Node.js","PostgreSQL","Drizzle","Docker","Redis","n8n","Tailwind","Linux","Git"];
  function fillTrack(el,list){var h=list.concat(list).map(function(t){return '<span>'+t+'</span>'}).join('');el.innerHTML=h;}
  var t1=document.getElementById('t1'),t2=document.getElementById('t2');
  fillTrack(t1,tech);fillTrack(t2,tech.slice().reverse());
  // Letreiro: linha de cima corre para a direita, de baixo para a esquerda
  (function(){var off=0,last=performance.now(),slow=matchMedia('(prefers-reduced-motion: reduce)').matches?.4:1;
    function step(now){var dt=Math.min(64,now-last);last=now;off+=dt*.045*slow;var w=t1.scrollWidth/2||1;var o=off%w;
      t1.style.transform='translateX('+(o-w)+'px)';t2.style.transform='translateX('+(-o)+'px)';requestAnimationFrame(step)}
    requestAnimationFrame(step)})();

  // Copy email
  document.getElementById('copy').addEventListener('click',function(){
    var b=this,t=document.getElementById('email').textContent;
    function done(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy email'},1600)}
    try{navigator.clipboard.writeText(t).then(done,function(){sel()})}catch(e){sel()}
    function sel(){var r=document.createRange();r.selectNodeContents(document.getElementById('email'));var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected — press Ctrl+C'}
  });

  // Tilt-in reveal (visible at rest, only straightens)
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
    document.querySelectorAll('.tilt').forEach(function(el){io.observe(el)});
  } else document.querySelectorAll('.tilt').forEach(function(el){el.classList.add('in')});

  // Rail highlight
  var rail=[].slice.call(document.querySelectorAll('.rail a'));
  function railUpdate(){
    var mid=innerHeight*.45,cur=null;
    rail.forEach(function(a){var s=document.getElementById(a.dataset.s);var r=s.getBoundingClientRect();if(r.top<mid)cur=a});
    rail.forEach(function(a){a.classList.toggle('on',a===cur)});
  }

  // Easter egg
  var realm=document.getElementById('realm'),clicks=0,buf='',realmOn=false;
  function openRealm(){realm.hidden=false;realmOn=true;document.getElementById('realmClose').focus()}
  function closeRealm(){realm.hidden=true;realmOn=false;document.getElementById('seal').focus()}
  document.getElementById('seal').addEventListener('click',function(){clicks++;if(clicks>=7){clicks=0;openRealm()}});
  document.getElementById('realmClose').addEventListener('click',closeRealm);
  addEventListener('keydown',function(e){
    if(realmOn&&e.key==='Escape'){closeRealm();return}
    if(e.key&&e.key.length===1){buf=(buf+e.key.toLowerCase()).slice(-7);if(buf==='xianxia')openRealm()}
  });

  // ---------- Three.js scene ----------
  var hudbar=document.getElementById('hudbar'),hudtxt=document.getElementById('hudtxt');
  function progress(){var max=document.documentElement.scrollHeight-innerHeight;return max>0?Math.min(1,Math.max(0,scrollY/max)):0}

  

  var canvas=document.getElementById('scene');
  var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.setClearColor(0x000000,0);
  var scene=new THREE.Scene();
  var cam=new THREE.PerspectiveCamera(55,1,.1,400);
  var narrow=innerWidth<640;
  // Twilight sky as the scene background (survives the bloom pass)
  scene.background=(function(){var c=document.createElement('canvas');c.width=4;c.height=512;var x=c.getContext('2d');var g=x.createLinearGradient(0,0,0,512);
    g.addColorStop(0,'#0A0826');g.addColorStop(.28,'#1C1556');g.addColorStop(.48,'#3E2F8C');g.addColorStop(.6,'#6A54B8');g.addColorStop(.68,'#9C78C8');g.addColorStop(.74,'#B98BC9');g.addColorStop(.8,'#4E3790');g.addColorStop(1,'#120E33');
    x.fillStyle=g;x.fillRect(0,0,4,512);var t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
  scene.fog=new THREE.Fog(0x3E2F8C,60,190);
  var C={violet:new THREE.Color(0x9D8CFF),pink:new THREE.Color(0xFF7AC6),cyan:new THREE.Color(0x5CE1FF),gold:new THREE.Color(0xFFC86B),white:new THREE.Color(0xFFF1FB)};
  scene.add(new THREE.AmbientLight(0xbfb0ff,1.2));
  var key=new THREE.PointLight(0xFF7AC6,1.6,80,0);key.position.set(8,10,12);scene.add(key);
  var fill=new THREE.PointLight(0x5CE1FF,1.4,80,0);fill.position.set(-10,4,6);scene.add(fill);
  var rnd=(function(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}})(7);

  // Glowing particle terrain (rolling hills of light)
  var NX=narrow?110:180,NZ=narrow?120:200,SX=1.1,SZ=1.25;
  var tg=new THREE.BufferGeometry(),tp=new Float32Array(NX*NZ*3),tc=new Float32Array(NX*NZ*3),base=new Float32Array(NX*NZ*2);
  var tmp=new THREE.Color();
  for(var iz=0,n=0;iz<NZ;iz++)for(var ix=0;ix<NX;ix++,n++){
    var x=(ix-NX/2)*SX+(rnd()-.5)*.5, z=10-iz*SZ+(rnd()-.5)*.5;
    base[n*2]=x;base[n*2+1]=z;tp[n*3]=x;tp[n*3+2]=z;
    var u=ix/NX,v=iz/NZ;
    if(u<.5)tmp.copy(C.cyan).lerp(C.violet,u*2);else tmp.copy(C.violet).lerp(C.pink,(u-.5)*2);
    tmp.lerp(C.gold,Math.max(0,Math.sin(v*9+u*3))*.35);
    var b=.55+rnd()*.6;tc[n*3]=tmp.r*b;tc[n*3+1]=tmp.g*b;tc[n*3+2]=tmp.b*b;
  }
  tg.setAttribute('position',new THREE.BufferAttribute(tp,3));tg.setAttribute('color',new THREE.BufferAttribute(tc,3));
  var dot=(function(){var c=document.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d');var g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
  var terrain=new THREE.Points(tg,new THREE.PointsMaterial({size:.32,map:dot,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.95}));
  scene.add(terrain);
  function hill(x,z,t){return Math.sin(x*.12+t*.4)*1.6+Math.cos(z*.09-t*.3)*1.9+Math.sin((x+z)*.05+t*.2)*2.2-7}

  // Light ribbons
  var ribbons=[];
  [[C.white,0,.42],[C.pink,2.2,.32],[C.cyan,-1.6,.28]].forEach(function(r,ri){
    var N=1400,g=new THREE.BufferGeometry(),pos=new Float32Array(N*3),off=new Float32Array(N);
    for(var i=0;i<N;i++){off[i]=rnd()}
    g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    var m=new THREE.Points(g,new THREE.PointsMaterial({size:r[2],map:dot,color:r[0],transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.9}));
    scene.add(m);ribbons.push({g:g,pos:pos,off:off,y:r[1],N:N,ri:ri});
  });

  // Floating petals / sparks
  var SP=narrow?500:1000,sg=new THREE.BufferGeometry(),spos=new Float32Array(SP*3),scol=new Float32Array(SP*3);
  var pal=[C.pink,C.cyan,C.gold,C.violet,C.white];
  for(var i=0;i<SP;i++){spos[i*3]=(rnd()-.5)*120;spos[i*3+1]=-6+rnd()*26;spos[i*3+2]=14-rnd()*240;var c=pal[i%5];scol[i*3]=c.r;scol[i*3+1]=c.g;scol[i*3+2]=c.b}
  sg.setAttribute('position',new THREE.BufferAttribute(spos,3));sg.setAttribute('color',new THREE.BufferAttribute(scol,3));
  var sparks=new THREE.Points(sg,new THREE.PointsMaterial({size:.45,map:dot,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.85}));scene.add(sparks);

  // Core cube { }
  var core=new THREE.Group();scene.add(core);
  var boxG=new THREE.BoxGeometry(3.4,3.4,3.4);
  var faceTex=(function(){var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d');var g=x.createLinearGradient(0,0,256,256);g.addColorStop(0,'#2A1F6B');g.addColorStop(1,'#5B2A7A');x.fillStyle=g;x.fillRect(0,0,256,256);x.fillStyle='#FFF1FB';x.font='300 92px "JetBrains Mono", monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('{ }',128,134);var tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx})();
  var plain=new THREE.MeshStandardMaterial({color:0x2A1F6B,roughness:.25,metalness:.6,emissive:0x1a1050,emissiveIntensity:.25});
  var front=new THREE.MeshStandardMaterial({map:faceTex,emissive:0xffffff,emissiveMap:faceTex,emissiveIntensity:.22,roughness:.3,metalness:.3});
  core.add(new THREE.Mesh(boxG,[plain,plain,plain,plain,front,plain]));
  var edgeM=new THREE.LineBasicMaterial({color:0xFFB8E8});
  core.add(new THREE.LineSegments(new THREE.EdgesGeometry(boxG),edgeM));
  core.position.set(narrow?0:9,6.5,-8);

  // Orbit rings
  function ring(r,col,op){var g=new THREE.RingGeometry(r,r+.05,160);var m=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});var mesh=new THREE.Mesh(g,m);mesh.rotation.x=Math.PI/2.3;mesh.position.copy(core.position);scene.add(mesh);return mesh}
  var r1=ring(6.5,0x5CE1FF,.7),r2=ring(8.6,0xFF7AC6,.5);

  // Orbiting tech labels
  function label(text,col){var c=document.createElement('canvas');c.width=512;c.height=128;var x=c.getContext('2d');x.fillStyle='rgba(22,18,63,.75)';x.strokeStyle=col;x.lineWidth=3;x.beginPath();if(x.roundRect)x.roundRect(4,24,504,80,40);else x.rect(4,24,504,80);x.fill();x.stroke();x.fillStyle='#FFF1FB';x.font='500 38px "JetBrains Mono", monospace';x.textAlign='center';x.textBaseline='middle';x.fillText(text,256,66);var lt=new THREE.CanvasTexture(c);lt.colorSpace=THREE.SRGBColorSpace;var s=new THREE.Sprite(new THREE.SpriteMaterial({map:lt,transparent:true,depthWrite:false}));s.scale.set(3.6,.9,1);scene.add(s);return s}
  var orbit=[["Java · Grails","#5CE1FF"],["Next.js · TS","#FF7AC6"],["PostgreSQL","#FFC86B"],["n8n + AI","#9D8CFF"],["Docker","#5CE1FF"]].map(function(t,i){return {s:label(t[0],t[1]),a:i/5*Math.PI*2}});

  // Post-processing bloom
  var composer=null,bloom=null;
  {
    composer=new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene,cam));
    bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.85,.5,.62);
    composer.addPass(bloom);
    
  }

  function size(){var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();if(composer){composer.setSize(w,h)}}
  addEventListener('resize',size);size();

  var mx=0,my=0,tx=0,ty=0,sp=0;
  addEventListener('pointermove',function(e){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)},{passive:true});
  addEventListener('scroll',railUpdate,{passive:true});railUpdate();

  var clock=new THREE.Clock(),frameN=0;
  function frame(){
    var t=clock.getElapsedTime()*(reduce?.4:1);
    var p=progress();sp+=(p-sp)*(reduce?1:.07);
    mx+=(tx-mx)*.05;my+=(ty-my)*.05;
    // terrain waves (update every frame on desktop, every other on phones)
    if(!narrow||(frameN++%2===0)){
      for(var n=0,L=NX*NZ;n<L;n++){tp[n*3+1]=hill(base[n*2],base[n*2+1],t)}
      tg.attributes.position.needsUpdate=true;
    }
    // ribbons: glowing flowing bands
    ribbons.forEach(function(r){
      for(var i=0;i<r.N;i++){var f=(r.off[i]+t*.03*(1+r.ri*.3))%1;var z=14-f*240;var x=Math.sin(z*.045+r.ri*1.7+t*.2)*18+(r.off[(i*7)%r.N]-.5)*2.2;var y=hill(x,z,t)+3.2+r.y*.4+Math.sin(z*.08+r.ri)*1.5+(r.off[(i*13)%r.N]-.5)*.9;r.pos[i*3]=x;r.pos[i*3+1]=y;r.pos[i*3+2]=z}
      r.g.attributes.position.needsUpdate=true;
    });
    sparks.rotation.y=Math.sin(t*.05)*.05;
    for(var i=0;i<SP;i+=1){spos[i*3+1]+=Math.sin(t*.6+i)*.004}
    sg.attributes.position.needsUpdate=true;
    // camera: hover by the cube, then glide over the hills
    var dive=Math.max(0,(sp-.06)/.94);
    var camZ=(narrow?22:18)-dive*200;
    var camY=4.5+Math.sin(dive*Math.PI*2)*1.6;
    var camX=Math.sin(dive*Math.PI*2.5)*4;
    cam.position.set(camX+mx*2.4,camY-my*1.6,camZ);
    cam.lookAt(camX*.6+(dive<.05?core.position.x*.4:0),1.2,camZ-24);
    core.rotation.y=t*.3+mx*1.2+sp*6;core.rotation.x=-.35+my*.6+sp*2;
    core.position.y=6.5+Math.sin(t*.8)*.35;
    r1.rotation.z=t*.06;r2.rotation.z=-t*.04;
    orbit.forEach(function(o){var a=o.a+t*.2;o.s.position.set(core.position.x+Math.cos(a)*6,core.position.y+1.5+Math.sin(a*2)*1.1,core.position.z+Math.sin(a)*6*.5)});
    // easter egg tint: everything warms toward gold
    var target=realmOn?C.gold:new THREE.Color(0xFFB8E8);edgeM.color.lerp(target,.06);
    if(bloom)bloom.strength+=((realmOn?1.5:.9)-bloom.strength)*.05;
    if(composer)composer.render();else renderer.render(scene,cam);
    var pct=Math.round(sp*100);hudbar.style.width=pct+'%';hudtxt.textContent=String(pct).padStart(3,'0')+' / 100';
    requestAnimationFrame(frame);
  }
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){faceTex.needsUpdate=true})}
  requestAnimationFrame(frame);
}

main();
