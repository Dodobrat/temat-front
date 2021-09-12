import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Portal, Card, Text, Button } from "@dodobrat/react-ui-kit";

import { IconClose } from "../../../../components/ui/icons";

import { dirtyConfirmOnExit } from "../../../../helpers/helpers";
import UserFormStepCredentials from "../user_form_steps/UserFormStepCredentials";
import UserFormStepDetails from "../user_form_steps/UserFormStepDetails";

interface Props {
	onClose: () => void;
	payload?: any;
}

const UsersUpdateForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();

	const [touchedFormFields, setTouchedFormFields] = useState(false);

	const handleIsFormTouched = (isTouched) => setTouchedFormFields(isTouched);

	return (
		<Portal
			onClose={onClose}
			onOutsideClick={() => dirtyConfirmOnExit(touchedFormFields ? { touched: true } : {}, onClose, t)}
			innerClassName='py--4'
			isOpen
			animation='none'
			{...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t("action.update", { entry: t("common.user") })}</Text>
				</Card.Header>
				<Tabs className='max-h--unset' contentClassName='w--100' elevation='none'>
					<Tabs.Panel tab={t("common.credentials")}>
						<UserFormStepCredentials payload={payload} onTouch={handleIsFormTouched} />
					</Tabs.Panel>
					<Tabs.Panel tab={t("common.details")}>
						<UserFormStepDetails payload={payload} onTouch={handleIsFormTouched} />
					</Tabs.Panel>
				</Tabs>
				<Card.Footer justify='flex-end' id='user-form-footer' />
			</Card>
		</Portal>
	);
};

export default UsersUpdateForm;
