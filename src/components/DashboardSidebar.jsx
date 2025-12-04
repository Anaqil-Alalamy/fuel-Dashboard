import MetricsCard from './MetricsCard'
import PerformanceChart from './PerformanceChart'

export default function DashboardSidebar({ allData }) {
  const totalSites = Object.values(allData).reduce((sum, arr) => sum + arr.length, 0)
  const overdueSites = allData.due.length
  const todaySites = allData.today.length
  const upcomingSites = allData.tomorrow.length + allData.comingIn3Days.length

  const performancePercentage = 85

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-section metrics-section">
        <MetricsCard label="TOTAL SITES" value={totalSites} variant="primary" />
        <MetricsCard label="DUE (OVERDUE)" value={overdueSites} variant="alert" />
        <MetricsCard label="TODAY" value={todaySites} variant="info" />
        <MetricsCard label="NEXT 3-15 DAYS" value={upcomingSites} variant="success" />
      </div>

      <div className="sidebar-section chart-section">
        <PerformanceChart percentage={performancePercentage} />
      </div>

      <div className="sidebar-section schedule-section">
        <h3 className="sidebar-section-title">DUE (OVERDUE)</h3>
        <div className="schedule-list">
          {allData.due.length > 0 ? (
            allData.due.map((item) => (
              <div key={item.id} className="schedule-item overdue-item">
                <div className="schedule-date">{item.siteName.substring(0, 3).toUpperCase()}</div>
                <span className="schedule-status">10-31-2025</span>
              </div>
            ))
          ) : (
            <p className="no-items">No overdue items</p>
          )}
        </div>
      </div>

      <div className="sidebar-section schedule-section">
        <h3 className="sidebar-section-title">TODAY SCHEDULE</h3>
        <div className="schedule-list">
          {allData.today.length > 0 ? (
            allData.today.map((item) => (
              <div key={item.id} className="schedule-item">
                <div className="schedule-date">{item.siteName.substring(0, 3).toUpperCase()}</div>
                <span className="schedule-status">12-04-2025</span>
              </div>
            ))
          ) : (
            <p className="no-items">No schedules for today</p>
          )}
        </div>
      </div>
    </aside>
  )
}
