import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Portal, Card, Text, Button } from "@dodobrat/react-ui-kit";

import OrdersUpdateProvider from "../../../../context/OrdersUpdateContext";

import { useOrderById } from "../../../../actions/fetchHooks";

import OrdersUpdateFormWizard from "./OrdersUpdateFormWizard";
import { IconClose } from "../../../../components/ui/icons";

import { errorToast } from "../../../../helpers/toastEmitter";
import { dirtyConfirmOnExit } from "../../../../helpers/helpers";

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
			onError: (err: any) => {
				errorToast(err);
				onClose();
			},
		},
		specialKey: { orderId: payload?.id, filters: ["products", "files"] },
	});

	const [touchedFormFields, setTouchedFormFields] = useState(false);

	const handleIsFormTouched = (isTouched) => setTouchedFormFields(isTouched);

	const fetchedOrder = useMemo(() => {
		if (data) {
			return data?.data;
		}
		return null;
	}, [data]);

	return (
		<Portal
			onClose={onClose}
			onOutsideClick={() => dirtyConfirmOnExit(touchedFormFields ? { touched: true } : {}, onClose, t)}
			innerClassName='py--4'
			isOpen
			animation='none'
			{...rest}
			withFocusLock>
			<Card isLoading={isFetching}>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t("action.update", { entry: t("common.order") })}</Text>
				</Card.Header>
				<OrdersUpdateProvider>
					<OrdersUpdateFormWizard payload={fetchedOrder} onTouch={handleIsFormTouched} />
				</OrdersUpdateProvider>
			</Card>
		</Portal>
	);
};

export default OrdersUpdateForm;
