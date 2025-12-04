export async function fetchCsvData(csvUrl) {
  try {
    const response = await fetch(csvUrl)
    if (!response.ok) throw new Error('Failed to fetch CSV')
    const csvText = await response.text()
    return parseCsvData(csvText)
  } catch (error) {
    console.error('Error fetching CSV data:', error)
    return null
  }
}

function parseCsvData(csvText) {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return null

  const headers = lines[0].split(',').map((h) => h.trim())
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim())
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    return row
  })

  return organizeFuelingData(rows, headers)
}

function organizeFuelingData(rows, headers) {
  const data = {
    today: [],
    tomorrow: [],
    comingIn3Days: [],
    due: [],
  }

  rows.forEach((row, index) => {
    const fuelingItem = {
      id: index + 1,
      siteName: row['Site Name'] || row['siteName'] || '',
      fuelType: row['Fuel Type'] || row['fuelType'] || '',
      quantity: row['Quantity'] || row['quantity'] || '',
      status: (row['Status'] || row['status'] || '').toLowerCase(),
      daysOverdue: parseInt(row['Days Overdue'] || row['daysOverdue'] || 0),
      scheduledDate: row['Scheduled Date'] || row['scheduledDate'] || '',
    }

    if (!fuelingItem.siteName) return

    const scheduledDate = parseScheduleDate(fuelingItem.scheduledDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (fuelingItem.status === 'overdue' || fuelingItem.daysOverdue > 0) {
      data.due.push(fuelingItem)
    } else if (scheduledDate && isSameDay(scheduledDate, today)) {
      data.today.push(fuelingItem)
    } else if (scheduledDate && isTomorrow(scheduledDate, today)) {
      data.tomorrow.push(fuelingItem)
    } else if (scheduledDate && isWithin3Days(scheduledDate, today)) {
      data.comingIn3Days.push(fuelingItem)
    }
  })

  return data
}

function parseScheduleDate(dateStr) {
  if (!dateStr) return null

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const d = new Date(parts[2], parseInt(parts[0]) - 1, parts[1])
      return isNaN(d.getTime()) ? null : d
    }
    return null
  }
  return date
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isTomorrow(date1, today) {
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return isSameDay(date1, tomorrow)
}

function isWithin3Days(date1, today) {
  const diff = Math.floor((date1 - today) / (1000 * 60 * 60 * 24))
  return diff > 1 && diff <= 3
}

export default fetchCsvData
