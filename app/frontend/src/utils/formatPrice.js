export default function priceBRL(value, withOutSimble=false) {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return withOutSimble ? "0,00" : "R$ 0,00";
  }

  const formattedValue = value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
	const valueWithoutSymbol = formattedValue.replace("R$", "").trim()

	return withOutSimble ? valueWithoutSymbol: formattedValue
}
