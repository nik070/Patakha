window.FestivalProgress = class {
  static missions = [
    {name:'First sparks',description:'Launch 10 fireworks in either mode',goal:10,reward:'Roman Candle',icon:'♜',kind:'launch',hint:'Free play counts too. Tap the sky and celebrate.'},
    {name:'Star collector',description:'Hit 8 stars in challenge mode',goal:8,reward:'Double Burst',icon:'✹',kind:'hit',hint:'Aim inside the glowing circles. Hits carry between rounds.'},
    {name:'Keep the rhythm',description:'Reach a 3× combo in a challenge',goal:3,reward:'Golden Willow',icon:'༄',kind:'combo',hint:'Hit three stars in a row, less than 3 seconds apart.'},
    {name:'Festival champion',description:'Score 2,000 points in one challenge',goal:2000,reward:'Grand Finale',icon:'✷',kind:'score',hint:'Build a combo. A 5× hit is worth 500 points.'},
    {name:'Color explorer',description:'Hit stars with 4 different cracker types',goal:4,reward:'Peacock Bloom',icon:'❈',kind:'types',hint:'Switch crackers between hits. Your collection carries between rounds.'},
    {name:'A sky full of stars',description:'Hit 15 more stars in challenges',goal:15,reward:'Rangoli Ring',icon:'◎',kind:'hit',hint:'Every star counts. You can complete this over several rounds.'},
    {name:'Light up Jaipur',description:'Score 5,000 points in one challenge',goal:5000,reward:'Thunder Garland',icon:'ϟ',kind:'score',hint:'Keep your 5× combo alive and aim for the golden bonus star.'},
    {name:'The grand celebration',description:'Finish 3 challenges with 1,000+ points each',goal:3,reward:'Tricolor Sky',icon:'✦',kind:'rounds',hint:'A strong finish earns one step. Your three rounds can be on different visits.'}
  ];
  constructor(storage,onUpdate){this.storage=storage;this.onUpdate=onUpdate;this.stage=0;this.value=0;this.types=[];this.saved=true;this.totalHits=0;this.rounds=0;try{const raw=storage.getItem('patakha-progress-v2')||storage.getItem('patakha-progress-v1'),s=JSON.parse(raw);if(s&&Number.isInteger(s.stage)&&s.stage>=0&&s.stage<=8){this.stage=s.stage;this.value=Math.max(0,Math.min(Number(s.value)||0,this.current?.goal||0));this.types=Array.isArray(s.types)?[...new Set(s.types.filter(t=>Number.isInteger(t)&&t>=0&&t<12))]:[];this.totalHits=Math.max(0,Math.floor(Number(s.totalHits)||0));this.rounds=Math.max(0,Math.floor(Number(s.rounds)||0));if(this.current?.kind==='types')this.value=Math.min(this.types.length,4);}}catch{} }
  get current(){return FestivalProgress.missions[this.stage];}
  isUnlocked(type){return Number.isInteger(type)&&type>=0&&type<4+this.stage;}
  save(){try{this.storage.setItem('patakha-progress-v2',JSON.stringify({stage:this.stage,value:this.value,types:this.types,totalHits:this.totalHits,rounds:this.rounds}));this.saved=true;}catch{this.saved=false;}}
  record(event,data={}){if(event==='hit')this.totalHits++;if(event==='finish')this.rounds++;const m=this.current;let next=this.value,unlocked=null;if(m){if(m.kind==='launch'&&event==='launch')next++;if(m.kind==='hit'&&event==='hit')next++;if(m.kind==='combo'&&event==='hit')next=Math.max(next,data.combo||0);if(m.kind==='score'&&event==='hit')next=Math.max(next,data.score||0);if(m.kind==='types'&&event==='hit'&&this.isUnlocked(data.type)){this.types=[...new Set([...this.types,data.type])];next=this.types.length;}if(m.kind==='rounds'&&event==='finish'&&data.score>=1000)next++;if(next>=m.goal){unlocked=this.stage+4;this.stage++;next=0;this.types=[];}}
    const changed=next!==this.value||unlocked!==null;this.value=next;if(changed||event==='hit'||event==='finish'){this.save();this.onUpdate?.(unlocked);}}
};
