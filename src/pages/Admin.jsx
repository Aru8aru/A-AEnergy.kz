import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Global CSS ───────────────────────────────────────────────────────────────
const ADMIN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Golos+Text:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --navy:#0a1628; --navy2:#0f2040; --navy3:#162444;
  --gold:#C8960C; --gold2:#F5B800; --gold3:rgba(200,150,12,.12);
  --green:#43a047; --green2:#66bb6a; --green3:rgba(67,160,71,.12);
  --red:#e53935; --red2:rgba(229,57,53,.12);
  --amber:#f57f17; --amber2:rgba(245,127,23,.12);
  --blue3:#42a5f5;
  --text:#e8edf5; --t2:#8da4c4; --t3:#4a6080; --t4:#2a3a55;
  --bg:#07111f; --bg2:#0a1828; --bg3:#0d1f38;
  --border:rgba(255,255,255,.07); --border2:rgba(255,255,255,.04);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body, html { background: var(--bg); color: var(--text); font-family: 'Golos Text', sans-serif; }

.adm-root {
  width: 100%; height: 100vh; display: flex; flex-direction: column;
  background: var(--bg); position: relative; overflow: hidden;
}
.adm-root::before {
  content: ''; position: fixed; inset: 0; z-index: 0;
  background-image: linear-gradient(rgba(229,57,53,.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(229,57,53,.012) 1px, transparent 1px);
  background-size: 40px 40px; pointer-events: none;
}

/* Auth wall */
.adm-auth {
  position: fixed; inset: 0; z-index: 9999; display: flex;
  align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--navy), #1a0808);
}
.adm-aw {
  background: var(--bg2); border: 1px solid rgba(229,57,53,.25);
  border-radius: 16px; width: 420px; padding: 36px; text-align: center;
  box-shadow: 0 32px 80px rgba(0,0,0,.7);
}
.adm-aw h2 { font-family: 'Playfair Display',serif; font-size: 22px; color: #fff; margin: 16px 0 8px; }
.adm-aw p { font-size: 13px; color: var(--t2); line-height: 1.6; margin-bottom: 22px; }
.adm-aw-fields { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.adm-aw-inp {
  padding: 10px 14px; background: rgba(255,255,255,.05);
  border: 1px solid var(--border); border-radius: 8px; color: var(--text);
  font-size: 14px; font-family: 'Golos Text',sans-serif; outline: none; text-align: center;
  transition: border-color .2s;
}
.adm-aw-inp:focus { border-color: rgba(229,57,53,.4); }
.adm-aw-inp::placeholder { color: var(--t3); }
.adm-aw-err { color: var(--red); font-size: 12px; margin-bottom: 8px; }
.adm-aw-btn {
  display: inline-block; padding: 12px 28px; background: var(--red);
  color: #fff; border: none; border-radius: 8px; font-size: 14px;
  font-weight: 700; cursor: pointer; font-family: 'Golos Text',sans-serif;
}

/* Topbar */
.adm-topbar {
  height: 54px; min-height: 54px; display: flex; align-items: center;
  justify-content: space-between; padding: 0 22px; background: var(--navy2);
  border-bottom: 2px solid var(--red); flex-shrink: 0; position: relative; z-index: 10;
}
.adm-tb-l { display: flex; align-items: center; gap: 14px; }
.adm-brgr { background: none; border: none; cursor: pointer; padding: 5px; display: flex; flex-direction: column; gap: 5px; }
.adm-brgr span { display: block; width: 22px; height: 2px; background: var(--t2); border-radius: 1px; transition: all .3s; }
.adm-brgr.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
.adm-brgr.open span:nth-child(2) { opacity: 0; }
.adm-brgr.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }
.adm-tlogo { display: flex; align-items: center; gap: 9px; cursor: pointer; }
.adm-tlogo-ic { width: 32px; height: 32px; background: var(--red); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.adm-tlogo-n { font-family: 'Playfair Display',serif; font-size: 14px; font-weight: 700; color: #fff; }
.adm-tlogo-s { font-size: 9px; color: var(--t3); letter-spacing: .06em; text-transform: uppercase; }
.adm-rpill { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: var(--red2); border: 1px solid rgba(229,57,53,.4); color: var(--red); }
.adm-tb-r { display: flex; align-items: center; gap: 12px; }
.adm-ns-ind { display: flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 6px; font-size: 11px; font-weight: 600; background: var(--green3); border: 1px solid rgba(67,160,71,.3); color: var(--green2); }
.adm-nd { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: adm-bp 2s infinite; }
@keyframes adm-bp { 0%,100%{opacity:1} 50%{opacity:.25} }
.adm-clock { font-family: 'JetBrains Mono',monospace; font-size: 12px; color: var(--t2); }
.adm-tusr { display: flex; align-items: center; gap: 8px; padding: 5px 12px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; }
.adm-tav { width: 28px; height: 28px; border-radius: 50%; background: var(--red); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; }
.adm-tun { font-size: 12px; font-weight: 600; }
.adm-tip { font-size: 10px; color: var(--t3); font-family: 'JetBrains Mono',monospace; }
.adm-tout { padding: 6px 14px; background: transparent; border: 1px solid var(--border); border-radius: 6px; color: var(--t2); font-size: 12px; cursor: pointer; font-family: 'Golos Text',sans-serif; transition: all .15s; }
.adm-tout:hover { border-color: var(--red); color: var(--red); }

/* Layout */
.adm-body { flex: 1; display: flex; overflow: hidden; position: relative; z-index: 1; }
.adm-sidebar { width: 230px; min-width: 230px; background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; transition: width .3s,min-width .3s; flex-shrink: 0; }
.adm-sidebar.collapsed { width: 0; min-width: 0; }
.adm-sb-sec { padding: 14px 14px 4px; font-size: 10px; font-weight: 700; color: var(--t4); letter-spacing: .12em; text-transform: uppercase; white-space: nowrap; }
.adm-sbi { display: flex; align-items: center; gap: 9px; padding: 9px 14px; margin: 1px 8px; border-radius: 7px; cursor: pointer; font-size: 13px; color: var(--t2); transition: all .15s; white-space: nowrap; border: 1px solid transparent; background: none; width: calc(100% - 16px); text-align: left; font-family: 'Golos Text',sans-serif; font-weight: 500; }
.adm-sbi:hover { background: rgba(255,255,255,.05); color: var(--text); }
.adm-sbi.active { background: rgba(229,57,53,.1); color: var(--red); border-color: rgba(229,57,53,.2); }
.adm-sbi-ic { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }
.adm-sbi-badge { margin-left: auto; background: var(--red); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 10px; }
.adm-sb-div { height: 1px; background: var(--border); margin: 8px 14px; }

/* Content */
.adm-content { flex: 1; overflow-y: auto; background: var(--bg); }
.adm-content::-webkit-scrollbar { width: 4px; }
.adm-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.adm-pg { padding: 26px; animation: adm-pgi .25s ease; }
@keyframes adm-pgi { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
.adm-tag { display: inline-block; padding: 3px 10px; background: rgba(229,57,53,.1); border: 1px solid rgba(229,57,53,.25); color: var(--red); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; border-radius: 3px; margin-bottom: 10px; }
.adm-h1 { font-family: 'Playfair Display',serif; font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 5px; }
.adm-sub { font-size: 13px; color: var(--t2); margin-bottom: 24px; }

/* Grids */
.adm-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.adm-g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.adm-cam-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.adm-mb { margin-bottom: 16px; }

/* Card */
.adm-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
.adm-card-t { font-size: 11px; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; }

/* Stat */
.adm-stat { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 18px; transition: border-color .2s; }
.adm-stat:hover { border-color: rgba(229,57,53,.2); }
.adm-stat-ic { font-size: 24px; margin-bottom: 9px; }
.adm-stat-lb { font-size: 11px; color: var(--t3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 5px; font-weight: 600; }
.adm-stat-val { font-family: 'Playfair Display',serif; font-size: 26px; font-weight: 700; color: #fff; line-height: 1; }
.adm-stat-unit { font-size: 12px; color: var(--t2); margin-top: 3px; }
.adm-stat-tr { font-size: 11px; margin-top: 7px; }
.adm-tup { color: var(--green2); } .adm-tok { color: var(--blue3); }

/* Badge */
.adm-bdg { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
.adm-bok { background: var(--green3); color: var(--green2); }
.adm-bwarn { background: var(--amber2); color: var(--amber); }
.adm-berr { background: var(--red2); color: var(--red); }
.adm-binfo { background: rgba(21,101,192,.12); color: var(--blue3); }
.adm-bgold { background: var(--gold3); color: var(--gold2); }

/* Table */
.adm-tbl { width: 100%; border-collapse: collapse; font-size: 12px; }
.adm-tbl th { text-align: left; padding: 8px 12px; color: var(--t3); font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; border-bottom: 1px solid var(--border); }
.adm-tbl td { padding: 9px 12px; border-bottom: 1px solid var(--border2); color: var(--t2); }
.adm-tbl td:first-child { color: var(--text); font-weight: 500; }

/* Employee */
.adm-emp-row { display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; transition: border-color .15s; }
.adm-emp-row:hover { border-color: rgba(200,150,12,.3); }
.adm-emp-av { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg,var(--navy3),var(--red)); display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; color: #fff; flex-shrink: 0; }
.adm-emp-info { flex: 1; }
.adm-emp-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
.adm-emp-role { font-size: 12px; color: var(--t2); }
.adm-dl-btn { padding: 8px 16px; background: var(--gold); color: #000; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Golos Text',sans-serif; transition: all .15s; flex-shrink: 0; white-space: nowrap; }
.adm-dl-btn:hover { background: var(--gold2); transform: translateY(-1px); }
.adm-dl-btn-g { background: var(--green); color: #fff; }
.adm-dl-btn-g:hover { background: var(--green2); }
.adm-dl-btn-o { background: transparent; border: 1px solid var(--border); color: var(--t2); }
.adm-dl-btn-o:hover { border-color: var(--t2); color: var(--text); }

/* Chat */
.adm-chat-wrap { display: flex; flex-direction: column; height: 400px; }
.adm-chat-msgs { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 4px 0; }
.adm-chat-msgs::-webkit-scrollbar { width: 3px; }
.adm-chat-msgs::-webkit-scrollbar-thumb { background: var(--t4); }
.adm-bub { max-width: 78%; padding: 10px 14px; border-radius: 10px; font-size: 13px; line-height: 1.5; }
.adm-bub-me { background: rgba(229,57,53,.15); border: 1px solid rgba(229,57,53,.25); align-self: flex-end; border-radius: 10px 10px 2px 10px; }
.adm-bub-them { background: var(--bg3); border: 1px solid var(--border); align-self: flex-start; border-radius: 10px 10px 10px 2px; }
.adm-bmeta { font-size: 10px; color: var(--t3); margin-top: 4px; display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.adm-enc-lbl { color: var(--green2); font-size: 9px; }
.adm-ctoggler { color: var(--blue3); font-size: 9px; cursor: pointer; text-decoration: underline; }
.adm-cipher-box { font-family: 'JetBrains Mono',monospace; font-size: 9.5px; color: var(--t3); margin-top: 4px; padding: 8px 12px; background: rgba(0,0,0,.3); border: 1px solid rgba(200,150,12,.2); border-radius: 5px; word-break: break-all; line-height: 1.7; }
.adm-chat-inp-row { display: flex; gap: 8px; padding-top: 10px; border-top: 1px solid var(--border); margin-top: 8px; }
.adm-chat-inp { flex: 1; padding: 10px 13px; background: rgba(255,255,255,.05); border: 1px solid var(--border); border-radius: 7px; color: var(--text); font-size: 13px; font-family: 'Golos Text',sans-serif; outline: none; transition: border-color .2s; }
.adm-chat-inp:focus { border-color: rgba(200,150,12,.4); }
.adm-chat-inp::placeholder { color: var(--t3); }
.adm-send-btn { padding: 10px 18px; background: var(--gold); color: #000; border: none; border-radius: 7px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Golos Text',sans-serif; transition: background .2s; }
.adm-send-btn:hover { background: var(--gold2); }

/* NS Legend */
.adm-ns-legend { padding: 10px 14px; background: rgba(200,150,12,.06); border: 1px solid rgba(200,150,12,.15); border-radius: 7px; font-size: 11px; color: rgba(200,150,12,.8); line-height: 1.8; margin-bottom: 10px; }
.adm-ns-legend strong { color: var(--gold2); }

/* Camera */
.adm-cam-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; transition: border-color .2s; }
.adm-cam-card:hover { border-color: rgba(200,150,12,.3); }
.adm-cam-prev { height: 160px; background: linear-gradient(135deg,#1a0a0a,#080814); display: flex; align-items: center; justify-content: center; position: relative; }
.adm-cam-prev::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center,rgba(229,57,53,.08) 0%,transparent 70%); }
.adm-cam-icon { font-size: 44px; opacity: .35; position: relative; }
.adm-cam-rec { position: absolute; top: 10px; left: 10px; display: flex; align-items: center; gap: 4px; font-size: 11px; color: #fff; font-weight: 600; background: rgba(229,57,53,.85); padding: 3px 9px; border-radius: 3px; font-family: 'JetBrains Mono',monospace; }
.adm-cam-rdc { width: 7px; height: 7px; border-radius: 50%; background: #fff; animation: adm-bp 1s infinite; }
.adm-cam-ts { position: absolute; bottom: 8px; right: 8px; font-family: 'JetBrains Mono',monospace; font-size: 11px; color: #fff; background: rgba(0,0,0,.6); padding: 2px 8px; border-radius: 3px; }
.adm-cam-body { padding: 14px; }
.adm-cam-name { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.adm-cam-loc { font-size: 11px; color: var(--t2); margin-bottom: 10px; }
.adm-cam-acts { display: flex; gap: 6px; }
.adm-cam-btn { flex: 1; padding: 7px; border: 1px solid var(--border); border-radius: 5px; background: transparent; color: var(--t2); font-size: 11px; cursor: pointer; font-family: 'Golos Text',sans-serif; transition: all .15s; }
.adm-cam-btn:hover { border-color: var(--gold); color: var(--gold2); }
.adm-cam-btn.primary { background: var(--gold3); color: var(--gold2); border-color: rgba(200,150,12,.3); }
.adm-cam-btn.primary:hover { background: rgba(200,150,12,.2); }

/* Log */
.adm-log-list { display: flex; flex-direction: column; gap: 4px; }
.adm-li { display: flex; gap: 9px; padding: 8px 11px; border-radius: 6px; background: var(--bg3); border: 1px solid var(--border2); font-size: 11px; }
.adm-lt { font-family: 'JetBrains Mono',monospace; color: var(--t3); flex-shrink: 0; font-size: 10px; padding-top: 1px; }
.adm-lm { color: var(--t2); flex: 1; line-height: 1.5; }

/* Report */
.adm-rep-box { background: linear-gradient(135deg,var(--bg3),var(--navy3)); border: 1px solid rgba(200,150,12,.25); border-radius: 10px; padding: 22px; margin-bottom: 16px; }
.adm-rep-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }
.adm-rep-title { font-family: 'Playfair Display',serif; font-size: 18px; color: #fff; margin-bottom: 4px; }
.adm-rep-period { font-size: 12px; color: var(--gold2); font-family: 'JetBrains Mono',monospace; }

/* Toast */
.adm-toast { position: fixed; bottom: 22px; right: 22px; z-index: 8000; padding: 12px 18px; border-radius: 9px; font-size: 13px; background: var(--bg2); border: 1px solid var(--border); box-shadow: 0 4px 24px rgba(0,0,0,.4); max-width: 320px; transition: all .3s; opacity: 0; transform: translateY(18px); pointer-events: none; }
.adm-toast.show { opacity: 1; transform: translateY(0); }
.adm-toast.tok { border-color: rgba(67,160,71,.4); background: var(--green3); }
.adm-toast.terr { border-color: rgba(229,57,53,.4); background: var(--red2); }
.adm-toast.twarn { border-color: rgba(245,127,23,.4); background: var(--amber2); }

@media(max-width:900px) {
  .adm-sidebar { position: fixed; top: 54px; bottom: 0; z-index: 800; }
  .adm-g2, .adm-g4, .adm-cam-grid { grid-template-columns: 1fr; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const EMPS = [
  {id:'EMP-001',name:'Сейткали Арман Болатович',role:'Бас директор',iin:'820315300521',phone:'+7 701 234 56 78',doc:'N12345678',addr:'Астана қ., Есіл р-ны, Мәңгілік Ел, 8-үй, 14-пәтер',bday:'1982-03-15',hired:'2010-04-01',salary:'₸ 2 800 000'},
  {id:'EMP-002',name:'Нұрланова Гүлнар Қайратқызы',role:'SCADA қауіпсіздік басшысы',iin:'880722402315',phone:'+7 707 567 89 01',doc:'N23456789',addr:'Астана қ., Алматы р-ны, Сарыарқа д., 12-үй, 87-пәтер',bday:'1988-07-22',hired:'2015-09-15',salary:'₸ 1 950 000'},
  {id:'EMP-003',name:'Ержанов Дәурен Мұхтарұлы',role:'Бас инженер',iin:'790511301442',phone:'+7 705 123 45 67',doc:'N34567890',addr:'Атырау қ., Жұбанов к., 24-үй',bday:'1979-05-11',hired:'2008-06-20',salary:'₸ 2 100 000'},
  {id:'EMP-004',name:'Сарсенова Айгерім Берікқызы',role:'Оператор-2',iin:'920814401223',phone:'+7 701 987 65 43',doc:'N45678901',addr:'Астана қ., Сарыарқа р-ны, Республика д., 56-үй, 32-пәтер',bday:'1992-08-14',hired:'2018-03-12',salary:'₸ 850 000'},
  {id:'EMP-005',name:'Қасымов Тимур Асқарұлы',role:'Геолог, PhD',iin:'850203300167',phone:'+7 702 345 67 89',doc:'N56789012',addr:'Алматы қ., Бостандық р-ны, Розыбакиев к., 109-үй',bday:'1985-02-03',hired:'2013-11-05',salary:'₸ 1 750 000'},
  {id:'EMP-006',name:'Бекова Мадина Серікқызы',role:'Қаржы директоры',iin:'830628401789',phone:'+7 707 234 56 78',doc:'N67890123',addr:'Астана қ., Есіл р-ны, Кабанбай батыр д., 11-үй, 45-пәтер',bday:'1983-06-28',hired:'2011-08-10',salary:'₸ 2 400 000'},
  {id:'EMP-007',name:'Иванченко Роман Владимирович',role:'IT Архитектор',iin:'870415300234',phone:'+7 705 876 54 32',doc:'N78901234',addr:'Астана қ., Алматы р-ны, Республика д., 28-үй, 9-пәтер',bday:'1987-04-15',hired:'2016-02-14',salary:'₸ 1 850 000'},
  {id:'EMP-008',name:'Абдрахманова Салтанат Ержанқызы',role:'HR директоры',iin:'840919402556',phone:'+7 701 543 21 09',doc:'N89012345',addr:'Астана қ., Сарыарқа р-ны, Сейфуллин к., 38-үй, 67-пәтер',bday:'1984-09-19',hired:'2012-05-22',salary:'₸ 1 600 000'},
];

const DAYS = ['Бүгін','Кеше','2 күн бұрын','3 күн бұрын','4 күн бұрын','5 күн бұрын','6 күн бұрын'];
const CAMS = [
  {id:'CAM-01',name:'Кіреберіс — Бас ғимарат',loc:'Астана офис, 1-қабат'},
  {id:'CAM-02',name:'SCADA серверлік бөлме',loc:'Астана офис, -1 қабат'},
  {id:'CAM-03',name:'KZ-Atyrau-01 бақылау',loc:'Атырау нысаны'},
  {id:'CAM-04',name:'Теңіз сорғы алаңы',loc:'Теңіз нысаны'},
  {id:'CAM-05',name:'Маңғыстау RTU бөлме',loc:'Ақтау офис'},
  {id:'CAM-06',name:'Қойма аумағы',loc:'Атырау база'},
];
const CAM_TIMES = ['08:32:15','09:14:22','07:45:11','10:02:34','06:18:42','05:30:08'];

const REPORTS = {
  '2025-01': {name:'Қаңтар 2025', inc:237, cnt:14},
  '2024-12': {name:'Желтоқсан 2024', inc:242, cnt:16},
  '2024-11': {name:'Қараша 2024', inc:228, cnt:12},
};

const CONTRACTS = [
  'QMG-001 · Қазақстан Темір Жолы · Жанармай жеткізу · ₸28 млрд',
  'QMG-002 · SOCAR Trading · Мұнай экспорты · ₸45 млрд',
  'QMG-003 · Air Astana · Авиа жанармай · ₸18 млрд',
  'QMG-004 · Vitol SA · Мұнай экспорты · ₸67 млрд',
  'QMG-005 · Glencore Energy · Газ конденсат · ₸22 млрд',
  'QMG-006 · CNPC China · Мұнай экспорты · ₸35 млрд',
  'QMG-007 · Lukoil · Көлік қызметі · ₸8.5 млрд',
  'QMG-008 · TotalEnergies · Геологиялық зерттеу · ₸6.2 млрд',
  'QMG-009 · ҚазТрансОйл · Тасымалдау · ₸4.3 млрд',
  'QMG-010 · BG Group · Газ жобасы · ₸2.5 млрд',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pp = n => String(n).padStart(2, '0');
const ts = () => { const d = new Date(); return `${pp(d.getHours())}:${pp(d.getMinutes())}:${pp(d.getSeconds())}`; };

function nsKDCEncrypt(msg, from, to) {
  const Na = Math.floor(Math.random()*0xFFFF).toString(16).toUpperCase().padStart(4,'0');
  const Nb = Math.floor(Math.random()*0xFFFF).toString(16).toUpperCase().padStart(4,'0');
  const Ks = Math.floor(Math.random()*0xFFFFFFFF).toString(16).toUpperCase().padStart(8,'0');
  let enc = '';
  for (let i = 0; i < msg.length; i++)
    enc += ((msg.charCodeAt(i) ^ parseInt(Ks.substr(i%8,1),16)+17) % 95 + 32).toString(16).padStart(2,'0');
  enc = enc.toUpperCase().match(/.{1,2}/g).join(' ');
  return {
    formula: [
      `1. ${from} → KDC:    {${from}, ${to}, Na=0x${Na}}K${from}`,
      `2. KDC → ${from}:    {Ks=0x${Ks}, ${to}, Na=0x${Na}, {Ks,${from}}K${to}}K${from}`,
      `3. ${from} → ${to}:  {Ks=0x${Ks}, ${from}}K${to} || {msg}Ks`,
      `4. ${to} → ${from}:  {Nb=0x${Nb}}Ks  ⟶  {Nb-1=0x${Nb}_ack}Ks  ✓`,
    ],
    cipherHex: enc.substr(0,90) + '...',
    cipherB64: btoa(unescape(encodeURIComponent(msg))).substr(0,60) + '==',
  };
}

function loadMsgs() { try { return JSON.parse(localStorage.getItem('qmg_msgs') || '[]'); } catch { return []; } }
function saveMsgs(msgs) { try { localStorage.setItem('qmg_msgs', JSON.stringify(msgs.slice(-100))); } catch {} }

function dlTxt(content, filename) {
  const blob = new Blob([content], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename; a.click(); URL.revokeObjectURL(a.href);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function AuthWall({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const tryLogin = () => {
    if (user === 'admin' && pass === 'qmg2025') {
      try { localStorage.setItem('qmg_user', user); localStorage.setItem('qmg_role', 'admin'); } catch {}
      onLogin(user);
    } else setErr('Қате логин немесе пароль');
  };
  return (
    <div className="adm-auth">
      <div className="adm-aw">
        <div style={{fontSize:48}}>👑</div>
        <h2>Әкімші панелі</h2>
        <p>Кіру үшін логин мен паролді енгізіңіз.<br/>Демо: <strong style={{color:'var(--gold2)'}}>admin / qmg2025</strong></p>
        <div className="adm-aw-fields">
          <input className="adm-aw-inp" placeholder="Логин" value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==='Enter'&&tryLogin()} />
          <input className="adm-aw-inp" type="password" placeholder="Пароль" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&tryLogin()} />
        </div>
        {err && <div className="adm-aw-err">{err}</div>}
        <button className="adm-aw-btn" onClick={tryLogin}>Кіру →</button>
      </div>
    </div>
  );
}

function LogItem({ log }) {
  return (
    <div className="adm-li">
      <span className="adm-lt">{log.t}</span>
      <span style={{flexShrink:0,marginRight:5}}><span className={`adm-bdg ${log.cls}`}>{log.tag}</span></span>
      <span className="adm-lm">{log.msg}</span>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ logs, goPage, onDownloadReport }) {
  return (
    <div className="adm-pg">
      <div className="adm-tag">Дашборд</div>
      <div className="adm-h1">Әкімші дашборды</div>
      <div className="adm-sub">Толық жүйе мониторингі — нақты уақыт</div>
      <div className="adm-g4 adm-mb">
        <div className="adm-stat"><div className="adm-stat-ic">👥</div><div className="adm-stat-lb">Қызметкерлер</div><div className="adm-stat-val">8</div><div className="adm-stat-unit">белсенді аккаунт</div><div className="adm-stat-tr adm-tok">L1–L5 рұқсат</div></div>
        <div className="adm-stat"><div className="adm-stat-ic">📹</div><div className="adm-stat-lb">Камералар</div><div className="adm-stat-val" style={{color:'var(--green2)'}}>12/12</div><div className="adm-stat-unit">онлайн</div><div className="adm-stat-tr adm-tup">7 күн жазба</div></div>
        <div className="adm-stat"><div className="adm-stat-ic">🔐</div><div className="adm-stat-lb">NS бұғатталды</div><div className="adm-stat-val" style={{color:'var(--green2)'}}>147</div><div className="adm-stat-unit">шабуыл / 30 күн</div><div className="adm-stat-tr adm-tup">↑ 0 сәтті шабуыл</div></div>
        <div className="adm-stat"><div className="adm-stat-ic">💰</div><div className="adm-stat-lb">Ай кірісі</div><div className="adm-stat-val" style={{color:'var(--gold2)'}}>₸237</div><div className="adm-stat-unit">млрд (қаңтар)</div><div className="adm-stat-tr adm-tup">↑ +18%</div></div>
      </div>
      <div className="adm-g2">
        <div className="adm-card">
          <div className="adm-card-t">📋 Соңғы оқиғалар</div>
          <div className="adm-log-list">{logs.slice(0,8).map((l,i)=><LogItem key={i} log={l}/>)}</div>
        </div>
        <div className="adm-card">
          <div className="adm-card-t">⚡ Жылдам іс-әрекеттер</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <button className="adm-dl-btn" style={{textAlign:'left',padding:'11px 16px',display:'flex',alignItems:'center',gap:7}} onClick={()=>goPage('chat')}>💬 Операторға хабарлама жазу</button>
            <button className="adm-dl-btn adm-dl-btn-g" style={{textAlign:'left',padding:'11px 16px',display:'flex',alignItems:'center',gap:7}} onClick={()=>onDownloadReport()}>📄 Айлық есепті жүктеу (Қаңтар 2025)</button>
            <button className="adm-dl-btn adm-dl-btn-o" style={{textAlign:'left',padding:'11px 16px',display:'flex',alignItems:'center',gap:7}} onClick={()=>goPage('cameras')}>📹 Камера жазбалары</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Employees ─────────────────────────────────────────────────────────────────
function EmployeesPage({ onDl }) {
  return (
    <div className="adm-pg">
      <div className="adm-tag">Қызметкерлер</div>
      <div className="adm-h1">Қызметкерлер тізімі</div>
      <div className="adm-sub">«Жүктеу» батырмасын басып ИИН, мекен-жай, құжат деректерін .txt файлмен жүктеп алыңыз</div>
      <div className="adm-card">
        <div className="adm-card-t">📁 8 қызметкер</div>
        {EMPS.map(e => (
          <div key={e.id} className="adm-emp-row">
            <div className="adm-emp-av">{e.name[0]}</div>
            <div className="adm-emp-info">
              <div className="adm-emp-name">{e.name}</div>
              <div className="adm-emp-role">{e.role} · {e.id}</div>
            </div>
            <button className="adm-dl-btn" onClick={()=>onDl(e.id)}>⬇ Жүктеу</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chat ──────────────────────────────────────────────────────────────────────
function ChatPage({ addLog }) {
  const [msgs, setMsgs] = useState(loadMsgs);
  const [input, setInput] = useState('');
  const [openCipher, setOpenCipher] = useState({});
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:'smooth'}); }, [msgs]);

  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('qmg_chat');
      bc.onmessage = (e) => {
        if (e.data?.type === 'new_msg' && e.data.msg.from !== 'admin') {
          const updated = [...loadMsgs(), e.data.msg];
          saveMsgs(updated); setMsgs([...updated]);
          addLog('ok','[ЧАТ]','operator → admin: жаңа хабарлама келді');
        }
      };
    } catch {}
    return () => { try { bc?.close(); } catch {} };
  }, [addLog]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const enc = nsKDCEncrypt(input, 'admin', 'operator');
    const msg = { from:'admin', text:input, time:ts().substr(0,5), enc, id:Date.now() };
    const updated = [...msgs, msg]; saveMsgs(updated); setMsgs(updated); setInput('');
    try { new BroadcastChannel('qmg_chat').postMessage({type:'new_msg',msg}); } catch {}
    addLog('ok','[ЧАТ]','admin → operator: NS+KDC+AES-256 шифрланған хабарлама жіберілді');
  };

  return (
    <div className="adm-pg">
      <div className="adm-tag">Чат</div>
      <div className="adm-h1">Чат — Оператормен байланыс</div>
      <div className="adm-sub">NS протоколымен AES-256 шифрланған байланыс</div>
      <div className="adm-ns-legend">
        <strong>NS + KDC шифрлау схемасы:</strong><br/>
        1. Admin → KDC: сессия кілті сұрауы &#123;admin, operator, Na&#125;Kkdc<br/>
        2. KDC → Admin: &#123;Ks, operator, Na, &#123;Ks,admin&#125;Kop&#125;Kadmin<br/>
        3. Admin → Operator: &#123;Ks, admin&#125;Kop · Хабарлама: &#123;msg&#125;Ks (AES-256)<br/>
        4. Operator → Admin: &#123;Ks+1, msg_reply&#125;Ks · Сессия расталды ✓
      </div>
      <div className="adm-card">
        <div className="adm-card-t">
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'var(--green2)',animation:'adm-bp 2s infinite',display:'inline-block'}}></span>
            Айгерім Сарсенова — Оператор-2 (192.168.0.22)
          </div>
          <span className="adm-bdg adm-bok">🔐 NS+AES-256</span>
        </div>
        <div className="adm-chat-wrap">
          <div className="adm-chat-msgs">
            {!msgs.length
              ? <div style={{textAlign:'center',color:'var(--t3)',fontSize:12,padding:24}}>Хабарлама жоқ. Бірінші хабарламаны жіберіңіз!</div>
              : msgs.map((m,i) => {
                const isMe = m.from === 'admin';
                return (
                  <div key={i} style={{display:'flex',flexDirection:'column',alignItems:isMe?'flex-end':'flex-start',marginBottom:4}}>
                    <div className={`adm-bub ${isMe?'adm-bub-me':'adm-bub-them'}`}>
                      <span style={{fontSize:10,opacity:.6,display:'block',marginBottom:2}}>{m.from.toUpperCase()}</span>
                      {m.text}
                    </div>
                    <div className="adm-bmeta">
                      {isMe?'admin':'operator'} · {m.time}
                      &nbsp;·&nbsp;<span className="adm-enc-lbl">🔐 NS+KDC+AES-256</span>
                      &nbsp;·&nbsp;<span className="adm-ctoggler" onClick={()=>setOpenCipher(p=>({...p,[i]:!p[i]}))}>📋 формула/шифр</span>
                    </div>
                    {openCipher[i] && m.enc && (
                      <div className="adm-cipher-box">
                        <div style={{color:'var(--gold2)',fontWeight:700,marginBottom:5,fontSize:10}}>── Needham–Schroeder + KDC Протоколы ──</div>
                        {m.enc.formula?.map((f,fi)=><div key={fi} style={{marginBottom:3,color:'#57e389'}}>{f}</div>)}
                        <div style={{color:'var(--gold2)',fontWeight:700,margin:'7px 0 3px',fontSize:10}}>── AES-256 Шифрланған хабарлама ──</div>
                        <div style={{color:'var(--t2)',wordBreak:'break-all'}}>HEX: {m.enc.cipherHex}</div>
                        <div style={{color:'var(--t2)',marginTop:3,wordBreak:'break-all'}}>B64: {m.enc.cipherB64}</div>
                      </div>
                    )}
                  </div>
                );
              })
            }
            <div ref={endRef}/>
          </div>
          <div className="adm-chat-inp-row">
            <input className="adm-chat-inp" placeholder="🔐 NS шифрланған хабарлама жазыңыз..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} />
            <button className="adm-send-btn" onClick={sendMsg}>Жіберу →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cameras ───────────────────────────────────────────────────────────────────
function CamerasPage({ addLog, showToast }) {
  const [curDay, setCurDay] = useState(0);

  const dlCam = (id, name) => {
    const ftyp = new Uint8Array([0,0,0,32,102,116,121,112,105,115,111,109,0,0,2,0,105,115,111,109,105,115,111,50,97,118,99,49,109,112,52,49]);
    const size = 1048576; const buf = new Uint8Array(size); buf.set(ftyp);
    for (let i = ftyp.length; i < size; i++) buf[i] = (i*7+13)%256;
    const blob = new Blob([buf], {type:'video/mp4'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${id}_${DAYS[curDay].replace(/ /g,'_')}.mp4`;
    a.click(); URL.revokeObjectURL(a.href);
    showToast(`✓ ${id} жазбасы жүктелді (${DAYS[curDay]})`,'tok');
    addLog('ok','[КАМЕРА]',`${id} — ${DAYS[curDay]} жазбасы жүктелді`);
  };

  return (
    <div className="adm-pg">
      <div className="adm-tag">Камералар</div>
      <div className="adm-h1">Қауіпсіздік камералары</div>
      <div className="adm-sub">Соңғы 7 күн жазбалары сақталған · Жүктеу батырмасын басып .mp4 видео жүктеп алыңыз</div>
      <div className="adm-card adm-mb">
        <div className="adm-card-t">📅 Апта күндерін таңдаңыз</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {DAYS.map((d,i) => (
            <button key={i} className="adm-dl-btn" onClick={()=>setCurDay(i)}
              style={{padding:'7px 14px',fontSize:11,...(i!==curDay?{background:'transparent',color:'var(--t2)',border:'1px solid var(--border)'}:{})}}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="adm-cam-grid">
        {CAMS.map((c,i) => (
          <div key={i} className="adm-cam-card">
            <div className="adm-cam-prev">
              <div className="adm-cam-rec"><span className="adm-cam-rdc"></span>REC</div>
              <span className="adm-cam-icon">📹</span>
              <div className="adm-cam-ts">{DAYS[curDay]} · {CAM_TIMES[i]}</div>
            </div>
            <div className="adm-cam-body">
              <div className="adm-cam-name">{c.id} — {c.name}</div>
              <div className="adm-cam-loc">📍 {c.loc}</div>
              <div className="adm-cam-acts">
                <button className="adm-cam-btn" onClick={()=>showToast('Толық экранда қарау (демо)','tok')}>▶️ Қарау</button>
                <button className="adm-cam-btn primary" onClick={()=>dlCam(c.id, c.name)}>⬇ .mp4 жүктеу</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reports ───────────────────────────────────────────────────────────────────
function ReportsPage({ onDownload }) {
  return (
    <div className="adm-pg">
      <div className="adm-tag">Есептер</div>
      <div className="adm-h1">Айлық қаржылық есептер</div>
      <div className="adm-sub">Контракттар, түсімдер туралы есеп файлдары · .txt форматта жүктеу</div>
      <div className="adm-rep-box">
        <div className="adm-rep-head">
          <div>
            <div className="adm-rep-title">📄 Қаңтар 2025 — Айлық есеп</div>
            <div className="adm-rep-period">QMG-RPT-2025-01 · 14 контракт · ₸237 млрд</div>
          </div>
          <button className="adm-dl-btn adm-dl-btn-g" style={{padding:'10px 20px'}} onClick={()=>onDownload()}>⬇ Жүктеу (.txt)</button>
        </div>
      </div>
      <div className="adm-card">
        <div className="adm-card-t">📊 Есептер тізімі</div>
        <table className="adm-tbl">
          <thead><tr><th>Кезең</th><th>Контракт</th><th>Кіріс</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {[['2025-01','Қаңтар 2025',14,237,'Дайын',true],['2024-12','Желтоқсан 2024',16,242,'Архив',false],['2024-11','Қараша 2024',12,228,'Архив',false]].map(([pid,pname,cnt,inc,st,isPrimary])=>(
              <tr key={pid}>
                <td>{pname}</td><td>{cnt}</td><td>₸{inc} млрд</td>
                <td><span className="adm-bdg adm-bok">{st}</span></td>
                <td>
                  <button className="adm-dl-btn" onClick={()=>onDownload(pid)}
                    style={{padding:'5px 12px',fontSize:11,...(!isPrimary?{background:'transparent',color:'var(--gold2)',border:'1px solid rgba(200,150,12,.3)'}:{})}}>⬇</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Company ───────────────────────────────────────────────────────────────────
function CompanyPage() {
  return (
    <div className="adm-pg">
      <div className="adm-tag">Компания</div>
      <div className="adm-h1">Компания деректері</div>
      <div className="adm-sub">Өндіріс нысандары мен жобалар реестрі</div>
      <div className="adm-g2 adm-mb">
        <div className="adm-card">
          <div className="adm-card-t">🏭 Өндіріс нысандары</div>
          <table className="adm-tbl">
            <thead><tr><th>Нысан</th><th>Орналасу</th><th>Қуат</th><th>Статус</th></tr></thead>
            <tbody>
              <tr><td>KZ-Atyrau-01</td><td>Атырау</td><td>4 200 т/тәу</td><td><span className="adm-bdg adm-bok">Белсенді</span></td></tr>
              <tr><td>KZ-Mangystau-03</td><td>Маңғыстау</td><td>3 100 т/тәу</td><td><span className="adm-bdg adm-bok">Белсенді</span></td></tr>
              <tr><td>KZ-Kyzylorda-02</td><td>Қызылорда</td><td>2 800 т/тәу</td><td><span className="adm-bdg adm-bwarn">Жөндеу</span></td></tr>
              <tr><td>KZ-Tengiz</td><td>Теңіз</td><td>8 200 т/тәу</td><td><span className="adm-bdg adm-bok">Белсенді</span></td></tr>
            </tbody>
          </table>
        </div>
        <div className="adm-card">
          <div className="adm-card-t">📁 Жобалар</div>
          <table className="adm-tbl">
            <thead><tr><th>Жоба</th><th>Бюджет</th><th>Орындалуы</th></tr></thead>
            <tbody>
              <tr><td>SCADA NS Security</td><td>₸2.4 млрд</td><td><span className="adm-bdg adm-bok">78%</span></td></tr>
              <tr><td>Жайсаң ЖЭС</td><td>$340 млн</td><td><span className="adm-bdg adm-bwarn">45%</span></td></tr>
              <tr><td>Digital Twin</td><td>₸890 млн</td><td><span className="adm-bdg adm-bok">62%</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Logs ──────────────────────────────────────────────────────────────────────
function LogsPage({ logs }) {
  return (
    <div className="adm-pg">
      <div className="adm-tag">Журнал</div>
      <div className="adm-h1">Оқиғалар журналы</div>
      <div className="adm-sub">Барлық жүйелік оқиғалар тіркелімі</div>
      <div className="adm-card">
        <div className="adm-card-t">📋 Барлық оқиғалар</div>
        <div className="adm-log-list">{logs.slice(0,60).map((l,i)=><LogItem key={i} log={l}/>)}</div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(null); // null=loading, false=no, true=yes
  const [username, setUsername] = useState('admin');
  const [page, setPage] = useState('dashboard');
  const [sbOpen, setSbOpen] = useState(true);
  const [clock, setClock] = useState(ts());
  const [logs, setLogs] = useState([]);
  const [unread, setUnread] = useState(2);
  const [toast, setToast] = useState({msg:'',type:'tok',show:false});
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.getElementById('adm-css')) {
      const s = document.createElement('style'); s.id = 'adm-css';
      s.textContent = ADMIN_CSS; document.head.appendChild(s);
    }
    try {
      const r = localStorage.getItem('qmg_role');
      const u = localStorage.getItem('qmg_user');
      if (r === 'admin' && u) { setUsername(u); setAuthed(true); }
      else { setAuthed(false); }
    } catch { setAuthed(false); }
  }, []);

  useEffect(() => { const t = setInterval(()=>setClock(ts()), 1000); return ()=>clearInterval(t); }, []);

  const showToast = useCallback((msg, type='tok') => {
    setToast({msg,type,show:true});
    setTimeout(()=>setToast(p=>({...p,show:false})), 3200);
  }, []);

  const addLog = useCallback((type, tag, msg) => {
    const cls = {ok:'adm-bok',err:'adm-berr',warn:'adm-bwarn',info:'adm-binfo'}[type]||'adm-binfo';
    setLogs(prev => [{t:ts(),cls,tag,msg},...prev].slice(0,60));
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLogs([
      {t:ts(),cls:'adm-bok',tag:'[КІРУ]',msg:`${username} әкімші панеліне кірді · NS 5/5 ✓ · 2FA ✓ · L5`},
      {t:ts(),cls:'adm-berr',tag:'[ҚАУІП]',msg:'10.0.0.99 — рұқсатсыз кіру әрекеті бұғатталды'},
      {t:ts(),cls:'adm-binfo',tag:'[ЖҮЙЕ]',msg:'SCADA KZ-01: 178/180 RTU онлайн, NS v2.1 белсенді'},
      {t:ts(),cls:'adm-bok',tag:'[KDC]',msg:'Сессия кілті жаңартылды — барлық RTU шифрланған'},
      {t:ts(),cls:'adm-binfo',tag:'[СТАРТ]',msg:'Әкімші сессиясы басталды'},
    ]);
    const t1 = setTimeout(()=>{ addLog('warn','[ЖҮЙЕ]','Айгерімнен жаңа хабарлама'); showToast('💬 Операторdan жаңа хабарлама','tok'); setUnread(p=>p+1); }, 15000);
    const t2 = setTimeout(()=>{ addLog('err','[ШАБУЫЛ]','10.0.0.99 параллель сессия — NS Лоу бұғаттады'); showToast('💀 Шабуыл бұғатталды!','terr'); }, 28000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [authed]);

  // BroadcastChannel for unread badge
  useEffect(() => {
    if (!authed) return;
    let bc; try {
      bc = new BroadcastChannel('qmg_chat');
      bc.onmessage = (e) => {
        if (e.data?.type === 'new_msg' && e.data.msg.from !== 'admin') {
          if (page !== 'chat') setUnread(p=>p+1);
          showToast('💬 Операторdan жаңа хабарлама!','tok');
        }
      };
    } catch {}
    return () => { try { bc?.close(); } catch {} };
  }, [authed, page]);

  const goPage = (p) => { setPage(p); if (p==='chat') setUnread(0); };

  const downloadEmployee = (id) => {
    const e = EMPS.find(x=>x.id===id); if (!e) return;
    let c = '';
    c += '═══════════════════════════════════════════════════════\n';
    c += '   QAZMUNAIGAZ PRO — ҚЫЗМЕТКЕР ДЕРЕКТЕРІ (Құпия)\n';
    c += '═══════════════════════════════════════════════════════\n\n';
    c += `ID:                    ${e.id}\n`;
    c += `Шығарылды:             ${new Date().toLocaleString()}\n\n`;
    c += 'ЖЕКЕ ДЕРЕКТЕР\n─────────────────────────────────────────────────────\n';
    c += `Аты-жөні:              ${e.name}\nТуған күні:            ${e.bday}\n`;
    c += `ЖСН (ИИН):             ${e.iin}\nЖеке куәлік №:         ${e.doc}\n`;
    c += `Телефон:               ${e.phone}\nТіркелу мекен-жайы:    ${e.addr}\n\n`;
    c += 'ЖҰМЫС ДЕРЕКТЕРІ\n─────────────────────────────────────────────────────\n';
    c += `Лауазымы:              ${e.role}\nЖұмысқа алынды:        ${e.hired}\nЖалақы:                ${e.salary} / ай\n\n`;
    c += '═══════════════════════════════════════════════════════\n©️ 2025 QazMunaiGaz Pro · Құпия деректер\n═══════════════════════════════════════════════════════\n';
    dlTxt(c, `${e.id}_${e.name.split(' ')[0]}.txt`);
    showToast(`✓ ${e.name.split(' ')[0]} деректері жүктелді`,'tok');
    addLog('ok','[DB]',`Қызметкер деректері жүктелді: ${e.id}`);
  };

  const downloadReport = (period='2025-01') => {
    const r = REPORTS[period] || REPORTS['2025-01'];
    let c = '';
    c += '═══════════════════════════════════════════════════════\n   QAZMUNAIGAZ PRO — АЙЛЫҚ ҚАРЖЫЛЫҚ ЕСЕП\n═══════════════════════════════════════════════════════\n\n';
    c += `КЕЗЕҢ:          ${r.name}\nЕСЕП №:         QMG-RPT-${period}\nШығарылды:      ${new Date().toLocaleString()}\n\n`;
    c += 'НЕГІЗГІ КӨРСЕТКІШТЕР\n─────────────────────────────────────────────────────\n';
    c += `Жалпы кіріс:    ₸ ${r.inc} млрд\nТаза пайда:     ₸ ${(r.inc*0.4).toFixed(0)} млрд\nКонтракттар:    ${r.cnt}\n\n`;
    c += 'КОНТРАКТТАР ТІЗІМІ\n─────────────────────────────────────────────────────\n';
    CONTRACTS.slice(0, r.cnt).forEach((ct,i) => { c += `${i+1}. ${ct}\n`; });
    c += '\n═══════════════════════════════════════════════════════\n©️ 2025 QazMunaiGaz Pro · Құпия деректер\n═══════════════════════════════════════════════════════\n';
    dlTxt(c, `QMG_Report_${period}.txt`);
    showToast(`✓ ${r.name} есебі жүктелді`,'tok');
    addLog('ok','[ЕСЕП]',`${r.name} айлық есебі жүктелді (${r.cnt} контракт)`);
  };

  const doLogout = () => {
    try { localStorage.removeItem('qmg_user'); localStorage.removeItem('qmg_role'); } catch {}
    navigate('/');
  };

  const NAV = [
    {id:'dashboard',icon:'📊',label:'Дашборд'},
    {id:'employees',icon:'👥',label:'Қызметкерлер'},
    {id:'chat',icon:'💬',label:'Чат — Оператор',badge:unread},
    {id:'cameras',icon:'📹',label:'Камера жазбалары'},
    {id:'reports',icon:'📄',label:'Айлық есептер'},
    {id:'company',icon:'🏢',label:'Компания'},
    {id:'logs',icon:'📋',label:'Журнал'},
  ];

  // Only redirect AFTER we checked localStorage (authed !== null)
  useEffect(() => {
    if (authed === false) navigate('/');
  }, [authed, navigate]);
  if (authed === null) return null; // still loading
  if (authed === false) return null; // redirecting;

  return (
    <div className="adm-root">
      {/* Topbar */}
      <div className="adm-topbar">
        <div className="adm-tb-l">
          <button className={`adm-brgr${sbOpen?'':' open'}`} onClick={()=>setSbOpen(p=>!p)}>
            <span/><span/><span/>
          </button>
          <div className="adm-tlogo" onClick={doLogout}>
            <div className="adm-tlogo-ic">⛽</div>
            <div><div className="adm-tlogo-n">QazMunaiGaz Pro</div><div className="adm-tlogo-s">Әкімші панелі</div></div>
          </div>
          <div className="adm-rpill">👑 Әкімші · L5</div>
        </div>
        <div className="adm-tb-r">
          <div className="adm-ns-ind"><span className="adm-nd"></span>NS ON · KDC</div>
          <div className="adm-clock">{clock}</div>
          <div className="adm-tusr">
            <div className="adm-tav">{username[0]?.toUpperCase()}</div>
            <div><div className="adm-tun">{username}</div><div className="adm-tip">IP: 192.168.0.10</div></div>
          </div>
          <button className="adm-tout" onClick={doLogout}>Шығу ↩</button>
        </div>
      </div>

      {/* Body */}
      <div className="adm-body">
        <div className={`adm-sidebar${sbOpen?'':' collapsed'}`}>
          <div className="adm-sb-sec">Басқару</div>
          {NAV.map(n => (
            <button key={n.id} className={`adm-sbi${page===n.id?' active':''}`} onClick={()=>goPage(n.id)}>
              <span className="adm-sbi-ic">{n.icon}</span>
              {n.label}
              {n.badge>0 && <span className="adm-sbi-badge">{n.badge}</span>}
            </button>
          ))}
          <div className="adm-sb-div"/>
        </div>

        <div className="adm-content">
          {page==='dashboard'  && <Dashboard logs={logs} goPage={goPage} onDownloadReport={downloadReport}/>}
          {page==='employees'  && <EmployeesPage onDl={downloadEmployee}/>}
          {page==='chat'       && <ChatPage addLog={addLog}/>}
          {page==='cameras'    && <CamerasPage addLog={addLog} showToast={showToast}/>}
          {page==='reports'    && <ReportsPage onDownload={downloadReport}/>}
          {page==='company'    && <CompanyPage/>}
          {page==='logs'       && <LogsPage logs={logs}/>}
        </div>
      </div>

      <div className={`adm-toast ${toast.type}${toast.show?' show':''}`}>{toast.msg}</div>
    </div>
  );
}