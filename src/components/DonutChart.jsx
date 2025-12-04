import { useMemo } from 'react'
import '../styles/donut-chart.css'

export default function DonutChart({ totalSites = 0, dueSites = 0 }) {
  const chartData = useMemo(() => {
    const total = totalSites
    const due = dueSites
    const onTime = total - due
    const duePercent = total > 0 ? (due / total) * 100 : 0
    const onTimePercent = total > 0 ? (onTime / total) * 100 : 0

    return {
      due,
      onTime,
      duePercent,
      onTimePercent,
    }
  }, [totalSites, dueSites])

  const radius = 60
  const circumference = 2 * Math.PI * radius
  const dueOffset = circumference - (chartData.duePercent / 100) * circumference
  const onTimeOffset = circumference - (chartData.onTimePercent / 100) * circumference

  return (
    <div className="donut-chart-card">
      <div className="donut-chart-header">
        <h3>KPI Overview</h3>
        <p className="donut-chart-subtitle">Total vs Due Sites</p>
      </div>

      <div className="donut-chart-content">
        <svg viewBox="0 0 160 160" className="donut-svg">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={dueOffset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            className="donut-due"
          />
          <text
            x="80"
            y="80"
            textAnchor="middle"
            dominantBaseline="middle"
            className="donut-center-text"
          >
            {chartData.duePercent.toFixed(0)}%
          </text>
        </svg>

        <div className="donut-legend">
          <div className="legend-item">
            <div className="legend-color due-color"></div>
            <div>
              <p className="legend-label">Due Sites</p>
              <p className="legend-value">{chartData.due}</p>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color on-time-color"></div>
            <div>
              <p className="legend-label">On Time</p>
              <p className="legend-value">{chartData.onTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="donut-stats">
        <div className="stat">
          <span className="stat-label">Total Sites</span>
          <span className="stat-number">{totalSites}</span>
        </div>
        <div className="divider"></div>
        <div className="stat">
          <span className="stat-label">Status</span>
          <span className="stat-number">{chartData.duePercent.toFixed(1)}% At Risk</span>
        </div>
      </div>
    </div>
  )
}
