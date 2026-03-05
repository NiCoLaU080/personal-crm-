'use client'
import { useState, useEffect } from "react";

const NOTION_ICON = (
  <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
    <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.194 12.818 2.913l17.641 12.34c2.913 2.139 3.886 2.72 3.886 5.053v68.052c0 4.277-1.553 6.804-6.99 7.19L24.837 99.58c-4.08.193-6.021-.389-8.35-3.108L3.326 79.082c-2.33-2.913-3.309-5.054-3.309-7.773V11.106c0-3.497 1.553-6.41 5.999-6.793z" fill="#fff"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M61.35.226L6.017 4.313C1.571 4.696.018 7.609.018 11.106v60.203c0 2.719.979 4.86 3.309 7.773l13.162 17.39c2.329 2.719 4.27 3.301 8.35 3.108l63.822-3.784c5.438-.389 6.99-2.912 6.99-7.19V19.532c0-2.195-.832-2.861-3.496-4.764L74.168 3.14C69.893.03 68.147-.357 61.35.226zM25.43 19.323c-5.058.338-6.209.418-9.083-1.838L8.776 11.49c-.738-.779-.35-1.752 1.556-1.946l53.644-3.888c4.468-.39 6.793 1.167 8.54 2.527l9.123 6.61c.39.195 1.362 1.364.194 1.364l-55.402 3.166zM19.8 88.827V30.06c0-2.525.777-3.694 3.107-3.886l61.4-3.498c2.138-.194 3.114 1.168 3.114 3.497v58.377c0 2.33-.778 3.887-3.496 4.083l-60.99 3.5c-2.718.193-3.5-1.166-3.5-3.306zm58.765-55.955c.387 1.75 0 3.5-1.75 3.694l-2.914.581v42.78c-2.524 1.363-4.853 2.139-6.797 2.139-3.108 0-3.886-1.166-6.021-4.083l-18.427-28.97v28.02l5.438 1.168s0 3.498-4.855 3.498l-13.386.779c-.39-.779 0-2.723 1.357-3.108l3.503-.972V39.536l-4.857-.389c-.39-1.75.579-4.273 3.302-4.47l14.373-.972 19.2 29.556V35.258l-4.468-.583c-.39-2.138 1.164-3.693 3.107-3.886l13.195-.917z" fill="#000"/>
  </svg>
);

const AREAS = ["University", "BJJ / Combat Sports", "Entrepreneurship", "Content / Media", "Personal", "Work", "Travel", "Online"];
const TAGS = ["classmate", "professor", "founder", "investor", "athlete", "coach", "friend", "mentor", "collab", "journalist", "sponsor", "peer", "recruiter", "advisor"];
const STORAGE_KEY = "crm-contacts";
const SETTINGS_KEY = "crm-settings";

const areaColor = (area) => ({
  "University": "#7c9ef5",
  "BJJ / Combat Sports": "#e07b5a",
  "Entrepreneurship": "#00ff87",
  "Content / Media": "#c97cf5",
  "Personal": "#ffd166",
  "Work": "#5ac8e0",
  "Travel": "#f5a623",
  "Online": "#a8e6cf",
}[area] || "#666");

