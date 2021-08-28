import { useEffect } from "react";
import { useOrdersContext } from "../../../../context/OrdersContext";
import { ProgressBar, Flex, Button } from "@dodobrat/react-ui-kit";
import OrderStepProducts from "../order_steps/OrderStepProducts";
import OrderStepShipping from "../order_steps/OrderStepShipping";
import OrderStepPayment from "../order_steps/OrderStepPayment";
import OrderStepSummary from "../order_steps/OrderStepSummary";
import { Card } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";
import OrderStepFiles from "../order_steps/OrderStepFiles";
import { useOrderAdd } from "../../../../actions/mutateHooks";
import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import { useQueryClient } from "react-query";
import { useAuthContext } from "../../../../context/AuthContext";
import OrderStepCompany from "../order_steps/OrderStepCompany";
import { CollapseFade } from "@dodobrat/react-ui-kit";
import { parseOrderAddData } from "../orderAddHelpers";

interface Props {
	maxSteps?: number;
	onClose: any;
}

const OrdersFormWizard = (props: Props) => {
	const { maxSteps = 1, onClose } = props;

	const queryClient = useQueryClient();
	const { t } = useTranslation();

	const steps = Array.from(Array(maxSteps).keys());

	const {
		stepValue: { currStep, setCurrStep },
		dataValue: { data, setData },
	} = useOrdersContext();

	const {
		userValue: { user },
		userCan,
	} = useAuthContext();

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

	const { mutate: addOrder, isLoading: isLoadingAdd } = useOrderAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orders");
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const placeOrder = () => {
		addOrder(parseOrderAddData(data));
	};

	return (
		<>
			<Card.Body>
				<CollapseFade in={currStep !== 0}>
					<div>
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
										tabIndex={-1}
										active={currStep < step + 1}
										pigment={currStep >= step + 1 ? "primary" : "default"}
										onClick={() => setCurrStep(step + 1)}>
										{step + 1}
									</Flex.Col>
								))}
							</Flex>
							<ProgressBar value={currStep} max={maxSteps} min={1} className='pt--0' />
						</div>
					</div>
				</CollapseFade>
				{currStep === 0 && userCan("orderCreate") && <OrderStepCompany />}
				{currStep === 1 && <OrderStepProducts />}
				{currStep === 2 && <OrderStepShipping />}
				{currStep === 3 && <OrderStepPayment />}
				{currStep === 4 && <OrderStepFiles />}
				{currStep === 5 && <OrderStepSummary />}
			</Card.Body>
			{data?.payment?.companyId && (
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
								isLoading={isLoadingAdd}
								onClick={() => (currStep < maxSteps ? setCurrStep((prev: number) => prev + 1) : placeOrder())}>
								{currStep < maxSteps ? t("common.next") : t("common.submit")}
							</Button>
						</Flex.Col>
					</Flex>
				</Card.Footer>
			)}
		</>
	);
};

export default OrdersFormWizard;
