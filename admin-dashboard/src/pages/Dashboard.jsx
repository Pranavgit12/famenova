import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import StatCard from '../components/StatCard';
import { leads, analytics } from '../services/api';
import { formatNumber, formatDate } from '../utils/helpers';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [nicheData, setNicheData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [statsRes, leadsRes, nicheRes, trendRes] = await Promise.allSettled([
          leads.getStats(),
          leads.getAll({ limit: 10 }),
          analytics.getByNiche(),
          analytics.getTrends(),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
        if (leadsRes.status === 'fulfilled') setRecentLeads(leadsRes.value.data.data || []);
        if (nicheRes.status === 'fulfilled') setNicheData(nicheRes.value.data.data || []);
        if (trendRes.status === 'fulfilled') setTrendData(trendRes.value.data.data || []);
      } catch {
        /* handled by individual checks */
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  const byStatus = stats?.byStatus || {};

  return (
    <div>
      <div className="stat-cards">
        <StatCard
          icon="◉"
          label="Total Leads"
          value={formatNumber(stats?.total ?? 0)}
          color="blue"
        />
        <StatCard
          icon="★"
          label="New Leads"
          value={formatNumber(byStatus.new ?? 0)}
          color="purple"
        />
        <StatCard
          icon="☎"
          label="Contacted"
          value={formatNumber(byStatus.contacted ?? 0)}
          color="yellow"
        />
        <StatCard
          icon="✓"
          label="Closed"
          value={formatNumber(byStatus.closed ?? 0)}
          color="emerald"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Leads Over Time</h3>
            <span className="card-subtitle">Last 30 days</span>
          </div>
          <div className="chart-wrapper">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(d) => formatDate(d)}
                    stroke="#2a2a3a"
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} stroke="#2a2a3a" />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid #2a2a3a',
                      borderRadius: 8,
                      color: '#e2e8f0',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <div className="empty-state-title">No trend data yet</div>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Leads by Niche</h3>
          </div>
          <div className="chart-wrapper">
            {nicheData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nicheData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="niche"
                  >
                    {nicheData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid #2a2a3a',
                      borderRadius: 8,
                      color: '#e2e8f0',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#94a3b8', fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <div className="empty-state-title">No niche data yet</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Leads</h3>
        </div>
        {recentLeads.length > 0 ? (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Business</th>
                  <th>Phone</th>
                  <th>Niche</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td style={{ fontWeight: 500 }}>{lead.fullName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{lead.businessName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{lead.phone}</td>
                    <td>{lead.niche || '—'}</td>
                    <td>
                      <span className={`badge badge-${lead.status === 'new' ? 'new' : lead.status === 'contacted' ? 'contacted' : lead.status === 'closed' ? 'closed' : 'new'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(lead.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No leads yet</div>
            <div className="empty-state-text">
              Leads will appear here once they start coming in through your forms.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
