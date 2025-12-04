import '../styles/fueling-table.css'

export default function FuelingTable({ data }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="fueling-table-wrapper">
      <table className="fueling-table">
        <thead>
          <tr>
            <th>Site Name</th>
            <th>Next Fueling Plan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="table-row">
              <td className="cell-site-name">{item.siteName}</td>
              <td className="cell-fueling-date">{formatDate(item.nextFuelingPlan)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
