import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Button, PortalWrapper, Flex } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import { useOrderAdd } from "../../../../actions/mutateHooks";

import OrderStepSummary from "../order_steps/OrderStepSummary";
import { successToast } from "../../../../helpers/toastEmitter";
import { parseOrderAddData } from "../orderHelpers";

const OrderFormStepSummary = ({ useContext = useOrdersContext, onClose }: any) => {
	const formFooter = document.getElementById("orders-form-footer");

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		dataValue: { data },
		stepValue: { setCurrStep },
	} = useContext();

	const { mutate: addOrder, isLoading: isLoadingAdd } = useOrderAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orders");
				onClose();
			},
		},
	});

	const onSubmit = () => {
		addOrder(parseOrderAddData(data));
	};

	return (
		<div>
			<OrderStepSummary />
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='space-between' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						<Button pigment={null} pigmentColor='none' onClick={() => setCurrStep(5)}>
							{t("common.back")}
						</Button>
					</Flex.Col>
					<Flex.Col col='auto'>
						<Button onClick={onSubmit} isLoading={isLoadingAdd}>
							{t("action.add", { entry: t("common.order") })}
						</Button>
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</div>
	);
};

export default OrderFormStepSummary;
