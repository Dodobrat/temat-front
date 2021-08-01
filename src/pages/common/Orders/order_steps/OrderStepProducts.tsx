import { useTranslation } from "react-i18next";
import { FormControl } from "@dodobrat/react-ui-kit";
import cn from "classnames";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { useState } from "react";
import { useOrdersContext } from "../../../../context/OrdersContext";
import { useProducts } from "../../../../actions/fetchHooks";
import { ListGroup } from "@dodobrat/react-ui-kit";
import { Flex } from "@dodobrat/react-ui-kit";
import Image from "../../../../components/ui/Image";
import { Button } from "@dodobrat/react-ui-kit";
import { IconAdd, IconMinus, IconTrash } from "../../../../components/ui/icons";
import { Input } from "@dodobrat/react-ui-kit";

const OrderStepProducts = ({ useContext = useOrdersContext }) => {
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useContext();

	const [selectError, setSelectError] = useState(null);

	const handleOnChangeProducts = (option: any) => {
		const optionsWithQuantity = option.map((item) => (!!item?.quantity ? item : { ...item, quantity: 1 }));

		setData((prev: any) => ({
			...prev,
			products: [...optionsWithQuantity],
		}));
		if (selectError && option) {
			setSelectError(null);
		}
	};

	const removeProductFromList = (product) => {
		const newProductList = data.products.filter((item) => {
			const IteratedUniqueId = item?.data?.id ?? item?.productId;
			const ProductUniqueId = product?.data?.id ?? product?.productId;

			return IteratedUniqueId !== ProductUniqueId;
		});

		setData((prev: any) => ({
			...prev,
			products: [...newProductList],
		}));
	};

	const increaseProductQty = (product) => {
		const newProductList = data.products.map((item) => {
			const IteratedUniqueId = item?.data?.id ?? item?.productId;
			const ProductUniqueId = product?.data?.id ?? product?.productId;
			const ItemQty = item?.quantity ?? item?.required;

			if (IteratedUniqueId === ProductUniqueId) {
				return { ...item, quantity: Math.min(ItemQty + 1, 99) };
			}
			return item;
		});

		setData((prev: any) => ({
			...prev,
			products: [...newProductList],
		}));
	};

	const decreaseProductQty = (product) => {
		const newProductList = data.products.map((item) => {
			const IteratedUniqueId = item?.data?.id ?? item?.productId;
			const ProductUniqueId = product?.data?.id ?? product?.productId;
			const ItemQty = item?.quantity ?? item?.required;

			if (IteratedUniqueId === ProductUniqueId) {
				return { ...item, quantity: Math.max(ItemQty - 1, 1) };
			}
			return item;
		});

		setData((prev: any) => ({
			...prev,
			products: [...newProductList],
		}));
	};

	const specificProductQty = (target, product) => {
		let tmp = Math.min(target.value, 99);

		const newProductList = data.products.map((item) => {
			const IteratedUniqueId = item?.data?.id ?? item?.productId;
			const ProductUniqueId = product?.data?.id ?? product?.productId;

			if (IteratedUniqueId === ProductUniqueId) {
				return { ...item, quantity: Math.max(tmp, 1) };
			}
			return item;
		});

		setData((prev: any) => ({
			...prev,
			products: [...newProductList],
		}));
	};

	return (
		<>
			{data.products?.length > 0 && (
				<ListGroup elevation='none' className='my--2 outline'>
					{data.products.map((product) => {
						const productEntry = {
							key: product?.productId ?? product?.data?.id,
							image: product?.image ?? product?.data?.image,
							imageAlt: product?.data?.description ?? product?.description,
							name: product?.name ?? product?.label,
							qty: product?.quantity ?? product?.required,
						};

						console.log(product);
						return (
							<ListGroup.Item key={productEntry.key} className='px--2'>
								<Flex align='center' wrap={{ base: "wrap", sm: "nowrap" }}>
									<Flex.Col className='temat__table__img'>
										<Image imgSrc={productEntry.image} alt={productEntry.imageAlt} />
									</Flex.Col>
									<Flex.Col>{productEntry.name}</Flex.Col>
									<Flex.Col col={{ base: "12", sm: "auto" }}>
										<Flex wrap='nowrap' align='center' spacingX={null} spacingY={null}>
											<Flex.Col
												col='auto'
												as={Button}
												equalDimensions
												pigment={null}
												pigmentColor='danger'
												onClick={() => decreaseProductQty(product)}>
												<IconMinus />
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
											<Flex.Col
												col='auto'
												as={Button}
												equalDimensions
												pigment={null}
												pigmentColor='primary'
												onClick={() => increaseProductQty(product)}>
												<IconAdd />
											</Flex.Col>
											<Flex.Col col='auto' className='pl--1 ml--base--auto ml--sm--0'>
												<Button equalDimensions pigment='danger' onClick={() => removeProductFromList(product)}>
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
					"text--danger": selectError,
				})}
				hintMsg={selectError?.message}>
				<AsyncSelect
					useFetch={useProducts}
					querySpecs={{
						filters: {
							companyId: data?.payment?.companyId?.value ?? data?.payment?.companyId,
						},
					}}
					isMulti
					isClearable={false}
					value={data.products}
					onChange={handleOnChangeProducts}
					className={cn("temat__select__phantom__values", {
						"temat__select__container--danger": selectError,
					})}
					placeholder='Pick Product'
				/>
			</FormControl>
		</>
	);
};

export default OrderStepProducts;
