const nameMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const toDateFormat = (timestamp: number): string => { 
  return new Date(timestamp * 1000).toISOString().split('T')[0]
}; 

export const toShortDateFormat = (timestamp: number): string => {
  const date = new Date(timestamp * 1000) 
  const shortYear = date.getFullYear().toString() // .slice(2,4) 

  return `${nameMonths[date.getMonth()]} ${shortYear}`
}; 

export const toFullDateFormat = (timestamp: number): string => {
  const date = new Date(timestamp * 1000) 
  return `${date.getDate()} ${nameMonths[date.getMonth()]} ${date.getFullYear()}`
}; 

export const toEurTimeFormat = (timestamp: number): string => {
  const date = new Date(timestamp * 1000) 
  return `${date.getHours()}:${date.getMinutes()}`
}; 

export const toTimestamp = (dateFormat: string): string => { 
  return String(Date.parse(dateFormat))
};