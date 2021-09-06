import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Portal, Card, Text, Button } from "@dodobrat/react-ui-kit";

import OrdersProvider from "../../../../context/OrdersContext";
import { useAuthContext } from "../../../../context/AuthContext";

import OrdersFormWizard from "./OrdersFormWizard";
import { IconClose } from "../../../../components/ui/icons";

import { confirmOnExit } from "../../../../helpers/helpers";

interface Props {
	onClose: () => void;
}

const OrdersForm = (props: Props) => {
	const { onClose, ...rest } = props;

	const { t } = useTranslation();

	const { userCan } = useAuthContext();

	const orderFormSteps = useMemo(
		() => [
			{ step: 1, label: t("step.payment") },
			{ step: 2, label: t("step.shipping") },
			{ step: 3, label: t("step.receiver") },
			{ step: 4, label: t("step.products") },
			{ step: 5, label: t("step.extras") },
			{ step: 6, label: t("step.summary") },
		],
		[t]
	);

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose, t)} isOpen animation='none' {...rest} withFocusLock>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t("action.add", { entry: t("common.order") })}</Text>
				</Card.Header>
				<OrdersProvider>
					<OrdersFormWizard steps={orderFormSteps} onClose={onClose} withPrefetch={userCan("orderCreate")} />
				</OrdersProvider>
			</Card>
		</Portal>
	);
};

export default OrdersForm;
