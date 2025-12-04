import { useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl, LayerGroup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles/site-map.css'

export default function SiteMap({ sites }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'today':
        return '#facc15'
      case 'pending':
        return '#facc15'
      case 'in-progress':
        return '#0099D8'
      case 'comingSoon':
        return '#22c55e'
      case 'scheduled':
        return '#22c55e'
      case 'due':
        return '#ef4444'
      case 'unscheduled':
        return '#9ca3af'
      default:
        return '#38bdf8'
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      today: 'Today',
      comingSoon: 'Coming in 3 Days',
      due: 'Due',
      unscheduled: 'Unscheduled',
    }
    return labels[status] || status
  }

  const initialCenter = useMemo(() => {
    if (sites.length > 0) {
      const siteWithCoords = sites.find(s => s.lat && s.lng)
      if (siteWithCoords) {
        return [siteWithCoords.lat, siteWithCoords.lng]
      }
    }
    return [24.7136, 46.6753]
  }, [sites])

  function MapBounds({ points, fallbackCenter }) {
    const map = useMap()

    useEffect(() => {
      if (!map) return

      const validPoints = points.filter(p => p.lat && p.lng)
      if (validPoints.length === 0) {
        map.setView(fallbackCenter, 5)
        return
      }

      const bounds = validPoints.map((point) => [point.lat, point.lng])
      map.fitBounds(bounds, { padding: [40, 40] })
    }, [map, points, fallbackCenter])

    return null
  }

  return (
    <div className="site-map">
      <MapContainer center={initialCenter} zoom={11} scrollWheelZoom={true} className="leaflet-map">
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Street Map" checked>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Dark Mode">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="Sites" checked>
            <LayerGroup>
              {sites.filter(site => site.lat && site.lng).map((site) => (
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
                      <p><strong>Date:</strong> {site.date}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
        <MapBounds points={sites} fallbackCenter={initialCenter} />
      </MapContainer>
    </div>
  )
}
