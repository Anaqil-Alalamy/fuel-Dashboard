import { useState, useEffect } from 'react'
import SummaryCard from '../components/SummaryCard'
import ExpandableTable from '../components/ExpandableTable'
import SiteMap from '../components/SiteMap'
import '../styles/dashboard.css'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDnTkwpbgsnY_i60u3ZleNs1DL3vMdG3fYHMrr5rwVDqMb3GpgKH40Y-7WQsEzEAi-wDHwLaimN8NC/pub?output=csv'

const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  const sites = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    if (values.length < 14) continue

    const site = {
      id: i,
      siteName: values[0],
      lat: parseFloat(values[5]),
      lng: parseFloat(values[6]),
      date: values[13],
    }

    if (site.siteName && !isNaN(site.lat) && !isNaN(site.lng) && site.date) {
      sites.push(site)
    }
  }

  return sites
}

const categorizeSites = (sites) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const in3Days = new Date(today)
  in3Days.setDate(in3Days.getDate() + 3)

  const categorized = {
    today: [],
    tomorrow: [],
    comingIn3Days: [],
    due: [],
  }

  sites.forEach((site) => {
    const siteDate = new Date(site.date)
    siteDate.setHours(0, 0, 0, 0)

    if (siteDate < today) {
      categorized.due.push({ ...site, status: 'overdue' })
    } else if (siteDate.getTime() === today.getTime()) {
      categorized.today.push({ ...site, status: 'pending' })
    } else if (siteDate.getTime() === tomorrow.getTime()) {
      categorized.tomorrow.push({ ...site, status: 'scheduled' })
    } else if (siteDate <= in3Days) {
      categorized.comingIn3Days.push({ ...site, status: 'scheduled' })
    }
  })

  return categorized
}

const fetchSitesData = async () => {
  try {
    const response = await fetch(CSV_URL)
    const csvText = await response.text()
    const sites = parseCSV(csvText)
    return categorizeSites(sites)
  } catch (error) {
    console.error('Error fetching sites data:', error)
    return {
      today: [],
      tomorrow: [],
      comingIn3Days: [],
      due: [],
    }
  }
}

export default function Dashboard({ onLogout }) {
  const [expandedTables, setExpandedTables] = useState({ today: true, tomorrow: false, coming3days: false, due: false })
  const [mockData, setMockData] = useState({
    today: [],
    tomorrow: [],
    comingIn3Days: [],
    due: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = await fetchSitesData()
      setMockData(data)
      setLoading(false)
    }

    loadData()

    const interval = setInterval(loadData, 2 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const allSites = [...mockData.today, ...mockData.tomorrow, ...mockData.comingIn3Days, ...mockData.due]

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
        <div className="header-accent-line"></div>
        <div className="header-content">
          <div className="header-logo-section">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2Fa9cbf8c7a3494e78810477f12dd379b5?format=webp&width=800"
              alt="Company Logo"
              className="header-logo"
            />
          </div>
          <div className="header-center">
            <h1 className="dashboard-title">Fueling Dashboard</h1>
            <p className="dashboard-subtitle">GSM Sites Fueling Plan Management</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="left-content-panel">
          <div className="summary-cards-section">
            <SummaryCard title="Total Sites" count={allSites.length} variant="total" />
            <SummaryCard title="Today" count={mockData.today.length} variant="today" />
            <SummaryCard title="Tomorrow" count={mockData.tomorrow.length} variant="tomorrow" />
            <SummaryCard title="Overdue" count={mockData.due.length} variant="overdue" />
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

        <div className="site-map-container">
          <SiteMap sites={allSites} />
        </div>
      </div>
    </div>
  )
}
