export function formatDate(dateString = "") {
	const [day, month, year] = dateString.split('-').map(Number)
	const dateReceived = new Date(year, month - 1, day)

	const formattedDay = dateReceived.getDate().toString().padStart(2, '0')
	const formattedMonth  = (dateReceived.getMonth() + 1).toString().padStart("2", 0)
	const formattedYear  = dateReceived.getFullYear()
	
	return `${formattedDay}/${formattedMonth}/${formattedYear}`
}

export function getMonthName(dateString = "") {
	const [day, month, year] = dateString.split('/').map(Number)
	const dateReceived = new Date(year, month - 1, day)

  let monthName = dateReceived.toLocaleString('pt-BR', { month: 'long' });

	monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1)
  
  return monthName;
}

export function getYear(dateString) {
	const [day, month, year] = dateString.split('/').map(Number)

  const date = new Date(year, month - 1, day);

  return date.getFullYear();
}
