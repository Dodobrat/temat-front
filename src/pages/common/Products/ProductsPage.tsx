import { useEffect, useState, Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useDebounce, Flex, Heading, Button, PortalWrapper, Input, Tooltip, ZoomPortal, SlideIn } from "@dodobrat/react-ui-kit";

import { useProducts } from "../../../actions/fetchHooks";
import { useProductDelete, useProductUpdate } from "../../../actions/mutateHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import { useAuthContext } from "../../../context/AuthContext";

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

import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { parseDefaultValues } from "../../../helpers/formValidations";
import { useTranslation } from "react-i18next";

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
			onError: (err: any) => errorToast(err),
		},
	});

	const { mutate: updateProductStatus } = useProductUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("products");
			},
			onError: (err: any) => errorToast(err),
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

	const [searchString, setSearchString] = useState("");
	const [searchStringError, setSearchStringError] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [showProductForm, setShowProductForm] = useState({ state: false, payload: null });

	const closeFilters = () => setShowFilters(false);
	const closeProductsForm = () => setShowProductForm((prev) => ({ ...prev, state: false }));

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
				<title>Temat | {t("common.product", { count: 0 })}</title>
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
