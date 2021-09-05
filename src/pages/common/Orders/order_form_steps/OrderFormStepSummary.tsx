import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { Form, Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import { useOrderAdd } from "../../../../actions/mutateHooks";

import OrderStepSummary from "../order_steps/OrderStepSummary";
import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import { parseOrderAddData } from "../orderAddHelpers";

const OrderFormStepSummary = ({ useContext = useOrdersContext, onClose }) => {
	const formFooter = document.getElementById("orders-form-footer");

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		dataValue: { data },
		stepValue: { setCurrStep },
	} = useContext();

	const { handleSubmit } = useForm({
		defaultValues: {
			...data,
		},
	});

	const { mutate: addOrder, isLoading: isLoadingAdd } = useOrderAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orders");
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = (data: any) => {
		addOrder(parseOrderAddData(data));
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
			<OrderStepSummary />
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='space-between' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						<Button type='button' pigment={null} pigmentColor='none' onClick={() => setCurrStep(5)}>
							{t("common.back")}
						</Button>
					</Flex.Col>
					<Flex.Col col='auto'>
						<Button type='submit' form='orders-form' isLoading={isLoadingAdd}>
							{t("common.next")}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default OrderFormStepSummary;
