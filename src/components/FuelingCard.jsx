import '../styles/fueling-card.css'

export default function FuelingCard({ data, section }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'pending'
      case 'in-progress':
        return 'in-progress'
      case 'scheduled':
        return 'scheduled'
      case 'overdue':
        return 'overdue'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      'in-progress': 'In Progress',
      scheduled: 'Scheduled',
      overdue: 'Overdue',
    }
    return labels[status] || status
  }

  return (
    <div className={`fueling-card card-status-${getStatusColor(data.status)}`}>
      <div className="card-header">
        <h3 className="card-site-name">{data.siteName}</h3>
        <span className={`card-status-badge status-${getStatusColor(data.status)}`}>
          {getStatusLabel(data.status)}
        </span>
      </div>

      <div className="card-body">
        <div className="card-field">
          <label className="field-label">Fuel Type</label>
          <p className="field-value">{data.fuelType}</p>
        </div>

        <div className="card-field">
          <label className="field-label">Quantity</label>
          <p className="field-value">{data.quantity}</p>
        </div>

        {data.daysOverdue && (
          <div className="card-field">
            <label className="field-label">Days Overdue</label>
            <p className="field-value overdue-text">{data.daysOverdue} day(s)</p>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button className="card-action-button">View Details</button>
      </div>
    </div>
  )
}
