import { Form } from "@dodobrat/react-ui-kit";
import { Portal, Card, Text, Button, Flex, FormControl, Input } from "@dodobrat/react-ui-kit";
import { Controller, useForm } from "react-hook-form";
import { IconClose } from "../../../components/ui/icons";
import { useCompanyAdd, useCompanyUpdate } from "../../../actions/mutateHooks";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { confirmOnExit } from "../../../helpers/helpers";
import AsyncSelect from "../../../components/forms/AsyncSelect";
import { usePhoneCodes } from "../../../actions/fetchHooks";
import { PhoneCode } from "../../common/Orders/order_steps/OrderStepShipping";
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
		formState: { errors },
	} = useForm({
		defaultValues: {
			...payload,
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
			onError: (err: any) => errorToast(err),
		},
	});

	const { mutate: updateCompany, isLoading: isLoadingUpdate } = useCompanyUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("companies");
				onClose();
			},
			onError: (err: any) => errorToast(err),
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
		<Portal onOutsideClick={() => confirmOnExit(onClose)} isOpen animation='none' {...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{payload ? t("companies.updateCompany") : t("companies.addCompany")}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='companies-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("companies.name")}
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
													placeholder={t("companies.name")}
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
											required: "Field is required",
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
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("companies.bulstat")}
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
													placeholder={t("companies.bulstat")}
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
											required: "Field is required",
											maxLength: {
												value: 9,
												message: "Max 9 characters",
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("companies.molFirstName")}
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
													placeholder={t("companies.molFirstName")}
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
											required: "Field is required",
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
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("companies.molLastName")}
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
													placeholder={t("companies.molLastName")}
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
											required: "Field is required",
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
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("companies.email")}
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
													placeholder={t("companies.email")}
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
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("companies.image")}
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
													placeholder={t("companies.image")}
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
									label={t("companies.country")}
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
													placeholder={t("companies.country")}
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
									label={t("companies.city")}
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
													placeholder={t("companies.city")}
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
									label={t("companies.zipCode")}
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
													placeholder={t("companies.zipCode")}
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
									label={t("companies.streetName")}
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
													placeholder={t("companies.streetName")}
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
									label={t("companies.streetNumber")}
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
													placeholder={t("companies.streetNumber")}
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
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='companies-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{payload ? t("common.update") : t("common.submit")}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default CompaniesForm;
