import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import { useOrderFilesUpdate } from "../../../../actions/mutateHooks";

import OrderStepExtras from "../order_steps/OrderStepExtras";
import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import { parseExtrasToFormData } from "../orderHelpers";

const OrderFormStepExtras = ({ useContext = useOrdersContext, isUpdating = false, onTouch }: any) => {
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
		formState: { errors, isDirty },
	} = useForm({
		defaultValues: {
			...data.extras,
			files: data?.extras?.files ?? [],
		},
	});

	useEffect(() => {
		onTouch?.(isDirty);
	}, [onTouch, isDirty]);

	const { mutateAsync: updateFiles, isLoading: isLoadingFilesUpdate } = useOrderFilesUpdate({
		specs: {
			orderId: data?.orderId,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orderById");
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = (data: any) => {
		if (isUpdating) {
			if (data?.files?.filter((file) => file instanceof File).length === 0) return;
			const formData = new FormData();
			parseExtrasToFormData(data, formData);
			updateFiles(formData).then(() => {
				setData((prev) => ({
					...prev,
					extras: data,
				}));
			});
		} else {
			setData((prev) => ({
				...prev,
				extras: data,
			}));
			setCurrStep(6);
		}
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepExtras
				orderId={data?.orderId}
				dataFiles={data?.extras?.files}
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
							{isUpdating ? t("action.update", { entry: t("step.extras") }) : t("common.next")}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default OrderFormStepExtras;
