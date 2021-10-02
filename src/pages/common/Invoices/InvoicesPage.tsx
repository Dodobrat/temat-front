import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Helmet } from "react-helmet";
import { Text, Card, Portal, ZoomPortal, Flex, Heading, PortalWrapper, Button } from "@dodobrat/react-ui-kit";

import { useInvoicePDF, useInvoices } from "../../../actions/fetchHooks";
import { useAuthContext } from "../../../context/AuthContext";

import { IconAdd, IconClose } from "../../../components/ui/icons";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import DataTable from "../../../components/util/DataTable";
import TableSearch from "../../../components/util/TableSearch";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";
import { useInvoiceDelete } from "../../../actions/mutateHooks";
import { successToast } from "../../../helpers/toastEmitter";
import { parseBaseLink } from "../../../helpers/helpers";

const InvoicesForm = lazy(() => import("./InvoicesForm"));

const InvoicesPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const { mutate: deleteInvoice } = useInvoiceDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("invoices");
			},
		},
	});

	const {
		tableProps,
		state: { setQueryParams },
	} = useDataTableGenerate({
		useFetch: useInvoices,
		actions: [
			{
				permission: ["invoiceReadSingle", "invoiceReadSingleTheir"],
				type: "view",
				action: (entry: any) => setInvoice(entry),
			},
			{
				permission: ["invoiceDelete", "invoiceDeleteTheir"],
				type: "delete",
				withConfirmation: true,
				action: (entry: any) => deleteInvoice(entry.id),
			},
		],
	});

	const [debouncedSearchString, setDebouncedSearchString] = useState("");
	const [showInvoiceForm, setShowInvoiceForm] = useState({ state: false, payload: null });
	const [showInvoice, setShowInvoice] = useState({ state: false, payload: null });
	const [invoice, setInvoice] = useState<any>();

	const closeInvoicesForm = () => setShowInvoiceForm((prev) => ({ ...prev, state: false }));
	const closeInvoices = () => setShowInvoice((prev) => ({ ...prev, state: false }));

	const {
		data: invoicePDF,
		isStale,
		refetch: getInvoicePDF,
	} = useInvoicePDF({
		specialKey: { id: invoice?.id },
	});

	useEffect(() => {
		if (invoice && isStale) {
			getInvoicePDF();
		}
	}, [invoice, isStale, getInvoicePDF]);

	useEffect(() => {
		if (invoicePDF) {
			setShowInvoice((prev) => ({
				...prev,
				payload: (
					<iframe
						title='invoice_pdf'
						width='100%'
						height='100%'
						style={{ border: "none", minHeight: "60vh" }}
						src={parseBaseLink(invoicePDF)}
					/>
				),
			}));
		}
	}, [invoicePDF]);

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
					{process.env.REACT_APP_NAME} | {t("common.invoice", { count: 0 })}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.invoice", { count: 0 })}
						</Heading>
					</Flex.Col>
					{userCan(["invoiceCreate", "invoiceCreateTheir"]) && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowInvoiceForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
			<Portal animation='zoom' sizing='lg' isOpen={showInvoice.state} onClose={closeInvoices} onOutsideClick={closeInvoices}>
				<Card>
					<Card.Header
						actions={
							<Button equalDimensions sizing='sm' onClick={closeInvoices} pigment='default'>
								<IconClose />
							</Button>
						}>
						<Text className='mb--0'>{t("action.download", { entry: t("field.file") })}</Text>
					</Card.Header>
					<Card.Body>{showInvoice.payload}</Card.Body>
				</Card>
			</Portal>
			<Suspense fallback={<div />}>
				<ZoomPortal in={showInvoiceForm.state}>
					<InvoicesForm onClose={closeInvoicesForm} payload={showInvoiceForm.payload} />
				</ZoomPortal>
			</Suspense>
		</PageWrapper>
	);
};

export default InvoicesPage;
