import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import OrderStepPayment from "../order_steps/OrderStepPayment";

const OrderFormStepPayment = ({ useContext = useOrdersContext }) => {
	const formFooter = document.getElementById("orders-form-footer");

	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
		stepValue: { setCurrStep },
	} = useContext();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...data.payment,
		},
	});

	const onSubmit = (data: any) => {
		setData((prev) => ({
			...prev,
			payment: {
				...prev.payment,
				...data,
			},
		}));
		setCurrStep(2);
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepPayment formProps={{ control, errors }} />
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='flex-end' className='w-100' style={{ flex: 1 }}>
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

export default OrderFormStepPayment;
