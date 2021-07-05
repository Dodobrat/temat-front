import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { Portal, Card, Button, Text, Form, Flex, FormControl, Input } from "@dodobrat/react-ui-kit";
import { IconClose } from "../../../components/ui/icons";
import { useProductAdd, useProductUpdate } from "../../../actions/mutateHooks";
import cn from "classnames";

interface Props {
	onClose: () => void;
	payload?: any;
}

const ProductsForm = (props: Props) => {
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

	const { mutate: addProduct, isLoading: isLoadingAdd } = useProductAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				console.log(res);
				queryClient.invalidateQueries("products");
				onClose();
			},
			onError: (err: any) => console.log(err),
		},
	});

	const { mutate: updateProduct, isLoading: isLoadingUpdate } = useProductUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				console.log(res);
				queryClient.invalidateQueries("products");
				onClose();
			},
			onError: (err: any) => console.log(err),
		},
	});

	const onSubmit = (data: any) => {
		const sanitizedData = {
			name: data.name,
			roleId: data.roleId?.value,
			description: data.description,
		};
		if (payload) {
			sanitizedData["id"] = payload.id;
			return updateProduct(sanitizedData);
		}
		return addProduct(sanitizedData);
	};

	const { ref: innerRefName, ...restName } = register("name", {
		required: "Field is required",
		minLength: { value: 6, message: "Min 6 characters" },
		maxLength: { value: 99, message: "Max 99 characters" },
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
					<Text className='mb--0'>{payload ? "Edit" : "Add"} Product</Text>
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

export default ProductsForm;
