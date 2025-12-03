import { useState } from 'react'
import '../styles/expandable-table.css'

export default function ExpandableTable({ title, data, isExpanded, onToggle, statusColor }) {
  return (
    <div className={`expandable-table expandable-${statusColor}`}>
      <button className="table-header" onClick={onToggle}>
        <div className="header-content">
          <span className="table-title">{title}</span>
          <span className="site-count">{data.length} Sites</span>
        </div>
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="table-content">
          <table className="sites-table">
            <thead>
              <tr>
                <th>Site Name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((site) => (
                <tr key={site.id}>
                  <td>{site.siteName}</td>
                  <td>{site.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
