import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { FormControl, ListGroup, Flex, Button, InputComponent } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useProducts } from "../../../../actions/fetchHooks";

import { IconTrash } from "../../../../components/ui/icons";
import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";
import Image from "../../../../components/ui/Image";
interface Props {
	initialData?: any;
	formProps: any;
	useContext?: any;
	payment?: any;
	companyId?: any;
	selectProps?: any;
}

const OrderStepProducts = ({
	selectProps,
	payment,
	companyId,
	initialData,
	formProps: { control, errors, watch, setValue, clearErrors },
}: Props) => {
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

	const specificProductValue = useCallback(
		(target, product, key) => {
			const newProductList = watchProducts.map((item) => {
				const IteratedUniqueId = item?.data?.id ?? item?.productId;
				const ProductUniqueId = product?.data?.id ?? product?.productId;

				if (IteratedUniqueId === ProductUniqueId) {
					return { ...item, [key]: target.value };
				}
				return item;
			});

			setValue("products", [...newProductList]);
		},
		[setValue, watchProducts]
	);

	const innerSetCompanyId = companyId || watchProducts?.payment?.companyId?.value || watchProducts?.payment?.companyId;

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
							currency: product?.currency ?? "????",
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
											<Flex.Col col='auto' className='pr--3'>
												<Flex wrap='nowrap' align='center'>
													<Flex.Col col='auto'>
														<InputComponent
															type='number'
															step='0.01'
															style={{ width: "4rem" }}
															defaultValue={productEntry?.price}
															onFocus={(e) => e.target.select()}
															onChange={({ target }) => specificProductValue(target, product, "price")}
														/>
													</Flex.Col>
													<Flex.Col col='auto'>{productEntry?.currency}</Flex.Col>
												</Flex>
											</Flex.Col>
											<Flex.Col col='auto' className='px--1'>
												<Flex wrap='nowrap' align='center'>
													<Flex.Col col='auto'>
														<InputComponent
															type='number'
															style={{ width: "4rem" }}
															defaultValue={productEntry?.qty}
															onFocus={(e) => e.target.select()}
															onChange={({ target }) => specificProductValue(target, product, "quantity")}
														/>
													</Flex.Col>
													<Flex.Col col='auto'>{t("common.qty")}</Flex.Col>
												</Flex>
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
				label={t("field.product", { count: 0 })}
				htmlFor='pickProduct'
				className={cn({
					"text--danger": errors?.products,
				})}
				hintMsg={errors?.products?.message}>
				<Controller
					render={({ field }) => {
						field.onChange = handleOnChange;

						return (
							<WindowedAsyncSelect
								inputId='pickProduct'
								useFetch={useProducts}
								queryFilters={{
									companyId: innerSetCompanyId,
								}}
								controlShouldRenderValue={false}
								isMulti
								isClearable={false}
								className={cn("temat__select__phantom__values", {
									"temat__select__container--danger": errors?.products,
								})}
								placeholder={t("field.select", { field: t("field.product", { count: 0 }) })}
								{...selectProps}
								{...field}
							/>
						);
					}}
					name='products'
					control={control}
					defaultValue={[]}
					rules={{
						validate: (val) => (Array.isArray(val) && val.length === 0 ? t("validation.required") : true),
					}}
				/>
			</FormControl>
		</>
	);
};

export default OrderStepProducts;
