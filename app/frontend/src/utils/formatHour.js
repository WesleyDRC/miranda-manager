export function formatDate(dateInput) {
  if (!dateInput) return "";

  // Trata strings YYYY-MM-DD de forma textual para evitar desvios de fuso horário
  if (typeof dateInput === 'string' && dateInput.includes('-')) {
    const parts = dateInput.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
  }

  const date = new Date(dateInput);

	const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '/')

	return formattedDate
}
