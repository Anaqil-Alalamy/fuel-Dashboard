import { useState, useEffect } from 'react'
import SummaryCard from '../components/SummaryCard'
import ExpandableTable from '../components/ExpandableTable'
import SiteMap from '../components/SiteMap'
import '../styles/dashboard.css'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDnTkwpbgsnY_i60u3ZleNs1DL3vMdG3fYHMrr5rwVDqMb3GpgKH40Y-7WQsEzEAi-wDHwLaimN8NC/pub?output=csv'

const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n')
  const sites = []

  if (lines.length < 2) {
    console.error('CSV has no data rows')
    return sites
  }

  console.log('CSV Header:', lines[0])
  console.log('Total lines:', lines.length)

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const row = lines[i]
    let values = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < row.length; j++) {
      const char = row[j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    values = values.map(v => v.replace(/^"|"$/g, ''))

    if (values.length < 14) {
      console.warn(`Row ${i} has only ${values.length} columns, skipping`)
      continue
    }

    const siteName = values[0]
    const lat = parseFloat(values[5])
    const lng = parseFloat(values[6])
    const date = values[13]

    console.log(`Row ${i}:`, { siteName, lat, lng, date })

    if (siteName && !isNaN(lat) && !isNaN(lng) && date) {
      sites.push({
        id: i,
        siteName,
        lat,
        lng,
        date,
      })
    }
  }

  console.log('Parsed sites:', sites)
  return sites
}

const parseDate = (dateString) => {
  if (!dateString) return null

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateString)
    return null
  }

  date.setHours(0, 0, 0, 0)
  return date
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
    const siteDate = parseDate(site.date)
    if (!siteDate) return

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
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchSitesData()
        setMockData(data)
      } catch (err) {
        setError(err.message)
        console.error('Failed to load data:', err)
      }
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
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading sites data...</p>
          </div>
        )}
        {error && (
          <div className="error-banner">
            <p>⚠️ Error loading data: {error}</p>
          </div>
        )}
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
