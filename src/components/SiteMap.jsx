import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles/site-map.css'

export default function SiteMap({ sites }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#0099D8'
      case 'in-progress':
        return '#0099D8'
      case 'scheduled':
        return '#22c55e'
      case 'overdue':
        return '#ef4444'
      default:
        return '#fbbf24'
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      'in-progress': 'In Progress',
      scheduled: 'Scheduled',
      overdue: 'Overdue',
    }
    return labels[status] || status
  }

  const center = [40.7128, -74.0060]

  return (
    <div className="site-map">
      <h3 className="map-title">Sites Map</h3>
      <MapContainer center={center} zoom={11} scrollWheelZoom={true} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sites.map((site) => (
          <CircleMarker
            key={site.id}
            center={[site.lat, site.lng]}
            radius={8}
            fillColor={getStatusColor(site.status)}
            color={getStatusColor(site.status)}
            weight={2}
            opacity={0.8}
            fillOpacity={0.6}
          >
            <Popup>
              <div className="popup-content">
                <h4>{site.siteName}</h4>
                <p><strong>ID:</strong> {site.id}</p>
                <p><strong>Status:</strong> {getStatusLabel(site.status)}</p>
                <p><strong>Fuel Type:</strong> {site.fuelType}</p>
                <p><strong>Quantity:</strong> {site.quantity}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
