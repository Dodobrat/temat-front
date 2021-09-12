import { useEffect } from "react";
import { Card } from "@dodobrat/react-ui-kit";

import { useAuthContext } from "../../../../context/AuthContext";
import { useShippingPlansContext } from "../../../../context/ShippingPlansContext";

import ShippingPlanStepCompany from "../shipping_plans_steps/ShippingPlanStepCompany";
import ShippingPlanStepSummary from "../shipping_plans_steps/ShippingPlanStepSummary";

interface Props {
	payload: any;
	onClose: any;
	withPrefetch?: boolean;
	onTouch?: any;
}

const parseProductsToContext = (products) => {
	const productsWithIds = [];
	for (const product of products) {
		productsWithIds.push({
			...product,
			value: product?.productId,
			quantity: product?.expected ?? "0",
			price: product?.price ?? "0.00",
		});
	}
	return productsWithIds;
};

const ShippingPlansFormWizard = (props: Props) => {
	const { onClose, payload, withPrefetch, onTouch } = props;

	const {
		dataValue: { data, setData },
	} = useShippingPlansContext();

	const {
		userValue: { user },
		userCan,
	} = useAuthContext();

	useEffect(() => {
		if (!userCan("planCreate") && !payload) {
			setData((prev) => ({
				...prev,
				companyId: user?.companyId,
			}));
		}
	}, [setData, user?.companyId, userCan, payload]);

	useEffect(() => {
		if (payload) {
			setData((prev) => ({
				...prev,
				companyId: payload?.companyId,
				products: parseProductsToContext(payload?.products),
				dateExpected: payload?.dateExpected ? new Date(payload?.dateExpected) : null,
				extraInfo: payload?.extraInfo ?? "",
			}));
		}
	}, [setData, payload]);

	return (
		<>
			<Card.Body>
				{!data.companyId && userCan("planCreate") ? (
					<ShippingPlanStepCompany withPrefetch={withPrefetch} onTouch={onTouch} />
				) : (
					<ShippingPlanStepSummary payload={payload} onClose={onClose} onTouch={onTouch} />
				)}
			</Card.Body>
			<Card.Footer justify='flex-end' id='shipping-plan-form-footer' />
		</>
	);
};

export default ShippingPlansFormWizard;
