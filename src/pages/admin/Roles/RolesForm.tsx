import { Form } from "@dodobrat/react-ui-kit";
import { Portal, Card, Text, Button, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import { useForm, Controller } from "react-hook-form";
import { IconClose } from "../../../components/ui/icons/index";
import AsyncSelect from "../../../components/forms/AsyncSelect";
import cn from "classnames";

interface Props {
	onClose: () => void;
	payload?: any;
}

const RolesForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	// const {
	// 	register,
	// 	control,
	// 	handleSubmit,
	// 	formState: { errors },
	// } = useForm({
	// 	defaultValues: {
	// 		...payload,
	// 	},
	// });

	// const onSubmit = (data: any) => {
	// 	console.log(data);
	// };

	// const { ref: innerRefName, ...restName } = register("name", {
	// 	required: "Field is required",
	// 	minLength: { value: 6, message: "Min 6 characters" },
	// 	maxLength: { value: 99, message: "Max 99 characters" },
	// });
	// const { ref: innerRefDescription, ...restDescription } = register("description", {
	// 	required: "Field is required",
	// 	minLength: { value: 6, message: "Min 6 characters" },
	// 	maxLength: { value: 250, message: "Max 250 characters" },
	// });

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
					{/* <Form id='permissions-add-form' onSubmit={handleSubmit(onSubmit)}>
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
								<FormControl label='Role' htmlFor='role'>
									<Controller
										control={control}
										name='test'
										render={({ field: { ref, ...rest } }) => <AsyncSelect {...rest} ref={ref} />}
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
					</Form> */}
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='permissions-add-form' className='ml--2'>
						{payload ? "Update" : "Submit"}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default RolesForm;
