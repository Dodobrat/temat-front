import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import { useOrderFilesUpdate } from "../../../../actions/mutateHooks";

import OrderStepExtras from "../order_steps/OrderStepExtras";
import { successToast } from "../../../../helpers/toastEmitter";
import { parseExtrasToFormData } from "../orderHelpers";

const OrderFormStepExtras = ({ useContext = useOrdersContext, isUpdating = false }) => {
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
		setValue,
		getValues,
		setError,
		clearErrors,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...data.extras,
			files: data?.extras?.files ?? [],
		},
	});

	const { mutate: updateFiles, isLoading: isLoadingFilesUpdate } = useOrderFilesUpdate({
		specs: {
			orderId: data?.orderId,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orderById");
			},
		},
	});

	const onSubmit = (data: any) => {
		setData((prev) => ({
			...prev,
			extras: data,
		}));
		if (isUpdating) {
			const formData = new FormData();
			parseExtrasToFormData(data, formData);
			updateFiles(formData);
		} else {
			setCurrStep(6);
		}
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepExtras
				orderId={data?.orderId}
				formProps={{ control, errors, setValue, getValues, setError, clearErrors, watch }}
				isUpdating={isUpdating}
			/>
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify={isUpdating ? "flex-end" : "space-between"} className='w-100' style={{ flex: 1 }}>
					{!isUpdating && (
						<Flex.Col col='auto'>
							<Button type='button' pigment={null} pigmentColor='none' onClick={() => setCurrStep(4)}>
								{t("common.back")}
							</Button>
						</Flex.Col>
					)}
					<Flex.Col col='auto'>
						<Button type='submit' form='orders-form' isLoading={isLoadingFilesUpdate}>
							{isUpdating ? t("common.update") : t("common.next")}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default OrderFormStepExtras;
