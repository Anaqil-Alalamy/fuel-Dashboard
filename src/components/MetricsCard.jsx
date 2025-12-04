export default function MetricsCard({ label, value, variant = 'default' }) {
  return (
    <div className={`metrics-card metrics-${variant}`}>
      <span className="metrics-label">{label}</span>
      <span className="metrics-value">{value}</span>
    </div>
  )
}
