(function(){
  var lb=document.getElementById("lb"),lbi=lb.querySelector("img");
  lb.addEventListener("click",function(){lb.classList.remove("on")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")lb.classList.remove("on")});
  document.querySelectorAll(".pic").forEach(function(b){
    b.addEventListener("click",function(){var im=b.querySelector("img");lbi.src=im.src;lbi.alt=im.alt;lb.classList.add("on")});
  });

  var ctx,master,timer,next=0,bar=0,on=false,beat=60/84,btn=document.getElementById("btn");
  var CH=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
  var ML=[[[0,659.25,1.5],[2,783.99,1],[3,659.25,1]],[[0,523.25,1.5],[2,659.25,1],[3,587.33,1]],[[0,523.25,1.5],[2,698.46,1],[3,659.25,1]],[[0,587.33,2],[2,493.88,1],[3,587.33,1]]];
  function note(f,t,d,v,type){
    var o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type;o.frequency.value=f;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(v,t+0.03);
    g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+d+0.05);
  }
  
  function schedBar(t,i){
    var c=CH[i%4],k;
    for(k=0;k<8;k++){note(c[[0,1,2,1][k%4]]*2,t+k*beat/2,beat*1.2,0.05,"triangle");}
    c.forEach(function(f){note(f/2,t,beat*3.9,0.035,"sine");});
    ML[i%4].forEach(function(m){note(m[1],t+m[0]*beat,m[2]*beat,0.07,"sine");});
  }
  
  function tick(){while(next<ctx.currentTime+0.8){schedBar(next,bar);bar++;next+=beat*4;}}
  function start(){
    if(!ctx){
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC){document.getElementById("st").textContent="Audio is not supported in this browser.";return;}
      ctx=new AC();master=ctx.createGain();master.gain.value=0.9;master.connect(ctx.destination);
    }
    ctx.resume();next=ctx.currentTime+0.1;bar=0;
    tick();timer=setInterval(tick,250);on=true;
    btn.textContent="Pause music";btn.setAttribute("aria-pressed","true");
    document.getElementById("st").textContent="Playing";
  }
  
  function stop(){
    clearInterval(timer);on=false;
    if(ctx){ctx.suspend();}
    btn.textContent="Play music";btn.setAttribute("aria-pressed","false");
    document.getElementById("st").textContent="A soft original melody";
}
  btn.addEventListener("click",function(){on?stop():start();});
})();