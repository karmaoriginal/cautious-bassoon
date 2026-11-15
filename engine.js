/* GameMind Evolution: deterministic world and fixed-step simulation. */
(function(root){
'use strict';
const W=18000, FLOOR=510, SIZE=3600, NAMES=['Pradera','Ruinas','Fábrica','Abismo','Núcleo'];
function rng(seed){let s=seed>>>0||1;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296)}
function world(seed){let r=rng(seed), coins=[], enemies=[], pickups=[], bosses=[]; for(let b=0;b<5;b++){let start=b*SIZE; for(let x=start+260;x<start+3100;x+=180){coins.push({x:x+Math.floor(r()*60),y:FLOOR-45-(r()<.25?50:0),taken:false});} for(let i=0;i<8;i++){let x=start+500+i*300+Math.floor(r()*100);enemies.push({x,base:x,y:FLOOR-30,type:i%5,dead:false,phase:r()*6});} pickups.push({x:start+950,y:FLOOR-38,type:['shield','magnet','high','life'][b%4],taken:false});bosses.push({x:start+3300,y:FLOOR-70,hp:6,max:6,dead:false,cool:0,phase:0});}return {seed,coins,enemies,pickups,bosses,bullets:Array.from({length:30},()=>({active:false,x:0,y:0,vx:0}))};}
function create(seed,opts={}){return {world:world(seed),x:80,y:FLOOR-46,vx:0,vy:0,w:32,h:46,ground:true,jumps:0,coyote:6,buffer:0,dash:0,dashCd:0,inv:0,lives:opts.lives||3,coins:0,score:0,time:0,checkpoint:0,biome:0,won:false,dead:false,powers:{shield:0,magnet:0,high:0},difficulty:opts.difficulty||'Normal',events:[],damage:0};}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function step(s,input){if(s.won||s.dead)return;s.events=[];s.time++;let p=s.powers;for(let k in p)if(p[k]>0)p[k]--; if(s.inv>0)s.inv--;if(s.dashCd>0)s.dashCd--;if(s.buffer>0)s.buffer--;if(s.coyote>0)s.coyote--;
 if(input.jumpPress)s.buffer=8;
 if(s.buffer>0&&(s.ground||s.coyote>0||s.jumps<2)){s.vy=-(p.high?15.5:13.2);s.jumps++;s.ground=false;s.coyote=0;s.buffer=0;s.events.push('jump')}
 if(input.dashPress&&s.dashCd<=0){s.dash=12;s.dashCd=95;s.events.push('dash')}
 let direction=(input.right?1:0)-(input.left?1:0);if(s.dash>0){s.vx=(direction||1)*9;s.dash--}else{s.vx+=(direction*4.4-s.vx)*.24}
 s.vy=Math.min(s.vy+.66,14);let oldBottom=s.y+s.h;s.x=Math.max(0,Math.min(W-32,s.x+s.vx));s.y+=s.vy;
 if(s.y+s.h>=FLOOR){s.y=FLOOR-s.h;s.vy=0;s.ground=true;s.jumps=0;s.coyote=6}else s.ground=false;
 let newBiome=Math.min(4,Math.floor(s.x/SIZE));if(newBiome>s.biome){s.biome=newBiome;s.checkpoint=newBiome*SIZE+80;s.lives=Math.max(s.lives,s.difficulty==='Difícil'?2:3);s.events.push('biome')}
 for(let c of s.world.coins){if(c.taken)continue;let dx=c.x-(s.x+16),dy=c.y-(s.y+23);if(Math.abs(dx)<(p.magnet?160:25)&&Math.abs(dy)<(p.magnet?130:35)){c.taken=true;s.coins++;s.score+=10;s.events.push('coin')}}
 for(let a of s.world.pickups){if(!a.taken&&overlap(s,{x:a.x-15,y:a.y-15,w:30,h:30})){a.taken=true;if(a.type==='life')s.lives=Math.min(5,s.lives+1);else p[a.type]=600;s.events.push('power')}}
 function hurt(){if(s.inv)return;if(p.shield){p.shield=0}else{s.lives--;s.damage++;}s.inv=300;s.vy=-7;s.events.push('hurt');if(s.lives<=0){s.dead=true;s.events.push('dead')}}
 for(let e of s.world.enemies){if(e.dead||Math.abs(e.base-s.x)>650)continue;let t=s.time/60+e.phase;e.x=e.base+Math.sin(t*(e.type===4?2:1))* (e.type===3?0:55);e.y=FLOOR-30-(e.type===1?Math.abs(Math.sin(t*2))*80:e.type===2?90+Math.sin(t)*30:0);if(e.type===3&&Math.abs(e.x-s.x)<500&&s.time%120===Math.floor(e.phase*10)){let shot=s.world.bullets.find(q=>!q.active);if(shot){shot.active=true;shot.x=e.x;shot.y=e.y+12;shot.vx=s.x<e.x?-3:3}}let box={x:e.x,y:e.y,w:30,h:30};if(overlap(s,box)){if((s.vy>0&&oldBottom<=e.y+15&&e.type!==4)||s.dash>0){e.dead=true;s.vy=-8;s.score+=50;s.events.push('hit')}else hurt()}}
 for(let q of s.world.bullets)if(q.active){q.x+=q.vx;if(Math.abs(q.x-s.x)>650)q.active=false;else if(overlap(s,{x:q.x,y:q.y,w:10,h:10})){q.active=false;hurt()}}
 for(let b of s.world.bosses){if(b.dead||Math.abs(b.x-s.x)>600)continue;if(!b.entered&&Math.abs(b.x-s.x)<200){b.entered=true;s.lives=Math.max(s.lives,s.difficulty==='Difícil'?2:3)}if(b.cool>0)b.cool--;b.phase= b.hp<=2?2:b.hp<=4?1:0;let box={x:b.x,y:b.y,w:65,h:70};if(overlap(s,box)||(s.dash>0&&Math.abs(s.x-b.x)<85)){if(!b.cool&&(s.dash>0||(s.vy>0&&oldBottom<=b.y+20))){b.hp--;b.cool=35;s.vy=-9;s.score+=100;s.events.push('hit');if(b.hp<=0){b.dead=true;s.score+=500;s.events.push('boss')}}else if(!b.cool&&s.time%(180-b.phase*35)<(15+b.phase*5))hurt()} // Bosses guard the exit; touching without attacking causes damage.
 if(!b.dead&&s.x>b.x+40)s.x=b.x+40;
 }
 // The final exit requires defeating all guardians.
 if(s.x>=W-80&&s.world.bosses.every(b=>b.dead)){s.won=true;s.events.push('win')}
}
function bot(s){let b=s.world.bosses.find(b=>!b.dead&&Math.abs(b.x-s.x)<160);let danger=s.world.enemies.some(e=>!e.dead&&e.x>s.x-10&&e.x-s.x<160&&e.y>FLOOR-110);return {right:!b||s.x<b.x+5,left:!!b&&s.x>b.x+20,jumpPress:!!b?s.time%24===0:danger&&s.ground,dashPress:(!!b||danger)&&s.dashCd<=0};}
// A small recurrent-free network maps local observations to action thresholds.
function observe(s){let b=s.world.bosses.find(b=>!b.dead&&b.x>s.x-40);let enemy=null;for(let e of s.world.enemies)if(!e.dead&&e.x>s.x&&(!enemy||e.x<enemy.x))enemy=e;return [1,Math.min(1,(enemy?enemy.x-s.x:500)/300),Math.min(1,(b?Math.abs(b.x-s.x):600)/300),s.ground?1:0,s.vy/14,s.dashCd?0:1];}
function policy(s,weights){let v=observe(s), sums=[0,0,0];for(let a=0;a<3;a++)for(let i=0;i<6;i++)sums[a]+=weights[a*6+i]*v[i];return {right:sums[0]>0,left:sums[0]<-.5,jumpPress:sums[1]>0&&s.time%16===0,dashPress:sums[2]>0&&s.dashCd===0};}
function fitness(s){return s.x+s.score*.2+(s.won?10000:0)}
const returnValue={W,FLOOR,SIZE,NAMES,world,create,step,bot,policy,fitness,rng};
if(typeof module!=='undefined'&&module.exports)module.exports=returnValue;else root.GameEngine=returnValue;
})(typeof window==='undefined'?globalThis:window);
