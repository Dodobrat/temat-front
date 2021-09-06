import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form, Portal, Card, Text, Button, Flex } from "@dodobrat/react-ui-kit";

import { useUserAdd } from "../../../../actions/mutateHooks";

import { IconClose } from "../../../../components/ui/icons";

import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import { confirmOnExit } from "../../../../helpers/helpers";
import UserStepCredentials from "../user_steps/UserStepCredentials";
import UserStepDetails from "../user_steps/UserStepDetails";

interface Props {
	onClose: () => void;
}

const UsersForm = (props: Props) => {
	const { onClose, ...rest } = props;

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		watch,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { mutate: addUser, isLoading: isLoadingAdd } = useUserAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("users");
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = async (data: any) => {
		const formData = new FormData();

		for (const entry of Object.entries(data)) {
			if (!!entry[1]) {
				if (entry[1] instanceof FileList) {
					formData.append(entry[0], entry[1][0]);
				} else if (typeof entry[1] === "object") {
					formData.append(entry[0], entry[1]["value"]);
				} else if (typeof entry[1] === "string") {
					formData.append(entry[0], entry[1]);
				}
			}
		}

		return addUser(formData);
	};

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose)} isOpen animation='none' {...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t("users.addUser")}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='users-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<UserStepCredentials formProps={{ control, errors, watch }} />
							<UserStepDetails formProps={{ control, errors, watch }} />
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='users-form' className='ml--2' isLoading={isLoadingAdd}>
						{t("common.submit")}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default UsersForm;
