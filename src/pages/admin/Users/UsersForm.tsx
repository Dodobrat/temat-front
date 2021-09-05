import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Form, Portal, Card, Text, Button, Flex, FormControl, Input } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useUserAdd, useUserPersonalUpdate, useUserCredentialsUpdate } from "../../../actions/mutateHooks";
import { usePhoneCodes, useRoles } from "../../../actions/fetchHooks";

import AsyncSelect from "../../../components/forms/AsyncSelect";
import { IconClose, IconEye, IconEyeCrossed } from "../../../components/ui/icons";
import { PhoneCode } from "../../common/Orders/order_steps/OrderStepShipping";

import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { confirmOnExit } from "../../../helpers/helpers";
import { imageValidator } from "../../../helpers/formValidations";

interface Props {
	onClose: () => void;
	payload?: any;
}

const UsersForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		watch,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...payload,
			image: "",
			roleId: payload ? { value: payload?.roleId, label: payload?.roleName } : null,
		},
	});

	const watchPass = watch("password", "");
	const watchPhone = watch("phone");

	const { mutate: addUser, isLoading: isLoadingAdd } = useUserAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("users");
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const { mutate: updatePersonalUser, isLoading: isLoadingPersonalUpdate } = useUserPersonalUpdate({
		queryConfig: {
			onSuccess: (res) => successToast(res),
			onError: (err: any) => errorToast(err),
		},
	});

	const { mutate: updateCredentialUser, isLoading: isLoadingCredentialsUpdate } = useUserCredentialsUpdate({
		queryConfig: {
			onSuccess: (res) => successToast(res),
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = async (data: any) => {
		const formData = new FormData();

		for (const entry of Object.entries(data)) {
			if (!!entry[1]) {
				if (entry[1] instanceof FileList) {
					formData.append(entry[0], entry[1][0]);
				} else if (typeof entry[1] === "object") {
					formData.append(entry[0], entry[1]["value"]);
				} else if (typeof entry[1] === "string") {
					formData.append(entry[0], entry[1]);
				}
			}
		}

		if (payload) {
			const toSend = {
				id: payload?.id,
				formData,
			};
			updatePersonalUser(toSend);
			updateCredentialUser(toSend);
			return;
		}
		return addUser(formData);
	};

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose)} isOpen animation='none' {...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{payload ? t("users.updateUser") : t("users.addUser")}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='users-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
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
							<Flex.Col col='12'>
								<FormControl
									label={t("users.username")}
									htmlFor='username'
									className={cn({
										"text--danger": errors?.username,
									})}
									hintMsg={errors?.username?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													name='username'
													placeholder={t("users.username")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.username ? "danger" : "primary"}
												/>
											);
										}}
										name='username'
										control={control}
										defaultValue=''
										rules={{
											required: "Field is required",
											pattern: {
												value: /^[a-zA-Z0-9]+$/,
												message: "Invalid Username characters",
											},
											minLength: {
												value: 2,
												message: "Min 2 characters",
											},
											maxLength: {
												value: 50,
												message: "Max 50 characters",
											},
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
							<Flex.Col col={{ base: "12", xs: "6" }}>
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
													<a
														href={payload?.image}
														target='_blank'
														rel='noopener noreferrer'
														className='text--info'>
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
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("users.role")}
									htmlFor='roleId'
									className={cn({
										"text--danger": errors?.roleId,
									})}
									hintMsg={errors?.roleId?.message}>
									<Controller
										render={({ field }) => (
											<AsyncSelect
												useFetch={useRoles}
												isClearable={false}
												className={cn({
													"temat__select__container--danger": errors?.roleId,
												})}
												placeholder='Select Role'
												{...field}
											/>
										)}
										name='roleId'
										control={control}
										defaultValue={null}
										rules={{
											required: "Field is required",
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("users.password")}
									htmlFor='password'
									className={cn({
										"text--danger": errors?.password,
									})}
									hintMsg={errors?.password?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													type='password'
													placeholder='Password'
													passwordRevealComponent={(isVisible) =>
														isVisible ? (
															<IconEyeCrossed className='dui__icon' />
														) : (
															<IconEye className='dui__icon' />
														)
													}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.password ? "danger" : "primary"}
												/>
											);
										}}
										name='password'
										control={control}
										defaultValue=''
										rules={{
											required: payload ? false : "Field is required",
											pattern: {
												value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,250}$/,
												message: "Password format doesn't match requirements",
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("users.confirmPassword")}
									htmlFor='confirmPassword'
									className={cn({
										"text--danger": errors?.confirmPassword,
									})}
									hintMsg={errors?.confirmPassword?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													type='password'
													placeholder='Password'
													passwordRevealComponent={(isVisible) =>
														isVisible ? (
															<IconEyeCrossed className='dui__icon' />
														) : (
															<IconEye className='dui__icon' />
														)
													}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.confirmPassword ? "danger" : "primary"}
												/>
											);
										}}
										name='confirmPassword'
										control={control}
										defaultValue=''
										rules={{
											validate: (val) => val === watchPass || "Passwords don't match",
											required: !payload ? "Field is required" : false,
										}}
									/>
								</FormControl>
							</Flex.Col>
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button
						type='submit'
						form='users-form'
						className='ml--2'
						isLoading={isLoadingAdd || isLoadingPersonalUpdate || isLoadingCredentialsUpdate}>
						{payload ? t("common.update") : t("common.submit")}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default UsersForm;
