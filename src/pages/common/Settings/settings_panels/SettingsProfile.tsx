import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, Flex, InputComponent, Form } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useAuthContext } from "../../../../context/AuthContext";

import { usePhoneCodes } from "../../../../actions/fetchHooks";
import { useUserPersonalUpdate } from "../../../../actions/mutateHooks";

import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";
import PhoneCode from "../../../../components/util/PhoneCode";
import SettingsItem from "../SettingsItem";
import SettingsWrapper from "../SettingsWrapper";

import { imageValidator } from "../../../../helpers/formValidations";
import { successToast } from "../../../../helpers/toastEmitter";
import Image from "../../../../components/ui/Image";

const SettingsProfile = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		userValue: { user },
	} = useAuthContext();

	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			image: "",
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			email: user?.email ?? "",
			phoneCode: null,
			phone: user?.phone ?? "",
			country: user?.country ?? "",
			city: user?.city ?? "",
			zipCode: user?.zipCode ?? "",
			streetName: user?.streetName ?? "",
			streetNumber: user?.streetNumber ?? "",
		} as any,
	});

	const watchPhone = watch("phone");

	const { mutateAsync: updatePersonalUser, isLoading: isLoadingPersonalUpdate } = useUserPersonalUpdate({
		queryConfig: {
			onSuccess: (res) => {
				queryClient.invalidateQueries("users");
				queryClient.invalidateQueries("logged_user");
				successToast(res);
			},
		},
	});

	const onSubmit = (data: any) => {
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

		const toSend = {
			id: user?.id,
			formData,
		};

		updatePersonalUser(toSend);
	};

	return (
		<Form id='profile-form' onSubmit={handleSubmit(onSubmit)}>
			<SettingsWrapper>
				<SettingsItem title={t("field.image")} htmlFor='image'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.image,
						})}
						hintMsg={errors?.image?.message}>
						<Controller
							render={({ field }) => {
								const { onChange, value, ...fieldRest } = field;
								return (
									<Flex wrap='nowrap'>
										<Flex.Col col='auto'>
											<div
												style={{
													width: "2.375rem",
													height: "2.375rem",
												}}>
												<Image imgSrc={user?.image} alt='profile picture' />
											</div>
										</Flex.Col>
										<Flex.Col>
											<InputComponent
												type='file'
												accept='image/*'
												placeholder={t("field.image")}
												{...fieldRest}
												onChange={(e) => onChange(e.target.files)}
												value={value?.[0]?.filename}
												pigment={errors?.image ? "danger" : "primary"}
											/>
										</Flex.Col>
									</Flex>
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
				</SettingsItem>
				<SettingsItem title={t("field.firstName")} htmlFor='firstName'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.firstName,
						})}
						hintMsg={errors?.firstName?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.firstName")}
									pigment={errors?.firstName ? "danger" : "primary"}
								/>
							)}
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
				</SettingsItem>
				<SettingsItem title={t("field.lastName")} htmlFor='lastName'>
					<FormControl
						withLabel={false}
						className={cn({
							"text--danger": errors?.lastName,
						})}
						hintMsg={errors?.lastName?.message}>
						<Controller
							render={({ field }) => (
								<InputComponent
									{...field}
									placeholder={t("field.lastName")}
									pigment={errors?.lastName ? "danger" : "primary"}
								/>
							)}
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
								required: t("validation.required"),
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
									defaultSearchString={user?.phoneCode ?? "359"}
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
					<Button type='submit' form='profile-form' isLoading={isLoadingPersonalUpdate}>
						{t("action.update", { entry: t("settings.profile") })}
					</Button>
				</SettingsItem>
			</SettingsWrapper>
		</Form>
	);
};

export default SettingsProfile;
