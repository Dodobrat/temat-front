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
	return "N/A";
};

export const parseToISODate: (dateString: string | Date) => string = (dateString) => {
	if (dateString) {
		const initDate = new Date(dateString);
		const year = initDate.getFullYear();
		const month = initDate.getMonth() + 1;
		const date = initDate.getDate();

		const parsedMonth = month <= 9 ? `0${month}` : month;
		const parsedDate = date <= 9 ? `0${date}` : date;

		return `${year}-${parsedMonth}-${parsedDate}`;
	}
	return "";
};

export const isNotSunday = (date) => {
	const day = new Date(date).getDay();
	return day !== 0;
};

export const excludeUnavailableDates = () => {
	const excludedDates = [];

	const currDate = new Date();
	const isCurrSaturday = currDate.getDay() === 6;
	const currHour = currDate.getHours();

	if (isCurrSaturday && currHour > 12) {
		excludedDates.push(currDate);
	}
	if (isNotSunday(currDate) && !isCurrSaturday && currHour > 16) {
		excludedDates.push(currDate);
	}

	return excludedDates;
};

export const getClosestValidDate = () => {
	const today = new Date();
	let nextAvailableDate = today;
	let currentTime = Date.now();

	if (excludeUnavailableDates().length > 0) {
		if (isNotSunday(currentTime)) {
			currentTime += 1000 * 60 * 60 * 24;
			nextAvailableDate = new Date(currentTime);
		} else {
			currentTime += 1000 * 60 * 60 * 24;
			nextAvailableDate = new Date(currentTime);
		}
	}

	if (!isNotSunday(currentTime)) {
		currentTime += 1000 * 60 * 60 * 24;
		nextAvailableDate = new Date(currentTime);
	}

	return nextAvailableDate;
};
