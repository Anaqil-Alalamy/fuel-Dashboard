import '../styles/status-card.css'

export default function StatusCard({ title, count, accentColor, data = [] }) {
  const previewRows = data.slice(0, 4)
  const emptyState = previewRows.length === 0

  return (
    <div className="status-card">
      <div className="status-card__accent" style={{ background: accentColor }}></div>
      <div className="status-card__header">
        <div>
          <p className="status-card__label">{title}</p>
          <h3 className="status-card__count">{count}</h3>
        </div>
        <span className="status-card__badge" style={{ color: accentColor, backgroundColor: `${accentColor}15` }}>
          {title}
        </span>
      </div>

      <div className="status-card__table-wrapper">
        <div className="status-card__table-header">
          <span>Site Name</span>
          <span>Date</span>
        </div>
        {emptyState ? (
          <div className="status-card__empty">No sites in this category</div>
        ) : (
          <ul className="status-card__list">
            {previewRows.map((site) => (
              <li key={site.id} className="status-card__row">
                <span title={site.siteName}>{site.siteName}</span>
                <span>{site.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
