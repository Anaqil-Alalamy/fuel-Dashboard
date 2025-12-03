import '../styles/summary-card.css'

export default function SummaryCard({ title, count, variant }) {
  return (
    <div className={`summary-card summary-card-${variant}`}>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-count">{count}</p>
      </div>
      <div className={`card-icon icon-${variant}`}>
        {variant === 'total' && <span>📊</span>}
        {variant === 'today' && <span>📅</span>}
        {variant === 'tomorrow' && <span>🗓️</span>}
        {variant === 'overdue' && <span>⚠️</span>}
      </div>
    </div>
  )
}
