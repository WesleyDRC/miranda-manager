export function formatDate(date) {
	const dateReceived = new Date(date)

	const day = dateReceived.getDay().toString().padStart("2", 0)
	const month = dateReceived.getMonth().toString().padStart("2", 0)
	const year = dateReceived.getFullYear()

	return `${day}/${month}/${year}`
}

export function getMonthName(dateString) {
  const date = new Date(dateString);
  
  let monthName = date.toLocaleString('pt-BR', { month: 'long' });

	monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1)
  
  return monthName;
}

export function getYear(dateString) {
  const date = new Date(dateString);
  
  return date.getFullYear();
}
