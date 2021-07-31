import { useEffect } from "react";
import { useOrdersContext } from "../../../context/OrdersContext";
import { ProgressBar, Flex, Button } from "@dodobrat/react-ui-kit";
import OrderStepProducts from "./order_steps/OrderStepProducts";
import OrderStepShipping from "./order_steps/OrderStepShipping";
import OrderStepPayment from "./order_steps/OrderStepPayment";
import OrderStepSummary from "./order_steps/OrderStepSummary";
import { Card } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";
import OrderStepFiles from "./order_steps/OrderStepFiles";
import { useOrderAdd } from "../../../actions/mutateHooks";
import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { useQueryClient } from "react-query";
import { useAuthContext } from "../../../context/AuthContext";
import OrderStepCompany from "./order_steps/OrderStepCompany";
import { CollapseFade } from "@dodobrat/react-ui-kit";

interface Props {
	payload?: any;
	maxSteps?: number;
	onClose: any;
}

const parseOrderAddData = (data) => {
	const formData = new FormData();

	data.products.forEach((product: { value: string; quantity: string }, idx: number) => {
		formData.append(`products[${idx}][id]`, product.value);
		formData.append(`products[${idx}][qty]`, product.quantity);
	});
	data.files.forEach((file: string | Blob | File | any, idx: number) => {
		formData.append(`files[${idx}]`, file, file?.name);
	});
	Object.entries(data.shipping).forEach((entry: any) => {
		if (typeof entry[1] === "object") {
			if (entry[0] === "country" && entry[1]?.value) {
				formData.append(entry[0], entry[1]?.label);
			} else if (entry[0] === "city" && entry[1]?.value) {
				formData.append(`${entry[0]}Id`, entry[1]?.value);
				formData.append(entry[0], entry[1]?.label);
			} else if (entry[0] === "streetName" && entry[1]?.value) {
				const street = entry[0].substring(0, 6);
				formData.append(`${street}Id`, entry[1]?.value);
				formData.append(`${street}Name`, entry[1]?.label);
			} else if (entry[0] === "officeId" && entry[1]?.value) {
				const office = entry[0].substring(0, 6);
				const shippingCourier = data.shipping?.shippingMethodId?.label?.split(" ")[0]?.toLowerCase();
				formData.append(`${office}Id`, shippingCourier === "speedy" ? entry[1]?.value : entry[1]?.data?.code);
			} else {
				if (entry[1]?.value) {
					formData.append(entry[0], entry[1]?.value);
				}
			}
		} else {
			if (!!entry[1]) {
				formData.append(entry[0], entry[1]);
			}
		}
	});

	Object.entries(data?.payment).forEach((entry: any) => {
		if (typeof entry[1] === "object" && entry[1]?.value) {
			formData.append(entry[0], entry[1]?.value);
		} else {
			if (!!entry[1]) {
				formData.append(entry[0], entry[1]);
			}
		}
	});

	// console.log(data);

	return formData;
};

const OrdersFormWizard = (props: Props) => {
	const { payload, maxSteps = 1, onClose } = props;

	const queryClient = useQueryClient();
	const { t } = useTranslation();

	const steps = Array.from(Array(maxSteps).keys());

	const {
		stepValue: { currStep, setCurrStep },
		dataValue: { data, setData },
	} = useOrdersContext();

	const {
		userValue: { user },
	} = useAuthContext();

	useEffect(() => {
		if (payload) {
			setData(payload);
		}
	}, [payload, setData]);

	useEffect(() => {
		if (user.roleName !== "ADMIN") {
			setData((prev) => ({
				...prev,
				payment: {
					...prev.payment,
					companyId: user?.companyId,
				},
			}));
		}
	}, [setData, user?.companyId, user.roleName]);

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
				{currStep === 0 && user?.roleName === "ADMIN" && <OrderStepCompany />}
				{currStep === 1 && <OrderStepProducts />}
				{currStep === 2 && <OrderStepShipping />}
				{currStep === 3 && <OrderStepPayment />}
				{currStep === 4 && <OrderStepFiles />}
				{currStep === 5 && <OrderStepSummary />}
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
							isLoading={isLoadingAdd}
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
