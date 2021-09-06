import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useUserPersonalUpdate } from "../../../../actions/mutateHooks";

import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import UserStepDetails from "../user_steps/UserStepDetails";

const UserFormStepDetails = ({ payload }) => {
	const formFooter = document.getElementById("user-form-footer");

	const queryClient = useQueryClient();
	const { t } = useTranslation();

	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...payload,
			image: "",
		},
	});

	const { mutate: updatePersonalUser, isLoading: isLoadingPersonalUpdate } = useUserPersonalUpdate({
		queryConfig: {
			onSuccess: (res) => {
				queryClient.invalidateQueries("users");
				successToast(res);
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = (data: any) => {
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

		const toSend = {
			id: payload?.id,
			formData,
		};

		updatePersonalUser(toSend);
	};

	return (
		<Form id='user-form' onSubmit={handleSubmit(onSubmit)}>
			<Flex spacingY='md'>
				<UserStepDetails payload={payload} formProps={{ control, errors, watch }} />
			</Flex>
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='flex-end' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						<Button type='submit' form='user-form' isLoading={isLoadingPersonalUpdate}>
							{t("action.update", { entry: t("common.user") })}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default UserFormStepDetails;
