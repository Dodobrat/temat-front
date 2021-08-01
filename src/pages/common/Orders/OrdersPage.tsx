import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@dodobrat/react-ui-kit";
import { useOrders } from "../../../actions/fetchHooks";
import { useAuthContext } from "../../../context/AuthContext";
import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { ResponseColumnType } from "../../../types/global.types";
import { Link } from "react-router-dom";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { Helmet } from "react-helmet";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import { Flex } from "@dodobrat/react-ui-kit";
import { Heading } from "@dodobrat/react-ui-kit";
import { Button } from "@dodobrat/react-ui-kit";
import { IconAdd, IconErrorCircle, IconFilter } from "../../../components/ui/icons";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { PortalWrapper } from "@dodobrat/react-ui-kit";
import { Input } from "@dodobrat/react-ui-kit";
import { Tooltip } from "@dodobrat/react-ui-kit";
import DataTable from "../../../components/util/DataTable";
import { ZoomPortal } from "@dodobrat/react-ui-kit";
import { SlideIn } from "@dodobrat/react-ui-kit";
import { useOrderDelete } from "../../../actions/mutateHooks";
import { useQueryClient } from "react-query";

const OrdersForm = lazy(() => import("./order_forms/OrdersForm"));
const OrdersUpdateForm = lazy(() => import("./order_forms/OrdersUpdateForm"));
const OrdersDrawer = lazy(() => import("./OrdersDrawer"));

const OrdersPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const [queryParams, setQueryParams] = useState({
		sortBy: [],
		filters: {
			page: 0,
			perPage: 10,
			searchString: "",
		},
	});
	const [searchString, setSearchString] = useState("");
	const [searchStringError, setSearchStringError] = useState(false);
	const [showOrdersForm, setShowOrdersForm] = useState({ state: false, payload: null });
	const [showOrdersUpdateForm, setShowOrdersUpdateForm] = useState({ state: false, payload: null });
	const [showFilters, setShowFilters] = useState(false);

	const closeOrdersForm = () => setShowOrdersForm((prev) => ({ ...prev, state: false }));
	const closeOrdersUpdateForm = () => setShowOrdersUpdateForm((prev) => ({ ...prev, state: false }));
	const closeFilters = () => setShowFilters(false);

	const { data, refetch, isFetching, isStale } = useOrders({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => errorToast(err),
		},
		specialKey: queryParams,
	});

	const { mutate: deleteOrder } = useOrderDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orders");
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const debouncedSearchString = useDebounce(!searchStringError ? searchString : "", 500);

	const handleOnSearchChange = (e: any) => {
		const stringValue = e.target.value;
		setSearchString(stringValue);

		if (stringValue.length === 1) {
			setSearchStringError(true);
		} else {
			setSearchStringError(false);
		}
	};

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

			if (userCan("orderReadSingle")) {
				permittedActions.push({
					type: "view",
					props: (entry) => ({
						as: Link,
						to: `/app/orders/${entry.id}`,
					}),
				});
			}
			if (userCan("orderUpdate")) {
				permittedActions.push({
					type: "edit",
					action: (entry: any) => setShowOrdersUpdateForm({ state: true, payload: entry }),
				});
			}
			if (userCan("orderDelete")) {
				permittedActions.push({
					type: "delete",
					withConfirmation: true,
					action: (entry: any) => deleteOrder(entry.id),
				});
			}

			return permittedActions;
		}
		return [];
	}, [data, userCan, deleteOrder]);

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
		setQueryParams((prev) => ({
			...prev,
			filters: {
				...prev.filters,
				searchString: debouncedSearchString,
			},
		}));
	}, [debouncedSearchString]);

	useEffect(() => {
		if (isStale) {
			refetch();
		}
	}, [queryParams, refetch, isStale]);

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Orders</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Orders
						</Heading>
					</Flex.Col>
					{userCan("orderCreate") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowOrdersForm({ state: true, payload: null })} iconStart={<IconAdd />}>
								Add New
							</Button>
						</Flex.Col>
					)}
				</Flex>
			</PageHeader>
			<PageContent>
				<PortalWrapper element={datatableHeader ?? null}>
					<Flex className='w--100' disableNegativeSpace>
						<Flex.Col>
							<Input
								type='search'
								className='temat__table__search'
								placeholder='Search by name...'
								value={searchString}
								onChange={handleOnSearchChange}
								pigment={searchStringError ? "danger" : "primary"}
								suffix={
									searchStringError && (
										<Tooltip content={"Minimum 2 characters"}>
											<IconErrorCircle className='text--danger' />
										</Tooltip>
									)
								}
							/>
						</Flex.Col>
						<Flex.Col col='auto'>
							<Button pigment='warning' onClick={() => setShowFilters(true)} iconStart={<IconFilter />}>
								Filters
							</Button>
						</Flex.Col>
					</Flex>
				</PortalWrapper>
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
				<ZoomPortal in={showOrdersForm.state}>
					<OrdersForm onClose={closeOrdersForm} payload={showOrdersForm.payload} />
				</ZoomPortal>
				<ZoomPortal in={showOrdersUpdateForm.state}>
					<OrdersUpdateForm onClose={closeOrdersUpdateForm} payload={showOrdersUpdateForm.payload} />
				</ZoomPortal>
				<SlideIn position='right' in={showFilters}>
					<OrdersDrawer onClose={closeFilters} />
				</SlideIn>
			</Suspense>
		</PageWrapper>
	);
};

export default OrdersPage;
