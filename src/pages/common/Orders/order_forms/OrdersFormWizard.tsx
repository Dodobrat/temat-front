import { useEffect } from "react";
import { Heading, CollapseFade, Card, ProgressBar, Flex, Button } from "@dodobrat/react-ui-kit";

import { useAuthContext } from "../../../../context/AuthContext";
import { useOrdersContext } from "../../../../context/OrdersContext";

import OrderStepCompany from "../order_steps/OrderStepCompany";
import OrderFormStepProducts from "../order_form_steps/OrderFormStepProducts";
import OrderFormStepPayment from "../order_form_steps/OrderFormStepPayment";
import OrderFormStepExtras from "../order_form_steps/OrderFormStepExtras";
import OrderFormStepSummary from "../order_form_steps/OrderFormStepSummary";
import OrderFormStepShipping from "../order_form_steps/OrderFormStepShipping";
import OrderFormStepReceiver from "../order_form_steps/OrderFormStepReceiver";

interface Props {
	steps?: any;
	onStep?: any;
	onClose: any;
	withPrefetch: boolean;
}

const OrdersFormWizard = (props: Props) => {
	const { steps, onClose, onStep, withPrefetch } = props;

	const {
		endValue: { hasReachedEnd },
		stepValue: { currStep, setCurrStep },
		dataValue: { setData },
	} = useOrdersContext();

	const {
		userValue: { user },
		userCan,
	} = useAuthContext();

	useEffect(() => {
		onStep(currStep);
	}, [currStep, onStep]);

	useEffect(() => {
		if (userCan("orderCreateTheir")) {
			setCurrStep(1);
			setData((prev) => ({
				...prev,
				payment: {
					...prev.payment,
					companyId: user?.companyId,
				},
			}));
		}
	}, [setData, setCurrStep, user?.companyId, userCan]);

	return (
		<>
			<Card.Body>
				<CollapseFade in={currStep !== 0}>
					<div>
						<Heading as='p' centered>
							{steps.find((step) => step.step === currStep)?.label}
						</Heading>
						<div className='temat__form__wizard__progress'>
							<Flex wrap='nowrap' justify='space-between' disableNegativeSpace>
								{steps.map((step) => (
									<Flex.Col
										key={step.step}
										as={Button}
										equalDimensions
										className='p--0'
										flavor='rounded'
										col='auto'
										tabIndex={-1}
										active={currStep < step.step}
										pigment={currStep >= step.step ? "primary" : "default"}
										onClick={() => hasReachedEnd && setCurrStep(step.step)}>
										{step.step}
									</Flex.Col>
								))}
							</Flex>
							<ProgressBar value={currStep} max={steps[steps.length - 1].step} min={1} className='pt--0' />
						</div>
					</div>
				</CollapseFade>
				{currStep === 0 && userCan("orderCreate") && <OrderStepCompany withPrefetch={withPrefetch} />}
				{currStep === 1 && <OrderFormStepPayment />}
				{currStep === 2 && <OrderFormStepShipping />}
				{currStep === 3 && <OrderFormStepReceiver />}
				{currStep === 4 && <OrderFormStepProducts />}
				{currStep === 5 && <OrderFormStepExtras />}
				{currStep === 6 && <OrderFormStepSummary onClose={onClose} />}
			</Card.Body>
			<Card.Footer id='orders-form-footer' />
		</>
	);
};

export default OrdersFormWizard;
