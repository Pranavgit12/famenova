export default function StatCard({ icon, label, value, trend, trendDir, color = 'blue' }) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${color}`}>{icon}</div>
      <div className="stat-card-info">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        {trend !== undefined && (
          <span className={`stat-card-trend ${trendDir}`}>
            {trendDir === 'up' ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
}
