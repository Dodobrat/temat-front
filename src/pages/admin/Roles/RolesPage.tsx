import { useCallback, useEffect, useMemo, useState, Suspense, lazy } from "react";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { useQueryClient } from "react-query";
import { useRoles } from "../../../actions/fetchHooks";
import { useAuth } from "../../../context/AuthContext";
import { IconAdd } from "../../../components/ui/icons/index";
import { SlideIn } from "@dodobrat/react-ui-kit";
import DataTable from "../../../components/util/DataTable";
import { Helmet } from "react-helmet";
import { Heading, Flex, Button, ZoomPortal } from "@dodobrat/react-ui-kit";
import { useRoleDelete } from "../../../actions/mutateHooks";

const RolesForm = lazy(() => import("./RolesForm"));
const RolesViewDrawer = lazy(() => import("./RolesViewDrawer"));

const RolesPage = () => {
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
	const [showRolesForm, setShowRolesForm] = useState({ state: false, payload: null });
	const [viewRole, setViewRole] = useState({ state: false, payload: null });

	const closeRolesForm = () => setShowRolesForm((prev) => ({ ...prev, state: false }));
	const closeRoleView = () => setViewRole((prev) => ({ ...prev, state: false }));

	const { data, refetch, isFetching, isStale } = useRoles({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => console.log(err),
		},
		specialKey: queryParams,
	});

	const { mutate: deleteRole } = useRoleDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				console.log(res);
				queryClient.invalidateQueries("roles");
			},
			onError: (err: any) => console.log(err),
		},
	});

	const fetchedData = useMemo(() => data?.data ?? [], [data]);
	const fetchedMeta = useMemo(() => data?.meta ?? null, [data]);

	const columns = useMemo(() => {
		if (data) {
			return data.columns.map((col: { accessor: string; title: string; canSort: boolean; type?: string; id?: string }) => {
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

			if (userCan("userRoleView")) {
				permittedActions.push({
					type: "view",
					action: (entry: any) => setViewRole({ state: true, payload: entry }),
				});
			}
			if (userCan("userRoleEdit")) {
				permittedActions.push({
					type: "edit",
					action: (entry: any) => setShowRolesForm({ state: true, payload: entry }),
				});
			}
			if (userCan("userRoleDelete")) {
				permittedActions.push({
					type: "delete",
					action: (entry: any) => deleteRole(entry.id),
				});
			}
			return permittedActions;
		}
		return [];
	}, [data, userCan, deleteRole]);

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
				<title>Temat | Roles</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Roles
						</Heading>
					</Flex.Col>
					{userCan("userRoleAdd") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowRolesForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
				<ZoomPortal in={showRolesForm.state}>
					<RolesForm onClose={closeRolesForm} payload={showRolesForm.payload} />
				</ZoomPortal>
				<SlideIn position='right' in={viewRole.state}>
					<RolesViewDrawer onClose={closeRoleView} payload={viewRole.payload} />
				</SlideIn>
			</Suspense>
		</PageWrapper>
	);
};

export default RolesPage;
