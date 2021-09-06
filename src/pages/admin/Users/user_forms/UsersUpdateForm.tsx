import { useTranslation } from "react-i18next";
import { Tabs, Portal, Card, Text, Button } from "@dodobrat/react-ui-kit";

import { IconClose } from "../../../../components/ui/icons";

import { confirmOnExit } from "../../../../helpers/helpers";
import UserFormStepCredentials from "../user_form_steps/UserFormStepCredentials";
import UserFormStepDetails from "../user_form_steps/UserFormStepDetails";

interface Props {
	onClose: () => void;
	payload?: any;
}

const UsersUpdateForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose)} isOpen animation='none' {...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t("users.updateUser")}</Text>
				</Card.Header>
				<Tabs className='max-h--unset' contentClassName='w--100' elevation='none'>
					<Tabs.Panel tab={t("users.credentials")}>
						<UserFormStepCredentials payload={payload} />
					</Tabs.Panel>
					<Tabs.Panel tab={t("users.details")}>
						<UserFormStepDetails payload={payload} />
					</Tabs.Panel>
				</Tabs>
				<Card.Footer justify='flex-end' id='user-form-footer' />
			</Card>
		</Portal>
	);
};

export default UsersUpdateForm;
