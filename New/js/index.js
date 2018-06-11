/* a Pen by Diaco m.lotfollahi  : https://diacodesign.com */

var A = document.createElement('audio');
A.src = 'http://www.freesound.org/data/previews/117/117697_646701-lq.mp3'; A.volume=.5; 
var Lamp = document.getElementById("lampP"),svg=document.getElementById('idea');
for(var i=1;i<5;i++){
  var newLamp = Lamp.cloneNode(true);svg.appendChild(newLamp);
  TweenLite.set(newLamp,{x:i*-70,className:i>3?"eB":"mB"});
};
TweenLite.set(".sB,.eB",{transformOrigin:"50% 0px"})
var tl = new TimelineMax({paused:true,yoyo:true,onComplete:function(){
	TweenLite.to(".sB,.eB",0.3,{rotation:0,ease:Sine.easeIn,onComplete:AP});
	TweenLite.to(".sB .lamp,.eB .lamp",0.3,{fill:"rgba(255,255,255,0.15)"});
	TweenLite.to(".report",1,{text:{value:"Error #404 , New Ideas Not found !...<br> pls try again"},delay:0.3});
	D[0].enable();
}});
var T1 = TweenMax.fromTo(".sB",0.3,{rotation:null},{rotation:0,ease:Sine.easeIn})
var T2 = TweenMax.to(".eB",0.3,{rotation:0,ease:Sine.easeOut,immediateRender:true});
tl.add(T1).to(".sB .lamp",0.3,{fill:"rgba(255,255,255,0.15)",ease:Elastic.easeOut.config(1,0.5)},0)
.staggerTo(".mB .lamp",0.01,{fill:"white",repeat:1,yoyo:true},0.025)
.add(T2).to(".eB .lamp",0.3,{fill:"white",ease:Elastic.easeIn.config(1,0.5)},"-=0.3")
.add(AP,"-=0.35");
var D = Draggable.create(".sB",{
type:"rotation",bounds:{minRotation:-70},
onPress:function(){
  TweenLite.to("#T",0.3,{fill:"rgba(0,0,0,0)"});
  TweenLite.set(".sB .lamp",{fill:"white"});
},onDragEnd:PU});
function PU(){
	TweenLite.to(".report",0.5,{text:{value:"Searching..."}});
	var X=this.rotation; this.disable(); T1.vars.startAt.rotation=X; T2.vars.css.rotation=-X;
	tl.seek(0).invalidate().restart().repeat(R(3,15))
};
function AP(){ A.currentTime=0; A.play() };
function R(min,max){ return min+Math.floor(Math.random()*(max-min)) };

/* a Pen by Diaco m.lotfollahi  : https://diacodesign.com */