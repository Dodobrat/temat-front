import { Card, Text, Button } from "@dodobrat/react-ui-kit";
import { IconClose } from "../../../../components/ui/icons";
import { useTranslation } from "react-i18next";
import { Portal } from "@dodobrat/react-ui-kit";
import OrdersUpdateProvider from "../../../../context/OrdersUpdateContext";
import { useOrderById } from "../../../../actions/fetchHooks";
import { errorToast } from "../../../../helpers/toastEmitter";
import OrdersUpdateFormWizard from "./OrdersUpdateFormWizard";
import { useMemo } from "react";
import { confirmOnExit } from "../../../../helpers/helpers";

interface Props {
	onClose: () => void;
	payload?: any;
}

const OrdersUpdateForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();

	const { data, isFetching } = useOrderById({
		specs: {
			filters: {
				products: "true",
				files: "true",
			},
		},
		queryConfig: {
			onError: (err: any) => errorToast(err),
		},
		specialKey: { orderId: payload?.id, filters: ["products", "files"] },
	});

	const fetchedOrder = useMemo(() => {
		if (data) {
			return data?.data;
		}
		return null;
	}, [data]);

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose)} isOpen animation='none' {...rest} withFocusLock>
			<Card isLoading={isFetching}>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t("orders.updateOrder")}</Text>
				</Card.Header>
				<OrdersUpdateProvider>
					<OrdersUpdateFormWizard payload={fetchedOrder} />
				</OrdersUpdateProvider>
			</Card>
		</Portal>
	);
};

export default OrdersUpdateForm;
