import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { InputComponent, Heading, Button, FormControl, Form } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useAuthContext } from "../../../../context/AuthContext";

import {
	useCompanyById,
	useConfirmMethod,
	useDocumentTypes,
	useOrderStatus,
	usePayAfter,
	usePhoneCodes,
	useShippingPaidBy,
	useTaxGroup,
} from "../../../../actions/fetchHooks";
import { useCompanyUpdateDetails } from "../../../../actions/mutateHooks";

import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";
import PhoneCode from "../../../../components/util/PhoneCode";
import SettingsItem from "../SettingsItem";
import SettingsWrapper from "../SettingsWrapper";

import { successToast } from "../../../../helpers/toastEmitter";
import { parseCompanyDetails } from "../helpers";

const SettingsCompanyDetails = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		userValue: { user },
	} = useAuthContext();

	const {
		control,
		watch,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { data } = useCompanyById({
		specialKey: { id: user?.companyId },
	});

	useEffect(() => {
		if (data) {
			reset(parseCompanyDetails(data?.data));
		}
	}, [data, reset]);

	const watchPhone = watch("phone");

	const { mutateAsync: updateCompanyDetails, isLoading } = useCompanyUpdateDetails({
		queryConfig: {
			onSuccess: (res) => {
				queryClient.invalidateQueries("companies");
				queryClient.invalidateQueries("companyById");
				successToast(res);
			},
		},
	});

	const onSubmit = (data: any) => {
		const formData = new FormData();

		for (const entry of Object.entries(data)) {
			if (entry[1] instanceof FileList) {
				formData.append(entry[0], entry[1][0]);
			} else if (typeof entry[1] === "object") {
				formData.append(entry[0], entry[1]["value"]);
			} else if (typeof entry[1] === "string") {
				formData.append(entry[0], entry[1]);
			}
		}

		const formFinalData = { id: user?.companyId, formData };
		updateCompanyDetails(formFinalData);
	};

	return (
		<Form id='profile-form' onSubmit={handleSubmit(onSubmit)}>
			<SettingsWrapper>
				<SettingsItem title={t("field.molFirstName")} htmlFor='molFirstName'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.molFirstName,
						})}
						hintMsg={errors?.molFirstName?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.molFirstName")}
									pigment={errors?.molFirstName ? "danger" : "primary"}
								/>
							)}
							name='molFirstName'
							control={control}
							defaultValue=''
							rules={{
								minLength: {
									value: 2,
									message: t("validation.minLength", { value: 2 }),
								},
								maxLength: {
									value: 50,
									message: t("validation.maxLength", { value: 50 }),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.molLastName")} htmlFor='molLastName'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.molLastName,
						})}
						hintMsg={errors?.molLastName?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.molLastName")}
									pigment={errors?.molLastName ? "danger" : "primary"}
								/>
							)}
							name='molLastName'
							control={control}
							defaultValue=''
							rules={{
								minLength: {
									value: 2,
									message: t("validation.minLength", { value: 2 }),
								},
								maxLength: {
									value: 50,
									message: t("validation.maxLength", { value: 50 }),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.email")} htmlFor='email'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.email,
						})}
						hintMsg={errors?.email?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									type='email'
									placeholder={t("field.email")}
									pigment={errors?.email ? "danger" : "primary"}
								/>
							)}
							name='email'
							control={control}
							defaultValue=''
							rules={{
								pattern: {
									value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
									message: t("validation.pattern"),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.phoneCode")} htmlFor='phoneCode'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.phoneCode,
						})}
						hintMsg={errors?.phoneCode?.message}>
						<Controller
							render={({ field }) => (
								<WindowedAsyncSelect
									inputId='phoneCode'
									useFetch={usePhoneCodes}
									defaultSearchString={data?.data?.phoneCode ?? "359"}
									isClearable={false}
									filterKey='code'
									defaultOptions
									preSelectOption
									isFetchedAtOnce
									labelComponent={(data) => <PhoneCode data={data} />}
									className={cn({
										"temat__select__container--danger": errors?.phoneCode,
									})}
									{...field}
								/>
							)}
							name='phoneCode'
							control={control}
							defaultValue={null}
							rules={{
								validate: (val) => (watchPhone.toString().length > 0 && !val ? t("validation.required") : true),
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.phone")} htmlFor='phone'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.phone,
						})}
						hintMsg={errors?.phone?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									type='tel'
									placeholder={t("field.phone")}
									pigment={errors?.phone ? "danger" : "primary"}
								/>
							)}
							name='phone'
							control={control}
							defaultValue=''
							rules={{
								pattern: {
									value: /^[0-9]{9}$/,
									message: t("validation.pattern"),
								},
								minLength: {
									value: 9,
									message: t("validation.minLength", { value: 9 }),
								},
								maxLength: {
									value: 9,
									message: t("validation.maxLength", { value: 9 }),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.country")} htmlFor='country'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.country,
						})}
						hintMsg={errors?.country?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.country")}
									pigment={errors?.country ? "danger" : "primary"}
								/>
							)}
							name='country'
							control={control}
							defaultValue=''
							rules={{
								minLength: {
									value: 2,
									message: t("validation.minLength", { value: 2 }),
								},
								maxLength: {
									value: 50,
									message: t("validation.maxLength", { value: 50 }),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.city")} htmlFor='city'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.city,
						})}
						hintMsg={errors?.city?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent {...field} placeholder={t("field.city")} pigment={errors?.city ? "danger" : "primary"} />
							)}
							name='city'
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
				</SettingsItem>
				<SettingsItem title={t("field.zipCode")} htmlFor='zipCode'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.zipCode,
						})}
						hintMsg={errors?.zipCode?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.zipCode")}
									pigment={errors?.zipCode ? "danger" : "primary"}
								/>
							)}
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
				</SettingsItem>
				<SettingsItem title={t("field.streetName")} htmlFor='streetName'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.streetName,
						})}
						hintMsg={errors?.streetName?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.streetName")}
									pigment={errors?.streetName ? "danger" : "primary"}
								/>
							)}
							name='streetName'
							control={control}
							defaultValue=''
							rules={{
								minLength: {
									value: 2,
									message: t("validation.minLength", { value: 2 }),
								},
								maxLength: {
									value: 50,
									message: t("validation.maxLength", { value: 50 }),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.streetNumber")} htmlFor='streetNumber'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.streetNumber,
						})}
						hintMsg={errors?.streetNumber?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.streetNumber")}
									pigment={errors?.streetNumber ? "danger" : "primary"}
								/>
							)}
							name='streetNumber'
							control={control}
							defaultValue=''
							rules={{
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
				</SettingsItem>
				<SettingsItem>
					<Heading as='p' className='mb--0'>
						{t("common.bankDetails")}
					</Heading>
				</SettingsItem>
				<SettingsItem title={t("field.bankName")} htmlFor='bankName'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.bankName,
						})}
						hintMsg={errors?.bankName?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.bankName")}
									pigment={errors?.bankName ? "danger" : "primary"}
								/>
							)}
							name='bankName'
							control={control}
							defaultValue=''
							rules={{
								minLength: {
									value: 2,
									message: t("validation.minLength", { value: 2 }),
								},
								maxLength: {
									value: 50,
									message: t("validation.maxLength", { value: 50 }),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.bankBic")} htmlFor='bankBic'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.bankBic,
						})}
						hintMsg={errors?.bankBic?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.bankBic")}
									pigment={errors?.bankBic ? "danger" : "primary"}
								/>
							)}
							name='bankBic'
							control={control}
							defaultValue=''
							rules={{
								minLength: {
									value: 8,
									message: t("validation.minLength", { value: 8 }),
								},
								maxLength: {
									value: 8,
									message: t("validation.maxLength", { value: 8 }),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.bankIBAN")} htmlFor='bankIBAN'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.bankIBAN,
						})}
						hintMsg={errors?.bankIBAN?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									placeholder={t("field.bankIBAN")}
									{...field}
									pigment={errors?.bankIBAN ? "danger" : "primary"}
								/>
							)}
							name='bankIBAN'
							control={control}
							defaultValue=''
							rules={{
								minLength: {
									value: 34,
									message: t("validation.minLength", { value: 34 }),
								},
								maxLength: {
									value: 34,
									message: t("validation.maxLength", { value: 34 }),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem>
					<Heading as='p' className='mb--0'>
						{t("common.preferences")}
					</Heading>
				</SettingsItem>
				<SettingsItem title={t("field.invoiceIdentityNumber")} htmlFor='invoiceIdentityNumber'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.invoiceIdentityNumber,
						})}
						hintMsg={errors?.invoiceIdentityNumber?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.invoiceIdentityNumber")}
									pigment={errors?.invoiceIdentityNumber ? "danger" : "primary"}
								/>
							)}
							name='invoiceIdentityNumber'
							control={control}
							defaultValue=''
							rules={{
								minLength: {
									value: 8,
									message: t("validation.minLength", { value: 8 }),
								},
								maxLength: {
									value: 8,
									message: t("validation.maxLength", { value: 8 }),
								},
							}}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.taxGroupId")} htmlFor='taxGroupId'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.taxGroupId,
						})}
						hintMsg={errors?.taxGroupId?.message}>
						<Controller
							render={({ field }) => (
								<WindowedAsyncSelect
									inputId='taxGroupId'
									useFetch={useTaxGroup}
									isClearable={false}
									isFetchedAtOnce
									className={cn({
										"temat__select__container--danger": errors?.taxGroupId,
									})}
									{...field}
								/>
							)}
							name='taxGroupId'
							control={control}
							defaultValue={null}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.payAfterId")} htmlFor='payAfterId'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.payAfterId,
						})}
						hintMsg={errors?.payAfterId?.message}>
						<Controller
							render={({ field }) => (
								<WindowedAsyncSelect
									inputId='payAfterId'
									useFetch={usePayAfter}
									isClearable={false}
									isFetchedAtOnce
									className={cn({
										"temat__select__container--danger": errors?.payAfterId,
									})}
									{...field}
								/>
							)}
							name='payAfterId'
							control={control}
							defaultValue={null}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.shipmentPayeeId")} htmlFor='shipmentPayeeId'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.shipmentPayeeId,
						})}
						hintMsg={errors?.shipmentPayeeId?.message}>
						<Controller
							render={({ field }) => (
								<WindowedAsyncSelect
									inputId='shipmentPayeeId'
									useFetch={useShippingPaidBy}
									isClearable={false}
									isFetchedAtOnce
									className={cn({
										"temat__select__container--danger": errors?.shipmentPayeeId,
									})}
									{...field}
								/>
							)}
							name='shipmentPayeeId'
							control={control}
							defaultValue={null}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.defaultOrderStatusId")} htmlFor='defaultOrderStatusId'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.defaultOrderStatusId,
						})}
						hintMsg={errors?.defaultOrderStatusId?.message}>
						<Controller
							render={({ field }) => (
								<WindowedAsyncSelect
									inputId='defaultOrderStatusId'
									useFetch={useOrderStatus}
									isClearable={false}
									isFetchedAtOnce
									className={cn({
										"temat__select__container--danger": errors?.defaultOrderStatusId,
									})}
									{...field}
								/>
							)}
							name='defaultOrderStatusId'
							control={control}
							defaultValue={null}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.confirmMethodId")} htmlFor='confirmMethodId'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.confirmMethodId,
						})}
						hintMsg={errors?.confirmMethodId?.message}>
						<Controller
							render={({ field }) => (
								<WindowedAsyncSelect
									inputId='confirmMethodId'
									useFetch={useConfirmMethod}
									isClearable={false}
									isFetchedAtOnce
									className={cn({
										"temat__select__container--danger": errors?.confirmMethodId,
									})}
									{...field}
								/>
							)}
							name='confirmMethodId'
							control={control}
							defaultValue={null}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem title={t("field.defaultDocumentTypeId")} htmlFor='defaultDocumentTypeId'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.defaultDocumentTypeId,
						})}
						hintMsg={errors?.defaultDocumentTypeId?.message}>
						<Controller
							render={({ field }) => (
								<WindowedAsyncSelect
									inputId='defaultDocumentTypeId'
									useFetch={useDocumentTypes}
									isClearable={false}
									isFetchedAtOnce
									className={cn({
										"temat__select__container--danger": errors?.defaultDocumentTypeId,
									})}
									{...field}
								/>
							)}
							name='defaultDocumentTypeId'
							control={control}
							defaultValue={null}
						/>
					</FormControl>
				</SettingsItem>
				<SettingsItem>
					<Button type='submit' form='profile-form' isLoading={isLoading}>
						{t("action.update", { entry: t("settings.companyDetails") })}
					</Button>
				</SettingsItem>
			</SettingsWrapper>
		</Form>
	);
};

export default SettingsCompanyDetails;
