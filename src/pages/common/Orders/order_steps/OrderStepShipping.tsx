import { useTranslation } from "react-i18next";
import { Flex, FormControl } from "@dodobrat/react-ui-kit";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { useOrdersContext } from "../../../../context/OrdersContext";
import cn from "classnames";
import {
	useDeliveryCities,
	useDeliveryCountries,
	useDeliveryMethods,
	useDeliveryOffices,
	useDeliveryStreets,
} from "../../../../actions/fetchHooks";
import { useEffect, useState } from "react";
import { Input } from "@dodobrat/react-ui-kit";
import { Heading } from "@dodobrat/react-ui-kit";
import { useMemo } from "react";
import { Checkbox } from "@dodobrat/react-ui-kit";

const receiverFields: any = [
	{
		type: "email",
		name: "email",
		col: "12",
	},
	{ name: "receiverName" },
	{ name: "receiverPhone" },
];

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
				{fields.map((field: any) => {
					const Component = field.inputType ?? Input;

					return (
						<Flex.Col col={field.col ?? { base: "12", sm: "6" }} key={field.name}>
							<FormControl withLabel={field?.formControlLabel} label={t(`orders.${field.name}`)} htmlFor={field.name}>
								<Component
									type={field.type ?? "text"}
									value={data.shipping[field.name] ?? ""}
									onChange={({ target }) => handleValueUpdate(field.name, target[field?.dataValue ?? "value"])}
									placeholder={field.name}
									{...field?.inputProps}
								/>
							</FormControl>
						</Flex.Col>
					);
				})}
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
					const { field, col, useFetch, querySpecs, querySpecialKey } = item;

					return (
						<Flex.Col col={col} key={field}>
							<FormControl label={t(`orders.${field}`)} htmlFor={field} className={cn("")} hintMsg={""}>
								{useFetch ? (
									<AsyncSelect
										querySpecs={querySpecs}
										querySpecialKey={querySpecialKey}
										useFetch={useFetch}
										value={data.shipping[field]}
										onChange={(option) => handleValueUpdate(field, option)}
										cacheUniqs={querySpecialKey}
									/>
								) : (
									<Input
										value={data.shipping[field] ?? ""}
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

const OrderStepShipping = ({ useContext = useOrdersContext }) => {
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useContext();

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

	const resetAddressValues = (key, val) => {
		setData((prev) => ({
			...prev,
			shipping: {
				...prev.shipping,
				[key]: val,
				officeId: null,
				country: null,
				city: null,
				streetName: null,
				zipCode: "",
				streetNumber: "",
				email: prev.shipping?.email ?? "",
				receiverName: prev.shipping?.receiverName ?? "",
				receiverPhone: prev.shipping?.receiverPhone ?? "",
				receiverAgentName: val?.label?.split(" ")[0].toLowerCase() === "econt" ? prev.shipping?.receiverAgentName : "",
				receiverAgentPhone: val?.label?.split(" ")[0].toLowerCase() === "econt" ? prev.shipping?.receiverAgentPhone : "",
			},
		}));
	};

	useEffect(() => {
		const deliveryOption = data.shipping?.shippingMethodId ?? null;
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
				querySpecialKey: [courierName, deliveryType],
			},
			{
				col: { base: "12", sm: "8" },
				field: "city",
				useFetch: useDeliveryCities,
				querySpecs: {
					courier: courierName,
					countryId: data.shipping?.country?.value,
				},
				querySpecialKey: [courierName, deliveryType, data.shipping?.country],
			},
			{ col: { base: "12", sm: "4" }, field: "zipCode" },
			{
				col: { base: "12", sm: "8" },
				field: "streetName",
				useFetch: useDeliveryStreets,
				querySpecs: {
					courier: courierName,
					sortBy: [{ id: "name", desc: true }],
					cityId: data.shipping?.city?.value,
				},
				querySpecialKey: [courierName, deliveryType, data.shipping?.city],
			},
			{ col: { base: "12", sm: "4" }, field: "streetNumber" },
		];
	}, [courierName, deliveryType, data]);

	return (
		<Flex>
			<Flex.Col col='12'>
				<FormControl label={t("orders.delivery")} htmlFor='shippingMethodId' className={cn("")} hintMsg={""}>
					<AsyncSelect
						useFetch={useDeliveryMethods}
						querySpecs={{
							sortBy: [{ asc: true, id: "name" }],
						}}
						value={data.shipping?.shippingMethodId}
						onChange={(option) => resetAddressValues("shippingMethodId", option)}
						placeholder='Select Delivery Type'
					/>
				</FormControl>
			</Flex.Col>

			{deliveryType === "office" && (
				<Flex.Col col='12'>
					<FormControl label={t("orders.office")} htmlFor='officeId' className={cn("")} hintMsg={""}>
						<AsyncSelect
							useFetch={useDeliveryOffices}
							querySpecs={{ courier: courierName }}
							querySpecialKey={[courierName, deliveryType]}
							value={data.shipping?.officeId}
							onChange={(option) => handleValueUpdate("officeId", option)}
							placeholder='Select Office'
							cacheUniqs={[deliveryType, courierName]}
						/>
					</FormControl>
				</Flex.Col>
			)}

			{deliveryType === "address" && <DeliveryAddress deliveryFields={deliveryFields} handleValueUpdate={handleValueUpdate} />}

			{courierName === "econt" && (
				<ReceiverInputs
					fields={[
						...receiverFields,
						{ name: "receiverAgentName" },
						{ name: "receiverAgentPhone" },
						{
							name: "receiverIsCompany",
							formControlLabel: false,
							col: "12",
							inputType: Checkbox,
							dataValue: "checked",
							inputProps: {
								seamless: true,
								children: t("orders.receiverIsCompany"),
							},
						},
					]}
					handleValueUpdate={handleValueUpdate}
				/>
			)}
			{courierName === "speedy" && <ReceiverInputs handleValueUpdate={handleValueUpdate} />}
		</Flex>
	);
};

export default OrderStepShipping;
