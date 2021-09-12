import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { Input, Flex, FormControl } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import {
	useDeliveryCities,
	useDeliveryCountries,
	useDeliveryMethods,
	useDeliveryOffices,
	useDeliveryStreets,
} from "../../../../actions/fetchHooks";

import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";
import CalendarPicker from "../../../../components/util/CalendarPicker";

const OrderStepShipping = ({ initialData, formProps: { control, errors, watch, getValues, setValue, reset } }: any) => {
	const { t, i18n } = useTranslation();

	const currLocale = i18n.language.split("-")[0];

	const [clearInputsCounter, setClearInputsCounter] = useState(0);
	const watchDelivery = watch("shippingMethodId", initialData?.shippingMethodId);
	const watchCountry = watch("country");
	const watchCity = watch("city");
	const watchStreet = watch("streetName");

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
					label={t("field.shipDate")}
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
							required: t("validation.required"),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label={t("field.shippingMethod")}
					htmlFor='shippingMethodId'
					className={cn({
						"text--danger": errors?.shippingMethodId,
					})}
					hintMsg={errors?.shippingMethodId?.message}>
					<Controller
						render={({ field }) => {
							field.onChange = handleDeliveryTypeOnChange;
							return (
								<WindowedAsyncSelect
									inputId='shippingMethodId'
									useFetch={useDeliveryMethods}
									querySpecs={{
										sortBy: [{ asc: true, id: "name" }],
									}}
									isClearable={false}
									isSearchable={false}
									defaultOptions
									isFetchedAtOnce
									placeholder={t("field.select", { field: t("field.shippingMethod") })}
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
							required: t("validation.required"),
						}}
					/>
				</FormControl>
			</Flex.Col>

			{watchDelivery?.data?.deliveryType === "office" && (
				<Flex.Col col='12'>
					<FormControl
						label={t("field.office")}
						htmlFor='officeId'
						className={cn({
							"text--danger": errors?.officeId,
						})}
						hintMsg={errors?.officeId?.message}>
						<Controller
							render={({ field }) => (
								<WindowedAsyncSelect
									inputId='officeId'
									useFetch={useDeliveryOffices}
									querySpecs={{ courier: watchDelivery?.data?.courierName }}
									querySpecialKey={[watchDelivery?.data?.courierName]}
									isClearable={false}
									labelComponent={(item) => (currLocale === "bg" ? item?.name : item?.nameEn)}
									filterKey={currLocale === "bg" ? "name" : "nameEn"}
									defaultOptions
									placeholder={t("field.select", { field: t("field.office") })}
									className={cn({
										"temat__select__container--danger": errors?.officeId,
									})}
									{...field}
								/>
							)}
							name='officeId'
							control={control}
							defaultValue={null}
							rules={{
								required: t("validation.required"),
							}}
						/>
					</FormControl>
				</Flex.Col>
			)}

			{watchDelivery?.data?.deliveryType === "address" && (
				<>
					<Flex.Col col='12'>
						<FormControl
							label={t("field.country")}
							htmlFor='country'
							className={cn({
								"text--danger": errors?.country,
							})}
							hintMsg={errors?.country?.message}>
							<Controller
								render={({ field }) => (
									<WindowedAsyncSelect
										inputId='country'
										{...field}
										useFetch={useDeliveryCountries}
										querySpecs={{ courier: watchDelivery?.data?.courierName }}
										querySpecialKey={[watchDelivery?.data?.courierName]}
										placeholder={t("field.select", { field: t("field.country") })}
										defaultSearchString='bulgaria'
										labelComponent={(item) => (currLocale === "bg" ? item?.name : item?.nameEn)}
										filterKey={currLocale === "bg" ? "name" : "nameEn"}
										defaultOptions
										// preSelectOption
										className={cn({
											"temat__select__container--danger": errors?.country,
										})}
									/>
								)}
								name='country'
								control={control}
								defaultValue={null}
								rules={{
									required: t("validation.required"),
								}}
							/>
						</FormControl>
					</Flex.Col>

					{!!watchCountry?.value && (
						<>
							<Flex.Col col={{ base: "12", sm: "8" }}>
								<FormControl
									label={t("field.city")}
									htmlFor='city'
									className={cn({
										"text--danger": errors?.city,
									})}
									hintMsg={errors?.city?.message}>
									<Controller
										render={({ field }) => (
											<WindowedAsyncSelect
												inputId='city'
												useFetch={useDeliveryCities}
												querySpecs={{
													courier: watchDelivery?.data?.courierName,
													countryId: watchCountry?.value,
												}}
												querySpecialKey={[watchDelivery?.data?.courierName, watchCountry?.value]}
												isClearable={false}
												labelComponent={(item) => (currLocale === "bg" ? item?.name : item?.nameEn)}
												filterKey={currLocale === "bg" ? "name" : "nameEn"}
												placeholder={t("field.select", { field: t("field.city") })}
												className={cn({
													"temat__select__container--danger": errors?.city,
												})}
												{...field}
											/>
										)}
										name='city'
										control={control}
										defaultValue={null}
										rules={{
											required: t("validation.required"),
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "4" }}>
								<FormControl
									label={t("field.zipCode")}
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
													placeholder={t("field.zipCode")}
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
											minLength: {
												value: 3,
												message: t("validation.minLength", { value: 3 }),
											},
											maxLength: {
												value: 10,
												message: t("validation.maxLength", { value: 10 }),
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
						</>
					)}

					{!!watchCountry?.value && !!watchCity?.value && (
						<>
							<Flex.Col col={{ base: "12", sm: "8" }}>
								<FormControl
									label={t("field.streetName")}
									htmlFor='streetName'
									className={cn({
										"text--danger": errors?.streetName,
									})}
									hintMsg={errors?.streetName?.message}>
									<Controller
										render={({ field }) => (
											<WindowedAsyncSelect
												inputId='streetName'
												useFetch={useDeliveryStreets}
												querySpecs={{
													courier: watchDelivery?.data?.courierName,
													sortBy: [{ id: "name", desc: true }],
													cityId: watchCity?.value,
												}}
												querySpecialKey={[watchDelivery?.data?.courierName, watchCity?.value]}
												isClearable={false}
												labelComponent={(item) => (currLocale === "bg" ? item?.name : item?.nameEn)}
												filterKey={currLocale === "bg" ? "name" : "nameEn"}
												placeholder={t("field.select", { field: t("field.streetName") })}
												defaultOptions={!!watchCountry?.value && !!watchCity?.value && !watchStreet?.value}
												className={cn({
													"temat__select__container--danger": errors?.streetName,
												})}
												{...field}
											/>
										)}
										name='streetName'
										control={control}
										defaultValue={null}
										rules={{
											required: t("validation.required"),
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "4" }}>
								<FormControl
									label={t("field.streetNumber")}
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
													placeholder={t("field.streetNumber")}
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
											required: t("validation.required"),
											minLength: {
												value: 1,
												message: t("validation.minLength", { value: 1 }),
											},
											maxLength: {
												value: 10,
												message: t("validation.maxLength", { value: 10 }),
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
						</>
					)}
				</>
			)}
		</Flex>
	);
};

export default OrderStepShipping;
