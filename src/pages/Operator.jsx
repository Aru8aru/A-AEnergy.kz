import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── CSS Variables injected once ───────────────────────────────────────────
const GLOBAL_CSS = `
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

.qmg-root {
  width: 100%; height: 100vh; display: flex; flex-direction: column;
  background: var(--bg); position: relative; overflow: hidden;
}
.qmg-root::before {
  content: ''; position: fixed; inset: 0; z-index: 0;
  background-image: linear-gradient(rgba(67,160,71,.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(67,160,71,.012) 1px, transparent 1px);
  background-size: 40px 40px; pointer-events: none;
}

/* Topbar */
.topbar { height:54px; min-height:54px; display:flex; align-items:center;
  justify-content:space-between; padding:0 22px; background:var(--navy2);
  border-bottom:2px solid var(--green); flex-shrink:0; position:relative; z-index:10; }
.tb-l { display:flex; align-items:center; gap:14px; }
.brgr { background:none; border:none; cursor:pointer; padding:5px;
  display:flex; flex-direction:column; gap:5px; }
.brgr span { display:block; width:22px; height:2px; background:var(--t2);
  border-radius:1px; transition:all .3s; }
.brgr.open span:nth-child(1) { transform:rotate(45deg) translate(5px,5px); }
.brgr.open span:nth-child(2) { opacity:0; }
.brgr.open span:nth-child(3) { transform:rotate(-45deg) translate(5px,-5px); }
.tlogo { display:flex; align-items:center; gap:9px; text-decoration:none; cursor:pointer; }
.tlogo-ic { width:32px; height:32px; background:var(--green); border-radius:6px;
  display:flex; align-items:center; justify-content:center; font-size:16px; }
.tlogo-n { font-family:'Playfair Display',serif; font-size:14px; font-weight:700; color:#fff; }
.tlogo-s { font-size:9px; color:var(--t3); letter-spacing:.06em; text-transform:uppercase; }
.rpill { padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700;
  background:var(--green3); border:1px solid rgba(67,160,71,.4); color:var(--green2); }
.tb-r { display:flex; align-items:center; gap:12px; }
.ns-ind { display:flex; align-items:center; gap:5px; padding:5px 11px;
  border-radius:6px; font-size:11px; font-weight:600;
  background:var(--green3); border:1px solid rgba(67,160,71,.3); color:var(--green2); }
.nd { width:6px; height:6px; border-radius:50%; background:currentColor;
  animation:bp 2s infinite; }
.tclock { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--t2); }
.tusr { display:flex; align-items:center; gap:8px; padding:5px 12px;
  background:var(--bg3); border:1px solid var(--border); border-radius:8px; }
.tav { width:28px; height:28px; border-radius:50%; background:var(--green);
  display:flex; align-items:center; justify-content:center;
  font-size:13px; font-weight:700; color:#fff; }
.tun { font-size:12px; font-weight:600; }
.tip { font-size:10px; color:var(--t3); font-family:'JetBrains Mono',monospace; }
.tout { padding:6px 14px; background:transparent; border:1px solid var(--border);
  border-radius:6px; color:var(--t2); font-size:12px; cursor:pointer;
  font-family:'Golos Text',sans-serif; transition:all .2s; }
.tout:hover { border-color:var(--red); color:var(--red); }

/* Layout */
.body-wrap { flex:1; display:flex; overflow:hidden; position:relative; z-index:1; }
.sidebar { width:220px; min-width:220px; background:var(--bg2);
  border-right:1px solid var(--border); display:flex; flex-direction:column;
  overflow:hidden; transition:width .3s,min-width .3s; flex-shrink:0; }
.sidebar.collapsed { width:0; min-width:0; }
.sb-sec { padding:14px 14px 4px; font-size:10px; font-weight:700;
  color:var(--t4); letter-spacing:.12em; text-transform:uppercase; white-space:nowrap; }
.sbi { display:flex; align-items:center; gap:9px; padding:9px 14px;
  margin:1px 8px; border-radius:7px; cursor:pointer; font-size:13px;
  color:var(--t2); transition:all .15s; border:1px solid transparent;
  background:none; width:calc(100% - 16px); text-align:left;
  font-family:'Golos Text',sans-serif; font-weight:500; white-space:nowrap; }
.sbi:hover { background:rgba(255,255,255,.05); color:var(--text); }
.sbi.active { background:rgba(67,160,71,.1); color:var(--green2);
  border-color:rgba(67,160,71,.2); }
.sbi-ic { font-size:15px; width:18px; text-align:center; flex-shrink:0; }
.sbi-badge { margin-left:auto; background:var(--red); color:#fff;
  font-size:9px; font-weight:700; padding:2px 6px; border-radius:10px; }
.sb-div { height:1px; background:var(--border); margin:8px 14px; }

/* Content */
.content { flex:1; overflow-y:auto; background:var(--bg); }
.content::-webkit-scrollbar { width:4px; }
.content::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }
.pg { padding:26px; animation:pgi .25s ease; }
@keyframes pgi { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
.pg-tag { display:inline-block; padding:3px 10px; background:var(--green3);
  border:1px solid rgba(67,160,71,.25); color:var(--green2);
  font-size:10px; font-weight:700; letter-spacing:.08em;
  text-transform:uppercase; border-radius:3px; margin-bottom:10px; }
.pg-h1 { font-family:'Playfair Display',serif; font-size:24px;
  font-weight:700; color:#fff; margin-bottom:5px; }
.pg-sub { font-size:13px; color:var(--t2); margin-bottom:24px; }

/* Grid */
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.g-sensor { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:16px; }
.ip-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.mb { margin-bottom:16px; }

/* Card */
.card { background:var(--bg2); border:1px solid var(--border);
  border-radius:10px; padding:20px; }
.card-t { font-size:11px; font-weight:700; color:var(--t3);
  text-transform:uppercase; letter-spacing:.08em; margin-bottom:14px;
  display:flex; align-items:center; justify-content:space-between; }

/* Stat */
.stat { background:var(--bg2); border:1px solid var(--border);
  border-radius:10px; padding:18px; }
.stat-ic { font-size:24px; margin-bottom:9px; }
.stat-lb { font-size:11px; color:var(--t3); text-transform:uppercase;
  letter-spacing:.06em; margin-bottom:5px; font-weight:600; }
.stat-val { font-family:'Playfair Display',serif; font-size:26px;
  font-weight:700; color:#fff; line-height:1; }
.stat-unit { font-size:12px; color:var(--t2); margin-top:3px; }
.stat-tr { font-size:11px; margin-top:7px; }
.tup { color:var(--green2); } .tdn { color:var(--red); } .tok-c { color:var(--blue3); }

/* Badge */
.bdg { display:inline-block; padding:2px 8px; border-radius:4px;
  font-size:10px; font-weight:700; }
.bok { background:var(--green3); color:var(--green2); }
.bwarn { background:var(--amber2); color:var(--amber); }
.berr { background:var(--red2); color:var(--red); }
.binfo { background:rgba(21,101,192,.12); color:var(--blue3); }

/* Sensor ring */
.sc { background:var(--bg2); border:1px solid var(--border);
  border-radius:10px; padding:18px; text-align:center; transition:border-color .3s; }
.sc.alarm { animation:alarm 0.8s infinite; }
.sc-title { font-size:11px; font-weight:700; color:var(--t3);
  text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px; }
.ring { width:88px; height:88px; border-radius:50%; margin:0 auto 10px;
  display:flex; align-items:center; justify-content:center; }
.ring-in { width:66px; height:66px; border-radius:50%; background:var(--bg2);
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; }
.ring-num { font-family:'Playfair Display',serif; font-size:17px; font-weight:700; }
.ring-unit { font-size:9px; color:var(--t3); margin-top:1px; }
.sc-loc { font-size:10px; color:var(--t2); margin-bottom:5px; }
.sc-st { font-size:10px; font-weight:700; padding:3px 9px;
  border-radius:10px; display:inline-block; }

/* Attack banner */
.atk-ban { display:none; padding:14px 20px; background:var(--red2);
  border:1px solid rgba(229,57,53,.4); border-radius:8px;
  margin-bottom:16px; animation:atka 1s infinite; }
.atk-ban.show { display:flex; align-items:center; gap:12px; }

/* Table */
.tbl { width:100%; border-collapse:collapse; font-size:12px; }
.tbl th { text-align:left; padding:8px 12px; color:var(--t3);
  font-size:10px; font-weight:700; letter-spacing:.07em;
  text-transform:uppercase; border-bottom:1px solid var(--border); }
.tbl td { padding:9px 12px; border-bottom:1px solid var(--border2); color:var(--t2); }
.tbl td:first-child { color:var(--text); font-weight:500; }

/* Pipe */
.pipe-card { background:var(--bg3); border:1px solid var(--border);
  border-radius:9px; padding:16px; transition:border-color .2s; }
.pipe-card:hover { border-color:rgba(67,160,71,.2); }
.pipe-hd { display:flex; justify-content:space-between; margin-bottom:9px; }
.pipe-name { font-size:13px; font-weight:600; color:var(--text); }
.pipe-loc { font-size:11px; color:var(--t2); margin-top:2px; }
.pipe-bar { height:5px; background:rgba(255,255,255,.07);
  border-radius:3px; margin-bottom:7px; overflow:hidden; }
.pipe-fill { height:100%; border-radius:3px; }
.pfg { background:var(--green); } .pfa { background:var(--amber); }
.pfr { background:var(--red); } .pfb { background:#1976D2; }
.pipe-stats { display:flex; gap:14px; font-size:11px; color:var(--t2); }
.pipe-stat strong { display:block; color:var(--text); font-size:12px; }

/* Chat */
.chat-wrap { display:flex; flex-direction:column; height:400px; }
.chat-msgs { flex:1; overflow-y:auto; display:flex;
  flex-direction:column; gap:10px; padding:4px 0; }
.chat-msgs::-webkit-scrollbar { width:3px; }
.chat-msgs::-webkit-scrollbar-thumb { background:var(--t4); }
.bub { max-width:78%; padding:10px 14px; border-radius:10px;
  font-size:13px; line-height:1.5; }
.bub-me { background:rgba(67,160,71,.15); border:1px solid rgba(67,160,71,.25);
  align-self:flex-end; border-radius:10px 10px 2px 10px; }
.bub-them { background:var(--bg3); border:1px solid var(--border);
  align-self:flex-start; border-radius:10px 10px 10px 2px; }
.bmeta { font-size:10px; color:var(--t3); margin-top:4px;
  display:flex; align-items:center; gap:5px; flex-wrap:wrap; }
.enc-lbl { color:var(--green2); font-size:9px; }
.ctoggler { color:var(--blue3); font-size:9px; cursor:pointer; text-decoration:underline; }
.cipher-box { font-family:'JetBrains Mono',monospace; font-size:9.5px;
  color:var(--t3); margin-top:4px; padding:8px 12px;
  background:rgba(0,0,0,.3); border:1px solid rgba(200,150,12,.2);
  border-radius:5px; word-break:break-all; line-height:1.7; }
.chat-inp-row { display:flex; gap:8px; padding-top:10px;
  border-top:1px solid var(--border); margin-top:8px; }
.chat-inp { flex:1; padding:10px 13px; background:rgba(255,255,255,.05);
  border:1px solid var(--border); border-radius:7px; color:var(--text);
  font-size:13px; font-family:'Golos Text',sans-serif; outline:none; }
.chat-inp:focus { border-color:rgba(67,160,71,.4); }
.chat-inp::placeholder { color:var(--t3); }
.send-btn { padding:10px 18px; background:var(--green); color:#fff;
  border:none; border-radius:7px; font-size:13px; font-weight:700;
  cursor:pointer; font-family:'Golos Text',sans-serif; }
.send-btn:hover { background:var(--green2); }
.ns-legend { padding:10px 14px; background:rgba(200,150,12,.06);
  border:1px solid rgba(200,150,12,.15); border-radius:7px;
  font-size:11px; color:rgba(200,150,12,.8); line-height:1.8; margin-bottom:10px; }
.ns-legend strong { color:var(--gold2); }

/* IP card */
.ip-card { background:var(--bg3); border:1px solid var(--border);
  border-radius:9px; padding:14px; }
.ip-name { font-size:12px; font-weight:600; color:var(--text); margin-bottom:5px; }
.ip-addr { font-family:'JetBrains Mono',monospace; font-size:11px;
  color:var(--blue3); margin-bottom:5px; }
.ip-info { font-size:11px; color:var(--t2); line-height:1.7; }
.sdot { display:inline-block; width:6px; height:6px; border-radius:50%; }
.sdg { background:var(--green2); animation:bp 2s infinite; }
.sda { background:var(--amber); }
.sdr { background:var(--red); animation:bp .8s infinite; }

/* Log */
.log-list { display:flex; flex-direction:column; gap:4px; }
.li { display:flex; gap:9px; padding:8px 11px; border-radius:6px;
  background:var(--bg3); border:1px solid var(--border2); font-size:11px; }
.lt { font-family:'JetBrains Mono',monospace; color:var(--t3);
  flex-shrink:0; font-size:10px; padding-top:1px; }
.lm { color:var(--t2); flex:1; line-height:1.5; }

/* Toast */
.toast { position:fixed; bottom:22px; right:22px; z-index:8000;
  padding:12px 18px; border-radius:9px; font-size:13px;
  background:var(--bg2); border:1px solid var(--border);
  box-shadow:0 4px 24px rgba(0,0,0,.4); max-width:320px;
  transition:all .3s; opacity:0; transform:translateY(18px); pointer-events:none; }
.toast.show { opacity:1; transform:translateY(0); }
.toast.tok { border-color:rgba(67,160,71,.4); background:var(--green3); }
.toast.terr { border-color:rgba(229,57,53,.4); background:var(--red2); }
.toast.twarn { border-color:rgba(245,127,23,.4); background:var(--amber2); }

/* Auth wall */
.auth-wall { position:fixed; inset:0; z-index:9999; display:flex;
  align-items:center; justify-content:center;
  background:linear-gradient(135deg,var(--navy),#0a1f0a); }
.aw { background:var(--bg2); border:1px solid rgba(67,160,71,.25);
  border-radius:16px; width:420px; padding:36px; text-align:center;
  box-shadow:0 32px 80px rgba(0,0,0,.7); }
.aw h2 { font-family:'Playfair Display',serif; font-size:22px;
  color:#fff; margin:16px 0 8px; }
.aw p { font-size:13px; color:var(--t2); line-height:1.6; margin-bottom:22px; }
.aw-btn { display:inline-block; padding:12px 28px; background:var(--green);
  color:#fff; border:none; border-radius:8px; font-size:14px;
  font-weight:700; cursor:pointer; font-family:'Golos Text',sans-serif; }
.aw-fields { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; }
.aw-inp { padding:10px 14px; background:rgba(255,255,255,.05);
  border:1px solid var(--border); border-radius:8px; color:var(--text);
  font-size:14px; font-family:'Golos Text',sans-serif; outline:none; text-align:center; }
.aw-inp:focus { border-color:rgba(67,160,71,.4); }
.aw-inp::placeholder { color:var(--t3); }
.aw-err { color:var(--red); font-size:12px; margin-bottom:8px; }

@keyframes bp { 0%,100%{opacity:1} 50%{opacity:.25} }
@keyframes alarm { 0%,100%{border-color:rgba(229,57,53,.25)} 50%{border-color:var(--red);box-shadow:0 0 10px rgba(229,57,53,.25)} }
@keyframes atka { 0%,100%{border-color:rgba(229,57,53,.4)} 50%{border-color:var(--red)} }

@media(max-width:900px) {
  .sidebar { position:fixed; top:54px; bottom:0; z-index:800; }
  .g2,.g3,.g4,.g-sensor,.ip-grid { grid-template-columns:1fr; }
}
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const PIPES_DATA = [
  {name:'Негізгі транзит',loc:'Атырау — Арал',flow:'600 м³/сағ',len:'840 км',pct:70,c:'pfg',s:'ok'},
  {name:'Маңғыстау тармағы',loc:'Ақтау — Өзен',flow:'420 м³/сағ',len:'380 км',pct:82,c:'pfg',s:'ok'},
  {name:'⚠ B-14 АВАРИЯ',loc:'Атырау обл.',flow:'92 bar',len:'45 км',pct:100,c:'pfr',s:'err'},
  {name:'Солтүстік желі',loc:'Астана бағыты',flow:'280 м³/сағ',len:'560 км',pct:58,c:'pfb',s:'ok'},
  {name:'Оңтүстік экспорт',loc:'Шымкент бағыты',flow:'350 м³/сағ',len:'720 км',pct:65,c:'pfg',s:'ok'},
  {name:'Теңіз — КТК',loc:'Каспий',flow:'820 м³/сағ',len:'1500 км',pct:88,c:'pfa',s:'warn'},
];
const DEVS_DATA = [
  {name:'SCADA-Сервер-01',ip:'192.168.0.1',mac:'00:1A:2B:3C:4D:5E',type:'SCADA сервер',proto:'NS v2.1',s:'ok'},
  {name:'KDC-Сервер',ip:'192.168.0.5',mac:'00:1A:2B:3C:4D:05',type:'Kerberos KDC',proto:'Kerberos+NS',s:'ok'},
  {name:'RTU-01 Атырау',ip:'192.168.1.10',mac:'00:1A:2B:3C:4D:61',type:'RTU/PLC',proto:'NS v2.1',s:'ok'},
  {name:'RTU-07 Секция B',ip:'192.168.1.70',mac:'00:1A:2B:3C:4D:67',type:'RTU/PLC',proto:'NS v2.1',s:'warn'},
  {name:'PLC-03 Сорғы',ip:'192.168.2.30',mac:'00:1A:2B:3C:4D:83',type:'PLC',proto:'NS v2.1',s:'ok'},
  {name:'⚠ UNKNOWN-HOST',ip:'10.0.0.99',mac:'DE:AD:BE:EF:00:99',type:'Белгісіз',proto:'—',s:'err'},
];
const INIT_SENSORS = [
  {id:'P-01',name:'Қысым',loc:'Секция A',val:70,base:70,unit:'bar',min:60,max:80,dr:0.8},
  {id:'T-03',name:'Температура',loc:'Сорғы-3',val:85,base:85,unit:'°C',min:0,max:90,dr:0.5},
  {id:'F-07',name:'Ағын',loc:'Негізгі желі',val:600,base:600,unit:'м³/сағ',min:500,max:1000,dr:6},
  {id:'L-02',name:'Деңгей',loc:'Резервуар B',val:78,base:78,unit:'%',min:20,max:90,dr:0.3},
  {id:'P-14',name:'Қысым B-14',loc:'RTU-07',val:92,base:92,unit:'bar',min:60,max:85,dr:1.2},
  {id:'G-05',name:'Газ қысымы',loc:'Сепаратор-2',val:4.2,base:4.2,unit:'МПа',min:3,max:5,dr:0.05},
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const pp = n => String(n).padStart(2, '0');
const ts = () => { const d = new Date(); return `${pp(d.getHours())}:${pp(d.getMinutes())}:${pp(d.getSeconds())}`; };
const sst = s => s.val > s.max ? 'err' : s.val > s.max * 0.93 ? 'warn' : 'ok';
const scol = st => ({ok:'#43a047',warn:'#f57f17',err:'#e53935'}[st]);
const sdisp = s => s.unit === 'МПа' ? s.val.toFixed(1) : Math.round(s.val);

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

// ─── Sub-components ──────────────────────────────────────────────────────────

function AuthWall({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const tryLogin = () => {
    if (user === 'operator' && pass === 'op2025') {
      try { localStorage.setItem('qmg_user', user); localStorage.setItem('qmg_role', 'operator'); } catch {}
      onLogin(user);
    } else {
      setErr('Қате логин немесе пароль');
    }
  };

  return (
    <div className="auth-wall">
      <div className="aw">
        <div style={{fontSize:48}}>🛡️</div>
        <h2>Оператор панелі</h2>
        <p>Кіру үшін логин мен паролді енгізіңіз.<br />Демо: <strong style={{color:'#66bb6a'}}>operator / op2025</strong></p>
        <div className="aw-fields">
          <input className="aw-inp" placeholder="Логин" value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==='Enter'&&tryLogin()} />
          <input className="aw-inp" type="password" placeholder="Пароль" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&tryLogin()} />
        </div>
        {err && <div className="aw-err">{err}</div>}
        <button className="aw-btn" onClick={tryLogin}>Кіру →</button>
      </div>
    </div>
  );
}

function Toast({ msg, type, show }) {
  return <div className={`toast ${type} ${show ? 'show' : ''}`}>{msg}</div>;
}

function LogItem({ log }) {
  return (
    <div className="li">
      <span className="lt">{log.t}</span>
      <span style={{flexShrink:0,marginRight:5}}><span className={`bdg ${log.cls}`}>{log.tag}</span></span>
      <span className="lm">{log.msg}</span>
    </div>
  );
}

// Dashboard Page
function Dashboard({ logs, showAtk, hideAtk, atkVisible, goPage }) {
  return (
    <div className="pg">
      <div className="pg-tag">Дашборд</div>
      <div className="pg-h1">Оператор дашборды</div>
      <div className="pg-sub">SCADA жүйесі мониторингі — нақты уақыт</div>

      {atkVisible && (
        <div className="atk-ban show" style={{display:'flex'}}>
          <div style={{fontSize:22,flexShrink:0}}>💀</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:'var(--red)',marginBottom:3}}>⚠ КИБЕРШАБУЫЛ — NS БҰҒАТТАДЫ!</div>
            <div style={{fontSize:12,color:'rgba(229,57,53,.8)'}}>10.0.0.99 — параллель сессия шабуылы. NS Лоу түзетуімен тойтарды.</div>
          </div>
          <button onClick={hideAtk} style={{marginLeft:'auto',padding:'5px 12px',background:'transparent',border:'1px solid rgba(229,57,53,.4)',borderRadius:5,color:'var(--red)',fontSize:11,cursor:'pointer'}}>✕</button>
        </div>
      )}

      <div className="g4 mb">
        <div className="stat"><div className="stat-ic">🛢️</div><div className="stat-lb">Мұнай өндірісі</div><div className="stat-val">125.4</div><div className="stat-unit">мың тонна / тәулік</div><div className="stat-tr tup">↑ +3.2%</div></div>
        <div className="stat"><div className="stat-ic">⚙️</div><div className="stat-lb">Белсенді RTU</div><div className="stat-val" style={{color:'var(--green2)'}}>178/180</div><div className="stat-unit">онлайн</div><div className="stat-tr tok-c">2 техн. қызмет</div></div>
        <div className="stat"><div className="stat-ic">🔐</div><div className="stat-lb">NS Қорғаныс</div><div className="stat-val" style={{color:'var(--green2)'}}>100%</div><div className="stat-unit">шифрланған</div><div className="stat-tr tup">↑ 0 шабуыл</div></div>
        <div className="stat"><div className="stat-ic">⚠️</div><div className="stat-lb">Ескертулер</div><div className="stat-val" style={{color:'var(--amber)'}}>{atkVisible?3:2}</div><div className="stat-unit">белсенді</div><div className="stat-tr tok-c">RTU-07, B-14</div></div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-t">📋 Соңғы оқиғалар</div>
          <div className="log-list">{logs.slice(0,8).map((l,i)=><LogItem key={i} log={l}/>)}</div>
        </div>
        <div className="card">
          <div className="card-t">⚡ Тез іс-әрекеттер</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <button onClick={()=>goPage('chat')} style={{padding:'11px 16px',background:'var(--green)',color:'#fff',border:'none',borderRadius:7,fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'left',fontFamily:'Golos Text,sans-serif'}}>💬 Әкіміге хабарлама жазу</button>
            <button onClick={()=>goPage('scada')} style={{padding:'11px 16px',background:'rgba(21,101,192,.15)',color:'var(--blue3)',border:'1px solid rgba(21,101,192,.3)',borderRadius:7,fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'left',fontFamily:'Golos Text,sans-serif'}}>🏭 SCADA датчиктер</button>
            <button onClick={()=>goPage('pipes')} style={{padding:'11px 16px',background:'transparent',color:'var(--t2)',border:'1px solid var(--border)',borderRadius:7,fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'left',fontFamily:'Golos Text,sans-serif'}}>🔩 Құбыр желілері</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// SCADA Page
function ScadaPage({ sensors }) {
  const [updTime, setUpdTime] = useState(ts());
  useEffect(() => { setUpdTime(ts()); }, [sensors]);

  return (
    <div className="pg">
      <div className="pg-tag">SCADA</div>
      <div className="pg-h1">SCADA Мониторинг</div>
      <div className="pg-sub">Датчиктер — 3 секунд сайын нақты уақытта жаңарту</div>
      <div className="g-sensor">
        {sensors.map((s,i) => {
          const st = sst(s), col = scol(st);
          const pct = Math.min(100,Math.max(0,Math.round((s.val-s.min)/(s.max-s.min)*100)));
          const bg = `conic-gradient(${col} ${pct*1.8}deg, rgba(255,255,255,.07) ${pct*1.8}deg)`;
          const lbl = {ok:'✓ Норма',warn:'⚠ Назар',err:'✗ АВАРИЯ'}[st];
          const cls = `sc-st bdg ${st==='ok'?'bok':st==='warn'?'bwarn':'berr'}`;
          return (
            <div key={i} className={`sc${st==='err'?' alarm':''}`}>
              <div className="sc-title">{s.id} — {s.name}</div>
              <div className="ring" style={{background:bg}}>
                <div className="ring-in">
                  <div className="ring-num" style={{color:col}}>{sdisp(s)}</div>
                  <div className="ring-unit">{s.unit}</div>
                </div>
              </div>
              <div className="sc-loc">{s.loc}</div>
              <div className={cls}>{lbl}</div>
            </div>
          );
        })}
      </div>
      <div className="card">
        <div className="card-t"><span>📊 Барлық датчиктер</span><span style={{color:'var(--t3)',fontSize:11}}>{updTime}</span></div>
        <table className="tbl">
          <thead><tr><th>ID</th><th>Атауы</th><th>Орналасуы</th><th>Мән</th><th>Норма</th><th>Статус</th></tr></thead>
          <tbody>
            {sensors.map((s,i) => {
              const st = sst(s), col = scol(st);
              return (
                <tr key={i}>
                  <td style={{fontFamily:'monospace',fontSize:10}}>{s.id}</td>
                  <td>{s.name}</td><td>{s.loc}</td>
                  <td style={{fontWeight:700,color:col}}>{sdisp(s)} {s.unit}</td>
                  <td style={{fontSize:11,color:'var(--t2)'}}>{s.min}–{s.max} {s.unit}</td>
                  <td><span className={`bdg ${st==='ok'?'bok':st==='warn'?'bwarn':'berr'}`}>{st==='ok'?'Норма':st==='warn'?'Ескерту':'Авария'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Pipes Page
function PipesPage() {
  const SB = {ok:'bok',warn:'bwarn',err:'berr'};
  const SL = {ok:'Норма',warn:'Ескерту',err:'Авария'};
  return (
    <div className="pg">
      <div className="pg-tag">Құбырлар</div>
      <div className="pg-h1">Мұнай-газ тасымалдау желілері</div>
      <div className="pg-sub">Барлық технологиялық желілердің жай-күйі</div>
      <div className="g2 mb">
        {PIPES_DATA.map((p,i) => (
          <div key={i} className="pipe-card">
            <div className="pipe-hd">
              <div><div className="pipe-name">{p.name}</div><div className="pipe-loc">{p.loc}</div></div>
              <span className={`bdg ${SB[p.s]}`}>{SL[p.s]}</span>
            </div>
            <div className="pipe-bar"><div className={`pipe-fill ${p.c}`} style={{width:`${p.pct}%`}}></div></div>
            <div className="pipe-stats">
              <div className="pipe-stat"><strong>{p.flow}</strong>Ағын</div>
              <div className="pipe-stat"><strong>{p.len}</strong>Ұзындық</div>
              <div className="pipe-stat"><strong>{p.pct}%</strong>Жүктеме</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chat Page
function ChatPage({ addLog }) {
  const [msgs, setMsgs] = useState(loadMsgs);
  const [input, setInput] = useState('');
  const [openCipher, setOpenCipher] = useState({});
  const msgsEndRef = useRef(null);

  useEffect(() => { msgsEndRef.current?.scrollIntoView({behavior:'smooth'}); }, [msgs]);

  // BroadcastChannel listener
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('qmg_chat');
      bc.onmessage = (e) => {
        if (e.data?.type === 'new_msg' && e.data.msg.from !== 'operator') {
          const updated = [...loadMsgs(), e.data.msg];
          saveMsgs(updated);
          setMsgs([...updated]);
          addLog('ok','[ЧАТ]','admin → operator: жаңа хабарлама келді');
        }
      };
    } catch {}
    return () => { try { bc?.close(); } catch {} };
  }, [addLog]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const enc = nsKDCEncrypt(input, 'operator', 'admin');
    const msg = { from:'operator', text:input, time:ts().substr(0,5), enc, id:Date.now() };
    const updated = [...msgs, msg];
    saveMsgs(updated);
    setMsgs(updated);
    setInput('');
    try { new BroadcastChannel('qmg_chat').postMessage({type:'new_msg',msg}); } catch {}
    addLog('ok','[ЧАТ]','operator → admin: NS+KDC+AES-256 шифрланған хабарлама жіберілді');
  };

  const toggleCipher = (i) => setOpenCipher(p => ({...p,[i]:!p[i]}));

  return (
    <div className="pg">
      <div className="pg-tag">Чат</div>
      <div className="pg-h1">Чат — Әкіміммен байланыс</div>
      <div className="pg-sub">NS протоколымен AES-256 шифрланған байланыс · KDC сессия кілті</div>
      <div className="ns-legend">
        <strong>NS + KDC шифрлау:</strong><br/>
        1. Operator → KDC: &#123;operator, admin, Na&#125;Kkdc · сессия кілті сұрауы<br/>
        2. KDC → Operator: &#123;Ks, admin, Na, &#123;Ks,operator&#125;Kadmin&#125;Kop · кілт берілді<br/>
        3. Operator → Admin: &#123;Ks, operator&#125;Kadmin · &#123;msg&#125;Ks — AES-256 шифрланған<br/>
        4. Admin → Operator: &#123;Nb, reply&#125;Ks · Сессия расталды ✓
      </div>
      <div className="card">
        <div className="card-t">
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'var(--red)',animation:'bp 2s infinite',display:'inline-block'}}></span>
            admin — Әкімші (192.168.0.10)
          </div>
          <span className="bdg bok">🔐 NS+AES-256</span>
        </div>
        <div className="chat-wrap">
          <div className="chat-msgs">
            {!msgs.length
              ? <div style={{textAlign:'center',color:'var(--t3)',fontSize:12,padding:24}}>Хабарлама жоқ. Бірінші хабарламаны жіберіңіз!</div>
              : msgs.map((m,i) => {
                const isMe = m.from === 'operator';
                return (
                  <div key={i} style={{display:'flex',flexDirection:'column',alignItems:isMe?'flex-end':'flex-start',marginBottom:4}}>
                    <div className={`bub ${isMe?'bub-me':'bub-them'}`}>
                      <span style={{fontSize:10,opacity:.6,display:'block',marginBottom:2}}>{m.from.toUpperCase()}</span>
                      {m.text}
                    </div>
                    <div className="bmeta">
                      {isMe?'operator':'admin'} · {m.time}
                      &nbsp;·&nbsp;<span className="enc-lbl">🔐 NS+KDC+AES-256</span>
                      &nbsp;·&nbsp;<span className="ctoggler" onClick={()=>toggleCipher(i)}>📋 формула/шифр</span>
                    </div>
                    {openCipher[i] && m.enc && (
                      <div className="cipher-box">
                        <div style={{color:'var(--gold2)',fontWeight:700,marginBottom:5,fontSize:10}}>── Needham–Schroeder + KDC Протоколы ──</div>
                        {m.enc.formula?.map((f,fi)=><div key={fi} style={{marginBottom:3,color:'#57e389'}}>{f}</div>)}
                        <div style={{color:'var(--gold2)',fontWeight:700,margin:'7px 0 3px',fontSize:10}}>── AES-256 Шифрланған хабарлама ──</div>
                        <div style={{color:'var(--t2)',wordBreak:'break-all'}}>HEX: {m.enc.cipherHex||'—'}</div>
                        <div style={{color:'var(--t2)',marginTop:3,wordBreak:'break-all'}}>B64: {m.enc.cipherB64||'—'}</div>
                      </div>
                    )}
                  </div>
                );
              })
            }
            <div ref={msgsEndRef}/>
          </div>
          <div className="chat-inp-row">
            <input
              className="chat-inp"
              placeholder="🔐 NS шифрланған хабарлама жазыңыз..."
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&sendMsg()}
            />
            <button className="send-btn" onClick={sendMsg}>Жіберу →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Devices Page
function DevicesPage() {
  const SD = {ok:'sdg',warn:'sda',err:'sdr'};
  const SB = {ok:'bok',warn:'bwarn',err:'berr'};
  const SL = {ok:'Онлайн',warn:'Ескерту',err:'Қауіп'};
  return (
    <div className="pg">
      <div className="pg-tag">IP Құрылғылар</div>
      <div className="pg-h1">Желі құрылғылары</div>
      <div className="pg-sub">SCADA желісіндегі барлық RTU, PLC, серверлер</div>
      <div className="ip-grid mb">
        {DEVS_DATA.map((d,i) => (
          <div key={i} className="ip-card">
            <div className="ip-name">
              <span className={`sdot ${SD[d.s]}`} style={{marginRight:5}}></span>
              {d.name}
              <span className={`bdg ${SB[d.s]}`} style={{marginLeft:6,float:'right'}}>{SL[d.s]}</span>
            </div>
            <div className="ip-addr">{d.ip}</div>
            <div className="ip-info">
              Тип: {d.type}<br/>
              Протокол: <span style={{color:'var(--blue3)'}}>{d.proto}</span><br/>
              <span style={{fontFamily:'monospace',fontSize:9,color:'var(--t3)'}}>MAC: {d.mac}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Logs Page
function LogsPage({ logs }) {
  return (
    <div className="pg">
      <div className="pg-tag">Журнал</div>
      <div className="pg-h1">Оқиғалар журналы</div>
      <div className="pg-sub">Барлық жүйелік оқиғалар тіркелімі</div>
      <div className="card">
        <div className="card-t">📋 Барлық оқиғалар</div>
        <div className="log-list">{logs.slice(0,60).map((l,i)=><LogItem key={i} log={l}/>)}</div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function Operator() {
  const [authed, setAuthed] = useState(null); // null=loading, false=no, true=yes
  const [username, setUsername] = useState('operator');
  const [page, setPage] = useState('dashboard');
  const [sbOpen, setSbOpen] = useState(true);
  const [clock, setClock] = useState(ts());
  const [logs, setLogs] = useState([]);
  const [sensors, setSensors] = useState(INIT_SENSORS.map(s=>({...s})));
  const [atkVisible, setAtkVisible] = useState(false);
  const [unread, setUnread] = useState(1);
  const [toast, setToast] = useState({msg:'',type:'tok',show:false});
  const navigate = useNavigate();

  // Inject CSS
  useEffect(() => {
    if (!document.getElementById('qmg-styles')) {
      const style = document.createElement('style');
      style.id = 'qmg-styles';
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
    // Check existing session
    try {
      const r = localStorage.getItem('qmg_role');
      const u = localStorage.getItem('qmg_user');
      if (r === 'operator' && u) { setUsername(u); setAuthed(true); }
      else { setAuthed(false); }
    } catch { setAuthed(false); }
  }, []);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setClock(ts()), 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = useCallback((msg, type='tok') => {
    setToast({msg,type,show:true});
    setTimeout(()=>setToast(p=>({...p,show:false})), 3200);
  }, []);

  const addLog = useCallback((type, tag, msg) => {
    const cls = {ok:'bok',err:'berr',warn:'bwarn',info:'binfo'}[type]||'binfo';
    setLogs(prev => [{t:ts(),cls,tag,msg},...prev].slice(0,60));
  }, []);

  // Init timers
  useEffect(() => {
    if (!authed) return;
    const initLogs = [
      {t:'ok',k:'[КІРУ]',m:`${username} оператор панеліне кірді · NS 5/5 ✓ · 2FA ✓`},
      {t:'warn',k:'[RTU-07]',m:'B-14 секция — қысым нормадан жоғары: 92 bar'},
      {t:'info',k:'[ЖҮЙЕ]',m:'SCADA KZ-01: 178/180 RTU онлайн'},
      {t:'ok',k:'[KDC]',m:'Сессия кілті жаңартылды — RSA-2048 + AES-256'},
      {t:'info',k:'[СТАРТ]',m:'Оператор сессиясы басталды'},
    ];
    setLogs(initLogs.map(l=>({t:ts(),cls:{ok:'bok',err:'berr',warn:'bwarn',info:'binfo'}[l.t],tag:l.k,msg:l.m})));

    const t1 = setTimeout(()=>{ addLog('warn','[RTU-07]','Қысым критикалық деңгейге жетті'); showToast('⚠ RTU-07 авария ескертуі!','twarn'); }, 10000);
    const t2 = setTimeout(()=>{ addLog('err','[ШАБУЫЛ]','10.0.0.99 — NS Лоу шабуылы бұғатталды'); showToast('💀 Шабуыл бұғатталды! NS жұмыс істеді','terr'); setAtkVisible(true); }, 22000);
    const t3 = setTimeout(()=>{ addLog('ok','[NS]','KDC сессия кілтін жаңартты'); setAtkVisible(false); showToast('✓ Жүйе қалпына келді','tok'); }, 38000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [authed]);

  // Live sensor updates
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => {
      setSensors(prev => prev.map(s => {
        let val = parseFloat((s.val + (Math.random()-.5)*2*s.dr).toFixed(s.unit==='МПа'?1:0));
        val = Math.max(s.base*.8, Math.min(s.base*1.2, val));
        return {...s, val};
      }));
    }, 3000);
    return () => clearInterval(t);
  }, [authed]);

  const goPage = (p) => {
    setPage(p);
    if (p === 'chat') setUnread(0);
  };

  const doLogout = () => {
    try { localStorage.removeItem('qmg_user'); localStorage.removeItem('qmg_role'); } catch {}
    navigate('/');
  };

  const onLogin = (u) => { setUsername(u); setAuthed(true); };

  // Only redirect AFTER we checked localStorage (authed !== null)
  useEffect(() => {
    if (authed === false) navigate('/');
  }, [authed, navigate]);
  if (authed === null) return null; // still loading
  if (authed === false) return null; // redirecting

  const NAV = [
    {id:'dashboard',icon:'📊',label:'Дашборд'},
    {id:'scada',icon:'🏭',label:'SCADA Мониторинг'},
    {id:'pipes',icon:'🔩',label:'Құбыр желілері'},
    {id:'chat',icon:'💬',label:'Чат — Әкімші',badge:unread},
    {id:'devices',icon:'📡',label:'IP Құрылғылар'},
    {id:'logs',icon:'📋',label:'Журнал'},
  ];

  return (
    <div className="qmg-root">
      {/* Topbar */}
      <div className="topbar">
        <div className="tb-l">
          <button className={`brgr${sbOpen?'':' open'}`} onClick={()=>setSbOpen(p=>!p)}>
            <span/><span/><span/>
          </button>
          <div className="tlogo" onClick={doLogout}>
            <div className="tlogo-ic">⛽</div>
            <div><div className="tlogo-n">QazMunaiGaz Pro</div><div className="tlogo-s">Оператор панелі</div></div>
          </div>
          <div className="rpill">🛡️ Оператор · L2</div>
        </div>
        <div className="tb-r">
          <div className="ns-ind"><span className="nd"></span>NS ON · KDC</div>
          <div className="tclock">{clock}</div>
          <div className="tusr">
            <div className="tav">{username[0]?.toUpperCase()}</div>
            <div><div className="tun">{username}</div><div className="tip">IP: 192.168.0.22</div></div>
          </div>
          <button className="tout" onClick={doLogout}>Шығу ↩</button>
        </div>
      </div>

      {/* Body */}
      <div className="body-wrap">
        {/* Sidebar */}
        <div className={`sidebar${sbOpen?'':' collapsed'}`}>
          <div className="sb-sec">Негізгі</div>
          {NAV.map(n => (
            <button key={n.id} className={`sbi${page===n.id?' active':''}`} onClick={()=>goPage(n.id)}>
              <span className="sbi-ic">{n.icon}</span>
              {n.label}
              {n.badge>0 && <span className="sbi-badge">{n.badge}</span>}
            </button>
          ))}
          <div className="sb-div"/>
        </div>

        {/* Content */}
        <div className="content">
          {page==='dashboard' && <Dashboard logs={logs} showAtk={()=>setAtkVisible(true)} hideAtk={()=>setAtkVisible(false)} atkVisible={atkVisible} goPage={goPage}/>}
          {page==='scada' && <ScadaPage sensors={sensors}/>}
          {page==='pipes' && <PipesPage/>}
          {page==='chat' && <ChatPage addLog={addLog}/>}
          {page==='devices' && <DevicesPage/>}
          {page==='logs' && <LogsPage logs={logs}/>}
        </div>
      </div>

      <Toast msg={toast.msg} type={toast.type} show={toast.show}/>
    </div>
  );
}