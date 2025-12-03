import '../styles/fueling-table.css'

export default function FuelingTable({ data, section }) {
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
    <div className="fueling-table-wrapper">
      <table className="fueling-table">
        <thead>
          <tr>
            <th>Site Name</th>
            <th>Fuel Type</th>
            <th>Quantity</th>
            {section === 'due' && <th>Days Overdue</th>}
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className={`table-row row-status-${getStatusColor(item.status)}`}>
              <td className="cell-site-name">{item.siteName}</td>
              <td className="cell-fuel-type">{item.fuelType}</td>
              <td className="cell-quantity">{item.quantity}</td>
              {section === 'due' && (
                <td className="cell-overdue">
                  {item.daysOverdue ? <span className="overdue-badge">{item.daysOverdue}d</span> : '-'}
                </td>
              )}
              <td>
                <span className={`table-status-badge status-${getStatusColor(item.status)}`}>
                  {getStatusLabel(item.status)}
                </span>
              </td>
              <td className="cell-action">
                <button className="table-action-button">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
