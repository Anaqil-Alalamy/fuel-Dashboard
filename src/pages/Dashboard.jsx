import { useState, useEffect } from 'react'
import StatusCard from '../components/StatusCard'
import SiteMap from '../components/SiteMap'
import DonutChart from '../components/DonutChart'
import '../styles/dashboard.css'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDnTkwpbgsnY_i60u3ZleNs1DL3vMdG3fYHMrr5rwVDqMb3GpgKH40Y-7WQsEzEAi-wDHwLaimN8NC/pub?gid=1871402380&single=true&output=csv'

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

    const siteName = values[0]
    if (!siteName) continue

    const lat = values[5] ? parseFloat(values[5]) : null
    const lng = values[6] ? parseFloat(values[6]) : null
    const date = values[13] || null

    sites.push({
      id: i,
      siteName,
      lat: isNaN(lat) ? null : lat,
      lng: isNaN(lng) ? null : lng,
      date,
    })
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
    unscheduled: [],
  }

  sites.forEach((site) => {
    const siteDate = parseDate(site.date)

    if (!siteDate) {
      categorized.unscheduled.push({ ...site, status: 'unscheduled' })
      return
    }

    if (siteDate < today) {
      categorized.due.push({ ...site, status: 'due' })
    } else if (siteDate.getTime() === today.getTime()) {
      categorized.today.push({ ...site, status: 'today' })
    } else if (siteDate <= in3Days) {
      categorized.comingIn3Days.push({ ...site, status: 'comingSoon' })
    } else {
      categorized.unscheduled.push({ ...site, status: 'unscheduled' })
    }
  })

  return categorized
}

const getMockFallbackData = () => {
  return {
    today: [
      { id: 1, siteName: 'GSM Downtown', lat: 40.7128, lng: -74.0060, date: new Date().toISOString().split('T')[0], status: 'today' },
      { id: 2, siteName: 'GSM Airport Hub', lat: 40.6413, lng: -73.7781, date: new Date().toISOString().split('T')[0], status: 'today' },
    ],
    comingIn3Days: [
      { id: 3, siteName: 'GSM North Terminal', lat: 40.7549, lng: -73.9840, date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'comingSoon' },
      { id: 4, siteName: 'GSM East Port', lat: 40.7489, lng: -73.9680, date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'comingSoon' },
    ],
    due: [
      { id: 5, siteName: 'GSM Harbor Facility', lat: 40.6501, lng: -73.9496, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'due' },
      { id: 6, siteName: 'GSM Mountain Site', lat: 40.7614, lng: -73.9776, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'due' },
    ],
  }
}

const fetchSitesData = async () => {
  try {
    console.log('Attempting to fetch from CSV URL')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(CSV_URL, {
      method: 'GET',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    console.log('Response status:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()
    console.log('CSV text length:', csvText.length)

    if (!csvText || csvText.trim().length === 0) {
      console.warn('CSV response is empty')
      return getMockFallbackData()
    }

    const sites = parseCSV(csvText)
    console.log('Parsed sites count:', sites.length)

    const categorized = categorizeSites(sites)
    console.log('Categorized sites:', {
      today: categorized.today.length,
      comingIn3Days: categorized.comingIn3Days.length,
      due: categorized.due.length,
    })

    return categorized
  } catch (error) {
    console.warn('Error fetching sites data, using fallback mock data:', error)
    return getMockFallbackData()
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
    unscheduled: [],
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
        setMockData(data)
      } catch (err) {
        setError(`Failed to load data: ${err.message}. Please check the browser console for details.`)
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

  const allSites = [...mockData.today, ...mockData.comingIn3Days, ...mockData.due, ...mockData.unscheduled]
  const sitesWithCoordinates = allSites.filter(site => site.lat !== null && site.lng !== null)

  console.log('Dashboard Debug Info:')
  console.log('Total sites:', allSites.length)
  console.log('Sites with coordinates:', sitesWithCoordinates.length)
  console.log('Sample site:', allSites[0])
  console.log('Sample site with coords:', sitesWithCoordinates[0])

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
                <div className="kpi-icon-wrapper">
                  <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="kpi-number">{allSites.length}</div>
                <div className="kpi-label">Total Sites</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon-wrapper kpi-icon-today">
                  <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="kpi-number">{mockData.today.length}</div>
                <div className="kpi-label">Today</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon-wrapper kpi-icon-upcoming">
                  <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="kpi-number">{mockData.comingIn3Days.length}</div>
                <div className="kpi-label">Coming in 3 Days</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon-wrapper kpi-icon-overdue">
                  <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                  </svg>
                </div>
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
              <SiteMap sites={sitesWithCoordinates} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
