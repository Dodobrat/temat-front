import { Portal, Card, Text, Button } from "@dodobrat/react-ui-kit";
import { IconClose } from "../../../components/ui/icons";
import { useTranslation } from "react-i18next";
import OrdersFormWizard from "./OrdersFormWizard";
import OrdersProvider from "../../../context/OrdersContext";

interface Props {
	onClose: () => void;
	payload?: any;
}

const OrdersForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();

	return (
		<Portal onClose={onClose} isOpen animation='none' {...rest} withFocusLock>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{payload ? t("orders.updateOrder") : t("orders.addOrder")}</Text>
				</Card.Header>
				<OrdersProvider>
					<OrdersFormWizard payload={payload} maxSteps={5} onClose={onClose} />
				</OrdersProvider>
			</Card>
		</Portal>
	);
};

export default OrdersForm;
