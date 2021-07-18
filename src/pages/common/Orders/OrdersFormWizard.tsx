import { useEffect } from "react";
import { useOrdersContext } from "../../../context/OrdersContext";
import { ProgressBar, Flex, Button } from "@dodobrat/react-ui-kit";
import OrderStepProducts from "./order_steps/OrderStepProducts";
import OrderStepShipping from "./order_steps/OrderStepShipping";
import OrderStepPayment from "./order_steps/OrderStepPayment";
import OrderStepSummary from "./order_steps/OrderStepSummary";
import { Card } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";

interface Props {
	payload?: any;
	maxSteps?: number;
}

const OrdersFormWizard = (props: Props) => {
	const { payload, maxSteps = 1 } = props;

	const { t } = useTranslation();

	const steps = Array.from(Array(maxSteps).keys());

	const {
		stepValue: { currStep, setCurrStep },
		dataValue: { data, setData },
	} = useOrdersContext();

	useEffect(() => {
		if (payload) {
			setData(payload);
		}
	}, [payload, setData]);

	const placeOrder = () => {
		console.log(data);
	};

	return (
		<>
			<Card.Body>
				<div className='temat__form__wizard__progress'>
					<Flex wrap='nowrap' justify='space-between' disableNegativeSpace>
						{steps.map((step) => (
							<Flex.Col
								key={step}
								as={Button}
								equalDimensions
								className='p--0'
								flavor='rounded'
								col='auto'
								active={currStep < step + 1}
								pigment={currStep >= step + 1 ? "primary" : "default"}
								onClick={() => setCurrStep(step + 1)}>
								{step + 1}
							</Flex.Col>
						))}
					</Flex>
					<ProgressBar value={currStep} max={maxSteps} min={1} className='pt--0' />
				</div>
				{/* {console.log(data)} */}
				{currStep === 1 && <OrderStepProducts />}
				{currStep === 2 && <OrderStepShipping />}
				{currStep === 3 && <OrderStepPayment />}
				{currStep === 4 && <OrderStepSummary />}
			</Card.Body>
			<Card.Footer>
				<Flex wrap='nowrap' justify='space-between' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						{currStep > 1 && (
							<Button pigment={null} pigmentColor='none' onClick={() => setCurrStep((prev: number) => prev - 1)}>
								{t("common.back")}
							</Button>
						)}
					</Flex.Col>
					<Flex.Col col='auto'>
						<Button
							pigment='primary'
							onClick={() => (currStep < maxSteps ? setCurrStep((prev: number) => prev + 1) : placeOrder())}>
							{currStep < maxSteps ? t("common.next") : t("common.submit")}
						</Button>
					</Flex.Col>
				</Flex>
			</Card.Footer>
		</>
	);
};

export default OrdersFormWizard;
