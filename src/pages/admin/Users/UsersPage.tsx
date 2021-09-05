import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";

import { PortalWrapper, Input, Tooltip, SlideIn, ZoomPortal, Heading, Flex, Button, useDebounce } from "@dodobrat/react-ui-kit";

import { useAuthContext } from "../../../context/AuthContext";
import { errorToast, successToast } from "../../../helpers/toastEmitter";

import { useUsers } from "../../../actions/fetchHooks";
import { useUserCredentialsUpdate, useUserDelete } from "../../../actions/mutateHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import { IconAdd, IconErrorCircle, IconFilter, IconSearch } from "../../../components/ui/icons";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import DataTable from "../../../components/util/DataTable";

import { parseDefaultValues } from "../../../helpers/formValidations";

const UsersForm = lazy(() => import("./UsersForm"));
const UsersDrawer = lazy(() => import("./UsersDrawer"));

const UsersPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const { mutate: updateUserStatus } = useUserCredentialsUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("users");
			},
			onError: (err: any) => errorToast(err),
		},
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

	const {
		tableProps,
		state: { setQueryParams },
	} = useDataTableGenerate({
		useFetch: useUsers,
		columns: [
			{
				type: "Switch",
				action: ({ value, entry }) => {
					const formData = new FormData();
					formData.append("active", value);
					const data = { id: entry?.id, formData };
					updateUserStatus(data);
				},
			},
		],
		actions: [
			{
				permission: "userReadSingle",
				type: "view",
				props: (entry) => ({
					as: Link,
					to: `/app/users/${entry.id}`,
				}),
			},
			{
				permission: ["userUpdatePersonal", "userUpdateLogin"],
				type: "edit",
				action: (entry: any) => setShowUsersForm({ state: true, payload: parseDefaultValues(entry) }),
			},
			{
				permission: "userDelete",
				type: "delete",
				withConfirmation: true,
				action: (entry: any) => deleteUser(entry.id),
			},
		],
	});

	const [searchString, setSearchString] = useState("");
	const [searchStringError, setSearchStringError] = useState(false);
	const [showUsersForm, setShowUsersForm] = useState({ state: false, payload: null });
	const [showFilters, setShowFilters] = useState(false);

	const closeUsersForm = () => setShowUsersForm((prev) => ({ ...prev, state: false }));
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
								preffix={<IconSearch className='dui__icon' />}
								suffix={
									searchStringError && (
										<Tooltip content={"Minimum 2 characters"}>
											<div>
												<IconErrorCircle className='text--danger dui__icon' />
											</div>
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
