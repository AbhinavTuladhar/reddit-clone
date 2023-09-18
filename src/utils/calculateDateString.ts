/**
 * Calculates a date string for displaying the best possible time difference units.
 * The order of the first and second dates do not matter, since an abs() function is used fo the subtraction.
 * @param {Date} first  The first date.
 * @param {Date} second The second date. 
 * @returns {string} The required date string.
 */

const calculateDateString = (first: Date, second: Date): string => {
  // It gives time difference in milliseconds, so dividing by 1000.
  const dateDifference = Math.abs(first.valueOf() - second.valueOf()) / 1000

  const MINUTE_FACTOR = 60
  const HOUR_FACTOR = MINUTE_FACTOR * 60
  const DAY_FACTOR = HOUR_FACTOR * 24
  const WEEK_FACTOR = DAY_FACTOR * 7
  const MONTH_FACTOR = DAY_FACTOR * 30
  const YEAR_FACTOR = DAY_FACTOR * 365

  if (dateDifference >= YEAR_FACTOR) {
    const years = Math.floor(dateDifference / YEAR_FACTOR)
    return `${years} ${years === 1 ? 'year' : 'years'} ago`
  } else if (dateDifference >= MONTH_FACTOR) {
    const months = Math.floor(dateDifference / MONTH_FACTOR)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  } else if (dateDifference >= WEEK_FACTOR) {
    const weeks = Math.floor(dateDifference / WEEK_FACTOR)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  } else if (dateDifference >= DAY_FACTOR) {
    const days = Math.floor(dateDifference / DAY_FACTOR)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  } else if (dateDifference >= HOUR_FACTOR) {
    const hours = Math.floor(dateDifference / HOUR_FACTOR)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (dateDifference >= MINUTE_FACTOR) {
    const minutes = Math.floor(dateDifference / MINUTE_FACTOR)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  }

  return `${dateDifference} seconds ago`
}

export default calculateDateString