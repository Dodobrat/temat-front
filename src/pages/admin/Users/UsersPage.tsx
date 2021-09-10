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

import {
	IconAdd,
	IconErrorCircle,
	// IconFilter,
	IconSearch,
} from "../../../components/ui/icons";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import DataTable from "../../../components/util/DataTable";

import { parseDefaultValues } from "../../../helpers/formValidations";
import { useTranslation } from "react-i18next";

const UsersForm = lazy(() => import("./user_forms/UsersForm"));
const UsersUpdateForm = lazy(() => import("./user_forms/UsersUpdateForm"));
const UsersDrawer = lazy(() => import("./UsersDrawer"));

const UsersPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const { t } = useTranslation();
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
				action: (entry: any) => setShowUsersUpdateForm({ state: true, payload: parseDefaultValues(entry) }),
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
	const [showUsersForm, setShowUsersForm] = useState({ state: false });
	const [showUsersUpdateForm, setShowUsersUpdateForm] = useState({ state: false, payload: null });
	const [showFilters, setShowFilters] = useState(false);

	const closeUsersForm = () => setShowUsersForm({ state: false });
	const closeUsersUpdateForm = () => setShowUsersUpdateForm((prev) => ({ ...prev, state: false }));
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
				<title>Temat | {t("common.company", { count: 0 })}</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.company", { count: 0 })}
						</Heading>
					</Flex.Col>
					{userCan("userCreate") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowUsersForm({ state: true })} iconStart={<IconAdd />}>
								{t("action.add")}
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
								placeholder={t("common.searchBy", { keyword: t("field.name") })}
								value={searchString}
								onChange={handleOnSearchChange}
								pigment={searchStringError ? "danger" : "primary"}
								preffix={<IconSearch className='dui__icon' />}
								suffix={
									searchStringError && (
										<Tooltip content={t("validation.minLength", { value: 2 })}>
											<div>
												<IconErrorCircle className='text--danger dui__icon' />
											</div>
										</Tooltip>
									)
								}
							/>
						</Flex.Col>
						{/* <Flex.Col col='auto'>
							<Button pigment='warning' onClick={() => setShowFilters(true)} iconStart={<IconFilter />}>
								{t("common.filter", { count: 0 })}
							</Button>
						</Flex.Col> */}
					</Flex>
				</PortalWrapper>
				<DataTable {...tableProps} />
			</PageContent>
			<Suspense fallback={<div />}>
				<ZoomPortal in={showUsersUpdateForm.state}>
					<UsersUpdateForm onClose={closeUsersUpdateForm} payload={showUsersUpdateForm.payload} />
				</ZoomPortal>
				<ZoomPortal in={showUsersForm.state}>
					<UsersForm onClose={closeUsersForm} />
				</ZoomPortal>
				<SlideIn position='right' in={showFilters}>
					<UsersDrawer onClose={closeFilters} />
				</SlideIn>
			</Suspense>
		</PageWrapper>
	);
};

export default UsersPage;
