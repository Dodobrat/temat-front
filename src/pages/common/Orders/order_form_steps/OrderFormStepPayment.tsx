import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import { useOrderDetailsUpdate } from "../../../../actions/mutateHooks";

import OrderStepPayment from "../order_steps/OrderStepPayment";
import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import { parsePaymentToFormData } from "../orderHelpers";

const OrderFormStepPayment = ({ useContext = useOrdersContext, isUpdating = false }) => {
	const formFooter = document.getElementById("orders-form-footer");

	const queryClient = useQueryClient();
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
		stepValue: { setCurrStep },
	} = useContext();

	const {
		control,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...data.payment,
		},
	});

	const { mutateAsync: updateDetails, isLoading: isLoadingDetailsUpdate } = useOrderDetailsUpdate({
		specs: {
			orderId: data?.orderId,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orders");
				queryClient.invalidateQueries("orderById");
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = (data: any) => {
		if (isUpdating) {
			const formData = new FormData();
			parsePaymentToFormData(data, formData);
			updateDetails(formData).then(() => {
				setData((prev) => ({
					...prev,
					payment: {
						...prev.payment,
						...data,
					},
				}));
			});
		} else {
			setData((prev) => ({
				...prev,
				payment: {
					...prev.payment,
					...data,
				},
			}));
			setCurrStep(2);
		}
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepPayment initialData={data.payment} formProps={{ control, errors, setValue }} />
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='flex-end' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						<Button type='submit' form='orders-form' isLoading={isLoadingDetailsUpdate}>
							{isUpdating ? t("action.update", { entry: t("step.payment") }) : t("common.next")}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default OrderFormStepPayment;
