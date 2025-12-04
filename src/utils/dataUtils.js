const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDnTkwpbgsnY_i60u3ZleNs1DL3vMdG3fYHMrr5rwVDqMb3GpgKH40Y-7WQsEzEAi-wDHwLaimN8NC/pub?gid=1871402380&single=true&output=csv'

const DEFAULT_MOCK_DATA = [
  {
    id: 1,
    siteName: 'GSM Downtown',
    latitude: 24.7136,
    longitude: 46.6753,
    fuelType: 'Diesel',
    quantity: '500L',
    status: 'pending',
    nextFuelingPlan: new Date().toISOString().split('T')[0],
  },
  {
    id: 2,
    siteName: 'GSM Airport Hub',
    latitude: 24.9554,
    longitude: 46.2991,
    fuelType: 'Petrol',
    quantity: '300L',
    status: 'in-progress',
    nextFuelingPlan: new Date().toISOString().split('T')[0],
  },
  {
    id: 3,
    siteName: 'GSM North Terminal',
    latitude: 24.9164,
    longitude: 46.2235,
    fuelType: 'Diesel',
    quantity: '450L',
    status: 'scheduled',
    nextFuelingPlan: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  },
  {
    id: 4,
    siteName: 'GSM East Port',
    latitude: 24.4539,
    longitude: 46.5101,
    fuelType: 'Petrol',
    quantity: '350L',
    status: 'scheduled',
    nextFuelingPlan: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  },
  {
    id: 5,
    siteName: 'GSM West Branch',
    latitude: 24.8242,
    longitude: 46.4104,
    fuelType: 'Diesel',
    quantity: '600L',
    status: 'scheduled',
    nextFuelingPlan: new Date(Date.now() + 172800000).toISOString().split('T')[0],
  },
  {
    id: 6,
    siteName: 'GSM Central Depot',
    latitude: 24.7746,
    longitude: 46.7079,
    fuelType: 'Petrol',
    quantity: '400L',
    status: 'scheduled',
    nextFuelingPlan: new Date(Date.now() + 259200000).toISOString().split('T')[0],
  },
  {
    id: 7,
    siteName: 'GSM South Station',
    latitude: 24.1551,
    longitude: 46.6992,
    fuelType: 'Diesel',
    quantity: '550L',
    status: 'scheduled',
    nextFuelingPlan: new Date(Date.now() + 259200000).toISOString().split('T')[0],
  },
  {
    id: 8,
    siteName: 'GSM Harbor Facility',
    latitude: 26.1207,
    longitude: 50.1955,
    fuelType: 'Diesel',
    quantity: '700L',
    status: 'overdue',
    daysOverdue: 2,
    nextFuelingPlan: new Date(Date.now() - 172800000).toISOString().split('T')[0],
  },
  {
    id: 9,
    siteName: 'GSM Mountain Site',
    latitude: 26.9124,
    longitude: 49.5005,
    fuelType: 'Petrol',
    quantity: '250L',
    status: 'overdue',
    daysOverdue: 1,
    nextFuelingPlan: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  },
]

export async function fetchFuelingData() {
  try {
    const response = await fetch(CSV_URL)
    if (!response.ok) {
      console.warn('Failed to fetch CSV data, using mock data')
      return DEFAULT_MOCK_DATA
    }
    const csvText = await response.text()
    return parseCSVData(csvText)
  } catch (error) {
    console.warn('Error fetching CSV:', error.message)
    return DEFAULT_MOCK_DATA
  }
}

function parseCSVData(csvText) {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return DEFAULT_MOCK_DATA

  const headers = lines[0].split(',').map((h) => h.trim())

  const siteNameIndex = headers.findIndex((h) =>
    h.toLowerCase().includes('sitename') || h.toLowerCase().includes('site name')
  )
  const latitudeIndex = headers.findIndex((h) => h.toLowerCase().includes('latitude'))
  const longitudeIndex = headers.findIndex((h) => h.toLowerCase().includes('longitude'))
  const nextFuelingPlanIndex = headers.findIndex(
    (h) =>
      h.toLowerCase().includes('nextfuelingplan') ||
      h.toLowerCase().includes('next fueling plan') ||
      h.toLowerCase().includes('fueling plan')
  )

  if (siteNameIndex === -1 || latitudeIndex === -1 || longitudeIndex === -1 || nextFuelingPlanIndex === -1) {
    console.warn('Could not find required columns in CSV')
    return DEFAULT_MOCK_DATA
  }

  const data = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    const values = parseCSVLine(line)
    if (values.length > Math.max(siteNameIndex, latitudeIndex, longitudeIndex, nextFuelingPlanIndex)) {
      const siteName = values[siteNameIndex]?.trim()
      const latitude = parseFloat(values[latitudeIndex]?.trim())
      const longitude = parseFloat(values[longitudeIndex]?.trim())
      const nextFuelingPlan = values[nextFuelingPlanIndex]?.trim()

      if (siteName && !isNaN(latitude) && !isNaN(longitude) && nextFuelingPlan) {
        data.push({
          id: i,
          siteName,
          latitude,
          longitude,
          fuelType: 'Diesel',
          quantity: '500L',
          status: 'scheduled',
          nextFuelingPlan,
        })
      }
    }
  }

  return data.length > 0 ? data : DEFAULT_MOCK_DATA
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

function getDateDifference(dateString) {
  const fuelingDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  fuelingDate.setHours(0, 0, 0, 0)

  const diffTime = fuelingDate - today
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

export function organizeFuelingDataByDate(allData) {
  const organized = {
    today: [],
    coming1day: [],
    coming2days: [],
    coming3days: [],
    due: [],
    all: allData,
  }

  allData.forEach((item) => {
    const daysDiff = getDateDifference(item.nextFuelingPlan)

    if (item.status === 'overdue' || daysDiff < 0) {
      organized.due.push(item)
    } else if (daysDiff === 0) {
      organized.today.push(item)
    } else if (daysDiff === 1) {
      organized.coming1day.push(item)
    } else if (daysDiff === 2) {
      organized.coming2days.push(item)
    } else if (daysDiff === 3) {
      organized.coming3days.push(item)
    }
  })

  return organized
}

export function getTotalSitesCount(data) {
  return data.length
}

export function getSectionCount(section, organizedData) {
  return organizedData[section]?.length || 0
}
