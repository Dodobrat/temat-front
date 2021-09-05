import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import OrderStepShipping from "../order_steps/OrderStepShipping";
import { getClosestValidDate } from "../../../../helpers/dateHelpers";

const OrderFormStepShipping = ({ useContext = useOrdersContext }) => {
	const formFooter = document.getElementById("orders-form-footer");

	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
		stepValue: { setCurrStep },
	} = useContext();

	const {
		control,
		watch,
		getValues,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...data.shipping,
			shipDate: data?.shipping?.shipDate ?? getClosestValidDate(),
		},
	});

	const onSubmit = (data: any) => {
		setData((prev) => ({
			...prev,
			shipping: data,
		}));
		setCurrStep(3);
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepShipping initialData={data.shipping} formProps={{ control, errors, watch, getValues, setValue, reset }} />
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='space-between' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						<Button type='button' pigment={null} pigmentColor='none' onClick={() => setCurrStep(1)}>
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

export default OrderFormStepShipping;
