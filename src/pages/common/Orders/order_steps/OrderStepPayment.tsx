import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import WindowedSelect from "react-windowed-select";
import { Flex, FormControl } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useCurrency, usePaymentMethods } from "../../../../actions/fetchHooks";

import AsyncSelect from "../../../../components/forms/AsyncSelect";

const selectProps = {
	className: "temat__select__container",
	classNamePrefix: "temat__select",
	menuPlacement: "auto",
	isSearchable: false,
};

export const paidByOptions = [
	{ value: "receiver", label: "Receiver" },
	{ value: "sender", label: "Sender" },
];

export const payAfterOptions = [
	{ value: "none", label: "Delivery" },
	{ value: "view", label: "Delivery and View" },
	{ value: "test", label: "Delivery and Test" },
];

interface Props {
	initialData?: any;
	formProps?: any;
	useContext?: any;
}

const OrderStepPayment = ({ formProps: { control, errors } }: Props) => {
	const { t } = useTranslation();

	return (
		<Flex>
			<Flex.Col col={{ base: "12", lg: "6" }}>
				<FormControl
					label={t("orders.paymentMethod")}
					htmlFor='paymentMethodId'
					className={cn({
						"text--danger": errors?.paymentMethodId,
					})}
					hintMsg={errors?.paymentMethodId?.message}>
					<Controller
						render={({ field }) => (
							<AsyncSelect
								inputId='payment-method'
								useFetch={usePaymentMethods}
								defaultOptions
								preSelectOption
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
							required: "Field is required",
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", lg: "6" }}>
				<FormControl
					label={t("orders.currency")}
					htmlFor='currencyId'
					className={cn({
						"text--danger": errors?.currencyId,
					})}
					hintMsg={errors?.currencyId?.message}>
					<Controller
						render={({ field }) => (
							<AsyncSelect
								inputId='currency'
								useFetch={useCurrency}
								defaultOptions
								preSelectOption
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
							required: "Field is required",
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", lg: "6" }}>
				<FormControl
					label={t("orders.paymentMethod")}
					htmlFor='shippingPaidBy'
					className={cn({
						"text--danger": errors?.shippingPaidBy,
					})}
					hintMsg={errors?.shippingPaidBy?.message}>
					<Controller
						render={({ field }) => (
							<WindowedSelect
								{...selectProps}
								options={paidByOptions}
								inputId='paid-by'
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
							required: "Field is required",
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", lg: "6" }}>
				<FormControl
					label={t("orders.payAfter")}
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
								inputId='pay-after'
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
							required: "Field is required",
						}}
					/>
				</FormControl>
			</Flex.Col>
		</Flex>
	);
};

export default OrderStepPayment;
