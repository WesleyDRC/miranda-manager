interface IRentMonth {
  dateMonth: string;
  paid: boolean;
}

export interface IRent {
	id: string,
	name: string,
	value: string,
	street: string,
	streetNumber: string,
	startRental: string,
	months?: IRentMonth[],
	grossIncome: number,
	netIncome: number,
	userId: string
}