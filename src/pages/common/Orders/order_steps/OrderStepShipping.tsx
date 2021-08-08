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
	usePhoneCodes,
} from "../../../../actions/fetchHooks";
import { useEffect, useState } from "react";
import { Input } from "@dodobrat/react-ui-kit";
import { Heading } from "@dodobrat/react-ui-kit";
import { useMemo } from "react";
import { Checkbox } from "@dodobrat/react-ui-kit";
import CalendarPicker from "../../../../components/util/DatePicker";

const receiverFields: any = [
	{
		type: "email",
		field: "email",
		col: "12",
	},
	{ field: "receiverName", col: "12" },
	{
		field: "receiverPhoneCodeId",
		col: { base: "5", md: "4" },
		useFetch: usePhoneCodes,
		searchStringLength: 1,
		labelComponent: (data) => <PhoneCode data={data} />,
	},
	{ field: "receiverPhone", col: { base: "7", md: "8" } },
];

const ReceiverInputs = ({ fields = receiverFields, handleValueUpdate, useContext }) => {
	const { t } = useTranslation();

	const {
		dataValue: { data },
	} = useContext();

	return (
		<Flex.Col col='12'>
			<Flex disableNegativeSpace className='outline flavor--default p--1'>
				<Flex.Col col='12'>
					<Heading as='p' className='mb--0'>
						Receiver Details
					</Heading>
				</Flex.Col>
				{fields.map((item: any) => {
					const {
						field,
						formControlLabel,
						col,
						useFetch,
						labelComponent,
						querySpecs,
						querySpecialKey,
						dataValue,
						inputProps,
						searchStringLength,
						inputType: Component = Input,
					} = item;

					return (
						<Flex.Col col={col ?? { base: "12", sm: "6" }} key={field}>
							<FormControl withLabel={formControlLabel} label={t(`orders.${field}`)} htmlFor={field}>
								{useFetch ? (
									<AsyncSelect
										querySpecs={querySpecs}
										querySpecialKey={querySpecialKey}
										labelComponent={labelComponent}
										searchStringLength={searchStringLength}
										useFetch={useFetch}
										value={data.shipping[field]}
										onChange={(option) => handleValueUpdate(field, option)}
										cacheUniqs={querySpecialKey}
									/>
								) : (
									<Component
										type={field.type ?? "text"}
										value={data.shipping[field] ?? ""}
										checked={data.shipping[field] ?? ""}
										onChange={({ target }) => handleValueUpdate(field, target[dataValue ?? "value"])}
										placeholder={field}
										{...inputProps}
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

const DeliveryAddress = ({ deliveryFields, handleValueUpdate, useContext }) => {
	const { t } = useTranslation();

	const {
		dataValue: { data },
	} = useContext();

	return (
		<Flex.Col col='12'>
			<Flex disableNegativeSpace className='outline flavor--default p--1'>
				<Flex.Col col='12'>
					<Heading as='p' className='mb--0'>
						Delivery Address
					</Heading>
				</Flex.Col>
				{deliveryFields.map((item) => {
					const { field, col, useFetch, querySpecs, querySpecialKey, defaultSearchString } = item;

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
										defaultSearchString={defaultSearchString}
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

export const PhoneCode = ({ data }) => (
	<span style={{ display: "flex", alignItems: "center" }}>
		<img src={data?.flag} alt={data?.country ?? data?.code} style={{ height: "1em", width: "1em", marginRight: "0.5rem" }} />{" "}
		{data?.code}
	</span>
);

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
				receiverPhoneCodeId: prev.shipping?.receiverPhoneCodeId ?? null,
				receiverPhone: prev.shipping?.receiverPhone ?? "",
				receiverAgentName: val?.label?.split(" ")[0].toLowerCase() === "econt" ? prev.shipping?.receiverAgentName : null,
				receiverAgentPhoneCodeId:
					val?.label?.split(" ")[0].toLowerCase() === "econt" ? prev.shipping?.receiverAgentPhoneCodeId : null,
				receiverAgentPhone: val?.label?.split(" ")[0].toLowerCase() === "econt" ? prev.shipping?.receiverAgentPhone : null,
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
				defaultSearchString: "bulgaria",
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
				<FormControl label={t("plans.shipDate")} htmlFor='shipDate'>
					<CalendarPicker
						id='shipDate'
						selected={data?.shipping?.shipDate}
						onChange={(date) => handleValueUpdate("shipDate", date)}
					/>
				</FormControl>
			</Flex.Col>
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

			{deliveryType === "address" && (
				<DeliveryAddress deliveryFields={deliveryFields} handleValueUpdate={handleValueUpdate} useContext={useContext} />
			)}

			{courierName === "econt" && (
				<ReceiverInputs
					fields={[
						...receiverFields,
						{ field: "receiverAgentName", col: "12" },
						{
							field: "receiverAgentPhoneCodeId",
							col: { base: "5", md: "4" },
							useFetch: usePhoneCodes,
							searchStringLength: 1,
							labelComponent: (data) => <PhoneCode data={data} />,
						},
						{ field: "receiverAgentPhone", col: { base: "7", md: "8" } },
						{
							field: "receiverIsCompany",
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
					useContext={useContext}
				/>
			)}
			{courierName === "speedy" && <ReceiverInputs handleValueUpdate={handleValueUpdate} useContext={useContext} />}
		</Flex>
	);
};

export default OrderStepShipping;
