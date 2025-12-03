import { useState } from 'react'
import SummaryCard from '../components/SummaryCard'
import ExpandableTable from '../components/ExpandableTable'
import SiteMap from '../components/SiteMap'
import '../styles/dashboard.css'

const today = new Date()
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
const in3Days = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)

const mockData = {
  today: [
    { id: 1, siteName: 'GSM Downtown', fuelType: 'Diesel', quantity: '500L', status: 'pending', date: today.toISOString().split('T')[0], lat: 40.7128, lng: -74.0060 },
    { id: 2, siteName: 'GSM Airport Hub', fuelType: 'Petrol', quantity: '300L', status: 'in-progress', date: today.toISOString().split('T')[0], lat: 40.7614, lng: -73.9776 },
  ],
  tomorrow: [
    { id: 3, siteName: 'GSM North Terminal', fuelType: 'Diesel', quantity: '450L', status: 'scheduled', date: tomorrow.toISOString().split('T')[0], lat: 40.7282, lng: -73.7949 },
    { id: 4, siteName: 'GSM East Port', fuelType: 'Petrol', quantity: '350L', status: 'scheduled', date: tomorrow.toISOString().split('T')[0], lat: 40.6501, lng: -73.9496 },
  ],
  comingIn3Days: [
    { id: 5, siteName: 'GSM West Branch', fuelType: 'Diesel', quantity: '600L', status: 'scheduled', date: in3Days.toISOString().split('T')[0], lat: 40.7245, lng: -74.0427 },
    { id: 6, siteName: 'GSM Central Depot', fuelType: 'Petrol', quantity: '400L', status: 'scheduled', date: in3Days.toISOString().split('T')[0], lat: 40.7489, lng: -73.9680 },
    { id: 7, siteName: 'GSM South Station', fuelType: 'Diesel', quantity: '550L', status: 'scheduled', date: in3Days.toISOString().split('T')[0], lat: 40.6850, lng: -73.9817 },
  ],
  due: [
    { id: 8, siteName: 'GSM Harbor Facility', fuelType: 'Diesel', quantity: '700L', status: 'overdue', daysOverdue: 2, date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], lat: 40.6995, lng: -74.0091 },
    { id: 9, siteName: 'GSM Mountain Site', fuelType: 'Petrol', quantity: '250L', status: 'overdue', daysOverdue: 1, date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], lat: 40.6892, lng: -73.9760 },
  ],
}

const allSites = [...mockData.today, ...mockData.tomorrow, ...mockData.comingIn3Days, ...mockData.due]

export default function Dashboard({ onLogout }) {
  const [expandedTables, setExpandedTables] = useState({ today: true, tomorrow: false, coming3days: false, due: false })

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const toggleTable = (section) => {
    setExpandedTables(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">Fueling Dashboard</h1>
            <p className="dashboard-subtitle">GSM Sites Fueling Plan Management</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="summary-cards-section">
          <SummaryCard title="Total Sites" count={allSites.length} variant="total" />
          <SummaryCard title="Today" count={mockData.today.length} variant="today" />
          <SummaryCard title="Tomorrow" count={mockData.tomorrow.length} variant="tomorrow" />
          <SummaryCard title="Overdue" count={mockData.due.length} variant="overdue" />
        </div>

        <div className="map-and-tables-wrapper">
          <div className="site-map-container">
            <SiteMap sites={allSites} />
          </div>

          <div className="tables-container">
            <ExpandableTable
              title="Today"
              data={mockData.today}
              isExpanded={expandedTables.today}
              onToggle={() => toggleTable('today')}
              statusColor="blue"
            />
            <ExpandableTable
              title="Tomorrow"
              data={mockData.tomorrow}
              isExpanded={expandedTables.tomorrow}
              onToggle={() => toggleTable('tomorrow')}
              statusColor="yellow"
            />
            <ExpandableTable
              title="Coming in 3 Days"
              data={mockData.comingIn3Days}
              isExpanded={expandedTables.coming3days}
              onToggle={() => toggleTable('coming3days')}
              statusColor="green"
            />
            <ExpandableTable
              title="Overdue"
              data={mockData.due}
              isExpanded={expandedTables.due}
              onToggle={() => toggleTable('due')}
              statusColor="red"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