export default function PersonalCRM() {
  const [contacts, setContacts] = useState([]);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [notionKey, setNotionKey] = useState("");
  const [notionDbId, setNotionDbId] = useState("");
  const [pushing, setPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [manualLinks, setManualLinks] = useState({ linkedin: "", instagram: "", email: "", phone: "", other: "" });
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [apiKey, setApiKey] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setContacts(JSON.parse(saved));
      const settings = localStorage.getItem(SETTINGS_KEY);
      if (settings) {
        const s = JSON.parse(settings);
        if (s.notionKey) setNotionKey(s.notionKey);
        if (s.notionDbId) setNotionDbId(s.notionDbId);
        if (s.apiKey) setApiKey(s.apiKey);
      }
    } catch {}
    setReady(true);
  }, []);

  // Auto-save contacts
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 1500);
    } catch {}
  }, [contacts, ready]);

  // Save settings
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ notionKey, notionDbId, apiKey }));
    } catch {}
  }, [notionKey, notionDbId, apiKey, ready]);

  const parseWithClaude = async () => {
    if (!freeText.trim()) return;
    if (!apiKey.trim()) { alert("Please add your Anthropic API key in Settings first."); setSettingsOpen(true); return; }
    setLoading(true);
    setParsed(null);
    setManualLinks({ linkedin: "", instagram: "", email: "", phone: "", other: "" });
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-opus-4-5-20251101",
          max_tokens: 1200,
          messages: [{
            role: "user",
            content: `Extract structured contact info from this note. Return ONLY valid JSON, no markdown, no explanation.

Note: "${freeText}"

Return this exact JSON shape:
{
  "name": "string (full name if available)",
  "area": "pick ONE from: University, BJJ / Combat Sports, Entrepreneurship, Content / Media, Personal, Work, Travel, Online",
  "context": "one sentence: how/where we met",
  "tags": ["pick 1-3 from: classmate, professor, founder, investor, athlete, coach, friend, mentor, collab, journalist, sponsor, peer, recruiter, advisor"],
  "followUp": "specific actionable follow-up",
  "followUpDate": "suggested date in YYYY-MM-DD format within 1-2 weeks from today ${new Date().toISOString().split("T")[0]}",
  "notes": "any other useful context in 1-2 sentences",
  "energy": "high | medium | low",
  "links": {
    "linkedin": "extract if mentioned, else empty string",
    "instagram": "extract if mentioned, else empty string",
    "email": "extract if mentioned, else empty string",
    "phone": "extract if mentioned, else empty string",
    "other": "any other URL or handle mentioned, else empty string"
  }
}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const obj = JSON.parse(text.replace(/```json|```/g, "").trim());
      setParsed({ ...obj, id: Date.now(), addedDate: new Date().toISOString().split("T")[0] });
      if (obj.links) setManualLinks({ ...{ linkedin: "", instagram: "", email: "", phone: "", other: "" }, ...obj.links });
    } catch {
      setParsed({ error: "Couldn't parse — try adding more detail to your note." });
    }
    setLoading(false);
  };

  const saveContact = () => {
    if (!parsed || parsed.error) return;
    const final = { ...parsed, links: manualLinks };
    setContacts(prev => [final, ...prev]);
    setView("list");
    setFreeText("");
    setParsed(null);
    setPushStatus(null);
    setManualLinks({ linkedin: "", instagram: "", email: "", phone: "", other: "" });
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setView("list");
  };

  const pushToNotion = async (contact) => {
    if (!notionKey || !notionDbId) { setSettingsOpen(true); return; }
    setPushing(true);
    setPushStatus(null);
    try {
      const links = contact.links || {};
      const linkStr = Object.entries(links).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
      const res = await fetch("/api/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: { ...contact, linkStr }, notionKey, notionDbId })
      });
      setPushStatus(res.ok ? "success" : "error");
    } catch { setPushStatus("error"); }
    setPushing(false);
  };

  const energyColor = e => e === "high" ? "#00ff87" : e === "medium" ? "#ffd166" : "#888";
  const energyDot = e => <span style={{ width: 7, height: 7, borderRadius: "50%", background: energyColor(e), display: "inline-block", marginRight: 6, flexShrink: 0 }} />;

  const filtered = contacts.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || c.name?.toLowerCase().includes(q) || c.context?.toLowerCase().includes(q) || c.tags?.some(t => t.includes(q)) || c.area?.toLowerCase().includes(q);
    return matchQ && (!filterArea || c.area === filterArea) && (!filterTag || c.tags?.includes(filterTag));
  });

  const areaGroups = {};
  filtered.forEach(c => { const a = c.area || "Other"; if (!areaGroups[a]) areaGroups[a] = []; areaGroups[a].push(c); });

  const inp = { background: "#111", border: "1px solid #222", color: "#e8e0d5", padding: "8px 12px", fontSize: 12, borderRadius: 2, fontFamily: "Georgia, serif", width: "100%", boxSizing: "border-box" };
  const lbl = { fontSize: 9, letterSpacing: 2, color: "#444", textTransform: "uppercase", marginBottom: 5, display: "block" };

  const renderLinks = (links) => {
    if (!links) return null;
    const entries = Object.entries(links).filter(([, v]) => v?.trim());
    if (!entries.length) return null;
    const icons = { linkedin: "in", instagram: "ig", email: "✉", phone: "☎", other: "↗" };
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {entries.map(([type, val]) => {
          const href = type === "email" ? `mailto:${val}` : type === "phone" ? `tel:${val}` : val.startsWith("http") ? val : `https://${val}`;
          return (
            <a key={type} href={href} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, color: "#888", fontSize: 12, textDecoration: "none", padding: "6px 10px", background: "#111", border: "1px solid #1e1e1e", borderRadius: 2 }}>
              <span style={{ fontSize: 9, fontFamily: "monospace", color: "#555", minWidth: 14 }}>{icons[type]}</span>
              <span style={{ textTransform: "capitalize", color: "#555", fontSize: 10, minWidth: 52 }}>{type}</span>
              <span style={{ color: "#c8c0b5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
            </a>
          );
        })}
      </div>
    );
  };

  if (!ready) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", color: "#333" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.3 }}>◎</div>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>Loading...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e0d5", fontFamily: "'Georgia', 'Times New Roman', serif", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0d0d", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 400, letterSpacing: -0.5 }}>Network CRM</div>
          <div style={{ fontSize: 11, color: "#2a2a2a" }}>{contacts.length}</div>
          <div style={{ fontSize: 10, color: saveIndicator ? "#00ff87" : "transparent", transition: "color 0.4s" }}>✓</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => setSettingsOpen(!settingsOpen)} style={{ background: settingsOpen ? "#1a1a1a" : "none", border: "1px solid #222", color: "#555", padding: "6px 10px", cursor: "pointer", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 2 }}>
            ⚙ Settings
          </button>
          <button onClick={() => { setView("add"); setParsed(null); setFreeText(""); setManualLinks({ linkedin: "", instagram: "", email: "", phone: "", other: "" }); }}
            style={{ background: "#e8e0d5", color: "#0a0a0a", border: "none", padding: "7px 14px", cursor: "pointer", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2 }}>
            + Add
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {settingsOpen && (
        <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", padding: "16px 20px", display: "grid", gap: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#444", textTransform: "uppercase" }}>Settings</div>
          <div>
            <label style={lbl}>Anthropic API Key (for AI extraction)</label>
            <input type="password" placeholder="sk-ant-..." value={apiKey} onChange={e => setApiKey(e.target.value)} style={inp} />
            <div style={{ fontSize: 10, color: "#333", marginTop: 4 }}>Get yours at console.anthropic.com → API Keys. Stored locally on your device only.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={lbl}>Notion Integration Token</label>
              <input type="password" placeholder="secret_..." value={notionKey} onChange={e => setNotionKey(e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Notion Database ID</label>
              <input placeholder="xxxxxxxxxxxxxxxx" value={notionDbId} onChange={e => setNotionDbId(e.target.value)} style={inp} />
            </div>
          </div>
          <button onClick={() => setSettingsOpen(false)} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", padding: "8px 14px", cursor: "pointer", fontSize: 11, borderRadius: 2, width: "fit-content" }}>
            Save & Close
          </button>
        </div>
      )}

      <div style={{ flex: 1, padding: "20px", maxWidth: 860, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* LIST */}
        {view === "list" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inp, flex: 1, minWidth: 140 }} />
              <select value={filterArea} onChange={e => setFilterArea(e.target.value)} style={{ ...inp, width: "auto", color: filterArea ? "#e8e0d5" : "#444", cursor: "pointer" }}>
                <option value="">All areas</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={filterTag} onChange={e => setFilterTag(e.target.value)} style={{ ...inp, width: "auto", color: filterTag ? "#e8e0d5" : "#444", cursor: "pointer" }}>
                <option value="">All tags</option>
                {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#2a2a2a" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>◎</div>
                <div style={{ fontSize: 12, color: "#333" }}>{contacts.length === 0 ? "No contacts yet. Hit + Add." : "No matches."}</div>
              </div>
            )}

            {(filterArea || filterTag || searchQuery ? [["Results", filtered]] : Object.entries(areaGroups)).map(([area, list]) => (
              <div key={area} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: areaColor(area), display: "inline-block" }} />
                  <span style={{ fontSize: 10, letterSpacing: 2, color: "#444", textTransform: "uppercase" }}>{area}</span>
                  <span style={{ fontSize: 10, color: "#2a2a2a" }}>({list.length})</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {list.map(c => (
                    <div key={c.id} onClick={() => { setSelected(c); setView("detail"); }}
                      style={{ background: "#0f0f0f", border: "1px solid #181818", padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 2 }}
                      onMouseEnter={e => e.currentTarget.style.background = "#131313"}
                      onMouseLeave={e => e.currentTarget.style.background = "#0f0f0f"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: `${areaColor(c.area)}18`, border: `1px solid ${areaColor(c.area)}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: areaColor(c.area) }}>
                          {c.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                            {energyDot(c.energy)}<span>{c.name}</span>
                            {c.links?.linkedin && <span style={{ fontSize: 9, color: "#3a3a3a", fontFamily: "monospace" }}>in</span>}
                            {c.links?.instagram && <span style={{ fontSize: 9, color: "#3a3a3a", fontFamily: "monospace" }}>ig</span>}
                            {c.links?.email && <span style={{ fontSize: 9, color: "#3a3a3a" }}>✉</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "#444", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>{c.context}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0, marginLeft: 10 }}>
                        {c.tags?.slice(0, 1).map(t => (
                          <span key={t} style={{ fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", background: "#161616", color: "#444", padding: "2px 6px", borderRadius: 1, border: "1px solid #1e1e1e" }}>{t}</span>
                        ))}
                        <span style={{ fontSize: 10, color: "#2a2a2a", marginLeft: 4 }}>↗ {c.followUpDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD */}
        {view === "add" && (
          <div style={{ maxWidth: 580 }}>
            <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 22, padding: 0 }}>← Back</button>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#444", textTransform: "uppercase", marginBottom: 6 }}>New Contact</div>
            <div style={{ fontSize: 18, marginBottom: 20, fontWeight: 400 }}>Describe who you met.</div>

            <textarea value={freeText} onChange={e => setFreeText(e.target.value)}
              placeholder={`e.g. "Met Carlos at a BJJ seminar in Porto. Black belt, runs a gym in Lisbon, wants to collab on content. His Instagram is @carlosgrappling. Should DM him this week."`}
              rows={5} style={{ ...inp, resize: "vertical", lineHeight: 1.75, fontSize: 13, padding: "14px" }}
            />

            <button onClick={parseWithClaude} disabled={loading || !freeText.trim()}
              style={{ marginTop: 10, background: loading ? "#141414" : "#e8e0d5", color: loading ? "#444" : "#0a0a0a", border: "none", padding: "11px 20px", cursor: loading ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2, width: "100%" }}>
              {loading ? "Extracting..." : "Extract with AI →"}
            </button>

            {!apiKey && (
              <div style={{ marginTop: 10, fontSize: 11, color: "#555", textAlign: "center" }}>
                ⚠ Add your Anthropic API key in <span style={{ color: "#888", cursor: "pointer", textDecoration: "underline" }} onClick={() => setSettingsOpen(true)}>Settings</span> to use AI extraction.
              </div>
            )}

            {parsed && !parsed.error && (
              <div style={{ marginTop: 22, background: "#0d0d0d", border: "1px solid #1e1e1e", padding: 20, borderRadius: 3 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "#444", textTransform: "uppercase", marginBottom: 16 }}>Extracted — review & edit</div>
                <div style={{ display: "grid", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div><label style={lbl}>Name</label><input value={parsed.name || ""} onChange={e => setParsed(p => ({ ...p, name: e.target.value }))} style={inp} /></div>
                    <div><label style={lbl}>Area</label>
                      <select value={parsed.area || ""} onChange={e => setParsed(p => ({ ...p, area: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                        {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label style={lbl}>Context</label><input value={parsed.context || ""} onChange={e => setParsed(p => ({ ...p, context: e.target.value }))} style={inp} /></div>
                  <div><label style={lbl}>Notes</label><textarea value={parsed.notes || ""} onChange={e => setParsed(p => ({ ...p, notes: e.target.value }))} rows={2} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                    <div><label style={lbl}>Follow-up</label><input value={parsed.followUp || ""} onChange={e => setParsed(p => ({ ...p, followUp: e.target.value }))} style={inp} /></div>
                    <div><label style={lbl}>Date</label><input type="date" value={parsed.followUpDate || ""} onChange={e => setParsed(p => ({ ...p, followUpDate: e.target.value }))} style={{ ...inp, width: 130 }} /></div>
                  </div>
                  <div>
                    <label style={lbl}>Energy</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["high", "medium", "low"].map(e => (
                        <button key={e} onClick={() => setParsed(p => ({ ...p, energy: e }))}
                          style={{ background: parsed.energy === e ? `${energyColor(e)}18` : "#111", border: `1px solid ${parsed.energy === e ? energyColor(e) : "#222"}`, color: parsed.energy === e ? energyColor(e) : "#444", padding: "5px 12px", cursor: "pointer", fontSize: 11, textTransform: "capitalize", borderRadius: 2, fontFamily: "Georgia, serif" }}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ ...lbl, marginBottom: 8 }}>Contact & Links</label>
                    <div style={{ display: "grid", gap: 7 }}>
                      {[{ key: "linkedin", ph: "linkedin.com/in/username" }, { key: "instagram", ph: "@handle" }, { key: "email", ph: "email@example.com" }, { key: "phone", ph: "+351 000 000 000" }, { key: "other", ph: "Website, Twitter, WhatsApp..." }].map(({ key, ph }) => (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 1.5, minWidth: 58, textAlign: "right" }}>{key}</span>
                          <input placeholder={ph} value={manualLinks[key] || ""} onChange={e => setManualLinks(l => ({ ...l, [key]: e.target.value }))} style={{ ...inp, flex: 1 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
                  <button onClick={saveContact} style={{ background: "#e8e0d5", color: "#0a0a0a", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2, flex: 1 }}>Save</button>
                  <button onClick={() => { const f = { ...parsed, links: manualLinks }; setContacts(prev => [f, ...prev]); pushToNotion(f); setView("list"); setFreeText(""); setParsed(null); }}
                    style={{ background: "#111", color: "#666", border: "1px solid #222", padding: "10px 16px", cursor: "pointer", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2, display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center" }}>
                    {NOTION_ICON} Save + Notion
                  </button>
                </div>
                {pushStatus === "success" && <div style={{ color: "#00ff87", fontSize: 11, marginTop: 8 }}>✓ Pushed to Notion</div>}
                {pushStatus === "error" && <div style={{ color: "#ff6b6b", fontSize: 11, marginTop: 8 }}>✗ Notion push failed</div>}
              </div>
            )}
            {parsed?.error && <div style={{ marginTop: 12, color: "#ff6b6b", fontSize: 13 }}>{parsed.error}</div>}
          </div>
        )}

        {/* DETAIL */}
        {view === "detail" && selected && (
          <div style={{ maxWidth: 580 }}>
            <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20, padding: 0 }}>← Back</button>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 22 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0, background: `${areaColor(selected.area)}15`, border: `1px solid ${areaColor(selected.area)}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: areaColor(selected.area) }}>
                {selected.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  {energyDot(selected.energy)}
                  <span style={{ fontSize: 19, fontWeight: 400 }}>{selected.name}</span>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: areaColor(selected.area), border: `1px solid ${areaColor(selected.area)}44`, padding: "2px 7px", borderRadius: 1 }}>{selected.area}</span>
                  {selected.tags?.map(t => <span key={t} style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", background: "#161616", color: "#444", padding: "2px 7px", borderRadius: 1, border: "1px solid #1e1e1e" }}>{t}</span>)}
                </div>
              </div>
            </div>

            {selected.links && Object.values(selected.links).some(v => v) && (
              <div style={{ marginBottom: 20 }}>
                <div style={lbl}>Contact & Links</div>
                {renderLinks(selected.links)}
              </div>
            )}

            <div style={{ display: "grid", gap: 16 }}>
              {[["Context", selected.context], ["Follow-up", selected.followUp], ["Follow-up Date", selected.followUpDate], ["Notes", selected.notes], ["Added", selected.addedDate]].map(([label, val]) => val && (
                <div key={label} style={{ borderBottom: "1px solid #111", paddingBottom: 12 }}>
                  <div style={lbl}>{label}</div>
                  <div style={{ fontSize: 13, color: "#c8c0b5", lineHeight: 1.65 }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
              <button onClick={() => { setPushStatus(null); pushToNotion(selected); }} disabled={pushing}
                style={{ background: "#0f0f0f", color: "#666", border: "1px solid #1e1e1e", padding: "9px 14px", cursor: pushing ? "not-allowed" : "pointer", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2, display: "flex", alignItems: "center", gap: 6 }}>
                {NOTION_ICON} {pushing ? "Pushing..." : "Push to Notion"}
              </button>
              <button onClick={() => deleteContact(selected.id)} style={{ background: "none", border: "1px solid #181818", color: "#333", padding: "9px 12px", cursor: "pointer", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 2 }}>Delete</button>
            </div>
            {pushStatus === "success" && <div style={{ color: "#00ff87", fontSize: 11, marginTop: 8 }}>✓ Pushed to Notion</div>}
            {pushStatus === "error" && <div style={{ color: "#ff6b6b", fontSize: 11, marginTop: 8 }}>✗ Notion push failed</div>}
          </div>
        )}
      </div>
    </div>
  );
}
