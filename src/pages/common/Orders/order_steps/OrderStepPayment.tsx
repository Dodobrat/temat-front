import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { Flex, FormControl } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useCurrency, usePayAfter, usePaymentMethods, useShippingPaidBy } from "../../../../actions/fetchHooks";

import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";

interface Props {
	initialData?: any;
	formProps?: any;
	isUpdating?: boolean;
}

const OrderStepPayment = ({ initialData, isUpdating, formProps: { control, errors } }: Props) => {
	const { t, i18n } = useTranslation();

	const currLocale = i18n.language.split("-")[0];

	const companyId = initialData?.companyId?.value ?? initialData?.companyId;

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
								defaultOptions={!isUpdating}
								preSelectOption={!isUpdating}
								// labelComponent={(item) => (currLocale === "bg" ? item?.name : item?.nameEn)}
								// filterKey={currLocale === "bg" ? "name" : "nameEn"}
								isFetchedAtOnce
								isClearable={false}
								isSearchable={false}
								className={cn({
									"temat__select__container--danger": errors?.paymentMethodId,
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
								defaultOptions={!isUpdating}
								preSelectOption={!isUpdating}
								isFetchedAtOnce
								labelComponent={(item) => `${item?.abbreviation} - ${item?.symbol}`}
								filterKey='abbreviation'
								isClearable={false}
								isSearchable={false}
								className={cn({
									"temat__select__container--danger": errors?.currencyId,
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
					label={t("field.shipmentPayee")}
					htmlFor='shipmentPayeeId'
					className={cn({
						"text--danger": errors?.shipmentPayeeId,
					})}
					hintMsg={errors?.shipmentPayeeId?.message}>
					<Controller
						render={({ field }) => (
							<WindowedAsyncSelect
								inputId='shipmentPayeeId'
								useFetch={useShippingPaidBy}
								queryFilters={{
									companyId: companyId,
								}}
								defaultOptions={!!companyId && !isUpdating}
								preSelectOption={!isUpdating}
								labelComponent={(item) => (currLocale === "bg" ? item?.name : item?.nameEn)}
								filterKey={currLocale === "bg" ? "name" : "nameEn"}
								isFetchedAtOnce
								isClearable={false}
								isSearchable={false}
								className={cn({
									"temat__select__container--danger": errors?.shipmentPayeeId,
								})}
								{...field}
							/>
						)}
						name='shipmentPayeeId'
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
					label={t("field.payAfter")}
					htmlFor='payAfterId'
					className={cn({
						"text--danger": errors?.payAfterId,
					})}
					hintMsg={errors?.payAfterId?.message}>
					<Controller
						render={({ field }) => (
							<WindowedAsyncSelect
								inputId='payAfterId'
								useFetch={usePayAfter}
								queryFilters={{
									companyId: companyId,
								}}
								defaultOptions={!!companyId && !isUpdating}
								preSelectOption={!isUpdating}
								labelComponent={(item) => (currLocale === "bg" ? item?.name : item?.nameEn)}
								filterKey={currLocale === "bg" ? "name" : "nameEn"}
								isFetchedAtOnce
								isClearable={false}
								isSearchable={false}
								className={cn({
									"temat__select__container--danger": errors?.payAfterId,
								})}
								{...field}
							/>
						)}
						name='payAfterId'
						control={control}
						defaultValue={null}
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
