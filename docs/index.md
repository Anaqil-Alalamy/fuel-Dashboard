---
layout: default
title: Fuel Dashboard - GSM Sites Fueling Plan Management
---

# 🚀 Fuel Dashboard

A comprehensive fueling plan management system for GSM sites. Manage fuel deliveries, track schedules, and monitor fueling operations across multiple locations in real-time.

## 📋 Overview

The Fuel Dashboard provides a centralized platform to:
- **Track Fueling Schedules**: Monitor fuel deliveries across all sites
- **Manage Multiple Sites**: Handle fuel operations for various locations
- **Real-time Status**: Monitor fueling status updates instantly
- **Flexible Scheduling**: Plan deliveries by date categories
- **Interactive Map**: Visualize site locations and statuses geographically

## 🎯 Key Features

### Dashboard Analytics
- **Total Sites**: View all registered fueling sites
- **Today Schedule**: Monitor today's fueling deliveries
- **Upcoming Deliveries**: Track fuel deliveries coming in the next 3 days
- **Overdue Alerts**: Identify and manage overdue fuel deliveries

### Site Management
- Multi-site overview and tracking
- Real-time delivery status updates
- Historical data and scheduling
- Geographic location mapping

### Planning & Organization
- Categorized scheduling (Today, Tomorrow, Coming in 3 Days, Due/Behind)
- Easy filtering and search functionality
- Data export capabilities
- Interactive site map visualization

## 📂 Categories

### Today
Fuel deliveries scheduled for **today**. Prioritize immediate fueling operations.

### Tomorrow
Fuel deliveries scheduled for **tomorrow**. Plan ahead for upcoming operations.

### Coming in 3 Days
Upcoming fuel deliveries within the **next 3 days**. Monitor medium-term schedules.

### Due / Behind
Overdue or **behind schedule** deliveries. Priority handling required.

## 🗺️ Features

### Interactive Map
- Visual representation of all fueling sites
- Color-coded status indicators
- Site details on click
- Multiple map layer options (Street, Satellite, Dark Mode, Terrain)

### KPI Overview
- Real-time key performance indicators
- Due vs. On-time site statistics
- Visual dashboard analytics
- Historical trend tracking

### Data Management
- Search and filter sites by name
- Export fueling data
- Detailed site information
- Date and status tracking

## 🔧 Technical Stack

The Fuel Dashboard is built with:
- **React 19** - Modern UI framework
- **Leaflet & React-Leaflet** - Interactive mapping
- **Vite** - Fast build tool
- **Modern CSS** - Responsive design
- **Jekyll** - Documentation site

## 📖 Getting Started

### For Users
1. Access the dashboard at the main site
2. View today's fueling schedule
3. Check upcoming deliveries
4. Monitor overdue items
5. Use the interactive map to visualize sites

### For Developers
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Data Overview

### Site Information
- Site Name/ID
- Location (Latitude/Longitude)
- Fuel Type
- Scheduled Delivery Date
- Current Status

### Status Types
- 🟡 **Today** - Scheduled for today
- 🟢 **Coming Soon** - Scheduled within 3 days
- 🔴 **Due/Overdue** - Overdue or behind schedule
- ⚫ **Unscheduled** - No scheduled date

## 🔄 Auto-Refresh

The dashboard automatically updates every 2 minutes to fetch the latest fueling data from the source system.

## 📝 Data Source

Fueling data is sourced from a Google Sheet and automatically synchronized with the dashboard. New sites added to the sheet will appear in the dashboard within 2 minutes.

## 🎨 Dashboard Design

The modern corporate design includes:
- Clean, professional interface
- Responsive layout for all devices
- Interactive cards with hover effects
- Color-coded status indicators
- Smooth animations and transitions
- Accessibility-first approach

## 📱 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Support

For issues, questions, or feature requests, please contact the development team.

## 📄 License

All rights reserved. GSM Sites Fueling Management System.

---

**Last Updated**: December 2025
