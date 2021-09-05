import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import OrderStepProducts from "../order_steps/OrderStepProducts";

const OrderFormStepProducts = ({ useContext = useOrdersContext }) => {
	const formFooter = document.getElementById("orders-form-footer");

	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
		stepValue: { setCurrStep },
	} = useContext();

	const {
		control,
		watch,
		setValue,
		clearErrors,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			products: data.products,
		},
	});

	const onSubmit = (data: any) => {
		console.log("submit Products", data);
		setData((prev) => ({
			...prev,
			products: data?.products,
		}));
		setCurrStep(5);
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepProducts
				payment={data?.payment}
				initialData={data.products}
				companyId={data?.payment?.companyId?.value ?? data?.payment?.companyId}
				formProps={{ control, errors, setValue, watch, clearErrors }}
			/>
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='space-between' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						<Button type='button' pigment={null} pigmentColor='none' onClick={() => setCurrStep(3)}>
							{t("common.back")}
						</Button>
					</Flex.Col>
					<Flex.Col col='auto'>
						<Button type='submit' form='orders-form'>
							{t("common.next")}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default OrderFormStepProducts;
