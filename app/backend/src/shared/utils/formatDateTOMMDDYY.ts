export function formatDateToMMDDYY(date: Date) {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const year = String(date.getFullYear()).slice(-2); // Pega os dois últimos dígitos do ano
	return `${month}/${day}/${year}`;
}
