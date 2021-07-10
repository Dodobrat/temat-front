import React from "react";
import { Button, Card, Portal, Text, Heading } from "@dodobrat/react-ui-kit";
import { IconClose } from "../ui/icons";
import { useTranslation } from "react-i18next";

interface Props {
	onClose: () => void;
	payload?: () => void;
}

const ActionConfirmation = (props: Props) => {
	const { onClose, payload, ...rest } = props;

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
						{t("common.confirmAction")}
					</Heading>
					<Text className='mb--0 text--danger'>{t("common.actionIrrevirsible")}</Text>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button className='ml--2' pigment='danger' onClick={onClose}>
						{t("common.no")}
					</Button>
					<Button className='ml--2' pigment='success' onClick={handleConfirm}>
						{t("common.yes")}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default ActionConfirmation;
