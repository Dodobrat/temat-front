import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Button, Tabs, Card } from "@dodobrat/react-ui-kit";

import { useOrdersUpdateContext } from "../../../../context/OrdersUpdateContext";
import { useOrderDetailsUpdate, useOrderFilesUpdate, useOrderProductUpdate } from "../../../../actions/mutateHooks";

import { successToast } from "../../../../helpers/toastEmitter";
import { parsedFetchedData, parseFilesToFormData, parseProductsToFormData, parseDetailsToFormData } from "../orderUpdateHelpers";

import OrderStepProducts from "../order_steps/OrderStepProducts";
import OrderStepShipping from "../order_steps/OrderStepShipping";
import OrderStepPayment from "../order_steps/OrderStepPayment";
import OrderStepFiles from "../order_steps/OrderStepFiles";
import { useWindowResize } from "@dodobrat/react-ui-kit";

interface Props {
	onClose: any;
	payload?: any;
}

const OrdersUpdateFormWizard = (props: Props) => {
	const {
		// onClose,
		payload,
	} = props;

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { width } = useWindowResize(100);

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

	const { mutate: updateDetails, isLoading: isLoadingDetailsUpdate } = useOrderDetailsUpdate({
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

	const { mutate: updateFiles, isLoading: isLoadingFilesUpdate } = useOrderFilesUpdate({
		specs: {
			orderId: payload?.details?.id,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orderById");
			},
		},
	});

	const determineMutateFunction = () => {
		switch (activeTab) {
			case 0:
				return updateProducts(parseProductsToFormData(data));
			case 1:
			case 2:
				return updateDetails(parseDetailsToFormData(data));
			case 3:
				return updateFiles(parseFilesToFormData(data));
			default:
				return null;
		}
	};

	const isLoadingMutation = isLoadingProductsUpdate || isLoadingFilesUpdate || isLoadingDetailsUpdate;

	return (
		<>
			<Tabs
				isLoading={isLoadingMutation}
				orientation={width < 1000 ? "horizontal" : "vertical"}
				className='overflow--visible max-h--unset'
				contentClassName='w--100'
				elevation='none'
				activeTab={activeTab}
				onTabSelect={(tab: number) => setActiveTab(tab)}>
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
					<OrderStepFiles useContext={useOrdersUpdateContext} updateForm />
				</Tabs.Panel>
			</Tabs>
			<Card.Footer justify='flex-end'>
				<Button pigment='primary' onClick={determineMutateFunction}>
					{t("common.submit")}
				</Button>
			</Card.Footer>
		</>
	);
};

export default OrdersUpdateFormWizard;
