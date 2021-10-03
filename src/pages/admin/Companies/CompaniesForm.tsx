import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Form, Portal, Card, Text, Button, Flex, FormControl, InputComponent } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useCompanyAdd, useCompanyUpdate } from "../../../actions/mutateHooks";
import { usePhoneCodes } from "../../../actions/fetchHooks";

import WindowedAsyncSelect from "../../../components/forms/WindowedAsyncSelect";
import { IconClose } from "../../../components/ui/icons";
import PhoneCode from "../../../components/util/PhoneCode";
import { successToast } from "../../../helpers/toastEmitter";
import { dirtyConfirmOnExit } from "../../../helpers/helpers";
import { imageValidator } from "../../../helpers/formValidations";

interface Props {
	onClose: () => void;
	payload?: any;
}

const CompaniesForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		control,
		watch,
		handleSubmit,
		formState: { errors, touchedFields },
	} = useForm({
		defaultValues: {
			...payload,
			phoneCodeId: null,
			image: "",
		},
	});

	const watchPhone = watch("phone");

	const { mutate: addCompany, isLoading: isLoadingAdd } = useCompanyAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("companies");
				onClose();
			},
		},
	});

	const { mutate: updateCompany, isLoading: isLoadingUpdate } = useCompanyUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("companies");
				onClose();
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

		if (payload) {
			const formFinalData = { id: payload?.id, formData };
			return updateCompany(formFinalData);
		}
		return addCompany(formData);
	};

	return (
		<Portal
			onClose={onClose}
			onOutsideClick={() => dirtyConfirmOnExit(touchedFields, onClose, t)}
			innerClassName='py--4'
			isOpen
			animation='none'
			{...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t(`action.${payload ? "update" : "add"}`, { entry: t("common.company") })}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='companies-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("field.name")}
									htmlFor='name'
									className={cn({
										"text--danger": errors?.name,
									})}
									hintMsg={errors?.name?.message}>
									<Controller
										render={({ field }) => (
											<InputComponent
												{...field}
												placeholder={t("field.name")}
												pigment={errors?.name ? "danger" : "primary"}
											/>
										)}
										name='name'
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
									label={t("field.bulstat")}
									htmlFor='bulstat'
									className={cn({
										"text--danger": errors?.bulstat,
									})}
									hintMsg={errors?.bulstat?.message}>
									<Controller
										render={({ field }) => (
											<InputComponent
												{...field}
												placeholder={t("field.bulstat")}
												pigment={errors?.bulstat ? "danger" : "primary"}
											/>
										)}
										name='bulstat'
										control={control}
										defaultValue=''
										rules={{
											required: t("validation.required"),
											maxLength: {
												value: 9,
												message: t("validation.maxLength", { value: 9 }),
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("field.molFirstName")}
									htmlFor='molFirstName'
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
									label={t("field.molLastName")}
									htmlFor='molLastName'
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
							<Flex.Col col={{ base: "5", xs: "4" }}>
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
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("field.email")}
									htmlFor='email'
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
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
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
											const { onChange, value, ...fieldRest } = field;
											return (
												<InputComponent
													{...fieldRest}
													type='file'
													accept='image/*'
													placeholder={t("field.image")}
													onChange={(e) => onChange(e.target.files)}
													value={value?.[0]?.filename}
													pigment={errors?.image ? "danger" : "primary"}
												/>
											);
										}}
										name='image'
										control={control}
										defaultValue=''
										rules={{
											validate: (files) =>
												imageValidator({
													file: files?.[0],
													t,
												}),
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
										render={({ field }) => (
											<InputComponent
												{...field}
												placeholder={t("field.city")}
												pigment={errors?.city ? "danger" : "primary"}
											/>
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
							</Flex.Col>
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='companies-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{t(`action.${payload ? "update" : "add"}`, { entry: t("common.company") })}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default CompaniesForm;
