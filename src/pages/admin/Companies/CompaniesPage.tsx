import { useCallback, useEffect, useMemo, useState, Suspense, lazy } from "react";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { useQueryClient } from "react-query";
import { useCompanies } from "../../../actions/fetchHooks";
import { useAuth } from "../../../context/AuthContext";
import { IconAdd, IconErrorCircle, IconFilter } from "../../../components/ui/icons";
import { SlideIn } from "@dodobrat/react-ui-kit";
import DataTable from "../../../components/util/DataTable";
import { Helmet } from "react-helmet";
import { Heading, Flex, Button, ZoomPortal } from "@dodobrat/react-ui-kit";
import { useCompanyDelete } from "../../../actions/mutateHooks";
import { ResponseColumnType } from "../../../types/global.types";
import { Link } from "react-router-dom";
import { useDebounce } from "@dodobrat/react-ui-kit";
import { PortalWrapper } from "@dodobrat/react-ui-kit";
import { Input } from "@dodobrat/react-ui-kit";
import { Tooltip } from "@dodobrat/react-ui-kit";

const CompaniesForm = lazy(() => import("./CompaniesForm"));
const CompaniesDrawer = lazy(() => import("./CompaniesDrawer"));

const CompaniesPage = () => {
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
	const [showCompaniesForm, setShowCompaniesForm] = useState({ state: false, payload: null });
	const [showFilters, setShowFilters] = useState(false);

	const closeCompaniesForm = () => setShowCompaniesForm((prev) => ({ ...prev, state: false }));
	const closeFilters = () => setShowFilters(false);

	const { data, refetch, isFetching, isStale } = useCompanies({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => console.log(err),
		},
		specialKey: queryParams,
	});

	const { mutate: deleteCompany } = useCompanyDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				console.log(res);
				queryClient.invalidateQueries("companies");
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

			if (userCan("companyReadSingle")) {
				permittedActions.push({
					type: "view",
					props: (entry) => ({
						as: Link,
						to: `/app/companies/${entry.id}`,
					}),
				});
			}
			if (userCan("companyUpdate")) {
				permittedActions.push({
					type: "edit",
					action: (entry: any) => setShowCompaniesForm({ state: true, payload: entry }),
				});
			}
			if (userCan("companyDelete")) {
				permittedActions.push({
					type: "delete",
					withConfirmation: true,
					action: (entry: any) => deleteCompany(entry.id),
				});
			}
			return permittedActions;
		}
		return [];
	}, [data, userCan, deleteCompany]);

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
				<title>Temat | Companies</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Companies
						</Heading>
					</Flex.Col>
					{userCan("companyCreate") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowCompaniesForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
				<ZoomPortal in={showCompaniesForm.state}>
					<CompaniesForm onClose={closeCompaniesForm} payload={showCompaniesForm.payload} />
				</ZoomPortal>
				<SlideIn position='right' in={showFilters}>
					<CompaniesDrawer onClose={closeFilters} />
				</SlideIn>
			</Suspense>
		</PageWrapper>
	);
};

export default CompaniesPage;
