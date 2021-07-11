import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { Heading } from "@dodobrat/react-ui-kit";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import { useAuth } from "../../../context/AuthContext";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useUsers } from "../../../actions/fetchHooks";
import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { useUserDelete } from "../../../actions/mutateHooks";
import { useDebounce } from "@dodobrat/react-ui-kit";
import { ResponseColumnType } from "../../../types/global.types";
import { Link } from "react-router-dom";
import { Flex } from "@dodobrat/react-ui-kit";
import { Button } from "@dodobrat/react-ui-kit";
import { IconAdd, IconErrorCircle, IconFilter } from "../../../components/ui/icons";
import DataTable from "../../../components/util/DataTable";
import { PortalWrapper } from "@dodobrat/react-ui-kit";
import { Input } from "@dodobrat/react-ui-kit";
import { Tooltip } from "@dodobrat/react-ui-kit";
import { ZoomPortal } from "@dodobrat/react-ui-kit";
import { SlideIn } from "@dodobrat/react-ui-kit";

const UsersForm = lazy(() => import("./UsersForm"));
const UsersDrawer = lazy(() => import("./UsersDrawer"));

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
	const [showUsersForm, setShowUsersForm] = useState({ state: false, payload: null });
	const [showFilters, setShowFilters] = useState(false);

	const closeUsersForm = () => setShowUsersForm((prev) => ({ ...prev, state: false }));
	const closeFilters = () => setShowFilters(false);

	const { data, refetch, isFetching, isStale } = useUsers({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => errorToast(err),
		},
		specialKey: queryParams,
	});

	const { mutate: deleteUser } = useUserDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("users");
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

			if (userCan("userReadSingle")) {
				permittedActions.push({
					type: "view",
					props: (entry) => ({
						as: Link,
						to: `/app/users/${entry.id}`,
					}),
				});
			}
			if (userCan("userUpdatePersonal") || userCan("userUpdateLogin")) {
				permittedActions.push({
					type: "edit",
					action: (entry: any) => setShowUsersForm({ state: true, payload: entry }),
				});
			}
			if (userCan("userDelete")) {
				permittedActions.push({
					type: "delete",
					withConfirmation: true,
					action: (entry: any) => deleteUser(entry.id),
				});
			}
			return permittedActions;
		}
		return [];
	}, [data, userCan, deleteUser]);

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
				<title>Temat | Users</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Users
						</Heading>
					</Flex.Col>
					{userCan("userCreate") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowUsersForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
				<ZoomPortal in={showUsersForm.state}>
					<UsersForm onClose={closeUsersForm} payload={showUsersForm.payload} />
				</ZoomPortal>
				<SlideIn position='right' in={showFilters}>
					<UsersDrawer onClose={closeFilters} />
				</SlideIn>
			</Suspense>
		</PageWrapper>
	);
};

export default UsersPage;
