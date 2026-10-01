export type HiddenStem={phase:string;stem:string;start:number;end:number|null};
export type MainStar={label:string;source:string;stem:string;star:string};
export type Follower={period:string;source:string;branch:string;star:string;energy:number};
export type RawSanmeiResult={
 input:{date:string;time:string;timezone:'Asia/Tokyo'};
 yearPillar:string;monthPillar:string;dayPillar:string;dayMaster:string;dayMasterElement:string;tenchusatsu:string;
 boundaries:{lichunJST:string;latestJie:string;latestJieJST:string;monthBranch:string};engine:string;
 nijuhachigen:{branch:string;dayNumber:number;countRule:string;active:HiddenStem;table:(HiddenStem&{active:boolean})[]};
 judaiShusei:{dayMaster:string;targets:Record<'north'|'south'|'east'|'center'|'west',MainStar>;centerStar:string};
 junidaiJusei:{dayMaster:string;early:Follower;middle:Follower;late:Follower};
};
export type SanmeiResult=Readonly<{
 birthDate:string;
 core:Pick<RawSanmeiResult,'yearPillar'|'monthPillar'|'dayPillar'|'dayMaster'|'dayMasterElement'|'tenchusatsu'|'boundaries'>;
 stars:Pick<RawSanmeiResult,'nijuhachigen'|'judaiShusei'|'junidaiJusei'>;
 interpretation:{basicNature?:string;strengths?:string[];cautions?:string[];summary?:string};
 conditions:{timeKnown:boolean};raw:RawSanmeiResult;
}>;
