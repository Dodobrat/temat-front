import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Form, Portal, Card, Text, Button, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useRoles } from "../../../actions/fetchHooks";
import { usePermissionAdd, usePermissionUpdate } from "../../../actions/mutateHooks";

import { IconClose } from "../../../components/ui/icons";
import WindowedAsyncSelect from "../../../components/forms/WindowedAsyncSelect";

import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { confirmOnExit, parseRoles } from "../../../helpers/helpers";

interface Props {
	onClose: () => void;
	payload?: any;
}

const PermissionsForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...payload,
			roles: payload ? parseRoles(payload?.roles) : null,
		},
	});

	const { mutate: addPermission, isLoading: isLoadingAdd } = usePermissionAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("permissions");
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const { mutate: updatePermission, isLoading: isLoadingUpdate } = usePermissionUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("permissions");
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = (data: any) => {
		const extractedRoles = data.roles.reduce((prev: number[], curr: { value: number }) => {
			return [...prev, curr.value];
		}, []);

		const sanitizedData = {
			name: data.name,
			roles: extractedRoles,
			description: data.description,
		};

		if (payload) {
			sanitizedData["id"] = payload?.id;
			return updatePermission(sanitizedData);
		}
		return addPermission(sanitizedData);
	};

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose, t)} isOpen animation='none' {...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t(`action.${payload ? "update" : "add"}`, { entry: t("common.permission") })}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='permissions-form' onSubmit={handleSubmit(onSubmit)}>
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
											pattern: {
												value: /^[a-zA-Z]+$/,
												message: t("validation.pattern"),
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col='12'>
								<FormControl
									label={t("field.role")}
									htmlFor='roleId'
									className={cn({
										"text--danger": errors?.roles,
									})}
									hintMsg={errors?.roles?.message}>
									<Controller
										render={({ field }) => (
											<WindowedAsyncSelect
												useFetch={useRoles}
												inputId='role'
												isMulti
												defaultOptions
												isFetchedAtOnce
												isClearable={false}
												closeMenuOnSelect={false}
												className={cn({
													"temat__select__container--danger": errors?.roles,
												})}
												placeholder={t("field.select", { field: t("field.role") })}
												{...field}
											/>
										)}
										name='roles'
										control={control}
										defaultValue={[]}
										rules={{
											required: t("validation.required"),
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
					<Button type='submit' form='permissions-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{t(`action.${payload ? "update" : "add"}`, { entry: t("common.permission") })}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default PermissionsForm;
