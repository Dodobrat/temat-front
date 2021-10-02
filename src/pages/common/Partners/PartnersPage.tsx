import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Heading, Flex, Button, ZoomPortal, PortalWrapper } from "@dodobrat/react-ui-kit";

import { usePartners } from "../../../actions/fetchHooks";
import { usePartnerDelete } from "../../../actions/mutateHooks";

import { useAuthContext } from "../../../context/AuthContext";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import { IconAdd } from "../../../components/ui/icons";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import DataTable from "../../../components/util/DataTable";

import { successToast } from "../../../helpers/toastEmitter";
import TableSearch from "../../../components/util/TableSearch";
import { parseDefaultValues } from "../../../helpers/formValidations";

const PartnersForm = lazy(() => import("./PartnersForm"));

const PartnersPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const { mutate: deletePartner } = usePartnerDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("partners");
			},
		},
	});

	const {
		tableProps,
		state: { setQueryParams },
	} = useDataTableGenerate({
		useFetch: usePartners,
		actions: [
			{
				permission: ["partnerReadSingle", "partnerReadSingleTheir"],
				type: "view",
				props: (entry) => ({
					as: Link,
					to: `/app/partners/${entry.id}`,
				}),
			},
			{
				permission: ["partnerUpdate", "partnerUpdateTheir"],
				type: "edit",
				action: (entry: any) => setShowPartnerForm({ state: true, payload: parseDefaultValues(entry) }),
			},
			{
				permission: ["partnerDelete", "partnerDeleteTheir"],
				type: "delete",
				withConfirmation: true,
				action: (entry: any) => deletePartner(entry.id),
			},
		],
	});

	const [debouncedSearchString, setDebouncedSearchString] = useState("");
	const [showPartnerForm, setShowPartnerForm] = useState({ state: false, payload: null });
	const closePartnersForm = () => setShowPartnerForm((prev) => ({ ...prev, state: false }));

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
					{process.env.REACT_APP_NAME} | {t("common.partner", { count: 0 })}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.partner", { count: 0 })}
						</Heading>
					</Flex.Col>
					{userCan(["partnerCreate", "partnerCreateTheir"]) && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowPartnerForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
							<TableSearch onSearch={(val) => setDebouncedSearchString(val)} />
						</Flex.Col>
					</Flex>
				</PortalWrapper>
				<DataTable {...tableProps} />
			</PageContent>
			<Suspense fallback={<div />}>
				<ZoomPortal in={showPartnerForm.state}>
					<PartnersForm onClose={closePartnersForm} payload={showPartnerForm.payload} />
				</ZoomPortal>
			</Suspense>
		</PageWrapper>
	);
};

export default PartnersPage;
