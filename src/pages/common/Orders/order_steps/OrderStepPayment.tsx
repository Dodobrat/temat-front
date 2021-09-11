import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import WindowedSelect from "react-windowed-select";
import { Flex, FormControl } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useCurrency, usePaymentMethods } from "../../../../actions/fetchHooks";

import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";

const selectProps = {
	className: "temat__select__container",
	classNamePrefix: "temat__select",
	menuPlacement: "auto",
	isSearchable: false,
};

interface Props {
	initialData?: any;
	formProps?: any;
}

const OrderStepPayment = ({ initialData, formProps: { control, errors, setValue } }: Props) => {
	const { t } = useTranslation();

	const paidByOptions = useMemo(
		() => [
			{ value: "receiver", label: t("options.receiver") },
			{ value: "sender", label: t("options.sender") },
		],
		[t]
	);

	const payAfterOptions = useMemo(
		() => [
			{ value: "none", label: t("options.delivery") },
			{ value: "view", label: t("options.deliveryWith", { with: t("common.view") }) },
			{ value: "test", label: t("options.deliveryWith", { with: t("common.test") }) },
		],
		[t]
	);

	useEffect(() => {
		if (initialData?.shippingPaidBy) {
			setValue(
				"shippingPaidBy",
				paidByOptions.find((option) => option.value === initialData?.shippingPaidBy)
			);
		}
		if (initialData?.payAfter) {
			setValue(
				"payAfter",
				payAfterOptions.find((option) => option.value === initialData?.payAfter)
			);
		}
	}, [initialData?.shippingPaidBy, initialData?.payAfter, setValue, paidByOptions, payAfterOptions]);

	return (
		<Flex>
			<Flex.Col col={{ base: "12", lg: "6" }}>
				<FormControl
					label={t("field.paymentMethod")}
					htmlFor='paymentMethodId'
					className={cn({
						"text--danger": errors?.paymentMethodId,
					})}
					hintMsg={errors?.paymentMethodId?.message}>
					<Controller
						render={({ field }) => (
							<WindowedAsyncSelect
								inputId='paymentMethodId'
								useFetch={usePaymentMethods}
								defaultOptions
								preSelectOption
								isFetchedAtOnce
								isClearable={false}
								className={cn({
									"temat__select__container--danger": errors?.phoneCodeId,
								})}
								{...field}
							/>
						)}
						name='paymentMethodId'
						control={control}
						defaultValue={null}
						rules={{
							required: t("validation.required"),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", lg: "6" }}>
				<FormControl
					label={t("field.currency")}
					htmlFor='currencyId'
					className={cn({
						"text--danger": errors?.currencyId,
					})}
					hintMsg={errors?.currencyId?.message}>
					<Controller
						render={({ field }) => (
							<WindowedAsyncSelect
								inputId='currencyId'
								useFetch={useCurrency}
								defaultOptions
								preSelectOption
								isFetchedAtOnce
								labelComponent={(item) => `${item?.abbreviation} - ${item?.symbol}`}
								isClearable={false}
								className={cn({
									"temat__select__container--danger": errors?.phoneCodeId,
								})}
								{...field}
							/>
						)}
						name='currencyId'
						control={control}
						defaultValue={null}
						rules={{
							required: t("validation.required"),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", lg: "6" }}>
				<FormControl
					label={t("field.shippingPaidBy")}
					htmlFor='shippingPaidBy'
					className={cn({
						"text--danger": errors?.shippingPaidBy,
					})}
					hintMsg={errors?.shippingPaidBy?.message}>
					<Controller
						render={({ field }) => (
							<WindowedSelect
								inputId='shippingPaidBy'
								{...selectProps}
								options={paidByOptions}
								className={cn(selectProps.className, {
									"temat__select__container--danger": errors?.payAfter,
								})}
								{...field}
							/>
						)}
						name='shippingPaidBy'
						control={control}
						defaultValue={paidByOptions[0]}
						rules={{
							required: t("validation.required"),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", lg: "6" }}>
				<FormControl
					label={t("field.payAfter")}
					htmlFor='payAfter'
					className={cn({
						"text--danger": errors?.payAfter,
					})}
					hintMsg={errors?.payAfter?.message}>
					<Controller
						render={({ field }) => (
							<WindowedSelect
								{...selectProps}
								options={payAfterOptions}
								inputId='payAfter'
								className={cn(selectProps.className, {
									"temat__select__container--danger": errors?.payAfter,
								})}
								{...field}
							/>
						)}
						name='payAfter'
						control={control}
						defaultValue={payAfterOptions[0]}
						rules={{
							required: t("validation.required"),
						}}
					/>
				</FormControl>
			</Flex.Col>
		</Flex>
	);
};

export default OrderStepPayment;
