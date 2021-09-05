import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import OrderStepExtras from "../order_steps/OrderStepExtras";

const OrderFormStepFiles = ({ useContext = useOrdersContext }) => {
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
		getValues,
		setError,
		clearErrors,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...data.extras,
			files: data?.extras?.files ?? [],
		},
	});

	const onSubmit = (data: any) => {
		setData((prev) => ({
			...prev,
			extras: data,
		}));
		setCurrStep(6);
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepExtras orderId={data?.orderId} formProps={{ control, errors, setValue, getValues, setError, clearErrors, watch }} />
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='space-between' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						<Button type='button' pigment={null} pigmentColor='none' onClick={() => setCurrStep(4)}>
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

export default OrderFormStepFiles;
