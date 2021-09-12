import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { Flex, Input, FormControl } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { usePhoneCodes } from "../../../../actions/fetchHooks";

import PhoneCode from "../../../../components/util/PhoneCode";

import { imageValidator } from "../../../../helpers/formValidations";
import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";

interface Props {
	payload?: any;
	formProps: any;
}

const UserStepDetails = ({ payload, formProps: { control, errors, watch } }: Props) => {
	const { t } = useTranslation();

	const watchPhone = watch("phone");

	return (
		<>
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("field.firstName")}
					htmlFor='firstName'
					className={cn({
						"text--danger": errors?.firstName,
					})}
					hintMsg={errors?.firstName?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<Input
									name='firstName'
									placeholder={t("field.firstName")}
									{...fieldRest}
									innerRef={ref}
									pigment={errors?.firstName ? "danger" : "primary"}
								/>
							);
						}}
						name='firstName'
						control={control}
						defaultValue=''
						rules={{
							required: t("validation.required"),
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
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("field.lastName")}
					htmlFor='lastName'
					className={cn({
						"text--danger": errors?.lastName,
					})}
					hintMsg={errors?.lastName?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<Input
									name='lastName'
									placeholder={t("field.lastName")}
									{...fieldRest}
									innerRef={ref}
									pigment={errors?.lastName ? "danger" : "primary"}
								/>
							);
						}}
						name='lastName'
						control={control}
						defaultValue=''
						rules={{
							required: t("validation.required"),
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
			</Flex.Col>
			<Flex.Col col={{ base: "5", md: "4" }}>
				<FormControl
					label={t("field.phoneCode")}
					htmlFor='phoneCodeId'
					className={cn({
						"text--danger": errors?.phoneCodeId,
					})}
					hintMsg={errors?.phoneCodeId?.message}>
					<Controller
						render={({ field }) => (
							<WindowedAsyncSelect
								inputId='phoneCodeId'
								useFetch={usePhoneCodes}
								defaultSearchString={payload?.phoneCode ?? "359"}
								isClearable={false}
								filterKey='code'
								defaultOptions
								preSelectOption
								isFetchedAtOnce
								labelComponent={(data) => <PhoneCode data={data} />}
								className={cn({
									"temat__select__container--danger": errors?.phoneCodeId,
								})}
								{...field}
							/>
						)}
						name='phoneCodeId'
						control={control}
						defaultValue={null}
						rules={{
							validate: (val) => (watchPhone.toString().length > 0 && !val ? t("validation.required") : true),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "7", xs: "8" }}>
				<FormControl
					label={t("field.phone")}
					htmlFor='phone'
					className={cn({
						"text--danger": errors?.phone,
					})}
					hintMsg={errors?.phone?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<Input
									type='tel'
									placeholder={t("field.phone")}
									{...fieldRest}
									innerRef={ref}
									pigment={errors?.phone ? "danger" : "primary"}
								/>
							);
						}}
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
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label={t("field.email")}
					htmlFor='email'
					className={cn({
						"text--danger": errors?.email,
					})}
					hintMsg={errors?.email?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<Input
									type='email'
									placeholder={t("field.email")}
									{...fieldRest}
									innerRef={ref}
									pigment={errors?.email ? "danger" : "primary"}
								/>
							);
						}}
						name='email'
						control={control}
						defaultValue=''
						rules={{
							required: t("validation.required"),
							pattern: {
								value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
								message: t("validation.pattern"),
							},
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label={t("field.image")}
					htmlFor='image'
					className={cn({
						"text--danger": errors?.image,
					})}
					hintMsg={
						<>
							{payload?.image ? (
								<>
									<a href={payload?.image} target='_blank' rel='noopener noreferrer' className='text--info'>
										Image Link
									</a>
									{!!errors?.image?.message && <br />}
								</>
							) : (
								""
							)}
							{errors?.image?.message ?? ""}
						</>
					}>
					<Controller
						render={({ field }) => {
							const { ref, onChange, value, ...fieldRest } = field;
							return (
								<Input
									type='file'
									accept='image/*'
									placeholder={t("field.image")}
									{...fieldRest}
									onChange={(e) => onChange(e.target.files)}
									value={value?.[0]?.filename}
									innerRef={ref}
									pigment={errors?.image ? "danger" : "primary"}
								/>
							);
						}}
						name='image'
						control={control}
						defaultValue=''
						rules={{
							validate: (files) => imageValidator({ file: files?.[0], t }),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label={t("field.country")}
					htmlFor='country'
					className={cn({
						"text--danger": errors?.country,
					})}
					hintMsg={errors?.country?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<Input
									placeholder={t("field.country")}
									{...fieldRest}
									innerRef={ref}
									pigment={errors?.country ? "danger" : "primary"}
								/>
							);
						}}
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
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "8" }}>
				<FormControl
					label={t("field.city")}
					htmlFor='city'
					className={cn({
						"text--danger": errors?.city,
					})}
					hintMsg={errors?.city?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<Input
									placeholder={t("field.city")}
									{...fieldRest}
									innerRef={ref}
									pigment={errors?.city ? "danger" : "primary"}
								/>
							);
						}}
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
			<Flex.Col col={{ base: "12", xs: "8" }}>
				<FormControl
					label={t("field.streetName")}
					htmlFor='streetName'
					className={cn({
						"text--danger": errors?.streetName,
					})}
					hintMsg={errors?.streetName?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<Input
									placeholder={t("field.streetName")}
									{...fieldRest}
									innerRef={ref}
									pigment={errors?.streetName ? "danger" : "primary"}
								/>
							);
						}}
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
	);
};

export default UserStepDetails;
