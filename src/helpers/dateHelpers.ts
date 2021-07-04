export const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const parseDate: (date: string, time?: boolean) => string = (date, time = false) => {
	const initDate = new Date(date);
	const parsedTime = `${initDate.getHours()}:${initDate.getMinutes()}`;
	const parsedDate = `${initDate.getDate()} ${shortMonths[initDate.getMonth()]} ${initDate.getFullYear()}${
		time ? ` | ${parsedTime}` : ""
	}`;

	return parsedDate;
};
