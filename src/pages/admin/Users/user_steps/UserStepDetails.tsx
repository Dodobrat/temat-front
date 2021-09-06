import { FormControl } from "@dodobrat/react-ui-kit";
import { Input } from "@dodobrat/react-ui-kit";
import { Flex } from "@dodobrat/react-ui-kit";
import { Controller } from "react-hook-form";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { usePhoneCodes } from "../../../../actions/fetchHooks";
import { PhoneCode } from "../../../common/Orders/order_steps/OrderStepShipping";
import { imageValidator } from "../../../../helpers/formValidations";

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
					label={t("users.firstName")}
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
									placeholder={t("users.firstName")}
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
							required: "Field is required",
							minLength: { value: 2, message: "Min 2 characters" },
							maxLength: { value: 50, message: "Max 50 characters" },
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("users.lastName")}
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
									placeholder={t("users.lastName")}
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
							required: "Field is required",
							minLength: { value: 2, message: "Min 2 characters" },
							maxLength: { value: 50, message: "Max 50 characters" },
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "5", md: "4" }}>
				<FormControl
					label={t("users.phoneCode")}
					htmlFor='phoneCodeId'
					className={cn({
						"text--danger": errors?.phoneCodeId,
					})}
					hintMsg={errors?.phoneCodeId?.message}>
					<Controller
						render={({ field }) => (
							<AsyncSelect
								inputId='phone-code-id'
								useFetch={usePhoneCodes}
								defaultSearchString={payload?.phoneCode ?? "359"}
								isClearable={false}
								defaultOptions
								preSelectOption
								searchStringLength={1}
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
							validate: (val) => (watchPhone.toString().length > 0 && !val ? "Field is required" : true),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "7", xs: "8" }}>
				<FormControl
					label={t("users.phone")}
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
									placeholder={t("users.phone")}
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
								message: "Invalid characters supplied",
							},
							minLength: { value: 9, message: "Min 9 characters" },
							maxLength: { value: 9, message: "Max 9 characters" },
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label={t("users.email")}
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
									placeholder={t("users.email")}
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
							required: "Field is required",
							pattern: {
								value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
								message: "Invalid Email",
							},
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label={t("users.image")}
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
									placeholder={t("users.image")}
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
							validate: (files) => imageValidator({ file: files?.[0] }),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label={t("users.country")}
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
									placeholder={t("users.country")}
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
							minLength: { value: 2, message: "Min 2 characters" },
							maxLength: { value: 50, message: "Max 50 characters" },
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "8" }}>
				<FormControl
					label={t("users.city")}
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
									placeholder={t("users.city")}
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
							minLength: { value: 2, message: "Min 2 characters" },
							maxLength: { value: 60, message: "Max 60 characters" },
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "4" }}>
				<FormControl
					label={t("users.zipCode")}
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
									placeholder={t("users.zipCode")}
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
			<Flex.Col col={{ base: "12", xs: "8" }}>
				<FormControl
					label={t("users.streetName")}
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
									placeholder={t("users.streetName")}
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
							minLength: { value: 2, message: "Min 2 characters" },
							maxLength: { value: 50, message: "Max 50 characters" },
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "4" }}>
				<FormControl
					label={t("users.streetNumber")}
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
									placeholder={t("users.streetNumber")}
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
							minLength: { value: 1, message: "Min 1 characters" },
							maxLength: { value: 10, message: "Max 10 characters" },
						}}
					/>
				</FormControl>
			</Flex.Col>
		</>
	);
};

export default UserStepDetails;
