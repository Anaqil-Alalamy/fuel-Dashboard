import { useState, useEffect } from 'react'
import StatusCard from '../components/StatusCard'
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

  const in3Days = new Date(today)
  in3Days.setDate(in3Days.getDate() + 3)

  const categorized = {
    today: [],
    comingIn3Days: [],
    due: [],
  }

  sites.forEach((site) => {
    const siteDate = parseDate(site.date)
    if (!siteDate) return

    if (siteDate < today) {
      categorized.due.push({ ...site, status: 'due' })
    } else if (siteDate.getTime() === today.getTime()) {
      categorized.today.push({ ...site, status: 'today' })
    } else if (siteDate <= in3Days) {
      categorized.comingIn3Days.push({ ...site, status: 'comingSoon' })
    }
  })

  return categorized
}

const fetchSitesData = async () => {
  try {
    const response = await fetch(CSV_URL, {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()
    const sites = parseCSV(csvText)
    const categorized = categorizeSites(sites)

    return categorized
  } catch (error) {
    console.error('Error fetching sites data:', error)
    throw error
  }
}

export default function Dashboard({ onLogout }) {
  const [mockData, setMockData] = useState({
    today: [],
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
        if (data.today.length === 0 && data.comingIn3Days.length === 0 && data.due.length === 0) {
          setError('No data found in the Google Sheet. Please check that the spreadsheet is published and accessible.')
        }
        setMockData(data)
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}. Please check the browser console for details.`)
        console.error('Failed to load data:', err)
      }
      setLoading(false)
    }

    loadData()

    const interval = setInterval(loadData, 2 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const allSites = [...mockData.today, ...mockData.comingIn3Days, ...mockData.due]
  const comingSoon = [...mockData.comingIn3Days]

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-accent-line"></div>
        <div className="header-content">
          <div className="header-logo-section">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2Fffe83361cdfc400eb47d08d9242e60a7?format=webp&width=800"
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

        <div className="dashboard-hero">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Daily Fuel Plan at a Glance</h2>
            <p className="hero-subtitle">All site commitments in one clean, modern view.</p>
          </div>
          <div className="hero-pill">Live Sync</div>
        </div>

        <div className="dashboard-grid">
          <div className="cards-column">
            <StatusCard title="Total Sites" count={allSites.length} accentColor="#38bdf8" data={allSites} />
            <StatusCard title="Today" count={mockData.today.length} accentColor="#facc15" data={mockData.today} />
            <StatusCard title="Coming in 3 Days" count={comingSoon.length} accentColor="#22c55e" data={comingSoon} />
            <StatusCard title="Due" count={mockData.due.length} accentColor="#ef4444" data={mockData.due} />
          </div>

          <div className="map-panel">
            <div className="map-header">
              <div>
                <p className="eyebrow">Live Map</p>
                <h3>Fueling Commitments</h3>
              </div>
              <div className="map-legend">
                <span className="legend-dot" style={{ background: '#facc15' }}></span> Today
                <span className="legend-dot" style={{ background: '#ef4444' }}></span> Due
                <span className="legend-dot" style={{ background: '#22c55e' }}></span> Coming in 3 Days
              </div>
            </div>
            <SiteMap sites={allSites} />
          </div>
        </div>
      </div>
    </div>
  )
}
