import { useEffect, useState } from 'react';
import { Activity, CalendarDays, CircleDollarSign, Headphones, Users } from 'lucide-react';
import './styles.css';

type Business = { tradingName: string; slogan: string; city: string; province: string; currency: string };

export function App() {
  const [business, setBusiness] = useState<Business | null>(null);
  useEffect(() => { fetch('/api/v1/business').then((r) => r.json()).then(setBusiness); }, []);

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">BS</div><div><strong>Blue Sine</strong><span>Music Studios</span></div></div>
        <nav><a className="active">Dashboard</a><a>CRM</a><a>Bookings</a><a>Projects</a><a>Finance</a><a>AI Agents</a><a>Reports</a><a>Settings</a></nav>
      </aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">OWNER COMMAND CENTRE</p><h1>Good morning{business ? `, ${business.tradingName}` : ''}</h1><p className="muted">Creating sound. Building stars.</p></div><button className="primary">Ask Blue Sine AI</button></header>
        <section className="brief"><div><p className="eyebrow">AI CEO DAILY BRIEFING</p><h2>Your studio at a glance</h2><p className="muted">Phase 1 foundation is connected to the Blue Sine API.</p></div><Activity size={32} /></section>
        <div className="metrics"><Metric icon={<CircleDollarSign />} label="Revenue this month" value="R0.00" /><Metric icon={<CalendarDays />} label="Bookings today" value="0" /><Metric icon={<Users />} label="New leads" value="0" /><Metric icon={<Headphones />} label="Active projects" value="0" /></div>
        <div className="grid"><article className="card"><h3>Today’s studio</h3><p className="muted">No bookings have been created yet.</p></article><article className="card"><h3>Sales pipeline</h3><p className="muted">Your connected lead and customer activity will appear here.</p></article></div>
      </section>
    </main>
  );
}
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <article className="metric"><div className="metric-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></article>; }
