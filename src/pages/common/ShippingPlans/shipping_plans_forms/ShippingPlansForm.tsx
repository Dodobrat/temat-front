import { Portal, Card, Text, Button } from "@dodobrat/react-ui-kit";

import { useShippingPlanById } from "../../../../actions/fetchHooks";

import ShippingPlansProvider from "../../../../context/ShippingPlansContext";

import ShippingPlansFormWizard from "./ShippingPlansFormWizard";
import { IconClose } from "../../../../components/ui/icons";

import { confirmOnExit } from "../../../../helpers/helpers";
import { errorToast } from "../../../../helpers/toastEmitter";

interface Props {
	onClose: () => void;
	payload?: any;
}

const ShippingPlansForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { data, isFetching } = useShippingPlanById({
		specs: {
			filters: {
				products: "true",
			},
		},
		queryConfig: {
			enabled: !!payload,
			onError: (err: any) => errorToast(err),
		},
		specialKey: { planId: payload?.id, filters: ["products"] },
	});

	const fetchedPlan = data?.data ?? null;

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose)} isOpen animation='none' {...rest}>
			<Card isLoading={isFetching}>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{payload ? "Edit" : "Add"} Shipping Plan</Text>
				</Card.Header>
				<ShippingPlansProvider>
					<ShippingPlansFormWizard onClose={onClose} payload={fetchedPlan} />
				</ShippingPlansProvider>
			</Card>
		</Portal>
	);
};

export default ShippingPlansForm;
