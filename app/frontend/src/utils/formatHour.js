export function formatDate(dateInput) {

  const date = new Date(dateInput);

	const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '/')

	return formattedDate
}
