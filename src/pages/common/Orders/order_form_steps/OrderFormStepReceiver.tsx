import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import OrderStepReceiver from "../order_steps/OrderStepReceiver";

const OrderFormStepReceiver = ({ useContext = useOrdersContext }) => {
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
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...data.receiver,
		},
	});

	const onSubmit = (data: any) => {
		if (data?.receiverAgentPhone === "") {
			data.receiverAgentPhoneCodeId = null;
		}
		setData((prev) => ({
			...prev,
			receiver: data,
		}));
		setCurrStep(4);
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepReceiver
				shipping={data.shipping}
				initialData={data.receiver}
				formProps={{ control, errors, watch, getValues, reset }}
			/>
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='space-between' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						<Button type='button' pigment={null} pigmentColor='none' onClick={() => setCurrStep(2)}>
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

export default OrderFormStepReceiver;
