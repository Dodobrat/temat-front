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
}

const parseProductsToContext = (products) => {
	const productsWithIds = [];
	for (const product of products) {
		productsWithIds.push({ ...product, value: product?.productId, quantity: product?.expected });
	}
	return productsWithIds;
};

const ShippingPlansFormWizard = (props: Props) => {
	const { onClose, payload, withPrefetch } = props;

	const {
		dataValue: { data, setData },
	} = useShippingPlansContext();

	const {
		userValue: { user },
	} = useAuthContext();

	useEffect(() => {
		if (user.roleName !== "ADMIN" && !payload) {
			setData((prev) => ({
				...prev,
				companyId: user?.companyId,
			}));
		}
	}, [setData, user?.companyId, user.roleName, payload]);

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
				{!data.companyId && user?.roleName === "ADMIN" ? (
					<ShippingPlanStepCompany withPrefetch={withPrefetch} />
				) : (
					<ShippingPlanStepSummary payload={payload} onClose={onClose} />
				)}
			</Card.Body>
			<Card.Footer justify='flex-end' id='shipping-plan-form-footer' />
		</>
	);
};

export default ShippingPlansFormWizard;
