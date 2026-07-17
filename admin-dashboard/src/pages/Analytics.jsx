import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { analytics } from '../services/api';
import { formatNumber } from '../utils/helpers';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

export default function Analytics() {
  const [funnel, setFunnel] = useState([]);
  const [nicheData, setNicheData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [funnelRes, nicheRes, locRes, trendRes, overviewRes] = await Promise.allSettled([
          analytics.getFunnel(),
          analytics.getByNiche(),
          analytics.getByLocation(),
          analytics.getTrends(),
          analytics.getOverview(),
        ]);

        if (funnelRes.status === 'fulfilled') setFunnel(funnelRes.value.data || []);
        if (nicheRes.status === 'fulfilled') setNicheData(nicheRes.value.data || []);
        if (locRes.status === 'fulfilled') setLocationData(locRes.value.data || []);
        if (trendRes.status === 'fulfilled') setMonthlyTrends(trendRes.value.data || []);
        if (overviewRes.status === 'fulfilled') setMetrics(overviewRes.value.data || {});
      } catch {
        /* handled */
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

  const maxFunnel = funnel.length > 0 ? funnel[0].count || funnel[0].value || 1 : 1;

  return (
    <div>
      <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-icon blue">⚡</div>
          <div className="stat-card-info">
            <div className="stat-card-label">Avg Response Time</div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>
              {metrics.avgResponseTime || '—'}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon emerald">📈</div>
          <div className="stat-card-info">
            <div className="stat-card-label">Conversion Rate</div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>
              {metrics.conversionRate ? `${metrics.conversionRate}%` : '—'}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon purple">📊</div>
          <div className="stat-card-info">
            <div className="stat-card-label">Total Leads</div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>
              {formatNumber(metrics.totalLeads || 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Conversion Funnel</h3>
          </div>
          {funnel.length > 0 ? (
            <div className="funnel">
              {funnel.map((step, i) => {
                const count = step.count || step.value || 0;
                const pct = maxFunnel > 0 ? (count / maxFunnel) * 100 : 0;
                return (
                  <div key={i} style={{ textAlign: 'center', width: '100%' }}>
                    <div
                      className="funnel-step"
                      style={{
                        width: `${Math.max(pct, 20)}%`,
                        background: COLORS[i % COLORS.length],
                      }}
                    >
                      {formatNumber(count)}
                    </div>
                    <div className="funnel-step-label">
                      {step.label || step.stage || step.name}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-title">No funnel data</div>
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Leads by Niche</h3>
          </div>
          <div className="chart-wrapper">
            {nicheData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nicheData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} stroke="#2a2a3a" />
                  <YAxis
                    type="category"
                    dataKey="niche"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    stroke="#2a2a3a"
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid #2a2a3a',
                      borderRadius: 8,
                      color: '#e2e8f0',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {nicheData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <div className="empty-state-title">No niche data</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Top Locations</h3>
          </div>
          <div className="chart-wrapper">
            {locationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis
                    dataKey="location"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    stroke="#2a2a3a"
                    angle={-30}
                    textAnchor="end"
                    height={60}
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
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {locationData.slice(0, 10).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <div className="empty-state-title">No location data</div>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">Monthly Trends</h3>
          </div>
          <div className="chart-wrapper">
            {monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#64748b', fontSize: 12 }}
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
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                    name="Leads"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <div className="empty-state-title">No trend data</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
