import { Portal, Card, Text, Button } from "@dodobrat/react-ui-kit";
import { useMemo } from "react";
import { useShippingPlanById } from "../../../../actions/fetchHooks";
import { IconClose } from "../../../../components/ui/icons";
import ShippingPlansProvider from "../../../../context/ShippingPlansContext";
import { errorToast } from "../../../../helpers/toastEmitter";
import ShippingPlansFormWizard from "./ShippingPlansFormWizard";

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

	const fetchedPlan = useMemo(() => {
		if (data) {
			return data?.data;
		}
		return null;
	}, [data]);

	return (
		<Portal onClose={onClose} isOpen animation='none' {...rest}>
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
