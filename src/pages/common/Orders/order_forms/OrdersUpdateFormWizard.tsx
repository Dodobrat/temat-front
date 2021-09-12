import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Card } from "@dodobrat/react-ui-kit";

import { useOrdersUpdateContext } from "../../../../context/OrdersUpdateContext";

import OrderFormStepPayment from "../order_form_steps/OrderFormStepPayment";
import OrderFormStepShipping from "../order_form_steps/OrderFormStepShipping";
import OrderFormStepReceiver from "../order_form_steps/OrderFormStepReceiver";
import OrderFormStepProducts from "../order_form_steps/OrderFormStepProducts";
import OrderFormStepExtras from "../order_form_steps/OrderFormStepExtras";

import { parsedFetchedData } from "../orderHelpers";

interface Props {
	payload?: any;
	onTouch?: any;
}

const OrdersUpdateFormWizard = (props: Props) => {
	const { payload, onTouch } = props;

	const { t } = useTranslation();

	const {
		dataValue: { setData },
		stepValue: { currStep, setCurrStep },
	} = useOrdersUpdateContext();

	useEffect(() => {
		if (payload) {
			setData(parsedFetchedData(payload));
		}
	}, [payload, setData]);

	return (
		<>
			<Tabs
				className='max-h--unset'
				contentClassName='w--100'
				elevation='none'
				activeTab={currStep}
				onTabSelect={(tab: number) => setCurrStep(tab)}>
				<Tabs.Panel tab={t("step.payment")}>
					<OrderFormStepPayment useContext={useOrdersUpdateContext} isUpdating onTouch={onTouch} />
				</Tabs.Panel>
				<Tabs.Panel tab={t("step.shipping")}>
					<OrderFormStepShipping useContext={useOrdersUpdateContext} isUpdating onTouch={onTouch} />
				</Tabs.Panel>
				<Tabs.Panel tab={t("step.receiver")}>
					<OrderFormStepReceiver useContext={useOrdersUpdateContext} isUpdating onTouch={onTouch} />
				</Tabs.Panel>
				<Tabs.Panel tab={t("step.products")}>
					<OrderFormStepProducts useContext={useOrdersUpdateContext} isUpdating onTouch={onTouch} />
				</Tabs.Panel>
				<Tabs.Panel tab={t("step.extras")}>
					<OrderFormStepExtras useContext={useOrdersUpdateContext} isUpdating onTouch={onTouch} />
				</Tabs.Panel>
			</Tabs>
			<Card.Footer id='orders-form-footer' />
		</>
	);
};

export default OrdersUpdateFormWizard;
