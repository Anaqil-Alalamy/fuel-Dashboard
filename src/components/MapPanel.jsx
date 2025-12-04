export default function MapPanel() {
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
        <svg width="100%" height="100%" viewBox="0 0 400 300" className="map-svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E0E4E8" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width="400" height="300" fill="#E8F4FF" />
          <rect width="400" height="300" fill="url(#grid)" />

          <path
            d="M 50 120 Q 100 100 150 110 T 250 130 Q 300 140 350 120"
            fill="none"
            stroke="#B0D4FF"
            strokeWidth="2"
            opacity="0.6"
          />

          <circle cx="80" cy="80" r="6" fill="#27AE60" />
          <circle cx="150" cy="100" r="6" fill="#27AE60" />
          <circle cx="220" cy="120" r="6" fill="#E67E22" />
          <circle cx="280" cy="110" r="6" fill="#E67E22" />
          <circle cx="320" cy="140" r="6" fill="#E74C3C" />
          <circle cx="180" cy="180" r="6" fill="#27AE60" />
          <circle cx="250" cy="200" r="6" fill="#0099D8" />
          <circle cx="100" cy="220" r="6" fill="#27AE60" />

          <g className="map-legend">
            <g transform="translate(20, 220)">
              <circle cx="0" cy="0" r="3" fill="#27AE60" />
              <text x="8" y="4" fontSize="11" fill="#666">
                Operational
              </text>
            </g>
            <g transform="translate(140, 220)">
              <circle cx="0" cy="0" r="3" fill="#E67E22" />
              <text x="8" y="4" fontSize="11" fill="#666">
                Pending
              </text>
            </g>
            <g transform="translate(260, 220)">
              <circle cx="0" cy="0" r="3" fill="#E74C3C" />
              <text x="8" y="4" fontSize="11" fill="#666">
                Delayed
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
