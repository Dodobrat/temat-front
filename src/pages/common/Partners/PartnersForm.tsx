import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Checkbox, Input, Card, Portal, Form, Flex, FormControl, Text, Button } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { usePartnerAdd, usePartnerUpdate } from "../../../actions/mutateHooks";
import { usePhoneCodes } from "../../../actions/fetchHooks";
import { useAuthContext } from "../../../context/AuthContext";

import { IconClose } from "../../../components/ui/icons";
import WindowedAsyncSelect from "../../../components/forms/WindowedAsyncSelect";
import PhoneCode from "../../../components/util/PhoneCode";

import { successToast } from "../../../helpers/toastEmitter";
import { dirtyConfirmOnExit } from "../../../helpers/helpers";

interface Props {
	onClose: () => void;
	payload?: any;
}

const PartnersForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const {
		userValue: { user },
	} = useAuthContext();
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
			companyId: user?.companyId,
		},
	});

	const watchVatRegistered = watch("vatRegistered");
	const watchPhone = watch("phone");

	const { mutate: addPartner, isLoading: isLoadingAdd } = usePartnerAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("partners");
				onClose();
			},
		},
	});

	const { mutate: updatePartner, isLoading: isLoadingUpdate } = usePartnerUpdate({
		specs: {
			id: payload?.id,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("partners");
				queryClient.invalidateQueries(["partnerById", { partnerId: payload?.id }]);
				onClose();
			},
		},
	});

	const onSubmit = (data: any) => {
		const parsedData = {
			...data,
			phone: data.phone.toString(),
			phoneCodeId: data.phone ? data?.phoneCodeId?.value : "",
		};
		console.log(parsedData);
		if (payload) {
			return updatePartner(parsedData);
		}
		return addPartner(parsedData);
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
					<Text className='mb--0'>{t(`action.${payload ? "update" : "add"}`, { entry: t("common.partner") })}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='partners-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col='12'>
								<FormControl
									label={t("field.name")}
									htmlFor='name'
									className={cn({
										"text--danger": errors?.name,
									})}
									hintMsg={errors?.name?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													name='name'
													placeholder={t("field.name")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.name ? "danger" : "primary"}
												/>
											);
										}}
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
												value: 99,
												message: t("validation.maxLength", { value: 99 }),
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("field.reference")}
									htmlFor='reference'
									className={cn({
										"text--danger": errors?.reference,
									})}
									hintMsg={errors?.reference?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													name='reference'
													placeholder={t("field.reference")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.reference ? "danger" : "primary"}
												/>
											);
										}}
										name='reference'
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
									htmlFor='bulstat'
									className={cn({
										"text--danger": errors?.bulstat,
									})}
									hintMsg={errors?.bulstat?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													placeholder={t("field.bulstat")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.bulstat ? "danger" : "primary"}
												/>
											);
										}}
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
							<Flex.Col col='12'>
								<FormControl
									withLabel={false}
									htmlFor='vatRegistered'
									className={cn({
										"text--danger": errors?.vatRegistered,
									})}
									hintMsg={errors?.vatRegistered?.message}>
									<Controller
										render={({ field }) => {
											const { ref, onChange, ...fieldRest } = field;
											return (
												<Checkbox
													{...fieldRest}
													checked={field.value}
													onChange={(e) => onChange(e.target.checked)}
													innerRef={ref}
													pigment={errors?.vatRegistered ? "danger" : "primary"}>
													{t("field.vatRegistered")}
												</Checkbox>
											);
										}}
										name='vatRegistered'
										control={control}
										defaultValue={false}
									/>
								</FormControl>
							</Flex.Col>
							{watchVatRegistered > 0 && (
								<Flex.Col col='12'>
									<FormControl
										label={t("field.bulstatVAT")}
										htmlFor='bulstatVAT'
										className={cn({
											"text--danger": errors?.bulstatVAT,
										})}
										hintMsg={errors?.bulstatVAT?.message}>
										<Controller
											render={({ field }) => {
												const { ref, ...fieldRest } = field;
												return (
													<Input
														name='bulstatVAT'
														placeholder={t("field.bulstatVAT")}
														{...fieldRest}
														innerRef={ref}
														pigment={errors?.bulstatVAT ? "danger" : "primary"}
													/>
												);
											}}
											name='bulstatVAT'
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
							)}
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("field.molFirstName")}
									htmlFor='molFirstName'
									className={cn({
										"text--danger": errors?.molFirstName,
									})}
									hintMsg={errors?.molFirstName?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													placeholder={t("field.molFirstName")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.molFirstName ? "danger" : "primary"}
												/>
											);
										}}
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
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													placeholder={t("field.molLastName")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.molLastName ? "danger" : "primary"}
												/>
											);
										}}
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
											required: t("validation.required"),
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
											required: t("validation.required"),
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
					<Button type='submit' form='partners-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{t(`action.${payload ? "update" : "add"}`, { entry: t("common.partner") })}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default PartnersForm;
