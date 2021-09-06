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
}

const OrdersUpdateFormWizard = (props: Props) => {
	const { payload } = props;

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
				<Tabs.Panel tab={t("orders.payment")}>
					<OrderFormStepPayment useContext={useOrdersUpdateContext} isUpdating />
				</Tabs.Panel>
				<Tabs.Panel tab={t("orders.shipping")}>
					<OrderFormStepShipping useContext={useOrdersUpdateContext} isUpdating />
				</Tabs.Panel>
				<Tabs.Panel tab={t("orders.receiver")}>
					<OrderFormStepReceiver useContext={useOrdersUpdateContext} isUpdating />
				</Tabs.Panel>
				<Tabs.Panel tab={t("orders.products")}>
					<OrderFormStepProducts useContext={useOrdersUpdateContext} isUpdating />
				</Tabs.Panel>
				<Tabs.Panel tab={t("orders.extras")}>
					<OrderFormStepExtras useContext={useOrdersUpdateContext} isUpdating />
				</Tabs.Panel>
			</Tabs>
			<Card.Footer id='orders-form-footer' />
		</>
	);
};

export default OrdersUpdateFormWizard;
