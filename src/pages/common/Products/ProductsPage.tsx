import { useEffect, useState, Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { Flex, Heading, Button, PortalWrapper, ZoomPortal, SlideIn } from "@dodobrat/react-ui-kit";

import { useProducts } from "../../../actions/fetchHooks";
import { useProductDelete, useProductUpdate } from "../../../actions/mutateHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import { useAuthContext } from "../../../context/AuthContext";

import {
	IconAdd,
	// IconFilter,
} from "../../../components/ui/icons";
import DataTable from "../../../components/util/DataTable";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";

import { successToast } from "../../../helpers/toastEmitter";
import { parseDefaultValues } from "../../../helpers/formValidations";
import { useTranslation } from "react-i18next";
import TableSearch from "../../../components/util/TableSearch";

const ProductsForm = lazy(() => import("./ProductsForm"));
const ProductsDrawer = lazy(() => import("./ProductsDrawer"));

const ProductsPage = () => {
	const datatableHeader = document.getElementById("datatable__header");

	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const { mutate: deleteProduct } = useProductDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("products");
			},
		},
	});

	const { mutate: updateProductStatus } = useProductUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("products");
			},
		},
	});

	const {
		tableProps,
		state: { setQueryParams },
	} = useDataTableGenerate({
		useFetch: useProducts,
		columns: [
			{
				type: "Switch",
				action: ({ value, entry }) => {
					const formData = new FormData();
					formData.append("active", value);
					const data = { id: entry.id, formData };
					updateProductStatus(data);
				},
			},
		],
		actions: [
			{
				permission: ["productReadSingle", "productReadSingleTheir"],
				type: "view",
				props: (entry) => ({
					as: Link,
					to: `/app/products/${entry.id}`,
				}),
			},
			{
				permission: ["productUpdate", "productUpdateTheir"],
				type: "edit",
				action: (entry: any) => setShowProductForm({ state: true, payload: parseDefaultValues(entry) }),
			},
			{
				permission: ["productDelete", "productDeleteTheir"],
				type: "delete",
				withConfirmation: true,
				action: (entry: any) => deleteProduct(entry.id),
			},
		],
	});

	const [debouncedSearchString, setDebouncedSearchString] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [showProductForm, setShowProductForm] = useState({ state: false, payload: null });

	const closeFilters = () => setShowFilters(false);
	const closeProductsForm = () => setShowProductForm((prev) => ({ ...prev, state: false }));

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
					{process.env.REACT_APP_NAME} | {t("common.product", { count: 0 })}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.product", { count: 0 })}
						</Heading>
					</Flex.Col>
					{userCan(["productCreate", "productCreateTheir"]) && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowProductForm({ state: true, payload: null })} iconStart={<IconAdd />}>
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
				<ZoomPortal in={showProductForm.state}>
					<ProductsForm onClose={closeProductsForm} payload={showProductForm.payload} />
				</ZoomPortal>
				<SlideIn position='right' in={showFilters}>
					<ProductsDrawer onClose={closeFilters} />
				</SlideIn>
			</Suspense>
		</PageWrapper>
	);
};

export default ProductsPage;
