import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useUserCredentialsUpdate } from "../../../../actions/mutateHooks";

import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import UserStepCredentials from "../user_steps/UserStepCredentials";

const UserFormStepCredentials = ({ payload }) => {
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
			roleId: payload ? { value: payload?.roleId, label: payload?.roleName } : null,
			companyId: payload && payload?.companyId ? { value: payload?.companyId, label: payload?.companyName } : null,
			warehouseId: payload && payload?.warehouseId ? { value: payload?.warehouseId, label: payload?.warehouseName } : null,
		},
	});

	const { mutate: updateCredentialUser, isLoading: isLoadingCredentialsUpdate } = useUserCredentialsUpdate({
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

		updateCredentialUser(toSend);
	};

	return (
		<Form id='user-form' onSubmit={handleSubmit(onSubmit)}>
			<Flex spacingY='md'>
				<UserStepCredentials payload={payload} formProps={{ control, errors, watch }} />
			</Flex>
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='flex-end' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						<Button type='submit' form='user-form' isLoading={isLoadingCredentialsUpdate}>
							{t("action.update", { entry: t("common.user") })}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default UserFormStepCredentials;
