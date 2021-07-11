import { Form } from "@dodobrat/react-ui-kit";
import { Portal, Card, Text, Button, Flex, FormControl, Input } from "@dodobrat/react-ui-kit";
import { useForm } from "react-hook-form";
import { IconClose } from "../../../components/ui/icons";
import { useCompanyAdd, useCompanyUpdate } from "../../../actions/mutateHooks";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { errorToast, successToast } from "../../../helpers/toastEmitter";

interface Props {
	onClose: () => void;
	payload?: any;
}

const CompaniesForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...payload,
		},
	});

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
		specs: { id: payload?.id },
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

		formData.append("name", data.name);
		formData.append("phone", data.phone);
		formData.append("email", data.email);
		formData.append("bulstat", data.bulstat);
		formData.append("image", data.image[0]);
		formData.append("streetNumber", data.streetNumber);
		formData.append("streetName", data.streetName);
		formData.append("country", data.country);
		formData.append("city", data.city);
		formData.append("zipCode", data.zipCode);
		formData.append("molFirstName", data.molFirstName);
		formData.append("molLastName", data.molLastName);

		if (payload) {
			return updateCompany(formData);
		}
		return addCompany(formData);
	};

	const { ref: innerRefName, ...restName } = register("name", {
		required: `${t("validation.fieldRequired")}`,
		minLength: { value: 3, message: `${t("validation.min3Chars")}` },
		maxLength: { value: 99, message: `${t("validation.max99Chars")}` },
	});
	const { ref: innerRefBulstat, ...restBulstat } = register("bulstat", {
		required: `${t("validation.fieldRequired")}`,
	});
	const { ref: innerRefPhone, ...restPhone } = register("phone");
	const { ref: innerRefEmail, ...restEmail } = register("email");
	const { ref: innerRefImage, ...restImage } = register("image");
	const { ref: innerRefStreetNumber, ...restStreetNumber } = register("streetNumber");
	const { ref: innerRefStreetName, ...restStreetName } = register("streetName");
	const { ref: innerRefCountry, ...restCountry } = register("country");
	const { ref: innerRefCity, ...restCity } = register("city");
	const { ref: innerRefZipCode, ...restZipCode } = register("zipCode");
	const { ref: innerRefMolFirstName, ...restMolFirstName } = register("molFirstName", {
		required: `${t("validation.fieldRequired")}`,
	});
	const { ref: innerRefMolLastName, ...restMolLastName } = register("molLastName", {
		required: `${t("validation.fieldRequired")}`,
	});

	return (
		<Portal onClose={onClose} isOpen animation='none' {...rest}>
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
					<Form id='companies-add-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("companies.name")}
									htmlFor='name'
									className={cn({
										"text--danger": errors?.name,
									})}
									hintMsg={errors?.name?.message}>
									<Input
										name='name'
										placeholder={t("companies.name")}
										{...restName}
										innerRef={innerRefName}
										pigment={errors?.name ? "danger" : "primary"}
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
									<Input
										name='bulstat'
										placeholder={t("companies.bulstat")}
										{...restBulstat}
										innerRef={innerRefBulstat}
										pigment={errors?.bulstat ? "danger" : "primary"}
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
									<Input
										name='molFirstName'
										placeholder={t("companies.molFirstName")}
										{...restMolFirstName}
										innerRef={innerRefMolFirstName}
										pigment={errors?.molFirstName ? "danger" : "primary"}
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
									<Input
										name='molLastName'
										placeholder={t("companies.molLastName")}
										{...restMolLastName}
										innerRef={innerRefMolLastName}
										pigment={errors?.molLastName ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("companies.phone")}
									htmlFor='phone'
									className={cn({
										"text--danger": errors?.phone,
									})}
									hintMsg={errors?.phone?.message}>
									<Input
										name='phone'
										type='tel'
										placeholder={t("companies.phone")}
										{...restPhone}
										innerRef={innerRefPhone}
										pigment={errors?.phone ? "danger" : "primary"}
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
									<Input
										name='email'
										type='email'
										placeholder={t("companies.email")}
										{...restEmail}
										innerRef={innerRefEmail}
										pigment={errors?.email ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col='12'>
								<FormControl
									label={t("companies.image")}
									htmlFor='image'
									className={cn({
										"text--danger": errors?.image,
									})}
									hintMsg={errors?.image?.message}>
									<Input
										type='file'
										name='image'
										placeholder={t("companies.image")}
										{...restImage}
										innerRef={innerRefImage}
										pigment={errors?.image ? "danger" : "primary"}
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
									<Input
										name='country'
										placeholder={t("companies.country")}
										{...restCountry}
										innerRef={innerRefCountry}
										pigment={errors?.country ? "danger" : "primary"}
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
									<Input
										name='city'
										placeholder={t("companies.city")}
										{...restCity}
										innerRef={innerRefCity}
										pigment={errors?.city ? "danger" : "primary"}
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
									<Input
										name='zipCode'
										placeholder={t("companies.zipCode")}
										{...restZipCode}
										innerRef={innerRefZipCode}
										pigment={errors?.zipCode ? "danger" : "primary"}
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
									<Input
										name='streetName'
										placeholder={t("companies.streetName")}
										{...restStreetName}
										innerRef={innerRefStreetName}
										pigment={errors?.streetName ? "danger" : "primary"}
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
									<Input
										name='streetNumber'
										placeholder={t("companies.streetNumber")}
										{...restStreetNumber}
										innerRef={innerRefStreetNumber}
										pigment={errors?.streetNumber ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='companies-add-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{payload ? t("common.update") : t("common.submit")}{" "}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default CompaniesForm;
