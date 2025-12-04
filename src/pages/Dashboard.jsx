import { useState, useEffect } from 'react'
import FuelingCard from '../components/FuelingCard'
import FuelingTable from '../components/FuelingTable'
import DashboardSidebar from '../components/DashboardSidebar'
import MapPanel from '../components/MapPanel'
import { fetchCsvData } from '../utils/csvParser'
import '../styles/dashboard.css'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDnTkwpbgsnY_i60u3ZleNs1DL3vMdG3fYHMrr5rwVDqMb3GpgKH40Y-7WQsEzEAi-wDHwLaimN8NC/pub?output=csv'

const mockData = {
  today: [
    { id: 1, siteName: 'GSM Downtown', fuelType: 'Diesel', quantity: '500L', status: 'pending' },
    { id: 2, siteName: 'GSM Airport Hub', fuelType: 'Petrol', quantity: '300L', status: 'in-progress' },
  ],
  tomorrow: [
    { id: 3, siteName: 'GSM North Terminal', fuelType: 'Diesel', quantity: '450L', status: 'scheduled' },
    { id: 4, siteName: 'GSM East Port', fuelType: 'Petrol', quantity: '350L', status: 'scheduled' },
  ],
  comingIn3Days: [
    { id: 5, siteName: 'GSM West Branch', fuelType: 'Diesel', quantity: '600L', status: 'scheduled' },
    { id: 6, siteName: 'GSM Central Depot', fuelType: 'Petrol', quantity: '400L', status: 'scheduled' },
    { id: 7, siteName: 'GSM South Station', fuelType: 'Diesel', quantity: '550L', status: 'scheduled' },
  ],
  due: [
    { id: 8, siteName: 'GSM Harbor Facility', fuelType: 'Diesel', quantity: '700L', status: 'overdue', daysOverdue: 2 },
    { id: 9, siteName: 'GSM Mountain Site', fuelType: 'Petrol', quantity: '250L', status: 'overdue', daysOverdue: 1 },
  ],
}

export default function Dashboard({ onLogout }) {
  const [viewMode, setViewMode] = useState('cards')
  const [activeSection, setActiveSection] = useState('today')
  const [dashboardData, setDashboardData] = useState(mockData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const csvData = await fetchCsvData(CSV_URL)
        if (csvData) {
          setDashboardData(csvData)
        } else {
          setError('Failed to load data from spreadsheet')
          setDashboardData(mockData)
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Error loading data. Using fallback data.')
        setDashboardData(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const getSectionData = () => {
    switch (activeSection) {
      case 'today':
        return dashboardData.today
      case 'tomorrow':
        return dashboardData.tomorrow
      case 'coming3days':
        return dashboardData.comingIn3Days
      case 'due':
        return dashboardData.due
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

      <div className="dashboard-main-wrapper">
        <DashboardSidebar allData={dashboardData} />

        <div className="dashboard-content">
          {error && <div className="data-error-notice">{error}</div>}
          <nav className="section-navigation">
            <button
              className={`section-tab ${activeSection === 'today' ? 'active' : ''}`}
              onClick={() => setActiveSection('today')}
            >
              <span className="tab-label">Today</span>
              <span className="tab-count">{dashboardData.today.length}</span>
            </button>
            <button
              className={`section-tab ${activeSection === 'tomorrow' ? 'active' : ''}`}
              onClick={() => setActiveSection('tomorrow')}
            >
              <span className="tab-label">Tomorrow</span>
              <span className="tab-count">{dashboardData.tomorrow.length}</span>
            </button>
            <button
              className={`section-tab ${activeSection === 'coming3days' ? 'active' : ''}`}
              onClick={() => setActiveSection('coming3days')}
            >
              <span className="tab-label">Coming in 3 Days</span>
              <span className="tab-count">{dashboardData.comingIn3Days.length}</span>
            </button>
            <button
              className={`section-tab ${activeSection === 'due' ? 'active' : ''}`}
              onClick={() => setActiveSection('due')}
            >
              <span className="tab-label">Due / Behind</span>
              <span className="tab-count">{dashboardData.due.length}</span>
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

        <MapPanel allData={dashboardData} />
      </div>
    </div>
  )
}
