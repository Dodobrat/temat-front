import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import { useOrderDetailsUpdate } from "../../../../actions/mutateHooks";

import OrderStepShipping from "../order_steps/OrderStepShipping";
import { getClosestValidDate } from "../../../../helpers/dateHelpers";
import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import { parseShippingDataToFormData } from "../orderHelpers";

const OrderFormStepShipping = ({ useContext = useOrdersContext, isUpdating = false }) => {
	const formFooter = document.getElementById("orders-form-footer");

	const queryClient = useQueryClient();
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
		stepValue: { setCurrStep },
	} = useContext();

	const {
		control,
		watch,
		getValues,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...data.shipping,
			shipDate: data?.shipping?.shipDate ?? getClosestValidDate(),
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
			parseShippingDataToFormData(data, formData);
			updateDetails(formData).then(() => {
				setData((prev) => ({
					...prev,
					shipping: data,
				}));
			});
		} else {
			setData((prev) => ({
				...prev,
				shipping: data,
			}));
			setCurrStep(3);
		}
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepShipping initialData={data.shipping} formProps={{ control, errors, watch, getValues, setValue, reset }} />
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify={isUpdating ? "flex-end" : "space-between"} className='w-100' style={{ flex: 1 }}>
					{!isUpdating && (
						<Flex.Col col='auto'>
							<Button type='button' pigment={null} pigmentColor='none' onClick={() => setCurrStep(1)}>
								{t("common.back")}
							</Button>
						</Flex.Col>
					)}
					<Flex.Col col='auto'>
						<Button type='submit' form='orders-form' isLoading={isLoadingDetailsUpdate}>
							{isUpdating ? t("action.update", { entry: t("step.shipping") }) : t("common.next")}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default OrderFormStepShipping;
