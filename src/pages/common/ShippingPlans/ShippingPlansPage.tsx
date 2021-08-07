import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { Button, Flex, Heading } from "@dodobrat/react-ui-kit";
import { useShippingPlans } from "../../../actions/fetchHooks";
import { useShippingPlanDelete } from "../../../actions/mutateHooks";
import { IconAdd } from "../../../components/ui/icons";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { useAuthContext } from "../../../context/AuthContext";
import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { ResponseColumnType } from "../../../types/global.types";
import { ZoomPortal } from "@dodobrat/react-ui-kit";
import PageContent from "../../../components/ui/wrappers/PageContent";
import DataTable from "../../../components/util/DataTable";

const ShippingPlansForm = lazy(() => import("./shipping_plans_forms/ShippingPlansForm"));

const ShippingPlansPage = () => {
	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const [queryParams, setQueryParams] = useState({
		sortBy: [],
		filters: {
			page: 0,
			perPage: 10,
			// searchString: "",
		},
	});
	const [showShippingPlansForm, setShowShippingPlansForm] = useState({ state: false, payload: null });

	const closeShippingPlansForm = () => setShowShippingPlansForm((prev) => ({ ...prev, state: false }));

	const { data, refetch, isFetching, isStale } = useShippingPlans({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => errorToast(err),
		},
		specialKey: queryParams,
	});

	const { mutate: deleteShippingPlan } = useShippingPlanDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("shippingPlans");
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const fetchedData = useMemo(() => data?.data ?? [], [data]);
	const fetchedMeta = useMemo(() => data?.meta ?? null, [data]);

	const columns = useMemo(() => {
		if (data) {
			return data.columns.map((col: ResponseColumnType) => {
				return {
					Header: col.title,
					accessor: col.accessor,
					disableSortBy: !col.canSort,
					type: col?.type,
					id: col?.id,
				};
			});
		}
		return [];
	}, [data]);

	const actions = useMemo(() => {
		if (data) {
			const permittedActions = [];

			if (userCan("planReadSingle")) {
				permittedActions.push({
					type: "view",
					props: (entry) => ({
						as: Link,
						to: `/app/plans/${entry.id}`,
					}),
				});
			}
			if (userCan("planUpdate")) {
				permittedActions.push({
					type: "edit",
					action: (entry: any) => setShowShippingPlansForm({ state: true, payload: entry }),
				});
			}
			if (userCan("planDelete")) {
				permittedActions.push({
					type: "delete",
					withConfirmation: true,
					action: (entry: any) => deleteShippingPlan(entry.id),
				});
			}
			return permittedActions;
		}
		return [];
	}, [data, userCan, deleteShippingPlan]);

	const fetchData = useCallback(({ pageSize, pageIndex, sortBy }) => {
		setQueryParams((prev) => ({
			...prev,
			sortBy,
			filters: {
				...prev.filters,
				page: pageIndex,
				perPage: pageSize,
			},
		}));
	}, []);

	useEffect(() => {
		if (isStale) {
			refetch();
		}
	}, [queryParams, refetch, isStale]);

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Shipping Plans</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Shipping Plans
						</Heading>
					</Flex.Col>
					{userCan("planCreate") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowShippingPlansForm({ state: true, payload: null })} iconStart={<IconAdd />}>
								Add New
							</Button>
						</Flex.Col>
					)}
				</Flex>
			</PageHeader>
			<PageContent>
				<DataTable
					columns={columns}
					data={fetchedData}
					fetchData={fetchData}
					loading={isFetching}
					actions={actions}
					serverPageCount={fetchedMeta?.lastPage}
					serverTotalResults={fetchedMeta?.total}
				/>
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
