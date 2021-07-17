import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { ProgressBar } from "@dodobrat/react-ui-kit";
import { useOrdersContext } from "../../../context/OrdersContext";

interface Props {
	payload?: any;
	maxSteps?: number;
}

const OrdersFormWizard = (props: Props) => {
	const { payload, maxSteps } = props;

	// const { t } = useTranslation();
	const {
		stepValue: { currStep },
		dataValue: { data, setData },
	} = useOrdersContext();

	useEffect(() => {
		if (payload) {
			setData(payload);
		}
	}, [payload, setData]);

	return (
		<>
			<ProgressBar value={currStep} max={maxSteps} labelAlwaysVisible labeled />
			Step: {currStep}
			data: {console.log(data)}
		</>
	);
};

export default OrdersFormWizard;
