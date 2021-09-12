import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { Form, Portal, Card, Text, Button, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import { Controller, useForm } from "react-hook-form";
import cn from "classnames";

import { useRoleAdd, useRoleUpdate } from "../../../actions/mutateHooks";

import { IconClose } from "../../../components/ui/icons";

import { successToast } from "../../../helpers/toastEmitter";
import { dirtyConfirmOnExit } from "../../../helpers/helpers";

interface Props {
	onClose: () => void;
	payload?: any;
}

const RolesForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		formState: { errors, touchedFields },
	} = useForm({
		defaultValues: {
			...payload,
		},
	});

	const { mutate: addRole, isLoading: isLoadingAdd } = useRoleAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("roles");
				onClose();
			},
		},
	});

	const { mutate: updateRole, isLoading: isLoadingUpdate } = useRoleUpdate({
		specs: { id: payload?.id },
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("roles");
				onClose();
			},
		},
	});

	const onSubmit = (data: any) => {
		const sanitizedData = {
			name: data.name,
			description: data.description,
		};
		if (payload) {
			return updateRole(sanitizedData);
		}
		return addRole(sanitizedData);
	};

	return (
		<Portal
			onClose={onClose}
			onOutsideClick={() => dirtyConfirmOnExit(touchedFields, onClose, t)}
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
					<Text className='mb--0'>{t(`action.${payload ? "update" : "add"}`, { entry: t("common.role") })}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='roles-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col='12'>
								<FormControl
									label={t("field.name")}
									htmlFor='name'
									className={cn({
										"text--danger": errors?.name,
									})}
									hintMsg={errors?.name?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													placeholder={t("field.name")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.name ? "danger" : "primary"}
												/>
											);
										}}
										name='name'
										control={control}
										defaultValue=''
										rules={{
											required: t("validation.required"),
											minLength: {
												value: 2,
												message: t("validation.minLength", { value: 2 }),
											},
											maxLength: {
												value: 50,
												message: t("validation.maxLength", { value: 50 }),
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col='12'>
								<FormControl
									label={t("field.description")}
									htmlFor='description'
									className={cn({
										"text--danger": errors?.description,
									})}
									hintMsg={errors?.description?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<TextArea
													placeholder={t("field.description")}
													{...fieldRest}
													innerRef={ref}
													// maxLength={250}
													withCharacterCount={false}
													pigment={errors?.description ? "danger" : "primary"}
												/>
											);
										}}
										name='description'
										control={control}
										defaultValue=''
										rules={{
											required: t("validation.required"),
											minLength: {
												value: 2,
												message: t("validation.minLength", { value: 2 }),
											},
											maxLength: {
												value: 250,
												message: t("validation.maxLength", { value: 250 }),
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='roles-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{t(`action.${payload ? "update" : "add"}`, { entry: t("common.role") })}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default RolesForm;
