import { useCallback, useEffect, useMemo, useState, Suspense, lazy } from "react";
import { useQueryClient } from "react-query";
import { useDebounce, Flex, Heading, Button, PortalWrapper, Input, Tooltip, ZoomPortal, SlideIn } from "@dodobrat/react-ui-kit";
import { useProducts } from "../../../actions/fetchHooks";
import { useProductDelete } from "../../../actions/mutateHooks";
import { useAuth } from "../../../context/AuthContext";
import { ResponseColumnType } from "../../../types/global.types";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IconAdd, IconFilter, IconErrorCircle } from "../../../components/ui/icons";
import DataTable from "../../../components/util/DataTable";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";

const ProductsForm = lazy(() => import("./ProductsForm"));
const ProductsDrawer = lazy(() => import("./ProductsDrawer"));

const ProductsPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const queryClient = useQueryClient();
	const { userCan } = useAuth();

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
	const [showFilters, setShowFilters] = useState(false);
	const [showProductForm, setShowProductForm] = useState({ state: false, payload: null });

	const closeFilters = () => setShowFilters(false);
	const closeProductsForm = () => setShowProductForm((prev) => ({ ...prev, state: false }));

	const { data, refetch, isFetching, isStale } = useProducts({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => console.log(err),
		},
		specialKey: queryParams,
	});

	const { mutate: deleteProduct } = useProductDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				console.log(res);
				queryClient.invalidateQueries("products");
			},
			onError: (err: any) => console.log(err),
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

			if (userCan("productReadSingle")) {
				permittedActions.push({
					type: "view",
					props: (entry) => ({
						as: Link,
						to: `/app/products/${entry.id}`,
					}),
				});
			}
			if (userCan("productUpdate")) {
				permittedActions.push({
					type: "edit",
					action: (entry: any) => setShowProductForm({ state: true, payload: entry }),
				});
			}
			if (userCan("productDelete")) {
				permittedActions.push({
					type: "delete",
					action: (entry: any) => deleteProduct(entry.id),
				});
			}
			return permittedActions;
		}
		return [];
	}, [data, userCan, deleteProduct]);

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
				<title>Temat | Products</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Products
						</Heading>
					</Flex.Col>
					{userCan("productCreate") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowProductForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
				<ZoomPortal in={showProductForm.state}>
					<ProductsForm onClose={closeProductsForm} payload={showProductForm.payload} />
				</ZoomPortal>
				<SlideIn position='right' in={showFilters}>
					<ProductsDrawer onClose={closeFilters} />
				</SlideIn>
			</Suspense>
		</PageWrapper>
	);
};

export default ProductsPage;
