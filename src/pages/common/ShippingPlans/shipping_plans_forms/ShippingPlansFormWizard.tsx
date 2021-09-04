import { useEffect, useState } from "react";
import { Button, Card, Flex, FormControl } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useAuthContext } from "../../../../context/AuthContext";
import OrderStepProducts from "../../Orders/order_steps/OrderStepProducts";
import { useShippingPlansContext } from "../../../../context/ShippingPlansContext";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { useCompanies } from "../../../../actions/fetchHooks";
import { TextArea } from "@dodobrat/react-ui-kit";

import { useShippingPlanAdd, useShippingPlanUpdate } from "../../../../actions/mutateHooks";
import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import CalendarPicker from "../../../../components/util/CalendarPicker";
import ShippingPlanStepCompany from "../shipping_plans_steps/ShippingPlanStepCompany";
import ShippingPlanStepSummary from "../shipping_plans_steps/ShippingPlanStepSummary";

interface Props {
	payload: any;
	onClose: any;
}

const parseShippingPlanData = (data) => {
	const parsedData: any = {};

	parsedData.companyId = data?.companyId?.value ?? data?.companyId;
	parsedData.dateExpected = data?.dateExpected?.toISOString().slice(0, 10);
	parsedData.products = data?.products?.reduce((acc, curr) => {
		return [...acc, { id: curr?.value, qty: curr?.quantity }];
	}, []);
	parsedData.extraInfo = data?.extraInfo;

	return parsedData;
};

const parseProductsToContext = (products) => {
	const productsWithIds = [];
	for (const product of products) {
		productsWithIds.push({ ...product, value: product?.productId, quantity: product?.expected });
	}
	return productsWithIds;
};

const ShippingPlansFormWizard = (props: Props) => {
	const { onClose, payload } = props;

	const queryClient = useQueryClient();
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useShippingPlansContext();

	const {
		userValue: { user },
	} = useAuthContext();

	const [canProceed, setCanProceed] = useState(false);

	useEffect(() => {
		if (user.roleName !== "ADMIN" && !payload) {
			setData((prev) => ({
				...prev,
				companyId: user?.companyId,
			}));
			setCanProceed(true);
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
			setCanProceed(true);
		}
	}, [setData, payload]);

	const { mutate: addShippingPlan, isLoading: isLoadingAdd } = useShippingPlanAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("shippingPlans");
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const { mutate: updateShippingPlan, isLoading: isLoadingUpdate } = useShippingPlanUpdate({
		specs: {
			planId: payload?.id,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("shippingPlans");
				queryClient.invalidateQueries("shippingPlanById");
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	return (
		<>
			<Card.Body>
				{!canProceed && user?.roleName === "ADMIN" && <ShippingPlanStepCompany canProceed={setCanProceed} />}
				{canProceed && data?.companyId && <ShippingPlanStepSummary />}
			</Card.Body>
			<Card.Footer justify='flex-end' id='shipping-plan-form-footer'>
				{/* <Button
					pigment='primary'
					isLoading={isLoadingAdd || isLoadingUpdate}
					onClick={() => {
						if (data?.companyId && !canProceed) {
							return setCanProceed(true);
						}
						if (!payload) {
							return addShippingPlan(parseShippingPlanData(data));
						} else {
							return updateShippingPlan(parseShippingPlanData(data));
						}
					}}>
					{!canProceed ? t("common.next") : t("common.submit")}
				</Button> */}
			</Card.Footer>
		</>
	);
};

export default ShippingPlansFormWizard;
