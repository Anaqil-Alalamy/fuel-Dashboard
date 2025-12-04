export async function fetchCsvData(csvUrl, sheetName = 'Sheet2') {
  try {
    const sheetUrl = csvUrl.includes('?output=csv')
      ? csvUrl
      : `${csvUrl}?output=csv`

    const response = await fetch(sheetUrl)
    if (!response.ok) throw new Error('Failed to fetch CSV')
    const csvText = await response.text()
    return parseCsvData(csvText, sheetName)
  } catch (error) {
    console.error('Error fetching CSV data:', error)
    return null
  }
}

function parseCsvData(csvText, sheetName = 'Sheet2') {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return null

  let dataStartIdx = 0

  if (sheetName === 'Sheet2') {
    const sheet2Idx = lines.findIndex((line) => line.toLowerCase().includes('sheet2'))
    if (sheet2Idx !== -1) {
      dataStartIdx = sheet2Idx + 1
    }
  }

  if (dataStartIdx >= lines.length) {
    console.warn(`${sheetName} not found, using first sheet`)
    dataStartIdx = 0
  }

  const headerLine = lines[dataStartIdx] || lines[0]
  const headers = headerLine.split(',').map((h) => h.trim())

  const dataLines = lines.slice(dataStartIdx + 1).filter((line) => line.trim())

  const rows = dataLines.map((line) => {
    const values = line.split(',').map((v) => v.trim())
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
      row[`col${String.fromCharCode(65 + index)}`] = values[index] || ''
    })
    return row
  })

  return organizeFuelingData(rows)
}

function organizeFuelingData(rows) {
  const data = {
    today: [],
    tomorrow: [],
    comingIn3Days: [],
    due: [],
  }

  rows.forEach((row, index) => {
    const siteName = row['colA'] || row['A'] || row['Site Name'] || row['siteName'] || ''

    if (!siteName) return

    const nextFuelingPlan = row['colN'] || row['N'] || row['Next Fuelling Plan'] || ''
    const latitude = parseFloat(row['colF'] || row['F'] || row['Latitude'] || 0)
    const longitude = parseFloat(row['colG'] || row['G'] || row['Longitude'] || 0)

    const fuelingItem = {
      id: index + 1,
      siteName: siteName,
      fuelType: row['Fuel Type'] || row['fuelType'] || '',
      quantity: row['Quantity'] || row['quantity'] || '',
      status: (row['Status'] || row['status'] || 'scheduled').toLowerCase(),
      daysOverdue: parseInt(row['Days Overdue'] || row['daysOverdue'] || 0),
      scheduledDate: nextFuelingPlan,
      latitude: latitude,
      longitude: longitude,
      nextFuelingPlan: nextFuelingPlan,
    }

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
    } else {
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
