import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles/map.css'

const SAUDI_ARABIA_BOUNDS = [
  [16.3469, 32.1613], // Southwest
  [32.1537, 55.9754], // Northeast
]

const SAUDI_ARABIA_CENTER = [23.8859, 45.0792]

export default function MapComponent({ sites }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])

  useEffect(() => {
    if (!mapContainer.current) return

    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(SAUDI_ARABIA_CENTER, 6)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current)

      map.current.setMaxBounds(SAUDI_ARABIA_BOUNDS)
      map.current.on('drag', () => {
        map.current.panInsideBounds(SAUDI_ARABIA_BOUNDS, { animate: false })
      })
    }

    markers.current.forEach((marker) => marker.remove())
    markers.current = []

    if (sites && sites.length > 0) {
      sites.forEach((site) => {
        if (site.latitude && site.longitude) {
          const color = getMarkerColor(site.status)
          const marker = L.circleMarker([site.latitude, site.longitude], {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(map.current)

          marker.bindPopup(`
            <div class="map-popup">
              <h4>${site.siteName}</h4>
              <p><strong>Status:</strong> ${getStatusLabel(site.status)}</p>
              <p><strong>Fuel Type:</strong> ${site.fuelType}</p>
              <p><strong>Quantity:</strong> ${site.quantity}</p>
            </div>
          `)

          markers.current.push(marker)
        }
      })
    }

    return () => {
      markers.current.forEach((marker) => marker.remove())
    }
  }, [sites])

  return <div ref={mapContainer} className="map-container"></div>
}

function getMarkerColor(status) {
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
      return '#95A5A6'
  }
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    scheduled: 'Scheduled',
    overdue: 'Overdue',
  }
  return labels[status] || status
}
