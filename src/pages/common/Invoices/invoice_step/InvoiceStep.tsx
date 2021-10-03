import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { InputComponent, Flex, FormControl, SwitchGroup } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { usePartners } from "../../../../actions/fetchHooks";

import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";

const InvoiceStep = ({ payload, onInputSwitch, formProps: { control, errors } }: any) => {
	const { t } = useTranslation();

	const [invoiceReceiver, setInvoiceReceiver] = useState(() => {
		if (payload) {
			if (payload?.contragentId) {
				return "partner";
			}
			return "receiver";
		}
		return "partner";
	});

	return (
		<>
			<Flex.Col col='12'>
				<SwitchGroup
					wide
					onSwitch={({ option }) => {
						setInvoiceReceiver(option.value);
						onInputSwitch?.(option.value);
					}}
					activeOption={invoiceReceiver}
					options={[
						{ value: "partner", label: t("common.partner") },
						{ value: "receiver", label: t("common.receiver") },
					]}
				/>
			</Flex.Col>
			{invoiceReceiver === "partner" && (
				<Flex.Col col='12'>
					<FormControl
						label={t("common.partner")}
						htmlFor='contragentId'
						className={cn({
							"text--danger": errors?.contragentId,
						})}
						hintMsg={errors?.contragentId?.message}>
						<Controller
							render={({ field }) => (
								<WindowedAsyncSelect
									inputId='contragentId'
									useFetch={usePartners}
									defaultOptions={!payload}
									isClearable={false}
									className={cn({
										"temat__select__container--danger": errors?.contragentId,
									})}
									{...field}
								/>
							)}
							name='contragentId'
							control={control}
							defaultValue={null}
							// rules={{
							// 	required: t("validation.required"),
							// }}
						/>
					</FormControl>
				</Flex.Col>
			)}
			{invoiceReceiver === "receiver" && (
				<>
					<Flex.Col col='12'>
						<FormControl
							label={t("field.name")}
							htmlFor='invoiceName'
							className={cn({
								"text--danger": errors?.invoiceName,
							})}
							hintMsg={errors?.invoiceName?.message}>
							<Controller
								render={({ field }) => (
									<InputComponent
										{...field}
										placeholder={t("field.name")}
										pigment={errors?.invoiceName ? "danger" : "primary"}
									/>
								)}
								name='invoiceName'
								control={control}
								defaultValue=''
								rules={{
									minLength: {
										value: 2,
										message: t("validation.minLength", { value: 2 }),
									},
									maxLength: {
										value: 99,
										message: t("validation.maxLength", { value: 99 }),
									},
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "12", xs: "6" }}>
						<FormControl
							label={t("field.bulstat")}
							htmlFor='invoiceBulstat'
							className={cn({
								"text--danger": errors?.invoiceBulstat,
							})}
							hintMsg={errors?.invoiceBulstat?.message}>
							<Controller
								render={({ field }) => (
									<InputComponent
										{...field}
										placeholder={t("field.bulstat")}
										pigment={errors?.invoiceBulstat ? "danger" : "primary"}
									/>
								)}
								name='invoiceBulstat'
								control={control}
								defaultValue=''
								rules={{
									maxLength: {
										value: 11,
										message: t("validation.maxLength", { value: 11 }),
									},
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "12", xs: "6" }}>
						<FormControl
							label={t("field.bulstatVAT")}
							htmlFor='invoiceBulstatVAT'
							className={cn({
								"text--danger": errors?.invoiceBulstatVAT,
							})}
							hintMsg={errors?.invoiceBulstatVAT?.message}>
							<Controller
								render={({ field }) => (
									<InputComponent
										{...field}
										placeholder={t("field.bulstatVAT")}
										pigment={errors?.invoiceBulstatVAT ? "danger" : "primary"}
									/>
								)}
								name='invoiceBulstatVAT'
								control={control}
								defaultValue=''
								rules={{
									maxLength: {
										value: 12,
										message: t("validation.maxLength", { value: 12 }),
									},
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "12", xs: "6" }}>
						<FormControl
							label={t("field.city")}
							htmlFor='invoiceCity'
							className={cn({
								"text--danger": errors?.invoiceCity,
							})}
							hintMsg={errors?.invoiceCity?.message}>
							<Controller
								render={({ field }) => (
									<InputComponent
										{...field}
										placeholder={t("field.city")}
										pigment={errors?.invoiceCity ? "danger" : "primary"}
									/>
								)}
								name='invoiceCity'
								control={control}
								defaultValue=''
								rules={{
									minLength: {
										value: 2,
										message: t("validation.minLength", { value: 2 }),
									},
									maxLength: {
										value: 60,
										message: t("validation.maxLength", { value: 60 }),
									},
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "12", xs: "6" }}>
						<FormControl
							label={t("field.address")}
							htmlFor='invoiceAddress'
							className={cn({
								"text--danger": errors?.invoiceAddress,
							})}
							hintMsg={errors?.invoiceAddress?.message}>
							<Controller
								render={({ field }) => (
									<InputComponent
										{...field}
										placeholder={t("field.address")}
										pigment={errors?.invoiceAddress ? "danger" : "primary"}
									/>
								)}
								name='invoiceAddress'
								control={control}
								defaultValue=''
								rules={{
									minLength: {
										value: 2,
										message: t("validation.minLength", { value: 2 }),
									},
									maxLength: {
										value: 60,
										message: t("validation.maxLength", { value: 60 }),
									},
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col='12'>
						<FormControl
							label={t("field.mol")}
							htmlFor='invoiceMol'
							className={cn({
								"text--danger": errors?.invoiceMol,
							})}
							hintMsg={errors?.invoiceMol?.message}>
							<Controller
								render={({ field }) => (
									<InputComponent
										{...field}
										placeholder={t("field.mol")}
										pigment={errors?.invoiceMol ? "danger" : "primary"}
									/>
								)}
								name='invoiceMol'
								control={control}
								defaultValue=''
								rules={{
									minLength: {
										value: 2,
										message: t("validation.minLength", { value: 2 }),
									},
									maxLength: {
										value: 60,
										message: t("validation.maxLength", { value: 60 }),
									},
								}}
							/>
						</FormControl>
					</Flex.Col>
				</>
			)}
		</>
	);
};

export default InvoiceStep;
