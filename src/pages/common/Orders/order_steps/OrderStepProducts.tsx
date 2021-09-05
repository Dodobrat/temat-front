import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { FormControl, ListGroup, Flex, Button, Input } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useProducts } from "../../../../actions/fetchHooks";

import {
	// IconAdd,
	// IconMinus,
	IconTrash,
} from "../../../../components/ui/icons";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import Image from "../../../../components/ui/Image";
interface Props {
	initialData?: any;
	formProps?: any;
	useContext?: any;
	payment?: any;
	companyId?: any;
}

const OrderStepProducts = ({ payment, companyId, initialData, formProps: { control, errors, watch, setValue, clearErrors } }: Props) => {
	const { t } = useTranslation();

	const watchProducts = watch("products", initialData);

	const handleOnChange = useCallback(
		(options) => {
			const optionsWithQuantity = options.map((item) =>
				!!item?.quantity
					? item
					: { ...item, quantity: 1, price: Number(item?.data?.price).toFixed(2), currency: payment?.currencyId?.data?.symbol }
			);

			if (options.length > 0) {
				clearErrors("products");
			}
			setValue("products", [...optionsWithQuantity]);
		},
		[setValue, clearErrors, payment]
	);

	const removeProductFromList = useCallback(
		(product) => {
			const newProductList = watchProducts.filter((item) => {
				const IteratedUniqueId = item?.data?.id ?? item?.productId;
				const ProductUniqueId = product?.data?.id ?? product?.productId;

				return IteratedUniqueId !== ProductUniqueId;
			});

			setValue("products", [...newProductList]);
		},
		[setValue, watchProducts]
	);

	const specificProductQty = useCallback(
		(target, product) => {
			let tmp = Math.min(target.value, 99);

			const newProductList = watchProducts.map((item) => {
				const IteratedUniqueId = item?.data?.id ?? item?.productId;
				const ProductUniqueId = product?.data?.id ?? product?.productId;

				if (IteratedUniqueId === ProductUniqueId) {
					return { ...item, quantity: Math.max(tmp, 1) };
				}
				return item;
			});

			setValue("products", [...newProductList]);
		},
		[setValue, watchProducts]
	);

	const specificProductPrice = useCallback(
		(target, product) => {
			const newProductList = watchProducts.map((item) => {
				const IteratedUniqueId = item?.data?.id ?? item?.productId;
				const ProductUniqueId = product?.data?.id ?? product?.productId;

				if (IteratedUniqueId === ProductUniqueId) {
					return { ...item, price: target.value };
				}
				return item;
			});

			setValue("products", [...newProductList]);
		},
		[setValue, watchProducts]
	);

	const innerSetCompanyId = watchProducts?.payment?.companyId?.value ?? watchProducts?.payment?.companyId;

	return (
		<>
			{watchProducts?.length > 0 && (
				<ListGroup elevation='none' className='my--2 outline'>
					{watchProducts.map((product) => {
						const productEntry = {
							key: product?.productId ?? product?.data?.id,
							image: product?.image ?? product?.data?.image,
							imageAlt: product?.data?.description ?? product?.description,
							name: product?.name ?? product?.label,
							qty: product?.quantity || product?.required || product?.expected,
							price: product?.price ?? product?.data?.price,
							currency: product?.currency ?? "лв",
						};

						return (
							<ListGroup.Item key={productEntry.key} className='px--2'>
								<Flex align='center' wrap={{ base: "wrap", sm: "nowrap" }}>
									<Flex.Col className='temat__table__img'>
										<Image imgSrc={productEntry.image} alt={productEntry.imageAlt} />
									</Flex.Col>
									<Flex.Col>{productEntry.name}</Flex.Col>
									<Flex.Col col={{ base: "12", sm: "auto" }}>
										<Flex wrap='nowrap' align='center' spacingX={null} spacingY={null}>
											<Flex.Col col='auto' className='pr--1'>
												<Input
													type='number'
													step='0.01'
													suffix={productEntry?.currency}
													style={{ width: "4rem" }}
													value={productEntry?.price}
													onChange={({ target }) => specificProductPrice(target, product)}
												/>
											</Flex.Col>
											<Flex.Col col='auto' className='px--1'>
												<Input
													type='number'
													preffix='Qty.'
													style={{ width: "4rem" }}
													value={productEntry?.qty}
													onChange={({ target }) => specificProductQty(target, product)}
												/>
											</Flex.Col>
											<Flex.Col col='auto' className='pl--1 ml--base--auto ml--sm--0'>
												<Button
													equalDimensions
													pigment='danger'
													type='button'
													onClick={() => removeProductFromList(product)}>
													<IconTrash />
												</Button>
											</Flex.Col>
										</Flex>
									</Flex.Col>
								</Flex>
							</ListGroup.Item>
						);
					})}
				</ListGroup>
			)}
			<FormControl
				label={t("orders.pickProduct")}
				htmlFor='pickProduct'
				className={cn({
					"text--danger": errors?.products,
				})}
				hintMsg={errors?.products?.message}>
				<Controller
					render={({ field }) => {
						field.onChange = handleOnChange;

						return (
							<AsyncSelect
								useFetch={useProducts}
								queryFilters={{
									companyId: companyId ?? innerSetCompanyId,
								}}
								isMulti
								isClearable={false}
								className={cn("temat__select__phantom__values", {
									"temat__select__container--danger": errors?.products,
								})}
								placeholder='Pick Product'
								{...field}
							/>
						);
					}}
					name='products'
					control={control}
					defaultValue={[]}
					rules={{
						validate: (val) => (Array.isArray(val) && val.length === 0 ? "Field is required" : true),
					}}
				/>
			</FormControl>
		</>
	);
};

export default memo(OrderStepProducts);
