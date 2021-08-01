import { Button } from "@dodobrat/react-ui-kit";
import OrderStepProducts from "../order_steps/OrderStepProducts";
import { useTranslation } from "react-i18next";
import { Tabs } from "@dodobrat/react-ui-kit";
import { useOrdersUpdateContext } from "../../../../context/OrdersUpdateContext";
import { useEffect } from "react";
import OrderStepShipping from "../order_steps/OrderStepShipping";
import OrderStepPayment from "../order_steps/OrderStepPayment";
import OrderStepFiles from "../order_steps/OrderStepFiles";
import { Card } from "@dodobrat/react-ui-kit";
import { useOrderProductUpdate } from "../../../../actions/mutateHooks";
import { successToast } from "../../../../helpers/toastEmitter";
import { useQueryClient } from "react-query";

interface Props {
	onClose: any;
	payload?: any;
}

const parsedFetchedData = (order) => {
	console.log(order);

	const parsedOrderData: any = { products: [], shipping: {}, payment: {}, files: [] };
	//Products
	const productsWithIds = [];
	for (const product of order?.products) {
		productsWithIds.push({ ...product, value: product?.productId, quantity: product?.required });
	}
	parsedOrderData.products = productsWithIds;

	//Payment
	parsedOrderData.payment.companyId = order?.details?.companyId;

	return parsedOrderData;
};

const parseProductsToFormData = (data) => {
	const formData = new FormData();

	data.products.forEach((product: { value: string; quantity: string }, idx: number) => {
		formData.append(`products[${idx}][id]`, product.value);
		formData.append(`products[${idx}][qty]`, product.quantity);
	});

	return formData;
};

const OrdersUpdateFormWizard = (props: Props) => {
	const {
		// onClose,
		payload,
	} = props;

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		dataValue: { data, setData },
		tabValue: { activeTab, setActiveTab },
	} = useOrdersUpdateContext();

	useEffect(() => {
		if (payload) {
			setData(parsedFetchedData(payload));
		}
	}, [payload, setData]);

	const { mutate: updateProducts, isLoading: isLoadingProductsUpdate } = useOrderProductUpdate({
		specs: {
			orderId: payload?.details?.id,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orders");
				queryClient.invalidateQueries("orderById");
			},
		},
	});

	const determineMutateFunction = () => {
		switch (activeTab) {
			case 0:
				return updateProducts(parseProductsToFormData(data));
			default:
				return null;
		}
	};

	const isLoadingMutation = isLoadingProductsUpdate;

	return (
		<>
			<Tabs
				isLoading={isLoadingMutation}
				orientation='vertical'
				className='overflow--visible'
				contentClassName='w--100'
				elevation='none'
				activeTab={activeTab}
				onTabSelect={(tab: any) => {
					console.log(tab);
					setActiveTab(tab);
				}}>
				<Tabs.Panel tab={t("orders.products")}>
					<OrderStepProducts useContext={useOrdersUpdateContext} />
				</Tabs.Panel>
				<Tabs.Panel tab={t("orders.shipping")}>
					<OrderStepShipping useContext={useOrdersUpdateContext} />
				</Tabs.Panel>
				<Tabs.Panel tab={t("orders.payment")}>
					<OrderStepPayment useContext={useOrdersUpdateContext} />
				</Tabs.Panel>
				<Tabs.Panel tab={t("orders.files")}>
					<OrderStepFiles useContext={useOrdersUpdateContext} />
				</Tabs.Panel>
			</Tabs>
			<Card.Footer justify='flex-end' style={{ zIndex: 1 }}>
				<Button pigment='primary' onClick={determineMutateFunction}>
					{t("common.submit")}
				</Button>
			</Card.Footer>
		</>
	);
};

export default OrdersUpdateFormWizard;
