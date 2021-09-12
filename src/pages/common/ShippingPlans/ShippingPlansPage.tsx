import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { Button, Flex, Heading, ZoomPortal } from "@dodobrat/react-ui-kit";

import { useShippingPlans } from "../../../actions/fetchHooks";
import { useShippingPlanDelete } from "../../../actions/mutateHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import { useAuthContext } from "../../../context/AuthContext";
import { successToast } from "../../../helpers/toastEmitter";

import { IconAdd } from "../../../components/ui/icons";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageContent from "../../../components/ui/wrappers/PageContent";
import DataTable from "../../../components/util/DataTable";

const ShippingPlansForm = lazy(() => import("./shipping_plans_forms/ShippingPlansForm"));

const ShippingPlansPage = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const { mutate: deleteShippingPlan } = useShippingPlanDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("shippingPlans");
			},
		},
	});

	const { tableProps } = useDataTableGenerate({
		useFetch: useShippingPlans,
		actions: [
			{
				permission: ["planReadSingle", "planReadSingleTheir"],
				type: "view",
				props: (entry) => ({
					as: Link,
					to: `/app/plans/${entry.id}`,
				}),
			},
			{
				permission: ["planUpdate", "planUpdateTheir"],
				type: "edit",
				action: (entry: any) => setShowShippingPlansForm({ state: true, payload: entry }),
			},
			{
				permission: ["planDelete", "planDeleteTheir"],
				type: "delete",
				withConfirmation: true,
				action: (entry: any) => deleteShippingPlan(entry.id),
			},
		],
	});

	const [showShippingPlansForm, setShowShippingPlansForm] = useState({ state: false, payload: null });

	const closeShippingPlansForm = () => setShowShippingPlansForm((prev) => ({ ...prev, state: false }));

	return (
		<PageWrapper>
			<Helmet>
				<title>
					{process.env.REACT_APP_NAME} | {t("common.shippingPlan", { count: 0 })}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.shippingPlan", { count: 0 })}
						</Heading>
					</Flex.Col>
					{userCan(["planCreate", "planCreateTheir"]) && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowShippingPlansForm({ state: true, payload: null })} iconStart={<IconAdd />}>
								{t("action.add")}
							</Button>
						</Flex.Col>
					)}
				</Flex>
			</PageHeader>
			<PageContent>
				<DataTable {...tableProps} />
			</PageContent>
			<Suspense fallback={<div />}>
				<ZoomPortal in={showShippingPlansForm.state}>
					<ShippingPlansForm onClose={closeShippingPlansForm} payload={showShippingPlansForm.payload} />
				</ZoomPortal>
			</Suspense>
		</PageWrapper>
	);
};

export default ShippingPlansPage;
