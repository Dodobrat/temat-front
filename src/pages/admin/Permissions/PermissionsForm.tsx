import { useQueryClient } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { Form, Portal, Card, Text, Button, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useRoles } from "../../../actions/fetchHooks";
import { usePermissionAdd, usePermissionUpdate } from "../../../actions/mutateHooks";

import { IconClose } from "../../../components/ui/icons";
import AsyncSelect from "../../../components/forms/AsyncSelect";

import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { confirmOnExit, parseRoles } from "../../../helpers/helpers";

interface Props {
	onClose: () => void;
	payload?: any;
}

const PermissionsForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const queryClient = useQueryClient();

	const {
		register,
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

	const { ref: innerRefName, ...restName } = register("name", {
		required: "Field is required",
		pattern: {
			value: /^[a-zA-Z]+$/,
			message: "Invalid Name characters",
		},
		minLength: { value: 2, message: "Min 2 characters" },
		maxLength: { value: 50, message: "Max 50 characters" },
	});
	const { ref: innerRefDescription, ...restDescription } = register("description", {
		required: "Field is required",
		minLength: { value: 2, message: "Min 2 characters" },
		maxLength: { value: 250, message: "Max 250 characters" },
	});

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose)} isOpen animation='none' {...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{payload ? "Edit" : "Add"} Permission</Text>
				</Card.Header>
				<Card.Body>
					<Form id='permissions-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col='12'>
								<FormControl
									label='Name'
									htmlFor='name'
									className={cn({
										"text--danger": errors?.name,
									})}
									hintMsg={errors?.name?.message}>
									<Input
										name='name'
										placeholder='Name'
										{...restName}
										innerRef={innerRefName}
										pigment={errors?.name ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col='12'>
								<FormControl
									label='Role'
									htmlFor='roleId'
									className={cn({
										"text--danger": errors?.roles,
									})}
									hintMsg={errors?.roles?.message}>
									<Controller
										render={({ field }) => (
											<AsyncSelect
												useFetch={useRoles}
												isMulti
												isClearable={false}
												closeMenuOnSelect={false}
												className={cn({
													"temat__select__container--danger": errors?.roles,
												})}
												placeholder='Select Role'
												{...field}
											/>
										)}
										name='roles'
										control={control}
										defaultValue={[]}
										rules={{
											required: "Field is required",
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col='12'>
								<FormControl
									label='Description'
									htmlFor='description'
									className={cn({
										"text--danger": errors?.description,
									})}
									hintMsg={errors?.description?.message}>
									<TextArea
										name='description'
										placeholder='Enter Description'
										{...restDescription}
										innerRef={innerRefDescription}
										// maxLength={250}
										withCharacterCount={false}
										pigment={errors?.description ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='permissions-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{payload ? "Update" : "Submit"}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default PermissionsForm;
