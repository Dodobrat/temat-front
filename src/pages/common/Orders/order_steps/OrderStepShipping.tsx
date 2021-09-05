import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flex, FormControl } from "@dodobrat/react-ui-kit";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import cn from "classnames";
import {
	useDeliveryCities,
	useDeliveryCountries,
	useDeliveryMethods,
	useDeliveryOffices,
	useDeliveryStreets,
} from "../../../../actions/fetchHooks";
import { Input } from "@dodobrat/react-ui-kit";
import CalendarPicker from "../../../../components/util/CalendarPicker";
import { Controller } from "react-hook-form";

export const PhoneCode = ({ data }) => (
	<span style={{ display: "flex", alignItems: "center" }}>
		<img src={data?.flag} alt={data?.country ?? data?.code} style={{ height: "1em", width: "1em", marginRight: "0.5rem" }} />{" "}
		{data?.code}
	</span>
);

const OrderStepShipping = ({ initialData, formProps: { control, errors, watch, getValues, setValue, reset } }: any) => {
	const { t } = useTranslation();

	const [clearInputsCounter, setClearInputsCounter] = useState(0);

	const watchDelivery = watch("shippingMethodId", initialData?.shippingMethodId);
	const watchCountry = watch("country");
	const watchCity = watch("city");

	const handleDeliveryTypeOnChange = useCallback(
		(option) => {
			setValue("shippingMethodId", option);
			setClearInputsCounter((prev) => prev + 1);
		},
		[setValue]
	);

	useEffect(() => {
		if (clearInputsCounter > 0) {
			reset({
				...getValues(),
				officeId: null,
				country: null,
				city: null,
				streetName: null,
				zipCode: "",
				streetNumber: "",
			});
		}
	}, [clearInputsCounter, reset, getValues]);

	return (
		<Flex>
			<Flex.Col col='12'>
				<FormControl
					label={t("plans.shipDate")}
					className={cn({
						"text--danger": errors?.shipDate,
					})}
					hintMsg={errors?.shipDate?.message}>
					<Controller
						render={({ field: { value, ...rest } }) => (
							<CalendarPicker
								selected={value}
								{...rest}
								inputProps={{
									pigment: errors?.shipDate ? "danger" : "primary",
								}}
							/>
						)}
						name='shipDate'
						control={control}
						defaultValue={null}
						rules={{
							required: "Field is required",
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label={t("orders.delivery")}
					htmlFor='shippingMethodId'
					className={cn({
						"text--danger": errors?.shippingMethodId,
					})}
					hintMsg={errors?.shippingMethodId?.message}>
					<Controller
						render={({ field }) => {
							field.onChange = handleDeliveryTypeOnChange;
							return (
								<AsyncSelect
									useFetch={useDeliveryMethods}
									querySpecs={{
										sortBy: [{ asc: true, id: "name" }],
									}}
									isClearable={false}
									defaultOptions
									placeholder='Select Delivery Type'
									className={cn({
										"temat__select__container--danger": errors?.shippingMethodId,
									})}
									{...field}
								/>
							);
						}}
						name='shippingMethodId'
						control={control}
						defaultValue={null}
						rules={{
							required: "Field is required",
						}}
					/>
				</FormControl>
			</Flex.Col>

			{watchDelivery?.data?.deliveryType === "office" && (
				<Flex.Col col='12'>
					<FormControl
						label={t("orders.office")}
						htmlFor='officeId'
						className={cn({
							"text--danger": errors?.officeId,
						})}
						hintMsg={errors?.officeId?.message}>
						<Controller
							render={({ field }) => (
								<AsyncSelect
									useFetch={useDeliveryOffices}
									querySpecs={{ courier: watchDelivery?.data?.courierName }}
									querySpecialKey={[watchDelivery?.data?.courierName]}
									isClearable={false}
									defaultOptions
									placeholder='Select Office'
									className={cn({
										"temat__select__container--danger": errors?.officeId,
									})}
									cacheUniqs={[watchDelivery?.data?.courierName]}
									{...field}
								/>
							)}
							name='officeId'
							control={control}
							defaultValue={null}
							rules={{
								required: "Field is required",
							}}
						/>
					</FormControl>
				</Flex.Col>
			)}

			{watchDelivery?.data?.deliveryType === "address" && (
				<>
					<Flex.Col col='12'>
						<FormControl
							label={t("orders.country")}
							htmlFor='country'
							className={cn({
								"text--danger": errors?.country,
							})}
							hintMsg={errors?.country?.message}>
							<Controller
								render={({ field }) => (
									<AsyncSelect
										{...field}
										useFetch={useDeliveryCountries}
										querySpecs={{ courier: watchDelivery?.data?.courierName }}
										querySpecialKey={[watchDelivery?.data?.courierName]}
										isClearable={false}
										placeholder='Select Country'
										defaultSearchString='bulgaria'
										defaultOptions
										preSelectOption
										className={cn({
											"temat__select__container--danger": errors?.country,
										})}
										cacheUniqs={[watchDelivery?.data?.courierName]}
									/>
								)}
								name='country'
								control={control}
								defaultValue={null}
								rules={{
									required: "Field is required",
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "12", sm: "8" }}>
						<FormControl
							label={t("orders.city")}
							htmlFor='city'
							className={cn({
								"text--danger": errors?.city,
							})}
							hintMsg={errors?.city?.message}>
							<Controller
								render={({ field }) => (
									<AsyncSelect
										useFetch={useDeliveryCities}
										querySpecs={{
											courier: watchDelivery?.data?.courierName,
											countryId: watchCountry?.value,
										}}
										querySpecialKey={[watchDelivery?.data?.courierName, watchCountry?.value]}
										isClearable={false}
										placeholder='Select City'
										defaultOptions={!!watchCountry?.value}
										className={cn({
											"temat__select__container--danger": errors?.city,
										})}
										cacheUniqs={[watchDelivery?.data?.courierName, watchCountry?.value]}
										{...field}
									/>
								)}
								name='city'
								control={control}
								defaultValue={null}
								rules={{
									required: "Field is required",
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "12", xs: "4" }}>
						<FormControl
							label={t("orders.zipCode")}
							htmlFor='zipCode'
							className={cn({
								"text--danger": errors?.zipCode,
							})}
							hintMsg={errors?.zipCode?.message}>
							<Controller
								render={({ field }) => {
									const { ref, ...fieldRest } = field;
									return (
										<Input
											placeholder={t("orders.zipCode")}
											{...fieldRest}
											innerRef={ref}
											pigment={errors?.zipCode ? "danger" : "primary"}
										/>
									);
								}}
								name='zipCode'
								control={control}
								defaultValue=''
								rules={{
									minLength: { value: 3, message: "Min 3 characters" },
									maxLength: { value: 10, message: "Max 10 characters" },
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "12", sm: "8" }}>
						<FormControl
							label={t("orders.streetName")}
							htmlFor='streetName'
							className={cn({
								"text--danger": errors?.streetName,
							})}
							hintMsg={errors?.streetName?.message}>
							<Controller
								render={({ field }) => (
									<AsyncSelect
										useFetch={useDeliveryStreets}
										querySpecs={{
											courier: watchDelivery?.data?.courierName,
											sortBy: [{ id: "name", desc: true }],
											cityId: watchCity?.value,
										}}
										querySpecialKey={[watchDelivery?.data?.courierName, watchCity?.value]}
										isClearable={false}
										placeholder='Select Street'
										defaultOptions={!!watchCity?.value}
										className={cn({
											"temat__select__container--danger": errors?.streetName,
										})}
										cacheUniqs={[watchDelivery?.data?.courierName, watchCity?.value]}
										{...field}
									/>
								)}
								name='streetName'
								control={control}
								defaultValue={null}
								rules={{
									required: "Field is required",
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "12", xs: "4" }}>
						<FormControl
							label={t("orders.streetNumber")}
							htmlFor='streetNumber'
							className={cn({
								"text--danger": errors?.streetNumber,
							})}
							hintMsg={errors?.streetNumber?.message}>
							<Controller
								render={({ field }) => {
									const { ref, ...fieldRest } = field;
									return (
										<Input
											placeholder={t("orders.streetNumber")}
											{...fieldRest}
											innerRef={ref}
											pigment={errors?.streetNumber ? "danger" : "primary"}
										/>
									);
								}}
								name='streetNumber'
								control={control}
								defaultValue=''
								rules={{
									required: "Field is Required",
									minLength: { value: 1, message: "Min 1 characters" },
									maxLength: { value: 10, message: "Max 10 characters" },
								}}
							/>
						</FormControl>
					</Flex.Col>
				</>
			)}
		</Flex>
	);
};

export default OrderStepShipping;
