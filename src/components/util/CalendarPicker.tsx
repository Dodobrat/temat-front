import { forwardRef } from "react";
import { InputComponent } from "@dodobrat/react-ui-kit";
import DatePicker, { registerLocale } from "react-datepicker";

import enGb from "date-fns/locale/en-GB";

import { excludeUnavailableDates, isNotSunday } from "../../helpers/dateHelpers";

interface Props {
	[key: string]: any;
}

const CalendarPicker = forwardRef((props: Props, ref: React.ForwardedRef<unknown>) => {
	const { inputProps, ...rest } = props;
	registerLocale("en-gb", enGb);

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
			customInput={<InputComponent {...inputProps} />}
			ref={ref}
			{...rest}
		/>
	);
});

export default CalendarPicker;
