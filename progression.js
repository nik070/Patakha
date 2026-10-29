// Sequential missions are independent of the animation engine and survive reloads.
window.FestivalProgress = class {
  static missions = [
    {name:'First sparks',description:'Launch 10 fireworks in either mode',goal:10,reward:'Roman Candle',icon:'♜'},
    {name:'Star collector',description:'Hit 8 stars in challenge mode',goal:8,reward:'Double Burst',icon:'✹'},
    {name:'Keep the rhythm',description:'Reach a 3× combo in challenge mode',goal:3,reward:'Golden Willow',icon:'༄'},
    {name:'Festival champion',description:'Score 2,000 points in one challenge',goal:2000,reward:'Grand Finale',icon:'✷'}
  ];
  constructor(storage,onUpdate){this.storage=storage;this.onUpdate=onUpdate;this.stage=0;this.value=0;this.saved=true;try{const s=JSON.parse(storage.getItem('patakha-progress-v1'));if(s&&Number.isInteger(s.stage)&&s.stage>=0&&s.stage<=4){this.stage=s.stage;this.value=Math.max(0,Math.min(Number(s.value)||0,this.current?.goal||0));}}catch{} }
  get current(){return FestivalProgress.missions[this.stage];}
  isUnlocked(type){return Number.isInteger(type)&&type>=0&&type<4+this.stage;}
  record(event,data={}){if(!this.current)return;let next=this.value;if(this.stage===0&&event==='launch')next++;if(this.stage===1&&event==='hit')next++;if(this.stage===2&&event==='hit')next=Math.max(next,data.combo||0);if(this.stage===3&&event==='hit')next=Math.max(next,data.score||0);if(next===this.value)return;this.value=next;let unlocked=null;if(this.value>=this.current.goal){unlocked=this.stage+4;this.stage++;this.value=0;}try{this.storage.setItem('patakha-progress-v1',JSON.stringify({stage:this.stage,value:this.value}));this.saved=true;}catch{this.saved=false;}this.onUpdate?.(unlocked);}
};
