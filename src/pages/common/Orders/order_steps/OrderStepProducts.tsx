import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Flex, Form, FormControl } from "@dodobrat/react-ui-kit";
import { Input } from "@dodobrat/react-ui-kit";
import cn from "classnames";

interface Props {}

const OrderStepProducts = (props: Props) => {
	const { t } = useTranslation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data: any) => {
		console.log(data);
	};

	// const { ref: innerRefFirstName, ...restFirstName } = register("firstName");

	return (
		<Form id='orders-add-form' onSubmit={handleSubmit(onSubmit)}>
			<Flex spacingY='md'>
				{/* <Flex.Col col={{ base: "12", xs: "6" }}>
					<FormControl
						label={t("users.firstName")}
						htmlFor='firstName'
						className={cn({
							"text--danger": errors?.firstName,
						})}
						hintMsg={errors?.firstName?.message}>
						<Input
							name='firstName'
							placeholder={t("users.firstName")}
							{...restFirstName}
							innerRef={innerRefFirstName}
							pigment={errors?.firstName ? "danger" : "primary"}
						/>
					</FormControl>
				</Flex.Col> */}
			</Flex>
		</Form>
	);
};

export default OrderStepProducts;
