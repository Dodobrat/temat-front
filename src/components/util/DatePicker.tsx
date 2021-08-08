import { InputComponent } from "@dodobrat/react-ui-kit";
import DatePicker, { registerLocale } from "react-datepicker";
import enGb from "date-fns/locale/en-GB";

interface Props {
	[key: string]: any;
}

const CalendarPicker = (props: Props) => {
	const { ...rest } = props;

	registerLocale("en-gb", enGb);

	const isNotSunday = (date) => {
		const day = new Date(date).getDay();
		return day !== 0;
	};

	const excludeUnavailableDates = () => {
		const excludedDates = [];

		const currDate = new Date();
		const isCurrSaturday = currDate.getDay() === 6;
		const currHour = currDate.getHours();

		if (isCurrSaturday && currHour > 12) {
			excludedDates.push(currDate);
		}

		return excludedDates;
	};

	return (
		<DatePicker
			className='w--100'
			dateFormat={"dd MMMM, yyyy"}
			calendarStartDay={1}
			locale='en-gb'
			fixedHeight
			minDate={new Date()}
			showWeekNumbers
			shouldCloseOnSelect
			excludeDates={excludeUnavailableDates()}
			filterDate={isNotSunday}
			customInput={<InputComponent />}
			{...rest}
		/>
	);
};

export default CalendarPicker;
