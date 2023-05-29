import { IInvoice } from '../interfaces/invoice.interface';

export const getDateForInput = (date: Date | string) => {
	if (date instanceof Date) {
		return date
			.toLocaleString('ru')
			.split(', ')[0]
			.split('.')
			.reverse()
			.join('-');
	}
	return date.split('.').reverse().join('-');
};

export const getNormalDate = (date: string) => {
	return date.split('-').reverse().join('.');
};

export const getRangeForInput = (startDate: string, range: number = 0) => {
	const [year, month, day] = startDate.split('-').map((el) => +el);
	console.log(startDate, range);

	const lastDate = new Date(
		new Date(year, month - 1, day).getTime() + range * 1000 * 60 * 60 * 24
	);

	return lastDate
		.toLocaleString('ru')
		.split(', ')[0]
		.split('.')
		.reverse()
		.join('-');
};

export const getDefaultDateRange = () => {
	const today = new Date();
	const currentMonth = today.getMonth();
	let prevMonth = 0;
	if (currentMonth === 0) {
		prevMonth = 10;
	}
	if (currentMonth === 1) {
		prevMonth = 11;
	} else {
		prevMonth = currentMonth - 2;
	}
	const year =
		prevMonth === 10 || prevMonth === 11
			? today.getFullYear()
			: today.getFullYear() - 1;
	const startDate = getDateForInput(new Date(year, prevMonth, 1));
	return {
		startDate,
		lastDate: getDateForInput(
			new Date(today.getTime() + 30 * 1000 * 60 * 60 * 24)
		),
	};
};

export const getUniqueDates = (invoices: IInvoice[]) => {
	return Array.from(new Set(invoices.map((invoice) => invoice.lastDate)));
};
