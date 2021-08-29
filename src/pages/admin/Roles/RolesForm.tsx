import { useQueryClient } from "react-query";
import { Form, Portal, Card, Text, Button, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import { Controller, useForm } from "react-hook-form";
import cn from "classnames";

import { useRoleAdd, useRoleUpdate } from "../../../actions/mutateHooks";

import { IconClose } from "../../../components/ui/icons";

import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { confirmOnExit } from "../../../helpers/helpers";

interface Props {
	onClose: () => void;
	payload?: any;
}

const RolesForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		formState: { errors },
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
			onError: (err: any) => errorToast(err),
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
			onError: (err: any) => errorToast(err),
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
		<Portal onOutsideClick={() => confirmOnExit(onClose)} isOpen animation='none' {...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{payload ? "Edit" : "Add"} Role</Text>
				</Card.Header>
				<Card.Body>
					<Form id='roles-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col='12'>
								<FormControl
									label='Name'
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
													placeholder='Name'
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
											required: "Field is required",
											minLength: { value: 2, message: "Min 2 characters" },
											maxLength: { value: 50, message: "Max 50 characters" },
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
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<TextArea
													placeholder='Enter Description'
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
											required: "Field is required",
											minLength: { value: 2, message: "Min 2 characters" },
											maxLength: { value: 250, message: "Max 250 characters" },
										}}
									/>
								</FormControl>
							</Flex.Col>
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='roles-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{payload ? "Update" : "Submit"}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default RolesForm;
