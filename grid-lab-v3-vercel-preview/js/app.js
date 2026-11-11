'use strict';
const $ = id => document.getElementById(id);
const missions = {
  red: [['初期偵察','Linux環境を調査し、/opt/gridlab/flag.txt を見つけよう。'],['サービス調査','架空のサービス台帳を調査しよう。'],['設定ファイル解析','模擬設定ファイルを調査しよう。'],['ログの相関分析','ログを時系列で調査しよう。'],['最終監査報告','監査資料を調査しよう。']],
  blue: [['ベースライン確認','正常値と観測値を比較しよう。'],['ログ調査','ログイン履歴を調査しよう。'],['権限の確認','危険なファイル権限を調査しよう。'],['異常検知','アラートとイベントを照合しよう。'],['監査報告','調査結果をまとめよう。']]
};
let team='red',stage=0;
function render(){
 $('redBtn').classList.toggle('selected',team==='red');
 $('blueBtn').classList.toggle('selected',team==='blue');
 $('missionTitle').textContent=(team==='red'?'RED':'BLUE')+' TEAM ミッション';
 $('progress').textContent='公開プレビュー / 全10ステージ';
 $('stages').replaceChildren();
 missions[team].forEach(([name],i)=>{const b=document.createElement('button');b.className='stage'+(stage===i?' active':'');b.textContent=`▶ ${String(i+1).padStart(2,'0')} ${name}`;b.onclick=()=>{stage=i;render()};$('stages').append(b)});
 $('stageName').textContent=`${String(stage+1).padStart(2,'0')} ${missions[team][stage][0]}`;
 $('stageDesc').textContent=missions[team][stage][1];
 $('flagResult').textContent='プレビュー版のためFLAG判定は無効です。';
}
$('redBtn').onclick=()=>{team='red';stage=0;render()};
$('blueBtn').onclick=()=>{team='blue';stage=0;render()};
$('resetStage').onclick=()=>{stage=0;render()};
$('resetAll').onclick=()=>{team='red';stage=0;render()};
$('submitFlag').disabled=true;$('flag').disabled=true;
$('terminalStatus').textContent='● PREVIEW ONLY';
$('connection').textContent='● VERCEL / PREVIEW MODE';
$('terminal').style.cssText='white-space:pre-wrap;color:#91f2bf;font:15px/1.6 monospace;padding:18px;overflow:auto';
$('terminal').textContent='GRID LAB v3 - PUBLIC PREVIEW\n\nLinuxターミナルはまだ接続されていません。\nRaspberry Piのバックエンドを安全に公開した後で有効になります。\n\n$ _';
for(const id of ['clear','interrupt','reconnect'])$(id).disabled=true;
render();
