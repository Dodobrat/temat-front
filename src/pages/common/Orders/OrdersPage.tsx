import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useDebounce, Flex, Heading, Button, PortalWrapper, Input, Tooltip, ZoomPortal, SlideIn } from "@dodobrat/react-ui-kit";

import { useOrders } from "../../../actions/fetchHooks";
import { useOrderDelete } from "../../../actions/mutateHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import { useAuthContext } from "../../../context/AuthContext";
import { errorToast, successToast } from "../../../helpers/toastEmitter";

import { IconAdd, IconErrorCircle, IconFilter } from "../../../components/ui/icons";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import DataTable from "../../../components/util/DataTable";

const OrdersForm = lazy(() => import("./order_forms/OrdersForm"));
const OrdersUpdateForm = lazy(() => import("./order_forms/OrdersUpdateForm"));
const OrdersDrawer = lazy(() => import("./OrdersDrawer"));

const OrdersPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const { mutate: deleteOrder } = useOrderDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orders");
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const {
		tableProps,
		state: { setQueryParams },
	} = useDataTableGenerate({
		useFetch: useOrders,
		actions: [
			{
				permission: "orderReadSingle",
				type: "view",
				props: (entry) => ({
					as: Link,
					to: `/app/orders/${entry.id}`,
				}),
			},
			{
				permission: "orderUpdate",
				type: "edit",
				action: (entry: any) => setShowOrdersUpdateForm({ state: true, payload: entry }),
			},
			{
				permission: "orderDelete",
				type: "delete",
				withConfirmation: true,
				action: (entry: any) => deleteOrder(entry.id),
			},
		],
	});

	const [searchString, setSearchString] = useState("");
	const [searchStringError, setSearchStringError] = useState(false);
	const [showOrdersForm, setShowOrdersForm] = useState({ state: false, payload: null });
	const [showOrdersUpdateForm, setShowOrdersUpdateForm] = useState({ state: false, payload: null });
	const [showFilters, setShowFilters] = useState(false);

	const closeOrdersForm = () => setShowOrdersForm((prev) => ({ ...prev, state: false }));
	const closeOrdersUpdateForm = () => setShowOrdersUpdateForm((prev) => ({ ...prev, state: false }));
	const closeFilters = () => setShowFilters(false);

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

	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			filters: {
				...prev.filters,
				searchString: debouncedSearchString,
			},
		}));
	}, [debouncedSearchString, setQueryParams]);

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
					{userCan(["orderCreate", "orderCreateTheir"]) && (
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
				<DataTable {...tableProps} />
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
