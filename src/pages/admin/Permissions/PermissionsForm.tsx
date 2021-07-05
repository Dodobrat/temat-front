import { Form } from "@dodobrat/react-ui-kit";
import { Portal, Card, Text, Button, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import { useForm } from "react-hook-form";
import { IconClose } from "../../../components/ui/icons";
import AsyncSelect from "../../../components/forms/AsyncSelect";
import cn from "classnames";
import { usePermissionAdd, usePermissionUpdate } from "../../../actions/mutateHooks";
import { useQueryClient } from "react-query";
import { useRoles } from "../../../actions/fetchHooks";
import { useState } from "react";

interface Props {
	onClose: () => void;
	payload?: any;
}

const PermissionsForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const queryClient = useQueryClient();

	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...payload,
			roleId: payload ? { value: payload?.roleId, label: payload?.roleName } : null,
		},
	});

	const [selectValue, setSelectValue] = useState(() => (payload ? { value: payload?.roleId, label: payload?.roleName } : null));
	const [selectError, setSelectError] = useState(null);

	const { mutate: addPermission, isLoading: isLoadingAdd } = usePermissionAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				console.log(res);
				queryClient.invalidateQueries("permissions");
				onClose();
			},
			onError: (err: any) => console.log(err),
		},
	});

	const { mutate: updatePermission, isLoading: isLoadingUpdate } = usePermissionUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				console.log(res);
				queryClient.invalidateQueries("permissions");
				onClose();
			},
			onError: (err: any) => console.log(err),
		},
	});

	const onSubmit = (data: any) => {
		if (!data.roleId?.value) {
			return setSelectError({ message: "Field is required" });
		} else {
			setSelectError(null);
		}
		const sanitizedData = {
			name: data.name,
			roleId: data.roleId?.value,
			description: data.description,
		};
		if (payload) {
			sanitizedData["id"] = payload.id;
			return updatePermission(sanitizedData);
		}
		return addPermission(sanitizedData);
	};

	const handleOnChangeRoleId = (option: any) => {
		setValue("roleId", option);
		setSelectValue(option);
		if (selectError && option) {
			setSelectError(null);
		}
	};

	const { ref: innerRefName, ...restName } = register("name", {
		required: "Field is required",
		minLength: { value: 6, message: "Min 6 characters" },
		maxLength: { value: 99, message: "Max 99 characters" },
	});
	const { ref: innerRefDescription, ...restDescription } = register("description", {
		required: "Field is required",
		minLength: { value: 6, message: "Min 6 characters" },
		maxLength: { value: 250, message: "Max 250 characters" },
	});

	return (
		<Portal onClose={onClose} isOpen animation='none' {...rest}>
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
					<Form id='permissions-add-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col={{ base: "12", xs: "6" }}>
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
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label='Role'
									htmlFor='roleId'
									className={cn({
										"text--danger": selectError,
									})}
									hintMsg={selectError?.message}>
									<AsyncSelect
										useFetch={useRoles}
										value={selectValue}
										onChange={handleOnChangeRoleId}
										className={cn({
											"temat__select__container--danger": selectError,
										})}
										placeholder='Select Role'
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
										maxLength={250}
										pigment={errors?.description ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='permissions-add-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{payload ? "Update" : "Submit"}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default PermissionsForm;