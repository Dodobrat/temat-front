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

const OrderStepProducts = () => {
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useOrdersContext();

	const [selectError, setSelectError] = useState(null);

	const handleOnChangeRoles = (option: any) => {
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
		const newProductList = data.products.filter((item) => item.value !== product.value);

		setData((prev: any) => ({
			...prev,
			products: [...newProductList],
		}));
	};
	const increaseProductQty = (product) => {
		const newProductList = data.products.map((item) =>
			item.value === product.value ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
		);

		setData((prev: any) => ({
			...prev,
			products: [...newProductList],
		}));
	};
	const decreaseProductQty = (product) => {
		const newProductList = data.products.map((item) =>
			item.value === product.value ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
		);

		setData((prev: any) => ({
			...prev,
			products: [...newProductList],
		}));
	};
	const specificProductQty = (target, product) => {
		let tmp = Math.min(target.value, 99);

		const newProductList = data.products.map((item) => (item.value === product.value ? { ...item, quantity: Math.max(tmp, 1) } : item));

		setData((prev: any) => ({
			...prev,
			products: [...newProductList],
		}));
	};

	return (
		<>
			{data.products.length > 0 && (
				<ListGroup elevation='none' className='my--2'>
					{data.products.map((product) => (
						<ListGroup.Item key={product.value} className='px--2'>
							<Flex align='center' wrap={{ base: "wrap", sm: "nowrap" }}>
								<Flex.Col className='temat__table__img'>
									<Image imgSrc={product?.data?.image} alt={product?.data?.description ?? product?.label} />
								</Flex.Col>
								<Flex.Col>{product?.label}</Flex.Col>
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
												value={product?.quantity}
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
					))}
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
					isMulti
					isClearable={false}
					value={data.products}
					onChange={handleOnChangeRoles}
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
