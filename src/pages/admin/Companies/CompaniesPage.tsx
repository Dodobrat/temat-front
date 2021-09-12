import { useEffect, useState, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useQueryClient } from "react-query";
import { Heading, Flex, Button, ZoomPortal, SlideIn, useDebounce, PortalWrapper, Input, Tooltip } from "@dodobrat/react-ui-kit";

import { useCompanies } from "../../../actions/fetchHooks";
import { useCompanyDelete, useCompanyUpdate } from "../../../actions/mutateHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import { useAuthContext } from "../../../context/AuthContext";
import { successToast } from "../../../helpers/toastEmitter";

import {
	IconAdd,
	IconErrorCircle,
	// IconFilter,
	IconSearch,
} from "../../../components/ui/icons";
import DataTable from "../../../components/util/DataTable";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";

const CompaniesForm = lazy(() => import("./CompaniesForm"));
const CompaniesDrawer = lazy(() => import("./CompaniesDrawer"));

const CompaniesPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const { mutate: deleteCompany } = useCompanyDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("companies");
			},
		},
	});

	const { mutate: updateCompanyStatus } = useCompanyUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("companies");
			},
		},
	});

	const {
		tableProps,
		state: { setQueryParams },
	} = useDataTableGenerate({
		useFetch: useCompanies,
		columns: [
			{
				type: "Switch",
				action: ({ value, entry }) => {
					const formData = new FormData();
					formData.append("active", value);
					const data = { id: entry.id, formData };
					updateCompanyStatus(data);
				},
			},
		],
		actions: [
			{
				permission: "companyReadSingle",
				type: "view",
				props: (entry) => ({
					as: Link,
					to: `/app/companies/${entry.id}`,
				}),
			},
			{
				permission: "companyUpdate",
				type: "edit",
				action: (entry: any) => setShowCompaniesForm({ state: true, payload: entry }),
			},
			{
				permission: "companyDelete",
				type: "delete",
				withConfirmation: true,
				action: (entry: any) => deleteCompany(entry.id),
			},
		],
	});

	const [searchString, setSearchString] = useState("");
	const [searchStringError, setSearchStringError] = useState(false);
	const [showCompaniesForm, setShowCompaniesForm] = useState({ state: false, payload: null });
	const [showFilters, setShowFilters] = useState(false);

	const closeCompaniesForm = () => setShowCompaniesForm((prev) => ({ ...prev, state: false }));
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
				<title>
					{process.env.REACT_APP_NAME} | {t("common.company", { count: 0 })}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.company", { count: 0 })}
						</Heading>
					</Flex.Col>
					{userCan("companyCreate") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowCompaniesForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
