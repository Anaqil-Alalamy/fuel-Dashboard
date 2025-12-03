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
  const [viewMode, setViewMode] = useState('cards')
  const [activeSection, setActiveSection] = useState('today')

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const getSectionData = () => {
    switch (activeSection) {
      case 'today':
        return mockData.today
      case 'tomorrow':
        return mockData.tomorrow
      case 'coming3days':
        return mockData.comingIn3Days
      case 'due':
        return mockData.due
      default:
        return []
    }
  }

  const getSectionTitle = () => {
    const titles = {
      today: 'Today',
      tomorrow: 'Tomorrow',
      coming3days: 'Coming in 3 Days',
      due: 'Due / Behind Schedule',
    }
    return titles[activeSection]
  }

  const sectionData = getSectionData()

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
        <nav className="section-navigation">
          <button
            className={`section-tab ${activeSection === 'today' ? 'active' : ''}`}
            onClick={() => setActiveSection('today')}
          >
            <span className="tab-label">Today</span>
            <span className="tab-count">{mockData.today.length}</span>
          </button>
          <button
            className={`section-tab ${activeSection === 'tomorrow' ? 'active' : ''}`}
            onClick={() => setActiveSection('tomorrow')}
          >
            <span className="tab-label">Tomorrow</span>
            <span className="tab-count">{mockData.tomorrow.length}</span>
          </button>
          <button
            className={`section-tab ${activeSection === 'coming3days' ? 'active' : ''}`}
            onClick={() => setActiveSection('coming3days')}
          >
            <span className="tab-label">Coming in 3 Days</span>
            <span className="tab-count">{mockData.comingIn3Days.length}</span>
          </button>
          <button
            className={`section-tab ${activeSection === 'due' ? 'active' : ''}`}
            onClick={() => setActiveSection('due')}
          >
            <span className="tab-label">Due / Behind</span>
            <span className="tab-count">{mockData.due.length}</span>
          </button>
        </nav>

        <div className="section-header">
          <h2 className="section-title">{getSectionTitle()}</h2>
          <div className="view-toggles">
            <button
              className={`view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card View"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" />
              </svg>
            </button>
            <button
              className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 2v2h2V6H4zm0 4v2h2v-2H4zm0 4v2h2v-2H4zm4-8v2h2V6H8zm0 4v2h2v-2H8zm0 4v2h2v-2H8zm4-8v2h2V6h-2zm0 4v2h2v-2h-2zm0 4v2h2v-2h-2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="section-content">
          {sectionData.length === 0 ? (
            <div className="empty-state">
              <p>No fueling plans scheduled for this period.</p>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="cards-grid">
              {sectionData.map((item) => (
                <FuelingCard key={item.id} data={item} section={activeSection} />
              ))}
            </div>
          ) : (
            <FuelingTable data={sectionData} section={activeSection} />
          )}
        </div>
      </div>
    </div>
  )
}
