import { useState, useEffect } from 'react'
import FuelingCard from '../components/FuelingCard'
import FuelingTable from '../components/FuelingTable'
import MapComponent from '../components/MapComponent'
import { fetchFuelingData, organizeFuelingDataByDate, getTotalSitesCount, getSectionCount } from '../utils/dataUtils'
import '../styles/dashboard.css'

const SECTIONS = [
  { id: 'today', label: 'Today', icon: '📅' },
  { id: 'coming1day', label: 'Coming in 1 Day', icon: '⏭️' },
  { id: 'coming2days', label: 'Coming in 2 Days', icon: '⏩' },
  { id: 'coming3days', label: 'Coming in 3 Days', icon: '⏩⏩' },
  { id: 'due', label: 'Due / Behind Schedule', icon: '⚠️' },
]

export default function Dashboard({ onLogout }) {
  const [viewMode, setViewMode] = useState('cards')
  const [activeSection, setActiveSection] = useState('today')
  const [allData, setAllData] = useState([])
  const [organizedData, setOrganizedData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMap, setShowMap] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const data = await fetchFuelingData()
      setAllData(data)
      setOrganizedData(organizeFuelingDataByDate(data))
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const getSectionData = () => {
    if (!organizedData) return []
    return organizedData[activeSection] || []
  }

  const getSectionTitle = () => {
    const section = SECTIONS.find((s) => s.id === activeSection)
    return section ? section.label : 'Dashboard'
  }

  const sectionData = getSectionData()
  const totalSites = getTotalSitesCount(allData)

  if (isLoading) {
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
          <div className="loading-spinner">Loading data...</div>
        </div>
      </div>
    )
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
        <div className="dashboard-main">
          <div className="map-section">
            {showMap && <MapComponent sites={allData} />}
            <button className="toggle-map-button" onClick={() => setShowMap(!showMap)}>
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>

          <div className="stats-bar">
            <div className="stat-card">
              <span className="stat-label">Total Sites</span>
              <span className="stat-value">{totalSites}</span>
            </div>
            {SECTIONS.map((section) => (
              <div key={section.id} className="stat-card">
                <span className="stat-label">{section.label}</span>
                <span className="stat-value">{getSectionCount(section.id, organizedData)}</span>
              </div>
            ))}
          </div>

          <nav className="section-navigation">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="tab-label">{section.label}</span>
                <span className="tab-count">{getSectionCount(section.id, organizedData)}</span>
              </button>
            ))}
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
    </div>
  )
}
