import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import { useOrderProductUpdate } from "../../../../actions/mutateHooks";

import OrderStepProducts from "../order_steps/OrderStepProducts";
import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import { parseProductsToFormData } from "../orderHelpers";

const OrderFormStepProducts = ({ useContext = useOrdersContext, isUpdating = false }) => {
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
		clearErrors,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			products: data.products,
		},
	});

	const { mutateAsync: updateProducts, isLoading: isLoadingProductsUpdate } = useOrderProductUpdate({
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
			parseProductsToFormData(data.products, formData);
			updateProducts(formData).then(() => {
				setData((prev) => ({
					...prev,
					products: data?.products,
				}));
			});
		} else {
			setData((prev) => ({
				...prev,
				products: data?.products,
			}));
			setCurrStep(5);
		}
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepProducts
				payment={data?.payment}
				initialData={data.products}
				companyId={data?.payment?.companyId?.value ?? data?.payment?.companyId}
				formProps={{ control, errors, setValue, watch, clearErrors }}
			/>
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify={isUpdating ? "flex-end" : "space-between"} className='w-100' style={{ flex: 1 }}>
					{!isUpdating && (
						<Flex.Col col='auto'>
							<Button type='button' pigment={null} pigmentColor='none' onClick={() => setCurrStep(3)}>
								{t("common.back")}
							</Button>
						</Flex.Col>
					)}
					<Flex.Col col='auto'>
						<Button type='submit' form='orders-form' isLoading={isLoadingProductsUpdate}>
							{isUpdating ? t("common.update") : t("common.next")}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default OrderFormStepProducts;
