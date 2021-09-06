import { Button, Card, Portal, Text, Heading } from "@dodobrat/react-ui-kit";
import { IconClose } from "../ui/icons";
import { useTranslation } from "react-i18next";

interface Props {
	onClose: () => void;
	payload?: () => void;
	actionType?: string;
	[key: string]: any;
}

const ActionConfirmation = (props: Props) => {
	const { onClose, payload, actionType, ...rest } = props;

	const { t } = useTranslation();

	const handleConfirm = () => {
		payload();
		onClose();
	};

	return (
		<Portal onClose={onClose} isOpen animation='none' {...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t("common.confirm")}</Text>
				</Card.Header>
				<Card.Body>
					<Heading as='p' className='mb--2'>
						{t("confirmation.action", { action: t(`action.${actionType}`).toUpperCase() })}
					</Heading>
					<Text className='mb--0 text--danger'>{t("confirmation.warning")}</Text>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button className='ml--2' pigment='default' onClick={onClose}>
						{t("common.no")}
					</Button>
					<Button className='ml--2' pigment='danger' onClick={handleConfirm}>
						{t("common.yes")}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default ActionConfirmation;
