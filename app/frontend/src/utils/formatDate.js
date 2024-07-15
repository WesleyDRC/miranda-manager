export function formatDate(date) {
	const dateReceived = new Date(date)

	const day = dateReceived.getDay().toString().padStart("2", 0)
	const month = dateReceived.getMonth().toString().padStart("2", 0)
	const year = dateReceived.getFullYear()

	return `${day}/${month}/${year}`
}