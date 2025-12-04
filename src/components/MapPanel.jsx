export default function MapPanel({ allData = {} }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#E67E22'
      case 'in-progress':
        return '#0099D8'
      case 'scheduled':
        return '#27AE60'
      case 'overdue':
        return '#E74C3C'
      default:
        return '#27AE60'
    }
  }

  const allItems = [
    ...Object.values(allData).flat()
  ]

  const validLocations = allItems.filter((item) => item.latitude && item.longitude)

  const bounds = calculateMapBounds(validLocations)
  const mapWidth = 400
  const mapHeight = 300

  const projectPoint = (lat, lng) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * mapWidth
    const y = mapHeight - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * mapHeight
    return { x: Math.max(10, Math.min(mapWidth - 10, x)), y: Math.max(10, Math.min(mapHeight - 10, y)) }
  }

  return (
    <div className="map-panel">
      <div className="map-header">
        <h3 className="map-title">LIVE FUEL STATUS</h3>
        <button className="map-fullscreen-btn" title="Fullscreen">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 0h5v1H1v5H0V1a1 1 0 011-1zm9 0h5a1 1 0 011 1v5h-1V1h-5V0zM1 9v5a1 1 0 001 1h5v1H2a2 2 0 01-2-2V9h1zm14 0v5a1 1 0 01-1 1h-5v-1h5v-5h1z" />
          </svg>
        </button>
      </div>

      <div className="map-container">
        <svg width="100%" height="100%" viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="map-svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E0E4E8" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width={mapWidth} height={mapHeight} fill="#E8F4FF" />
          <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

          {validLocations.length > 0 ? (
            <>
              {validLocations.map((item, idx) => {
                const point = projectPoint(item.latitude, item.longitude)
                return (
                  <g key={idx}>
                    <circle cx={point.x} cy={point.y} r="6" fill={getStatusColor(item.status)} opacity="0.9" />
                    <circle cx={point.x} cy={point.y} r="6" fill="none" stroke={getStatusColor(item.status)} strokeWidth="1.5" opacity="0.4" />
                    <title>{item.siteName}</title>
                  </g>
                )
              })}
            </>
          ) : (
            <text x={mapWidth / 2} y={mapHeight / 2} textAnchor="middle" fontSize="14" fill="#999">
              No location data available
            </text>
          )}

          <g className="map-legend">
            <g transform="translate(20, 220)">
              <circle cx="0" cy="0" r="3" fill="#27AE60" />
              <text x="8" y="4" fontSize="11" fill="#666">
                Scheduled
              </text>
            </g>
            <g transform="translate(120, 220)">
              <circle cx="0" cy="0" r="3" fill="#E67E22" />
              <text x="8" y="4" fontSize="11" fill="#666">
                Pending
              </text>
            </g>
            <g transform="translate(220, 220)">
              <circle cx="0" cy="0" r="3" fill="#E74C3C" />
              <text x="8" y="4" fontSize="11" fill="#666">
                Overdue
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

function calculateMapBounds(locations) {
  if (locations.length === 0) {
    return { minLat: 20, maxLat: 35, minLng: 55, maxLng: 75 }
  }

  const lats = locations.map((loc) => loc.latitude)
  const lngs = locations.map((loc) => loc.longitude)

  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const padding = 0.1
  const latPadding = (maxLat - minLat) * padding || 1
  const lngPadding = (maxLng - minLng) * padding || 1

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding,
  }
}
