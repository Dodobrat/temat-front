import { Form } from "@dodobrat/react-ui-kit";
import { Portal, Card, Text, Button, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import { useForm } from "react-hook-form";
import { IconClose } from "../../../components/ui/icons";
import cn from "classnames";
import { useRoleAdd, useRoleUpdate } from "../../../actions/mutateHooks";
import { useQueryClient } from "react-query";
import { errorToast, successToast } from "../../../helpers/toastEmitter";

interface Props {
	onClose: () => void;
	payload?: any;
}

const RolesForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const queryClient = useQueryClient();

	const {
		register,
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

	const { ref: innerRefName, ...restName } = register("name", {
		required: "Field is required",
		minLength: { value: 3, message: "Min 3 characters" },
		maxLength: { value: 39, message: "Max 39 characters" },
	});
	const { ref: innerRefDescription, ...restDescription } = register("description", {
		required: "Field is required",
		minLength: { value: 3, message: "Min 3 characters" },
		maxLength: { value: 150, message: "Max 150 characters" },
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
										maxLength={150}
										pigment={errors?.description ? "danger" : "primary"}
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
