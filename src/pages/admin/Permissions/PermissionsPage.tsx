import { useCallback, useMemo, useState, Suspense, lazy } from "react";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { Heading, Flex, Button, PortalWrapper, Input, Tooltip, ZoomPortal } from "@dodobrat/react-ui-kit";
import { Helmet } from "react-helmet";
import { usePermissions } from "../../../actions/fetchHooks";
import { useEffect } from "react";
import DataTable from "../../../components/util/DataTable";
import { useAuth } from "../../../context/AuthContext";
import { usePermissionDelete, usePermissionUpdate } from "../../../actions/mutateHooks";
import { useQueryClient } from "react-query";
import { useDebounce } from "@dodobrat/react-ui-kit";
import { IconAdd, IconFilter, IconErrorCircle } from "../../../components/ui/icons";
import { SlideIn } from "@dodobrat/react-ui-kit";
import { ResponseColumnType } from "../../../types/global.types";
import { errorToast, successToast } from "../../../helpers/toastEmitter";

const PermissionsForm = lazy(() => import("./PermissionsForm"));
const PermissionsDrawer = lazy(() => import("./PermissionsDrawer"));
const PermissionsViewDrawer = lazy(() => import("./PermissionsViewDrawer"));

const UsersPage = () => {
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
	const [showPermissionForm, setShowPermissionForm] = useState({ state: false, payload: null });
	const [viewPermission, setViewPermission] = useState({ state: false, payload: null });

	const closeFilters = () => setShowFilters(false);
	const closePermissionsForm = () => setShowPermissionForm((prev) => ({ ...prev, state: false }));
	const closePermissionView = () => setViewPermission((prev) => ({ ...prev, state: false }));

	const { data, refetch, isFetching, isStale } = usePermissions({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => errorToast(err),
		},
		specialKey: queryParams,
	});

	const { mutate: deletePermission } = usePermissionDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("permissions");
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const { mutate: updatePermissionStatus } = usePermissionUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("permissions");
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
				if (col?.type === "Switch") {
					return {
						Header: col.title,
						accessor: col.accessor,
						disableSortBy: !col.canSort,
						type: col?.type,
						id: col?.id,
						action: ({ value, entry }) => {
							const data = { id: entry.id, status: value };
							updatePermissionStatus(data);
						},
					};
				}
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
	}, [data, updatePermissionStatus]);

	const actions = useMemo(() => {
		if (data) {
			const permittedActions = [];

			if (userCan("permissionReadSingle")) {
				permittedActions.push({
					type: "view",
					action: (entry: any) => setViewPermission({ state: true, payload: entry }),
				});
			}
			if (userCan("permissionUpdate")) {
				permittedActions.push({
					type: "edit",
					action: (entry: any) => setShowPermissionForm({ state: true, payload: entry }),
				});
			}
			if (userCan("permissionUpdatePermissionUsers")) {
				permittedActions.push({
					type: "edit-users",
					action: (entry: any) => console.log(entry),
				});
			}
			if (userCan("permissionDelete")) {
				permittedActions.push({
					type: "delete",
					withConfirmation: true,
					action: (entry: any) => deletePermission(entry.id),
				});
			}
			return permittedActions;
		}
		return [];
	}, [data, userCan, deletePermission]);

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
				<title>Temat | Permissions</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Permissions
						</Heading>
					</Flex.Col>
					{userCan("permissionCreate") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowPermissionForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
				<ZoomPortal in={showPermissionForm.state}>
					<PermissionsForm onClose={closePermissionsForm} payload={showPermissionForm.payload} />
				</ZoomPortal>
				<SlideIn position='right' in={showFilters}>
					<PermissionsDrawer onClose={closeFilters} />
				</SlideIn>
				<SlideIn position='right' in={viewPermission.state}>
					<PermissionsViewDrawer onClose={closePermissionView} payload={viewPermission.payload} />
				</SlideIn>
			</Suspense>
		</PageWrapper>
	);
};

export default UsersPage;
