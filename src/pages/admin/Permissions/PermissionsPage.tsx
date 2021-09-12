import { useEffect, useState, Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import { Heading, Flex, Button, PortalWrapper, Input, Tooltip, ZoomPortal, useDebounce, SlideIn } from "@dodobrat/react-ui-kit";

import { usePermissions } from "../../../actions/fetchHooks";
import { usePermissionDelete, usePermissionUpdate } from "../../../actions/mutateHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import { useAuthContext } from "../../../context/AuthContext";
import { successToast } from "../../../helpers/toastEmitter";

import {
	IconAdd,
	// IconFilter,
	IconErrorCircle,
	IconSearch,
} from "../../../components/ui/icons";
import DataTable from "../../../components/util/DataTable";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";
import { useTranslation } from "react-i18next";

const PermissionsForm = lazy(() => import("./PermissionsForm"));
const PermissionsDrawer = lazy(() => import("./PermissionsDrawer"));
const PermissionsViewDrawer = lazy(() => import("./PermissionsViewDrawer"));

const UsersPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const { mutate: deletePermission } = usePermissionDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("permissions");
			},
		},
	});

	const { mutate: updatePermissionStatus } = usePermissionUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("permissions");
			},
		},
	});

	const {
		tableProps,
		state: { setQueryParams },
	} = useDataTableGenerate({
		useFetch: usePermissions,
		columns: [
			{
				type: "Switch",
				action: ({ value, entry }) => {
					const data = { id: entry.id, active: value };
					updatePermissionStatus(data);
				},
			},
		],
		actions: [
			{
				permission: "permissionReadSingle",
				type: "view",
				action: (entry: any) => setViewPermission({ state: true, payload: entry }),
			},
			{
				permission: "permissionUpdate",
				type: "edit",
				action: (entry: any) => setShowPermissionForm({ state: true, payload: entry }),
			},
			{
				permission: "permissionDelete",
				type: "delete",
				withConfirmation: true,
				action: (entry: any) => deletePermission(entry.id),
			},
		],
	});

	const [searchString, setSearchString] = useState("");
	const [searchStringError, setSearchStringError] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [showPermissionForm, setShowPermissionForm] = useState({ state: false, payload: null });
	const [viewPermission, setViewPermission] = useState({ state: false, payload: null });

	const closeFilters = () => setShowFilters(false);
	const closePermissionsForm = () => setShowPermissionForm((prev) => ({ ...prev, state: false }));
	const closePermissionView = () => setViewPermission((prev) => ({ ...prev, state: false }));

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
				<title>
					{process.env.REACT_APP_NAME} | {t("common.permission", { count: 0 })}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.permission", { count: 0 })}
						</Heading>
					</Flex.Col>
					{userCan("permissionCreate") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowPermissionForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
