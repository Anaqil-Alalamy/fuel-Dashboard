import { useState, useEffect } from 'react'
import StatusCard from '../components/StatusCard'
import SiteMap from '../components/SiteMap'
import DonutChart from '../components/DonutChart'
import '../styles/dashboard.css'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDnTkwpbgsnY_i60u3ZleNs1DL3vMdG3fYHMrr5rwVDqMb3GpgKH40Y-7WQsEzEAi-wDHwLaimN8NC/pub?gid=1&output=csv'

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
      mode: 'cors',
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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getCurrentDateTime = () => {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Dashboard({ onLogout }) {
  const [mockData, setMockData] = useState({
    today: [],
    comingIn3Days: [],
    due: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDue, setFilteredDue] = useState([])
  const [filteredToday, setFilteredToday] = useState([])

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

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDue(mockData.due)
      setFilteredToday(mockData.today)
    } else {
      const lowerSearch = searchTerm.toLowerCase()
      setFilteredDue(mockData.due.filter(site => site.siteName.toLowerCase().includes(lowerSearch)))
      setFilteredToday(mockData.today.filter(site => site.siteName.toLowerCase().includes(lowerSearch)))
    }
  }, [searchTerm, mockData])

  const allSites = [...mockData.today, ...mockData.comingIn3Days, ...mockData.due]

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const handleDownload = () => {
    const csvContent = [
      ['Site Name', 'Date', 'Status'],
      ...allSites.map(site => [site.siteName, site.date, site.status || 'unknown']),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `fueling-sites-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="dashboard-main-wrapper">
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

        <div className="dashboard-layout">
          <div className="left-column">
            <div className="date-time-label">
              <p>{getCurrentDateTime()}</p>
            </div>

            <div className="search-download-row">
              <input
                type="text"
                placeholder="Search by site name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-large"
              />
              <button className="download-button" onClick={handleDownload}>
                📥 Download
              </button>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-number">{allSites.length}</div>
                <div className="kpi-label">Total Sites</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-number">{mockData.today.length}</div>
                <div className="kpi-label">Today</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-number">{mockData.comingIn3Days.length}</div>
                <div className="kpi-label">Coming in 3 Days</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-number">{mockData.due.length}</div>
                <div className="kpi-label">Due (Overdue)</div>
              </div>
            </div>

            <DonutChart totalSites={allSites.length} dueSites={mockData.due.length} />

            <div className="tables-container">
              <div className="table-card">
                <div className="table-header">
                  <h3>Due (Overdue)</h3>
                  <span className="table-count">{filteredDue.length}</span>
                </div>
                <div className="table-wrapper">
                  <div className="table-header-row">
                    <span>Site Name</span>
                    <span>Date</span>
                  </div>
                  <div className="table-body">
                    {filteredDue.length === 0 ? (
                      <div className="table-empty">No overdue sites</div>
                    ) : (
                      filteredDue.map(site => (
                        <div key={site.id} className="table-row">
                          <span className="cell-site-name">{site.siteName}</span>
                          <span className="cell-date">{formatDate(site.date)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="table-card">
                <div className="table-header">
                  <h3>Today Schedule</h3>
                  <span className="table-count">{filteredToday.length}</span>
                </div>
                <div className="table-wrapper">
                  <div className="table-header-row">
                    <span>Site Name</span>
                    <span>Date</span>
                  </div>
                  <div className="table-body">
                    {filteredToday.length === 0 ? (
                      <div className="table-empty">No sites scheduled for today</div>
                    ) : (
                      filteredToday.map(site => (
                        <div key={site.id} className="table-row">
                          <span className="cell-site-name">{site.siteName}</span>
                          <span className="cell-date">{formatDate(site.date)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="map-container">
              <div className="map-header-section">
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
    </div>
  )
}
