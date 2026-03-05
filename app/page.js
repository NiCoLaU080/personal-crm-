'use client'
import { useState, useEffect, useRef } from "react";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  Notion: () => (
    <svg width="13" height="13" viewBox="0 0 100 100" fill="none">
      <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.194 12.818 2.913l17.641 12.34c2.913 2.139 3.886 2.72 3.886 5.053v68.052c0 4.277-1.553 6.804-6.99 7.19L24.837 99.58c-4.08.193-6.021-.389-8.35-3.108L3.326 79.082c-2.33-2.913-3.309-5.054-3.309-7.773V11.106c0-3.497 1.553-6.41 5.999-6.793z" fill="#fff"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M61.35.226L6.017 4.313C1.571 4.696.018 7.609.018 11.106v60.203c0 2.719.979 4.86 3.309 7.773l13.162 17.39c2.329 2.719 4.27 3.301 8.35 3.108l63.822-3.784c5.438-.389 6.99-2.912 6.99-7.19V19.532c0-2.195-.832-2.861-3.496-4.764L74.168 3.14C69.893.03 68.147-.357 61.35.226zM25.43 19.323c-5.058.338-6.209.418-9.083-1.838L8.776 11.49c-.738-.779-.35-1.752 1.556-1.946l53.644-3.888c4.468-.39 6.793 1.167 8.54 2.527l9.123 6.61c.39.195 1.362 1.364.194 1.364l-55.402 3.166zM19.8 88.827V30.06c0-2.525.777-3.694 3.107-3.886l61.4-3.498c2.138-.194 3.114 1.168 3.114 3.497v58.377c0 2.33-.778 3.887-3.496 4.083l-60.99 3.5c-2.718.193-3.5-1.166-3.5-3.306zm58.765-55.955c.387 1.75 0 3.5-1.75 3.694l-2.914.581v42.78c-2.524 1.363-4.853 2.139-6.797 2.139-3.108 0-3.886-1.166-6.021-4.083l-18.427-28.97v28.02l5.438 1.168s0 3.498-4.855 3.498l-13.386.779c-.39-.779 0-2.723 1.357-3.108l3.503-.972V39.536l-4.857-.389c-.39-1.75.579-4.273 3.302-4.47l14.373-.972 19.2 29.556V35.258l-4.468-.583c-.39-2.138 1.164-3.693 3.107-3.886l13.195-.917z" fill="#000"/>
    </svg>
  ),
  LinkedIn: ({ size = 13, color = "#0A66C2" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Instagram: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="url(#igGrad)">
      <defs>
        <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433"/>
          <stop offset="25%" stopColor="#e6683c"/>
          <stop offset="50%" stopColor="#dc2743"/>
          <stop offset="75%" stopColor="#cc2366"/>
          <stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  Gmail: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
    </svg>
  ),
  Phone: ({ size = 13, color = "#00e87a" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  Link: ({ size = 13, color = "#888" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  ),
  Birthday: ({ size = 14, color = "#ff6b9d" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 6c1.11 0 2-.89 2-2 0-.55-.23-1.05-.59-1.41L12 1l-1.41 1.59C10.23 2.95 10 3.45 10 4c0 1.11.89 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.13-2.13 2.13 2.13c.37.37.86.57 1.38.57C20.12 15.5 21 14.62 21 13.54V12c0-1.66-1.34-3-3-3z"/>
    </svg>
  ),
  Twitter: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DA1F2">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  WhatsApp: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
};

// ─── Constants ────────────────────────────────────────────────────────────────
const AREAS = ["University","BJJ / Combat Sports","Entrepreneurship","Content / Media","Personal","Work","Travel","Online","Event / Conference","Family","Health & Wellness","Finance / Investing"];
const DEFAULT_TAGS = ["classmate","professor","founder","investor","athlete","coach","friend","mentor","collab","journalist","sponsor","peer","recruiter","advisor","client","supplier","partner","fan","creator","researcher","doctor","lawyer","accountant","designer","engineer","manager","executive","volunteer","neighbour","alumni"];
const STORAGE_KEY = "crm-contacts-v3";
const SETTINGS_KEY = "crm-settings-v2";
const CUSTOM_TAGS_KEY = "crm-custom-tags";
const AREA_COLORS = {"University":"#7c9ef5","BJJ / Combat Sports":"#e07b5a","Entrepreneurship":"#00e87a","Content / Media":"#c97cf5","Personal":"#ffd166","Work":"#5ac8e0","Travel":"#f5a623","Online":"#a8e6cf","Event / Conference":"#ff6b9d","Family":"#ff9a7a","Health & Wellness":"#7affb2","Finance / Investing":"#ffe066"};
const areaColor = a => AREA_COLORS[a] || "#666";
const energyColor = e => e === "high" ? "#00e87a" : e === "medium" ? "#ffd166" : "#555";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const daysDiff = d => d ? Math.floor((new Date(d) - new Date(today())) / 86400000) : null;
const fmtDate = d => { if (!d) return ""; const [y,m,day] = d.split("-"); return `${day}/${m}/${y}`; };
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Birthday helpers — compare only MM-DD ignoring year
const birthdayDaysUntil = (bday) => {
  if (!bday) return null;
  const now = new Date();
  const parts = bday.split("-"); // YYYY-MM-DD or MM-DD
  const month = parseInt(parts.length === 3 ? parts[1] : parts[0]) - 1;
  const day = parseInt(parts.length === 3 ? parts[2] : parts[1]);
  const next = new Date(now.getFullYear(), month, day);
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  return Math.round((next - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
};

const fmtBirthday = (bday) => {
  if (!bday) return "";
  const parts = bday.split("-");
  if (parts.length === 3) { return `${parts[2]} ${MONTHS[parseInt(parts[1])-1]} ${parts[0]}`; }
  return `${parts[1]} ${MONTHS[parseInt(parts[0])-1]}`;
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  inp: { background:"#0d0d0d", border:"1px solid #1c1c1c", color:"#e0d8cd", padding:"9px 12px", fontSize:12, borderRadius:4, fontFamily:"inherit", width:"100%", boxSizing:"border-box" },
  lbl: { fontSize:9, letterSpacing:2, color:"#383838", textTransform:"uppercase", marginBottom:5, display:"block" },
  btn: { cursor:"pointer", fontFamily:"inherit", borderRadius:4, border:"none", fontSize:11, letterSpacing:1.2, textTransform:"uppercase", padding:"8px 14px" },
  card: { background:"#0a0a0a", border:"1px solid #161616", borderRadius:6, padding:"16px 18px" },
};

// ─── Link icon pills shown on contact rows & detail ──────────────────────────
const LinkPills = ({ links, size = 12, gap = 5 }) => {
  const entries = Object.entries(links || {}).filter(([,v]) => v?.trim());
  if (!entries.length) return null;
  const getIcon = (type, val) => {
    if (type === "linkedin") return <Icons.LinkedIn size={size} />;
    if (type === "instagram") return <Icons.Instagram size={size} />;
    if (type === "email") return <Icons.Gmail size={size} />;
    if (type === "phone") return val?.includes("whatsapp") ? <Icons.WhatsApp size={size} /> : <Icons.Phone size={size} color="#00e87a" />;
    if (type === "twitter") return <Icons.Twitter size={size} />;
    if (type === "whatsapp") return <Icons.WhatsApp size={size} />;
    return <Icons.Link size={size} color="#888" />;
  };
  const getHref = (type, val) => {
    if (type === "email") return `mailto:${val}`;
    if (type === "phone") return `tel:${val}`;
    if (val.startsWith("http")) return val;
    return `https://${val}`;
  };
  return (
    <div style={{ display:"flex", gap, alignItems:"center", flexWrap:"wrap" }}>
      {entries.map(([type, val]) => (
        <a key={type} href={getHref(type, val)} target="_blank" rel="noreferrer"
          onClick={e => e.stopPropagation()}
          title={`${type}: ${val}`}
          style={{ display:"flex", alignItems:"center", justifyContent:"center", width:size+10, height:size+10, borderRadius:4, background:"#111", border:"1px solid #1e1e1e", textDecoration:"none", flexShrink:0, transition:"border-color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor="#333"}
          onMouseLeave={e => e.currentTarget.style.borderColor="#1e1e1e"}>
          {getIcon(type, val)}
        </a>
      ))}
    </div>
  );
};

// ─── Expanded link list for detail view ──────────────────────────────────────
const LinkList = ({ links }) => {
  const entries = Object.entries(links || {}).filter(([,v]) => v?.trim());
  if (!entries.length) return null;
  const getIcon = (type) => {
    if (type === "linkedin") return <Icons.LinkedIn size={15} />;
    if (type === "instagram") return <Icons.Instagram size={15} />;
    if (type === "email") return <Icons.Gmail size={15} />;
    if (type === "phone") return <Icons.Phone size={15} color="#00e87a" />;
    if (type === "twitter") return <Icons.Twitter size={15} />;
    if (type === "whatsapp") return <Icons.WhatsApp size={15} />;
    return <Icons.Link size={15} color="#888" />;
  };
  const getHref = (type, val) => type==="email"?`mailto:${val}`:type==="phone"?`tel:${val}`:val.startsWith("http")?val:`https://${val}`;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      {entries.map(([type, val]) => (
        <a key={type} href={getHref(type,val)} target="_blank" rel="noreferrer"
          style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", padding:"8px 12px", background:"#080808", border:"1px solid #161616", borderRadius:5 }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#222"} onMouseLeave={e=>e.currentTarget.style.borderColor="#161616"}>
          <span style={{ display:"flex", alignItems:"center", justifyContent:"center", width:26, height:26, background:"#111", borderRadius:4, border:"1px solid #1c1c1c", flexShrink:0 }}>{getIcon(type)}</span>
          <span style={{ textTransform:"capitalize", color:"#444", fontSize:11, minWidth:60 }}>{type}</span>
          <span style={{ color:"#b8b0a5", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{val}</span>
        </a>
      ))}
    </div>
  );
};

export default function PersonalCRM() {
  const [contacts, setContacts] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [freeText, setFreeText] = useState("");
  const [quickText, setQuickText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [editData, setEditData] = useState(null);
  const [manualLinks, setManualLinks] = useState({ linkedin:"", instagram:"", email:"", phone:"", whatsapp:"", twitter:"", other:"" });
  const [newTag, setNewTag] = useState("");
  const [newInteraction, setNewInteraction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [notionKey, setNotionKey] = useState("");
  const [notionDbId, setNotionDbId] = useState("");
  const [pushing, setPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState(null);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [bdayView, setBdayView] = useState(false);
  const fileRef = useRef();
  const allTags = [...new Set([...DEFAULT_TAGS, ...customTags])].sort();
  const LINK_FIELDS = [
    { k:"linkedin", ph:"linkedin.com/in/...", label:"LinkedIn" },
    { k:"instagram", ph:"@handle", label:"Instagram" },
    { k:"email", ph:"email@...", label:"Gmail / Email" },
    { k:"phone", ph:"+351 ...", label:"Phone" },
    { k:"whatsapp", ph:"+351 ... or link", label:"WhatsApp" },
    { k:"twitter", ph:"@handle or twitter.com/...", label:"Twitter / X" },
    { k:"other", ph:"Website, TikTok...", label:"Other" },
  ];

  // ── Load ──
  useEffect(() => {
    try {
      const c = localStorage.getItem(STORAGE_KEY); if (c) setContacts(JSON.parse(c));
      // migrate from v2 storage key
      if (!c) { const old = localStorage.getItem("crm-contacts-v2"); if (old) { setContacts(JSON.parse(old)); } }
      const s = localStorage.getItem(SETTINGS_KEY); if (s) { const p=JSON.parse(s); setApiKey(p.apiKey||""); setNotionKey(p.notionKey||""); setNotionDbId(p.notionDbId||""); }
      const t = localStorage.getItem(CUSTOM_TAGS_KEY); if (t) setCustomTags(JSON.parse(t));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => { if (!ready) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); setSaveIndicator(true); setTimeout(()=>setSaveIndicator(false),1200); } catch {} }, [contacts, ready]);
  useEffect(() => { if (!ready) return; try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({apiKey,notionKey,notionDbId})); } catch {} }, [apiKey,notionKey,notionDbId,ready]);
  useEffect(() => { if (!ready) return; try { localStorage.setItem(CUSTOM_TAGS_KEY, JSON.stringify(customTags)); } catch {} }, [customTags,ready]);

  // ── Browser notification for birthdays ──
  useEffect(() => {
    if (!ready || !contacts.length) return;
    const todayBdays = contacts.filter(c => birthdayDaysUntil(c.birthday) === 0);
    if (todayBdays.length && "Notification" in window && Notification.permission === "granted") {
      todayBdays.forEach(c => new Notification(`🎂 ${c.name}'s birthday today!`, { body: `Don't forget to wish them well.` }));
    }
  }, [ready, contacts]);

  const requestNotifPermission = () => { if ("Notification" in window) Notification.requestPermission(); };

  // ── Export / Import ──
  const exportContacts = () => {
    const blob = new Blob([JSON.stringify({contacts, exportedAt: new Date().toISOString(), version:3},null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=`crm-backup-${today()}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const importContacts = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result); const imported = data.contacts || data;
        if (!Array.isArray(imported)) throw new Error();
        setContacts(prev => { const ids = new Set(prev.map(c=>c.id)); return [...prev, ...imported.filter(c=>!ids.has(c.id))]; });
        setImportMsg(`✓ Imported ${imported.length} contacts`);
      } catch { setImportMsg("✗ Invalid file"); }
      setTimeout(()=>setImportMsg(""),3000);
    };
    reader.readAsText(file); e.target.value="";
  };

  // ── Claude API ──
  const callClaude = async (prompt, max=1200) => {
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-allow-browser":"true"},
      body: JSON.stringify({model:"claude-opus-4-5-20251101",max_tokens:max,messages:[{role:"user",content:prompt}]})
    });
    const data = await res.json();
    return JSON.parse((data.content?.[0]?.text||"").replace(/```json|```/g,"").trim());
  };

  const parseWithClaude = async () => {
    if (!freeText.trim()||!apiKey) return;
    setLoading(true); setParsed(null);
    setManualLinks({linkedin:"",instagram:"",email:"",phone:"",whatsapp:"",twitter:"",other:""});
    try {
      const obj = await callClaude(`Extract structured contact info from this note. Return ONLY valid JSON, no markdown.
Note: "${freeText}"
{
  "name": "full name",
  "area": "University|BJJ / Combat Sports|Entrepreneurship|Content / Media|Personal|Work|Travel|Online|Event / Conference|Family|Health & Wellness|Finance / Investing",
  "context": "one sentence: how/where we met",
  "tags": ["1-3 from: ${allTags.slice(0,20).join(", ")}"],
  "followUp": "specific actionable follow-up",
  "followUpDate": "YYYY-MM-DD within 2 weeks from ${today()}",
  "birthday": "YYYY-MM-DD if mentioned, else empty string",
  "notes": "useful context 1-2 sentences",
  "energy": "high|medium|low",
  "links": { "linkedin": "", "instagram": "", "email": "", "phone": "", "whatsapp": "", "twitter": "", "other": "" }
}`);
      setParsed({...obj, id:Date.now(), addedDate:today(), interactions:[]});
      if (obj.links) setManualLinks({...{linkedin:"",instagram:"",email:"",phone:"",whatsapp:"",twitter:"",other:""},...obj.links});
    } catch { setParsed({error:"Couldn't parse — add more detail and try again."}); }
    setLoading(false);
  };

  const quickAdd = async () => {
    if (!quickText.trim()) return;
    setLoading(true);
    let contact = {id:Date.now(),name:quickText.trim(),area:"Personal",context:"Quick capture",tags:[],energy:"medium",notes:quickText,birthday:"",followUp:"Add more details",followUpDate:new Date(Date.now()+7*86400000).toISOString().split("T")[0],links:{},interactions:[],addedDate:today(),needsCleanup:true};
    if (apiKey) {
      try {
        const obj = await callClaude(`Extract minimal contact info. Return ONLY valid JSON.
Note: "${quickText}"
{ "name":"string","area":"University|BJJ / Combat Sports|Entrepreneurship|Content / Media|Personal|Work|Travel|Online|Event / Conference|Family|Health & Wellness|Finance / Investing","context":"one sentence","tags":["1-2 tags"],"energy":"high|medium|low" }`,400);
        contact = {...contact,...obj};
      } catch {}
    }
    setContacts(prev=>[contact,...prev]); setQuickText(""); setView("dashboard"); setLoading(false);
  };

  const saveContact = () => {
    if (!parsed||parsed.error) return;
    setContacts(prev=>[{...parsed,links:manualLinks,interactions:[]}, ...prev]);
    setView("list"); setFreeText(""); setParsed(null);
    setManualLinks({linkedin:"",instagram:"",email:"",phone:"",whatsapp:"",twitter:"",other:""});
  };

  const saveEdit = () => {
    if (!editData) return;
    const updated = {...editData, links:manualLinks, needsCleanup:false};
    setContacts(prev=>prev.map(c=>c.id===editData.id?updated:c));
    setSelected(updated); setView("detail");
  };

  const addInteraction = (contactId) => {
    if (!newInteraction.trim()) return;
    const entry = {date:today(), note:newInteraction.trim()};
    setContacts(prev=>prev.map(c=>c.id===contactId?{...c,interactions:[entry,...(c.interactions||[])]}:c));
    setSelected(prev=>({...prev,interactions:[entry,...(prev.interactions||[])]}));
    setNewInteraction("");
  };

  const deleteContact = (id) => { setContacts(prev=>prev.filter(c=>c.id!==id)); setView("list"); };

  const pushToNotion = async (contact) => {
    if (!notionKey||!notionDbId) { setSettingsOpen(true); return; }
    setPushing(true); setPushStatus(null);
    try {
      const linkStr = Object.entries(contact.links||{}).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join("\n");
      const res = await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contact:{...contact,linkStr},notionKey,notionDbId})});
      setPushStatus(res.ok?"success":"error");
    } catch { setPushStatus("error"); }
    setPushing(false);
  };

  // ── Birthday data ──
  const upcomingBdays = contacts
    .filter(c => c.birthday)
    .map(c => ({...c, daysUntil: birthdayDaysUntil(c.birthday)}))
    .sort((a,b) => a.daysUntil - b.daysUntil)
    .slice(0,20);
  const todayBdays = upcomingBdays.filter(c => c.daysUntil === 0);
  const soonBdays = upcomingBdays.filter(c => c.daysUntil > 0 && c.daysUntil <= 14);

  // ── Dashboard computed ──
  const overdue = contacts.filter(c=>{const d=daysDiff(c.followUpDate);return d!==null&&d<0;}).sort((a,b)=>daysDiff(a.followUpDate)-daysDiff(b.followUpDate));
  const dueSoon = contacts.filter(c=>{const d=daysDiff(c.followUpDate);return d!==null&&d>=0&&d<=7;}).sort((a,b)=>daysDiff(a.followUpDate)-daysDiff(b.followUpDate));
  const drafts = contacts.filter(c=>c.needsCleanup);

  // ── Filter ──
  const filtered = contacts.filter(c => {
    const q=searchQuery.toLowerCase();
    return (!q||c.name?.toLowerCase().includes(q)||c.context?.toLowerCase().includes(q)||c.tags?.some(t=>t.includes(q))||c.area?.toLowerCase().includes(q))
      &&(!filterArea||c.area===filterArea)&&(!filterTag||c.tags?.includes(filterTag));
  });
  const areaGroups={};
  filtered.forEach(c=>{const a=c.area||"Other";if(!areaGroups[a])areaGroups[a]=[];areaGroups[a].push(c);});

  // ── Sub-components ──
  const EnergyDot = ({e}) => <span style={{width:7,height:7,borderRadius:"50%",background:energyColor(e),display:"inline-block",marginRight:6,flexShrink:0}}/>;
  const Avatar = ({name,area,size=32}) => (
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,background:`${areaColor(area)}12`,border:`1px solid ${areaColor(area)}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,color:areaColor(area)}}>
      {name?.[0]?.toUpperCase()||"?"}
    </div>
  );
  const Tag = ({t}) => <span style={{fontSize:9,letterSpacing:1.2,textTransform:"uppercase",background:"#111",color:"#444",padding:"2px 7px",borderRadius:2,border:"1px solid #1a1a1a"}}>{t}</span>;
  const AreaBadge = ({area}) => <span style={{fontSize:9,letterSpacing:1.2,textTransform:"uppercase",color:areaColor(area),border:`1px solid ${areaColor(area)}38`,padding:"2px 8px",borderRadius:2}}>{area}</span>;

  const ContactRow = ({c, onClick}) => {
    const diff=daysDiff(c.followUpDate);
    const isOverdue=diff!==null&&diff<0;
    const isSoon=diff!==null&&diff>=0&&diff<=3;
    const bdayDays = birthdayDaysUntil(c.birthday);
    const isBdayToday = bdayDays === 0;
    const isBdaySoon = bdayDays !== null && bdayDays > 0 && bdayDays <= 7;
    return (
      <div onClick={onClick} style={{background:"#080808",border:`1px solid ${isOverdue?"#2e1414":isBdayToday?"#2e1a2e":"#131313"}`,padding:"11px 15px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:5,transition:"border-color 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor=isOverdue?"#4a1e1e":"#1e1e1e"}
        onMouseLeave={e=>e.currentTarget.style.borderColor=isOverdue?"#2e1414":isBdayToday?"#2e1a2e":"#131313"}>
        <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
          <Avatar name={c.name} area={c.area} size={30}/>
          <div style={{minWidth:0}}>
            <div style={{fontSize:13,display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <EnergyDot e={c.energy}/>
              <span style={{color:"#d8d0c5"}}>{c.name}</span>
              {c.needsCleanup&&<span style={{fontSize:8,color:"#f5a623",border:"1px solid #f5a62333",padding:"1px 5px",borderRadius:2}}>DRAFT</span>}
              {isBdayToday&&<span style={{fontSize:9,color:"#ff6b9d"}}>🎂 Birthday!</span>}
              {isBdaySoon&&!isBdayToday&&<span style={{fontSize:9,color:"#ff6b9d",opacity:0.7}}>🎂 {bdayDays}d</span>}
            </div>
            {/* Link icons row */}
            <LinkPills links={c.links} size={11} gap={4}/>
          </div>
        </div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0,marginLeft:12}}>
          {c.tags?.slice(0,1).map(t=><Tag key={t} t={t}/>)}
          <span style={{fontSize:10,color:isOverdue?"#e07b5a":isSoon?"#ffd166":"#252525",marginLeft:4,whiteSpace:"nowrap"}}>
            {isOverdue?`${Math.abs(diff)}d overdue`:diff===0?"today":isSoon?`${diff}d`:fmtDate(c.followUpDate)}
          </span>
        </div>
      </div>
    );
  };

  const BirthdayCard = ({c}) => (
    <div onClick={()=>{setSelected(c);setView("detail");}} style={{background:"#0a080d",border:"1px solid #2a1a2a",padding:"11px 15px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:5}}
      onMouseEnter={e=>e.currentTarget.style.borderColor="#3a1e3a"} onMouseLeave={e=>e.currentTarget.style.borderColor="#2a1a2a"}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Avatar name={c.name} area={c.area} size={30}/>
        <div>
          <div style={{fontSize:13,color:"#d8d0c5",marginBottom:3}}>{c.name}</div>
          <div style={{fontSize:11,color:"#554466"}}>{fmtBirthday(c.birthday)}</div>
        </div>
      </div>
      <div style={{textAlign:"right"}}>
        {c.daysUntil===0
          ? <div style={{fontSize:13,color:"#ff6b9d",fontWeight:600}}>🎂 Today!</div>
          : <div style={{fontSize:12,color:"#774488"}}>{c.daysUntil}d away</div>
        }
        <LinkPills links={c.links} size={11} gap={4}/>
      </div>
    </div>
  );

  if (!ready) return (
    <div style={{minHeight:"100vh",background:"#060606",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:28,height:28,border:"1px solid #1a1a1a",borderTop:"1px solid #555",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
    </div>
  );

  const NAV = [{id:"dashboard",label:"Dashboard",icon:"◈"},{id:"weekly",label:"Weekly",icon:"📋"},{id:"list",label:"Contacts",icon:"◎"},{id:"add",label:"Add",icon:"+"},{id:"quickadd",label:"Quick",icon:"⚡"},{id:"birthdays",label:"Birthdays",icon:"🎂"}];

  return (
    <div style={{minHeight:"100vh",background:"#060606",color:"#e0d8cd",fontFamily:"-apple-system,'Inter',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`
        *{box-sizing:border-box} input,textarea,select{outline:none} input:focus,textarea:focus,select:focus{border-color:#2a2a2a!important}
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:#060606} ::-webkit-scrollbar-thumb{background:#181818;border-radius:2px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}} .fade{animation:fadeIn 0.18s ease}
      `}</style>

      {/* Top bar */}
      <div style={{borderBottom:"1px solid #0e0e0e",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#060606",position:"sticky",top:0,zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontSize:14,fontWeight:700,letterSpacing:-0.5,color:"#c8c0b5"}}>Network <span style={{color:"#252525"}}>CRM</span></div>
          <div style={{display:"flex",gap:1,flexWrap:"wrap"}}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setView(n.id)} style={{...S.btn,background:view===n.id?"#111":"none",color:view===n.id?"#c8c0b5":"#2e2e2e",border:`1px solid ${view===n.id?"#1c1c1c":"transparent"}`,padding:"4px 10px",fontSize:10}}>
                {n.icon} {n.label}{n.id==="birthdays"&&todayBdays.length>0?<span style={{marginLeft:4,background:"#ff6b9d",color:"#000",borderRadius:8,fontSize:8,padding:"1px 5px"}}>{todayBdays.length}</span>:null}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:9,color:saveIndicator?"#00e87a":"transparent",transition:"color 0.4s",letterSpacing:1.5}}>✓ SAVED</span>
          <span style={{fontSize:10,color:"#252525"}}>{contacts.length}</span>
          <button onClick={()=>setSettingsOpen(!settingsOpen)} style={{...S.btn,background:settingsOpen?"#111":"none",color:"#333",border:"1px solid #141414",padding:"4px 9px",fontSize:11}}>⚙</button>
        </div>
      </div>

      {/* Settings */}
      {settingsOpen&&(
        <div className="fade" style={{background:"#080808",borderBottom:"1px solid #0e0e0e",padding:"18px 20px",display:"grid",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={S.lbl}>Anthropic API Key</label>
              <input type="password" placeholder="sk-ant-..." value={apiKey} onChange={e=>setApiKey(e.target.value)} style={S.inp}/>
              <div style={{fontSize:9,color:"#252525",marginTop:4}}>console.anthropic.com → API Keys</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              <button onClick={exportContacts} style={{...S.btn,background:"#0d0d0d",color:"#666",border:"1px solid #1c1c1c"}}>↓ Export Backup</button>
              <input ref={fileRef} type="file" accept=".json" onChange={importContacts} style={{display:"none"}}/>
              <button onClick={()=>fileRef.current?.click()} style={{...S.btn,background:"#0d0d0d",color:"#666",border:"1px solid #1c1c1c"}}>↑ Import Backup</button>
              {importMsg&&<div style={{fontSize:10,color:importMsg.startsWith("✓")?"#00e87a":"#e07b5a"}}>{importMsg}</div>}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={S.lbl}>Notion Token</label><input type="password" placeholder="secret_..." value={notionKey} onChange={e=>setNotionKey(e.target.value)} style={S.inp}/></div>
            <div><label style={S.lbl}>Notion Database ID</label><input placeholder="xxxxxxxxxxxxxxxx" value={notionDbId} onChange={e=>setNotionDbId(e.target.value)} style={S.inp}/></div>
          </div>
          <div>
            <label style={S.lbl}>Custom Tags</label>
            <div style={{display:"flex",gap:7,marginBottom:8}}>
              <input placeholder="e.g. podcast guest..." value={newTag} onChange={e=>setNewTag(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newTag.trim()){setCustomTags(p=>[...new Set([...p,newTag.trim().toLowerCase()])]);setNewTag("");}}} style={{...S.inp,flex:1}}/>
              <button onClick={()=>{if(newTag.trim()){setCustomTags(p=>[...new Set([...p,newTag.trim().toLowerCase()])]);setNewTag("");}}} style={{...S.btn,background:"#111",color:"#666",border:"1px solid #1c1c1c"}}>Add</button>
            </div>
            {customTags.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{customTags.map(t=><span key={t} onClick={()=>setCustomTags(p=>p.filter(x=>x!==t))} style={{fontSize:10,background:"#111",border:"1px solid #1c1c1c",color:"#666",padding:"3px 8px",borderRadius:3,cursor:"pointer"}}>{t} ×</span>)}</div>}
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={requestNotifPermission} style={{...S.btn,background:"#0d0d0d",color:"#666",border:"1px solid #1c1c1c"}}>🔔 Enable Birthday Notifications</button>
            <span style={{fontSize:10,color:"#252525"}}>Get browser alerts on birthdays</span>
          </div>
          <button onClick={()=>setSettingsOpen(false)} style={{...S.btn,background:"#111",color:"#555",border:"1px solid #1c1c1c",width:"fit-content"}}>Close</button>
        </div>
      )}

      {/* Birthday banner — shows if someone has a birthday today */}
      {todayBdays.length > 0 && view !== "birthdays" && (
        <div onClick={()=>setView("birthdays")} style={{background:"#1a0820",borderBottom:"1px solid #3a1040",padding:"10px 20px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}
          onMouseEnter={e=>e.currentTarget.style.background="#220a2a"} onMouseLeave={e=>e.currentTarget.style.background="#1a0820"}>
          <span style={{fontSize:16}}>🎂</span>
          <span style={{fontSize:13,color:"#ff6b9d",fontWeight:500}}>
            {todayBdays.map(c=>c.name).join(" & ")}{todayBdays.length===1?"'s":"'"} birthday {todayBdays.length===1?"is":"are"} today!
          </span>
          <span style={{fontSize:11,color:"#774488",marginLeft:"auto"}}>View →</span>
        </div>
      )}

      <div style={{flex:1,padding:"20px",maxWidth:800,width:"100%",margin:"0 auto"}}>

        {/* ══ DASHBOARD ══ */}
        {view==="dashboard"&&(
          <div className="fade" style={{display:"grid",gap:18}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[
                {label:"Total",value:contacts.length,color:"#c8c0b5"},
                {label:"High Energy",value:contacts.filter(c=>c.energy==="high").length,color:"#00e87a"},
                {label:"Overdue",value:overdue.length,color:overdue.length>0?"#e07b5a":"#252525"},
                {label:"This Week",value:dueSoon.length,color:dueSoon.length>0?"#ffd166":"#252525"},
              ].map(s=>(
                <div key={s.label} style={{...S.card,textAlign:"center",padding:"14px 10px"}}>
                  <div style={{fontSize:22,fontWeight:700,color:s.color,marginBottom:3}}>{s.value}</div>
                  <div style={{fontSize:8,letterSpacing:2,color:"#252525",textTransform:"uppercase"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {overdue.length>0&&(
              <div>
                <div style={{fontSize:9,letterSpacing:2,color:"#e07b5a",textTransform:"uppercase",marginBottom:8}}>⚠ Overdue Follow-ups ({overdue.length})</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>{overdue.slice(0,5).map(c=><ContactRow key={c.id} c={c} onClick={()=>{setSelected(c);setView("detail");}}/>)}</div>
              </div>
            )}

            {dueSoon.length>0&&(
              <div>
                <div style={{fontSize:9,letterSpacing:2,color:"#ffd166",textTransform:"uppercase",marginBottom:8}}>↗ Due This Week</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>{dueSoon.slice(0,5).map(c=><ContactRow key={c.id} c={c} onClick={()=>{setSelected(c);setView("detail");}}/>)}</div>
              </div>
            )}

            {(todayBdays.length>0||soonBdays.length>0)&&(
              <div>
                <div style={{fontSize:9,letterSpacing:2,color:"#ff6b9d",textTransform:"uppercase",marginBottom:8}}>🎂 Upcoming Birthdays</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>{[...todayBdays,...soonBdays].slice(0,4).map(c=><BirthdayCard key={c.id} c={c}/>)}</div>
              </div>
            )}

            {drafts.length>0&&(
              <div>
                <div style={{fontSize:9,letterSpacing:2,color:"#f5a623",textTransform:"uppercase",marginBottom:8}}>✎ Quick Captures — Needs Cleanup</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>{drafts.map(c=><ContactRow key={c.id} c={c} onClick={()=>{setSelected(c);setEditData({...c});setManualLinks({...{linkedin:"",instagram:"",email:"",phone:"",whatsapp:"",twitter:"",other:""},...(c.links||{})});setView("edit");}}/>)}</div>
              </div>
            )}

            {contacts.length>0&&(
              <div>
                <div style={{fontSize:9,letterSpacing:2,color:"#252525",textTransform:"uppercase",marginBottom:10}}>By Area</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:7}}>
                  {AREAS.map(area=>{const count=contacts.filter(c=>c.area===area).length;if(!count)return null;return(
                    <div key={area} onClick={()=>{setFilterArea(area);setView("list");}} style={{...S.card,cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:"10px 13px"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="#202020"} onMouseLeave={e=>e.currentTarget.style.borderColor="#161616"}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:areaColor(area),flexShrink:0}}/>
                      <div><div style={{fontSize:10,color:"#555",marginBottom:1,lineHeight:1.3}}>{area}</div><div style={{fontSize:17,fontWeight:700,color:areaColor(area)}}>{count}</div></div>
                    </div>
                  );})}
                </div>
              </div>
            )}

            {contacts.length===0&&(
              <div style={{...S.card,textAlign:"center",padding:"50px 20px"}}>
                <div style={{fontSize:28,marginBottom:12,opacity:0.15}}>◎</div>
                <div style={{color:"#252525",marginBottom:16,fontSize:13}}>Your network starts here.</div>
                <button onClick={()=>setView("add")} style={{...S.btn,background:"#e0d8cd",color:"#060606",padding:"10px 20px"}}>Add your first contact →</button>
              </div>
            )}
          </div>
        )}

        {/* ══ WEEKLY DIGEST ══ */}
        {view==="weekly"&&(()=>{
          const now = new Date();
          const dayOfWeek = now.getDay(); // 0=Sun
          const weekStart = new Date(now); weekStart.setDate(now.getDate() - dayOfWeek);
          const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
          const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          const fmtFull = d => { const dt=new Date(d); return `${dt.getDate()} ${MONTH_NAMES[dt.getMonth()]}`; };

          // This week's follow-ups
          const thisWeek = contacts.filter(c=>{const d=daysDiff(c.followUpDate);return d!==null&&d>=0&&d<=7;}).sort((a,b)=>daysDiff(a.followUpDate)-daysDiff(b.followUpDate));
          const overdueDigest = contacts.filter(c=>{const d=daysDiff(c.followUpDate);return d!==null&&d<0;}).sort((a,b)=>daysDiff(a.followUpDate)-daysDiff(b.followUpDate));

          // Gone cold — no interaction in 30+ days AND high/medium energy
          const goneCold = contacts.filter(c=>{
            if (c.energy==="low") return false;
            if (!c.interactions||c.interactions.length===0){
              const added = c.addedDate ? Math.floor((now - new Date(c.addedDate))/86400000) : 999;
              return added > 30;
            }
            const lastDate = c.interactions[0]?.date;
            if (!lastDate) return true;
            return Math.floor((now - new Date(lastDate))/86400000) > 30;
          }).sort((a,b)=>{
            const lastA = a.interactions?.[0]?.date ? Math.floor((now-new Date(a.interactions[0].date))/86400000) : 999;
            const lastB = b.interactions?.[0]?.date ? Math.floor((now-new Date(b.interactions[0].date))/86400000) : 999;
            return lastB - lastA;
          });

          // Birthdays in next 7 days
          const weekBdays = contacts.filter(c=>c.birthday).map(c=>({...c,daysUntil:birthdayDaysUntil(c.birthday)})).filter(c=>c.daysUntil<=7).sort((a,b)=>a.daysUntil-b.daysUntil);

          const totalActions = thisWeek.length + overdueDigest.length + weekBdays.length;

          const DigestRow = ({c, right, accent="#c8c0b5", onClick}) => (
            <div onClick={onClick||(() => {setSelected(c);setView("detail");})} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"#080808",border:"1px solid #131313",borderRadius:5,cursor:"pointer",gap:10}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#1e1e1e"} onMouseLeave={e=>e.currentTarget.style.borderColor="#131313"}>
              <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:`${areaColor(c.area)}12`,border:`1px solid ${areaColor(c.area)}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:areaColor(c.area),flexShrink:0}}>
                  {c.name?.[0]?.toUpperCase()}
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:13,color:"#d8d0c5",marginBottom:2}}>{c.name}</div>
                  <div style={{fontSize:11,color:"#2e2e2e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:240}}>{c.followUp||c.context}</div>
                </div>
              </div>
              <div style={{flexShrink:0,textAlign:"right"}}>
                <div style={{fontSize:11,color:accent,whiteSpace:"nowrap"}}>{right}</div>
                <div style={{marginTop:3}}><LinkPills links={c.links} size={10} gap={3}/></div>
              </div>
            </div>
          );

          return (
            <div className="fade" style={{display:"grid",gap:22}}>
              {/* Header */}
              <div style={{borderBottom:"1px solid #0e0e0e",paddingBottom:18}}>
                <div style={{fontSize:11,color:"#333",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>
                  Week of {fmtFull(weekStart)} · {DAY_NAMES[dayOfWeek]}
                </div>
                <div style={{fontSize:22,fontWeight:700,letterSpacing:-0.5,marginBottom:4}}>
                  {totalActions === 0 ? "You're all caught up 🎉" : `${totalActions} thing${totalActions!==1?"s":""} need your attention`}
                </div>
                <div style={{fontSize:12,color:"#333"}}>
                  {contacts.length} contacts · {overdueDigest.length} overdue · {goneCold.length} gone cold
                </div>
              </div>

              {/* Overdue first — urgent */}
              {overdueDigest.length>0&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <span style={{fontSize:9,letterSpacing:2,color:"#e07b5a",textTransform:"uppercase"}}>⚠ Overdue</span>
                    <span style={{fontSize:9,color:"#2a2a2a"}}>({overdueDigest.length})</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {overdueDigest.slice(0,5).map(c=><DigestRow key={c.id} c={c} right={`${Math.abs(daysDiff(c.followUpDate))}d overdue`} accent="#e07b5a"/>)}
                  </div>
                </div>
              )}

              {/* This week */}
              {thisWeek.length>0&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <span style={{fontSize:9,letterSpacing:2,color:"#ffd166",textTransform:"uppercase"}}>↗ Follow up this week</span>
                    <span style={{fontSize:9,color:"#2a2a2a"}}>({thisWeek.length})</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {thisWeek.map(c=><DigestRow key={c.id} c={c} right={daysDiff(c.followUpDate)===0?"today":`in ${daysDiff(c.followUpDate)}d`} accent="#ffd166"/>)}
                  </div>
                </div>
              )}

              {/* Birthdays this week */}
              {weekBdays.length>0&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <span style={{fontSize:9,letterSpacing:2,color:"#ff6b9d",textTransform:"uppercase"}}>🎂 Birthdays this week</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {weekBdays.map(c=>(
                      <DigestRow key={c.id} c={c}
                        right={c.daysUntil===0?"🎂 Today!":c.daysUntil===1?"tomorrow":`in ${c.daysUntil}d`}
                        accent={c.daysUntil===0?"#ff6b9d":"#774488"}/>
                    ))}
                  </div>
                </div>
              )}

              {/* Gone cold */}
              {goneCold.length>0&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:9,letterSpacing:2,color:"#444",textTransform:"uppercase"}}>❄ Gone cold</span>
                    <span style={{fontSize:9,color:"#2a2a2a"}}>({goneCold.length} high/medium energy contacts · 30+ days silent)</span>
                  </div>
                  <div style={{fontSize:10,color:"#252525",marginBottom:8}}>These people are worth a quick message.</div>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {goneCold.slice(0,6).map(c=>{
                      const daysSince = c.interactions?.[0]?.date
                        ? Math.floor((now-new Date(c.interactions[0].date))/86400000)
                        : c.addedDate ? Math.floor((now-new Date(c.addedDate))/86400000) : null;
                      return <DigestRow key={c.id} c={c} right={daysSince?`${daysSince}d ago`:"no contact"} accent="#333"/>;
                    })}
                  </div>
                </div>
              )}

              {/* All clear */}
              {totalActions===0&&goneCold.length===0&&(
                <div style={{...S.card,textAlign:"center",padding:"40px 20px"}}>
                  <div style={{fontSize:28,marginBottom:10}}>✓</div>
                  <div style={{color:"#2a2a2a"}}>Nothing urgent this week.</div>
                </div>
              )}

              {/* Summary footer */}
              <div style={{borderTop:"1px solid #0e0e0e",paddingTop:14,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[
                  {label:"High energy contacts",value:contacts.filter(c=>c.energy==="high").length,color:"#00e87a"},
                  {label:"Interactions logged",value:contacts.reduce((sum,c)=>sum+(c.interactions?.length||0),0),color:"#7c9ef5"},
                  {label:"Birthdays on record",value:contacts.filter(c=>c.birthday).length,color:"#ff6b9d"},
                ].map(s=>(
                  <div key={s.label} style={{...S.card,textAlign:"center",padding:"12px 8px"}}>
                    <div style={{fontSize:20,fontWeight:700,color:s.color,marginBottom:3}}>{s.value}</div>
                    <div style={{fontSize:8,letterSpacing:1.5,color:"#252525",textTransform:"uppercase",lineHeight:1.4}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ══ BIRTHDAYS ══ */}
        {view==="birthdays"&&(
          <div className="fade">
            <div style={{marginBottom:20}}>
              <div style={{fontSize:18,fontWeight:700,letterSpacing:-0.4,marginBottom:4}}>🎂 Birthdays</div>
              <div style={{fontSize:12,color:"#333"}}>Add birthdays when editing a contact. Get notified on the day.</div>
            </div>

            {todayBdays.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:9,letterSpacing:2,color:"#ff6b9d",textTransform:"uppercase",marginBottom:8}}>🎉 Today</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>{todayBdays.map(c=><BirthdayCard key={c.id} c={c}/>)}</div>
              </div>
            )}

            {soonBdays.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:9,letterSpacing:2,color:"#cc4488",textTransform:"uppercase",marginBottom:8}}>Next 14 Days</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>{soonBdays.map(c=><BirthdayCard key={c.id} c={c}/>)}</div>
              </div>
            )}

            {upcomingBdays.filter(c=>c.daysUntil>14).length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:9,letterSpacing:2,color:"#552244",textTransform:"uppercase",marginBottom:8}}>Coming Up</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>{upcomingBdays.filter(c=>c.daysUntil>14).map(c=><BirthdayCard key={c.id} c={c}/>)}</div>
              </div>
            )}

            {upcomingBdays.length===0&&(
              <div style={{...S.card,textAlign:"center",padding:"50px 20px"}}>
                <div style={{fontSize:28,marginBottom:10}}>🎂</div>
                <div style={{color:"#252525",marginBottom:8}}>No birthdays saved yet.</div>
                <div style={{fontSize:11,color:"#1e1e1e"}}>Edit any contact and add their birthday date.</div>
              </div>
            )}

            <div style={{marginTop:16,padding:"12px 16px",background:"#0a0a0a",border:"1px solid #141414",borderRadius:5}}>
              <div style={{fontSize:10,color:"#333",marginBottom:8}}>Enable browser notifications to get alerted on birthdays</div>
              <button onClick={requestNotifPermission} style={{...S.btn,background:"#141414",color:"#666",border:"1px solid #1c1c1c",fontSize:10}}>🔔 Enable Notifications</button>
            </div>
          </div>
        )}

        {/* ══ LIST ══ */}
        {view==="list"&&(
          <div className="fade">
            <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap"}}>
              <input placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{...S.inp,flex:1,minWidth:130}}/>
              <select value={filterArea} onChange={e=>setFilterArea(e.target.value)} style={{...S.inp,width:"auto",color:filterArea?"#e0d8cd":"#333",cursor:"pointer"}}>
                <option value="">All areas</option>{AREAS.map(a=><option key={a} value={a}>{a}</option>)}
              </select>
              <select value={filterTag} onChange={e=>setFilterTag(e.target.value)} style={{...S.inp,width:"auto",color:filterTag?"#e0d8cd":"#333",cursor:"pointer"}}>
                <option value="">All tags</option>{allTags.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              {(filterArea||filterTag||searchQuery)&&<button onClick={()=>{setFilterArea("");setFilterTag("");setSearchQuery("");}} style={{...S.btn,background:"none",color:"#333",border:"1px solid #181818"}}>✕</button>}
            </div>
            {filtered.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:"#252525"}}>{contacts.length===0?"No contacts yet.":"No matches."}</div>}
            {(filterArea||filterTag||searchQuery?[["Results",filtered]]:Object.entries(areaGroups)).map(([area,list])=>(
              <div key={area} style={{marginBottom:22}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:areaColor(area),display:"inline-block"}}/>
                  <span style={{fontSize:9,letterSpacing:2,color:"#252525",textTransform:"uppercase"}}>{area}</span>
                  <span style={{fontSize:9,color:"#1c1c1c"}}>({list.length})</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>{list.map(c=><ContactRow key={c.id} c={c} onClick={()=>{setSelected(c);setView("detail");}}/>)}</div>
              </div>
            ))}
          </div>
        )}

        {/* ══ QUICK ADD ══ */}
        {view==="quickadd"&&(
          <div className="fade" style={{maxWidth:500}}>
            <div style={{fontSize:9,letterSpacing:3,color:"#333",textTransform:"uppercase",marginBottom:8}}>Quick Capture</div>
            <div style={{fontSize:18,fontWeight:600,marginBottom:6,letterSpacing:-0.3}}>Just a name & one line.</div>
            <div style={{fontSize:12,color:"#333",marginBottom:20}}>Saves instantly as a draft. Clean up from the dashboard.</div>
            <textarea value={quickText} onChange={e=>setQuickText(e.target.value)} placeholder={"e.g. \"João — BJJ founder, Tilburg, met at kickoff\""} rows={3}
              style={{...S.inp,resize:"none",lineHeight:1.7,fontSize:14,padding:"14px"}}
              onKeyDown={e=>{if(e.key==="Enter"&&e.metaKey)quickAdd();}}/>
            <button onClick={quickAdd} disabled={loading||!quickText.trim()} style={{...S.btn,marginTop:10,background:loading?"#0d0d0d":"#e0d8cd",color:loading?"#444":"#060606",width:"100%",padding:"12px",fontSize:12}}>
              {loading?"Saving...":"Save draft ↵"}
            </button>
          </div>
        )}

        {/* ══ ADD ══ */}
        {view==="add"&&(
          <div className="fade" style={{maxWidth:540}}>
            <div style={{fontSize:9,letterSpacing:3,color:"#333",textTransform:"uppercase",marginBottom:8}}>New Contact</div>
            <div style={{fontSize:18,fontWeight:600,marginBottom:20,letterSpacing:-0.3}}>Describe who you met.</div>
            <textarea value={freeText} onChange={e=>setFreeText(e.target.value)}
              placeholder={"e.g. \"Met Carlos at a BJJ seminar in Porto. Black belt, runs a gym in Lisbon. His Instagram is @carlosgrappling and birthday is 14th June. Should DM him this week.\""}
              rows={5} style={{...S.inp,resize:"vertical",lineHeight:1.75,fontSize:13,padding:"14px"}}/>
            <button onClick={parseWithClaude} disabled={loading||!freeText.trim()||!apiKey}
              style={{...S.btn,marginTop:10,background:loading?"#0d0d0d":"#e0d8cd",color:loading?"#444":"#060606",width:"100%",padding:"12px",fontSize:12}}>
              {loading?"Extracting...":"Extract with AI →"}
            </button>
            {!apiKey&&<div style={{fontSize:10,color:"#333",textAlign:"center",marginTop:8}}>Add Anthropic API key in ⚙ Settings first</div>}

            {parsed&&!parsed.error&&(
              <div className="fade" style={{marginTop:18,...S.card}}>
                <div style={{fontSize:9,letterSpacing:2,color:"#333",textTransform:"uppercase",marginBottom:14}}>Review & edit</div>
                <div style={{display:"grid",gap:12}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><label style={S.lbl}>Name</label><input value={parsed.name||""} onChange={e=>setParsed(p=>({...p,name:e.target.value}))} style={S.inp}/></div>
                    <div><label style={S.lbl}>Area</label><select value={parsed.area||""} onChange={e=>setParsed(p=>({...p,area:e.target.value}))} style={{...S.inp,cursor:"pointer"}}>{AREAS.map(a=><option key={a} value={a}>{a}</option>)}</select></div>
                  </div>
                  <div><label style={S.lbl}>Context</label><input value={parsed.context||""} onChange={e=>setParsed(p=>({...p,context:e.target.value}))} style={S.inp}/></div>
                  <div><label style={S.lbl}>Notes</label><textarea value={parsed.notes||""} onChange={e=>setParsed(p=>({...p,notes:e.target.value}))} rows={2} style={{...S.inp,resize:"vertical",lineHeight:1.6}}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10}}>
                    <div><label style={S.lbl}>Follow-up</label><input value={parsed.followUp||""} onChange={e=>setParsed(p=>({...p,followUp:e.target.value}))} style={S.inp}/></div>
                    <div><label style={S.lbl}>Date</label><input type="date" value={parsed.followUpDate||""} onChange={e=>setParsed(p=>({...p,followUpDate:e.target.value}))} style={{...S.inp,width:130}}/></div>
                  </div>
                  <div><label style={S.lbl}>Birthday</label><input type="date" value={parsed.birthday||""} onChange={e=>setParsed(p=>({...p,birthday:e.target.value}))} style={S.inp} placeholder="Optional"/></div>
                  <div><label style={S.lbl}>Energy</label>
                    <div style={{display:"flex",gap:6}}>
                      {["high","medium","low"].map(e=>(
                        <button key={e} onClick={()=>setParsed(p=>({...p,energy:e}))} style={{...S.btn,background:parsed.energy===e?`${energyColor(e)}18`:"#0a0a0a",border:`1px solid ${parsed.energy===e?energyColor(e):"#1c1c1c"}`,color:parsed.energy===e?energyColor(e):"#444",textTransform:"capitalize"}}>{e}</button>
                      ))}
                    </div>
                  </div>
                  <div><label style={{...S.lbl,marginBottom:8}}>Contact Links</label>
                    <div style={{display:"grid",gap:6}}>
                      {LINK_FIELDS.map(({k,ph,label})=>(
                        <div key={k} style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{...S.lbl,marginBottom:0,minWidth:72,textAlign:"right"}}>{label}</span>
                          <input placeholder={ph} value={manualLinks[k]||""} onChange={e=>setManualLinks(l=>({...l,[k]:e.target.value}))} style={{...S.inp,flex:1}}/>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:7,marginTop:16}}>
                  <button onClick={saveContact} style={{...S.btn,background:"#e0d8cd",color:"#060606",flex:1,padding:"11px"}}>Save Contact</button>
                  <button onClick={()=>{const f={...parsed,links:manualLinks,interactions:[]};setContacts(p=>[f,...p]);pushToNotion(f);setView("list");setFreeText("");setParsed(null);}}
                    style={{...S.btn,background:"#0d0d0d",color:"#555",border:"1px solid #1c1c1c",display:"flex",alignItems:"center",gap:6}}>
                    <Icons.Notion/> Notion
                  </button>
                </div>
              </div>
            )}
            {parsed?.error&&<div style={{marginTop:12,color:"#e07b5a",fontSize:12}}>{parsed.error}</div>}
          </div>
        )}

        {/* ══ EDIT ══ */}
        {view==="edit"&&editData&&(
          <div className="fade" style={{maxWidth:540}}>
            <button onClick={()=>setView("detail")} style={{...S.btn,background:"none",color:"#333",border:"none",padding:"0 0 18px",fontSize:11}}>← Back</button>
            <div style={{fontSize:9,letterSpacing:3,color:"#333",textTransform:"uppercase",marginBottom:14}}>Edit Contact</div>
            <div style={{display:"grid",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={S.lbl}>Name</label><input value={editData.name||""} onChange={e=>setEditData(p=>({...p,name:e.target.value}))} style={S.inp}/></div>
                <div><label style={S.lbl}>Area</label><select value={editData.area||""} onChange={e=>setEditData(p=>({...p,area:e.target.value}))} style={{...S.inp,cursor:"pointer"}}>{AREAS.map(a=><option key={a} value={a}>{a}</option>)}</select></div>
              </div>
              <div><label style={S.lbl}>Context</label><input value={editData.context||""} onChange={e=>setEditData(p=>({...p,context:e.target.value}))} style={S.inp}/></div>
              <div><label style={S.lbl}>Notes</label><textarea value={editData.notes||""} onChange={e=>setEditData(p=>({...p,notes:e.target.value}))} rows={3} style={{...S.inp,resize:"vertical",lineHeight:1.6}}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10}}>
                <div><label style={S.lbl}>Follow-up</label><input value={editData.followUp||""} onChange={e=>setEditData(p=>({...p,followUp:e.target.value}))} style={S.inp}/></div>
                <div><label style={S.lbl}>Date</label><input type="date" value={editData.followUpDate||""} onChange={e=>setEditData(p=>({...p,followUpDate:e.target.value}))} style={{...S.inp,width:130}}/></div>
              </div>
              <div><label style={S.lbl}>Birthday</label><input type="date" value={editData.birthday||""} onChange={e=>setEditData(p=>({...p,birthday:e.target.value}))} style={S.inp} placeholder="Optional"/></div>
              <div><label style={S.lbl}>Energy</label>
                <div style={{display:"flex",gap:6}}>
                  {["high","medium","low"].map(e=>(
                    <button key={e} onClick={()=>setEditData(p=>({...p,energy:e}))} style={{...S.btn,background:editData.energy===e?`${energyColor(e)}18`:"#0a0a0a",border:`1px solid ${editData.energy===e?energyColor(e):"#1c1c1c"}`,color:editData.energy===e?energyColor(e):"#444",textTransform:"capitalize"}}>{e}</button>
                  ))}
                </div>
              </div>
              <div><label style={S.lbl}>Tags</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,maxHeight:110,overflowY:"auto"}}>
                  {allTags.map(t=>{const active=editData.tags?.includes(t);return(
                    <span key={t} onClick={()=>setEditData(p=>({...p,tags:active?p.tags.filter(x=>x!==t):[...(p.tags||[]),t]}))}
                      style={{fontSize:9,letterSpacing:1,textTransform:"uppercase",padding:"3px 8px",borderRadius:2,cursor:"pointer",background:active?"#0f1f0f":"#0d0d0d",color:active?"#00e87a":"#333",border:`1px solid ${active?"#00e87a33":"#181818"}`}}>{t}</span>
                  );})}
                </div>
              </div>
              <div><label style={{...S.lbl,marginBottom:8}}>Contact Links</label>
                <div style={{display:"grid",gap:6}}>
                  {LINK_FIELDS.map(({k,ph,label})=>(
                    <div key={k} style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{...S.lbl,marginBottom:0,minWidth:72,textAlign:"right"}}>{label}</span>
                      <input placeholder={ph} value={manualLinks[k]||""} onChange={e=>setManualLinks(l=>({...l,[k]:e.target.value}))} style={{...S.inp,flex:1}}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:7,marginTop:16}}>
              <button onClick={saveEdit} style={{...S.btn,background:"#e0d8cd",color:"#060606",flex:1,padding:"11px"}}>Save Changes</button>
              <button onClick={()=>setView("detail")} style={{...S.btn,background:"none",color:"#333",border:"1px solid #181818"}}>Cancel</button>
            </div>
          </div>
        )}

        {/* ══ DETAIL ══ */}
        {view==="detail"&&selected&&(
          <div className="fade" style={{maxWidth:540}}>
            <button onClick={()=>setView("list")} style={{...S.btn,background:"none",color:"#333",border:"none",padding:"0 0 16px",fontSize:11}}>← Back</button>
            <div style={{display:"flex",alignItems:"flex-start",gap:13,marginBottom:18}}>
              <Avatar name={selected.name} area={selected.area} size={48}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <EnergyDot e={selected.energy}/>
                  <span style={{fontSize:20,fontWeight:700,letterSpacing:-0.4}}>{selected.name}</span>
                  {selected.needsCleanup&&<span style={{fontSize:8,color:"#f5a623",border:"1px solid #f5a62333",padding:"2px 6px",borderRadius:2}}>DRAFT</span>}
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                  <AreaBadge area={selected.area}/>
                  {selected.tags?.map(t=><Tag key={t} t={t}/>)}
                </div>
                {/* Birthday badge */}
                {selected.birthday&&(
                  <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:birthdayDaysUntil(selected.birthday)===0?"#ff6b9d":"#554466"}}>
                    <Icons.Birthday size={13} color={birthdayDaysUntil(selected.birthday)===0?"#ff6b9d":"#554466"}/>
                    {fmtBirthday(selected.birthday)}
                    {birthdayDaysUntil(selected.birthday)===0&&<span style={{color:"#ff6b9d",fontWeight:600}}> · Today! 🎉</span>}
                    {birthdayDaysUntil(selected.birthday)!==0&&<span style={{color:"#333"}}> · in {birthdayDaysUntil(selected.birthday)}d</span>}
                  </div>
                )}
              </div>
              <button onClick={()=>{setEditData({...selected});setManualLinks({...{linkedin:"",instagram:"",email:"",phone:"",whatsapp:"",twitter:"",other:""},...(selected.links||{})});setView("edit");}} style={{...S.btn,background:"#0d0d0d",color:"#444",border:"1px solid #181818",fontSize:10}}>Edit</button>
            </div>

            {/* Contact links - big icons */}
            {selected.links&&Object.values(selected.links).some(v=>v)&&(
              <div style={{marginBottom:18}}>
                <label style={S.lbl}>Contact & Links</label>
                <LinkList links={selected.links}/>
              </div>
            )}

            <div style={{display:"grid",gap:12,marginBottom:18}}>
              {[
                ["Context",selected.context],
                ["Follow-up",selected.followUp],
                ["Follow-up Date",selected.followUpDate?`${fmtDate(selected.followUpDate)}${daysDiff(selected.followUpDate)<0?` · ${Math.abs(daysDiff(selected.followUpDate))}d overdue`:daysDiff(selected.followUpDate)===0?" · today":` · in ${daysDiff(selected.followUpDate)}d`}`:""],
                ["Notes",selected.notes],
                ["Added",fmtDate(selected.addedDate)],
              ].map(([label,val])=>val&&(
                <div key={label} style={{borderBottom:"1px solid #0d0d0d",paddingBottom:11}}>
                  <label style={S.lbl}>{label}</label>
                  <div style={{fontSize:13,color:"#b8b0a5",lineHeight:1.6}}>{val}</div>
                </div>
              ))}
            </div>

            {/* Interaction log */}
            <div style={{marginBottom:18}}>
              <label style={S.lbl}>Interaction Log</label>
              <div style={{display:"flex",gap:7,marginBottom:8}}>
                <input value={newInteraction} onChange={e=>setNewInteraction(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addInteraction(selected.id)}
                  placeholder={"e.g. \"Had coffee, he intro'd me to X\""} style={{...S.inp,flex:1}}/>
                <button onClick={()=>addInteraction(selected.id)} disabled={!newInteraction.trim()} style={{...S.btn,background:"#111",color:"#666",border:"1px solid #1c1c1c",whiteSpace:"nowrap"}}>+ Log</button>
              </div>
              {(selected.interactions||[]).length===0
                ?<div style={{fontSize:11,color:"#1c1c1c"}}>No interactions logged yet.</div>
                :<div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {(selected.interactions||[]).map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"8px 11px",background:"#080808",border:"1px solid #131313",borderRadius:4}}>
                      <span style={{fontSize:10,color:"#252525",whiteSpace:"nowrap",marginTop:1}}>{fmtDate(item.date)}</span>
                      <span style={{fontSize:12,color:"#777",lineHeight:1.5}}>{item.note}</span>
                    </div>
                  ))}
                </div>
              }
            </div>

            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              <button onClick={()=>{setPushStatus(null);pushToNotion(selected);}} disabled={pushing}
                style={{...S.btn,background:"#0d0d0d",color:"#444",border:"1px solid #181818",display:"flex",alignItems:"center",gap:6}}>
                <Icons.Notion/> {pushing?"Pushing...":"Push to Notion"}
              </button>
              <button onClick={()=>deleteContact(selected.id)} style={{...S.btn,background:"none",color:"#252525",border:"1px solid #131313"}}>Delete</button>
            </div>
            {pushStatus==="success"&&<div style={{color:"#00e87a",fontSize:11,marginTop:7}}>✓ Pushed to Notion</div>}
            {pushStatus==="error"&&<div style={{color:"#e07b5a",fontSize:11,marginTop:7}}>✗ Failed — check Notion settings</div>}
          </div>
        )}
      </div>
    </div>
  );
}
