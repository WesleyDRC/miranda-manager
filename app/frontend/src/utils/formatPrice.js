export default function priceBRL(value, withOutSimble=false) {

  const formattedValue = value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
	const valueWithoutSymbol = formattedValue.replace("R$", "").trim()

	return withOutSimble ? valueWithoutSymbol: formattedValue
}
