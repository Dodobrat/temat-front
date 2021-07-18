import { useTranslation } from "react-i18next";
import { Flex, FormControl } from "@dodobrat/react-ui-kit";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { useOrdersContext } from "../../../../context/OrdersContext";
import cn from "classnames";
import { useDeliveryCities, useDeliveryCountries, useDeliveryMethods, useDeliveryOffices } from "../../../../actions/fetchHooks";
import { useEffect, useState } from "react";
import { Input } from "@dodobrat/react-ui-kit";
import { Heading } from "@dodobrat/react-ui-kit";
import { useMemo } from "react";

const receiverFields = ["receiverName", "receiverPhone"];

const ReceiverInputs = ({ fields = receiverFields, handleValueUpdate }) => {
	const { t } = useTranslation();

	const {
		dataValue: { data },
	} = useOrdersContext();

	return (
		<Flex.Col col='12'>
			<Flex disableNegativeSpace className='outline flavor--default p--1'>
				<Flex.Col col='12'>
					<Heading as='p' className='mb--0'>
						Receiver Details
					</Heading>
				</Flex.Col>
				{fields.map((field) => (
					<Flex.Col col={{ base: "12", sm: "6" }} key={field}>
						<FormControl label={t(`orders.${field}`)} htmlFor={field} className={cn("")} hintMsg={""}>
							<Input
								value={data.shipping[field]}
								onChange={({ target }) => handleValueUpdate(field, target.value)}
								placeholder={field}
							/>
						</FormControl>
					</Flex.Col>
				))}
			</Flex>
		</Flex.Col>
	);
};

const DeliveryAddress = ({ deliveryFields, handleValueUpdate }) => {
	const { t } = useTranslation();

	const {
		dataValue: { data },
	} = useOrdersContext();

	return (
		<Flex.Col col='12'>
			<Flex disableNegativeSpace className='outline flavor--default p--1'>
				<Flex.Col col='12'>
					<Heading as='p' className='mb--0'>
						Delivery Address
					</Heading>
				</Flex.Col>
				{deliveryFields.map((item) => {
					const { field, col, useFetch, querySpecs } = item;
					return (
						<Flex.Col col={col} key={field}>
							<FormControl label={t(`orders.${field}`)} htmlFor={field} className={cn("")} hintMsg={""}>
								{useFetch ? (
									<AsyncSelect
										querySpecs={querySpecs}
										useFetch={useFetch}
										value={data.shipping[field]}
										onChange={(option) => handleValueUpdate(field, option)}
									/>
								) : (
									<Input
										value={data.shipping[field]}
										onChange={({ target }) => handleValueUpdate(field, target.value)}
										placeholder={field}
									/>
								)}
							</FormControl>
						</Flex.Col>
					);
				})}
			</Flex>
		</Flex.Col>
	);
};

const OrderStepShipping = () => {
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useOrdersContext();

	const [courierName, setCourierName] = useState(null);
	const [deliveryType, setDeliveryType] = useState(null);

	const handleValueUpdate = (key, val) => {
		setData((prev) => ({
			...prev,
			shipping: {
				...prev.shipping,
				[key]: val,
			},
		}));
	};

	useEffect(() => {
		const deliveryOption = data.shipping?.delivery ?? null;
		if (deliveryOption) {
			setCourierName(deliveryOption?.label?.split(" ")[0].toLowerCase());
			setDeliveryType(deliveryOption?.label?.split(" ")[1].toLowerCase());
		}
	}, [data.shipping]);

	const deliveryFields = useMemo(() => {
		return [
			{
				col: "12",
				field: "country",
				useFetch: useDeliveryCountries,
				querySpecs: {
					courier: courierName,
				},
			},
			{
				col: { base: "12", sm: "8" },
				field: "city",
				useFetch: useDeliveryCities,
				querySpecs: {
					courier: courierName,
					countryId: data.shipping?.country?.data?.id,
				},
			},
			{ col: { base: "12", sm: "4" }, field: "zipCode" },
			{ col: { base: "12", sm: "8" }, field: "streetName" },
			{ col: { base: "12", sm: "4" }, field: "streetNumber" },
		];
	}, [courierName, data.shipping?.country?.data?.id]);

	return (
		<Flex>
			<Flex.Col col='12'>
				<FormControl label={t("orders.delivery")} htmlFor='delivery' className={cn("")} hintMsg={""}>
					<AsyncSelect
						useFetch={useDeliveryMethods}
						value={data.shipping?.delivery}
						onChange={(option) => handleValueUpdate("delivery", option)}
						placeholder='Select Delivery'
					/>
				</FormControl>
			</Flex.Col>

			{deliveryType === "office" && (
				<Flex.Col col='12'>
					<FormControl label={t("orders.office")} htmlFor='officeCode' className={cn("")} hintMsg={""}>
						<AsyncSelect
							useFetch={useDeliveryOffices}
							querySpecs={{ courier: courierName }}
							value={data.shipping?.officeCode}
							onChange={(option) => handleValueUpdate("officeCode", option)}
							placeholder='Select Office'
						/>
					</FormControl>
				</Flex.Col>
			)}

			{deliveryType === "address" && <DeliveryAddress deliveryFields={deliveryFields} handleValueUpdate={handleValueUpdate} />}

			{courierName === "econt" && (
				<ReceiverInputs fields={[...receiverFields, "agentName", "agentPhone"]} handleValueUpdate={handleValueUpdate} />
			)}
			{courierName === "speedy" && <ReceiverInputs handleValueUpdate={handleValueUpdate} />}
		</Flex>
	);
};

export default OrderStepShipping;
