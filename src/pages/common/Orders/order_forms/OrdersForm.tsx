import { Card, Text, Button } from "@dodobrat/react-ui-kit";
import { IconClose } from "../../../../components/ui/icons";
import { useTranslation } from "react-i18next";
import OrdersFormWizard from "./OrdersFormWizard";
import OrdersProvider from "../../../../context/OrdersContext";
import { Portal } from "@dodobrat/react-ui-kit";
import { confirmOnExit } from "../../../../helpers/helpers";

interface Props {
	onClose: () => void;
	payload?: any;
}

const OrdersForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose)} isOpen animation='none' {...rest} withFocusLock>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t("orders.addOrder")}</Text>
				</Card.Header>
				<OrdersProvider>
					<OrdersFormWizard maxSteps={5} onClose={onClose} />
				</OrdersProvider>
			</Card>
		</Portal>
	);
};

export default OrdersForm;
