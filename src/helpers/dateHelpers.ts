export const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const parseDate: (date: string, time?: boolean) => string = (date, time = false) => {
	if (date) {
		const initDate = new Date(date);
		const hours = initDate.getHours();
		const mins = initDate.getMinutes();
		const parsedTime = `${hours < 10 ? `0${hours}` : hours}:${mins < 10 ? `0${mins}` : mins}`;
		const parsedDate = `${initDate.getDate()} ${shortMonths[initDate.getMonth()]} ${initDate.getFullYear()}${
			time ? ` | ${parsedTime}` : ""
		}`;

		return parsedDate;
	}
	return null;
};
