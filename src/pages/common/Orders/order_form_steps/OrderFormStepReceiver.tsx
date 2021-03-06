import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import OrderStepReceiver from "../order_steps/OrderStepReceiver";
import { useOrderDetailsUpdate } from "../../../../actions/mutateHooks";
import { successToast } from "../../../../helpers/toastEmitter";
import { useQueryClient } from "react-query";
import { parseShippingDataToFormData } from "../orderHelpers";

const OrderFormStepReceiver = ({ useContext = useOrdersContext, isUpdating = false, onTouch }: any) => {
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
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm({
		defaultValues: {
			...data.receiver,
		},
	});

	useEffect(() => {
		onTouch?.(isDirty);
	}, [onTouch, isDirty]);

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
		},
	});

	const onSubmit = (data: any) => {
		if (data?.receiverAgentPhone === "") {
			data.receiverAgentPhoneCodeId = null;
		}
		if (isUpdating) {
			const formData = new FormData();
			parseShippingDataToFormData(data, formData);
			updateDetails(formData).then(() => {
				setData((prev) => ({
					...prev,
					receiver: data,
				}));
			});
		} else {
			setData((prev) => ({
				...prev,
				receiver: data,
			}));
			setCurrStep(4);
		}
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepReceiver
				shipping={data.shipping}
				initialData={data.receiver}
				formProps={{ control, errors, watch }}
				isUpdating={isUpdating}
			/>
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify={isUpdating ? "flex-end" : "space-between"} className='w-100' style={{ flex: 1 }}>
					{!isUpdating && (
						<Flex.Col col='auto'>
							<Button type='button' pigment={null} pigmentColor='none' onClick={() => setCurrStep(2)}>
								{t("common.back")}
							</Button>
						</Flex.Col>
					)}
					<Flex.Col col='auto'>
						<Button type='submit' form='orders-form' isLoading={isLoadingDetailsUpdate}>
							{isUpdating ? t("action.update", { entry: t("step.receiver") }) : t("common.next")}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default OrderFormStepReceiver;
