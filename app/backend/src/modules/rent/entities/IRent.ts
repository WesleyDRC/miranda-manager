interface IRentMonth {
  month: string;
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
	userId: string
}