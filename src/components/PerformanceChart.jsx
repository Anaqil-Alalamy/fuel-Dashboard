export default function PerformanceChart({ percentage = 85 }) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="performance-chart-container">
      <div className="chart-title">FUELING PERFORMANCE</div>
      <svg width="180" height="180" className="performance-chart">
        <circle
          cx="90"
          cy="90"
          r="45"
          fill="none"
          stroke="#E0E4E8"
          strokeWidth="8"
        />
        <circle
          cx="90"
          cy="90"
          r="45"
          fill="none"
          stroke="#0099D8"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
        />
        <text
          x="90"
          y="95"
          textAnchor="middle"
          dominantBaseline="middle"
          className="chart-percentage"
        >
          {percentage}%
        </text>
      </svg>
      <div className="chart-subtitle">On-time fuel compliance rate</div>
    </div>
  )
}
