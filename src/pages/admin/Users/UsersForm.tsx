import { Form } from "@dodobrat/react-ui-kit";
import { Portal, Card, Text, Button, Flex, FormControl, Input } from "@dodobrat/react-ui-kit";
import { useForm } from "react-hook-form";
import { IconClose } from "../../../components/ui/icons";
import { useUserAdd, useUserPersonalUpdate, useUserCredentialsUpdate } from "../../../actions/mutateHooks";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { errorToast, successToast } from "../../../helpers/toastEmitter";
import AsyncSelect from "../../../components/forms/AsyncSelect";
import { useRoles } from "../../../actions/fetchHooks";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
	onClose: () => void;
	payload?: any;
}

const UsersForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...payload,
			roleId: payload ? { value: payload?.roleId, label: payload?.roleName } : null,
		},
	});

	const [selectValue, setSelectValue] = useState(() => (payload ? { value: payload?.roleId, label: payload?.roleName } : null));
	const [selectError, setSelectError] = useState(null);
	const [updatedUser, setUpdatedUser] = useState({
		personal: false,
		credentials: false,
	});

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
		specs: { id: payload?.id },
		queryConfig: {
			onSuccess: () => setUpdatedUser((prev) => ({ ...prev, personal: true })),
			onError: (err: any) => errorToast(err),
		},
	});

	const { mutate: updateCredentialUser, isLoading: isLoadingCredentialsUpdate } = useUserCredentialsUpdate({
		specs: { id: payload?.id },
		queryConfig: {
			onSuccess: () => setUpdatedUser((prev) => ({ ...prev, credentials: true })),
			onError: (err: any) => errorToast(err),
		},
	});

	useEffect(() => {
		if (updatedUser.credentials && updatedUser.personal) {
			successToast({ success: "Updated User successfully!" });
			queryClient.invalidateQueries("users");
			onClose();
		}
	}, [updatedUser, onClose, queryClient]);

	const onSubmit = (data: any) => {
		if (!data.roleId?.value) {
			return setSelectError({ message: "Field is required" });
		} else {
			setSelectError(null);
		}
		const formData = new FormData();
		formData.append("username", data.username);
		formData.append("phone", data.phone);
		formData.append("email", data.email);
		formData.append("firstName", data.firstName);
		formData.append("lastName", data.lastName);
		formData.append("image", data.image[0]);
		formData.append("streetNumber", data.streetNumber);
		formData.append("streetName", data.streetName);
		formData.append("country", data.country);
		formData.append("password", data.password);
		formData.append("confirmPassword", data.confirmPassword);
		formData.append("roleId", data.roleId?.value);

		if (payload) {
			updatePersonalUser(formData);
			updateCredentialUser(formData);
			return;
		}
		return addUser(formData);
	};

	const handleOnChangeRoleId = (option: any) => {
		setValue("roleId", option);
		setSelectValue(option);
		if (selectError && option) {
			setSelectError(null);
		}
	};

	const { ref: innerRefUsername, ...restUsername } = register("username", {
		required: `${t("validation.fieldRequired")}`,
		minLength: { value: 3, message: `${t("validation.min3Chars")}` },
		maxLength: { value: 50, message: `${t("validation.max50Chars")}` },
	});
	const { ref: innerRefFirstName, ...restFirstName } = register("firstName");
	const { ref: innerRefLastName, ...restLastName } = register("lastName");
	const { ref: innerRefEmail, ...restEmail } = register("email");
	const { ref: innerRefPhone, ...restPhone } = register("phone");
	const { ref: innerRefCountry, ...restCountry } = register("country");
	const { ref: innerRefCity, ...restCity } = register("city");
	const { ref: innerRefZipCode, ...restZipCode } = register("zipCode");
	const { ref: innerRefStreetName, ...restStreetName } = register("streetName");
	const { ref: innerRefStreetNumber, ...restStreetNumber } = register("streetNumber");
	const { ref: innerRefImage, ...restImage } = register("image");
	const { ref: innerRefPassword, ...restPassword } = register("password");
	const { ref: innerRefConfirmPassword, ...restConfirmPassword } = register("confirmPassword");

	return (
		<Portal onClose={onClose} isOpen animation='none' {...rest}>
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
					<Form id='users-add-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("users.firstName")}
									htmlFor='firstName'
									className={cn({
										"text--danger": errors?.firstName,
									})}
									hintMsg={errors?.firstName?.message}>
									<Input
										name='firstName'
										placeholder={t("users.firstName")}
										{...restFirstName}
										innerRef={innerRefFirstName}
										pigment={errors?.firstName ? "danger" : "primary"}
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
									<Input
										name='lastName'
										placeholder={t("users.lastName")}
										{...restLastName}
										innerRef={innerRefLastName}
										pigment={errors?.lastName ? "danger" : "primary"}
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
									<Input
										name='username'
										placeholder={t("users.username")}
										{...restUsername}
										innerRef={innerRefUsername}
										pigment={errors?.username ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("users.phone")}
									htmlFor='phone'
									className={cn({
										"text--danger": errors?.phone,
									})}
									hintMsg={errors?.phone?.message}>
									<Input
										type='tel'
										name='phone'
										placeholder={t("users.phone")}
										{...restPhone}
										innerRef={innerRefPhone}
										pigment={errors?.phone ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("users.email")}
									htmlFor='email'
									className={cn({
										"text--danger": errors?.email,
									})}
									hintMsg={errors?.email?.message}>
									<Input
										name='email'
										type='email'
										placeholder={t("users.email")}
										{...restEmail}
										innerRef={innerRefEmail}
										pigment={errors?.email ? "danger" : "primary"}
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
									<Input
										name='country'
										placeholder={t("users.country")}
										{...restCountry}
										innerRef={innerRefCountry}
										pigment={errors?.country ? "danger" : "primary"}
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
									<Input
										name='city'
										placeholder={t("users.city")}
										{...restCity}
										innerRef={innerRefCity}
										pigment={errors?.city ? "danger" : "primary"}
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
									<Input
										name='zipCode'
										placeholder={t("users.zipCode")}
										{...restZipCode}
										innerRef={innerRefZipCode}
										pigment={errors?.zipCode ? "danger" : "primary"}
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
									<Input
										name='streetName'
										placeholder={t("users.streetName")}
										{...restStreetName}
										innerRef={innerRefStreetName}
										pigment={errors?.streetName ? "danger" : "primary"}
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
									<Input
										name='streetNumber'
										placeholder={t("users.streetNumber")}
										{...restStreetNumber}
										innerRef={innerRefStreetNumber}
										pigment={errors?.streetNumber ? "danger" : "primary"}
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
									hintMsg={errors?.image?.message}>
									<Input
										type='file'
										name='image'
										placeholder={t("users.image")}
										{...restImage}
										innerRef={innerRefImage}
										pigment={errors?.image ? "danger" : "primary"}
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
									<AsyncSelect
										useFetch={useRoles}
										value={selectValue}
										onChange={handleOnChangeRoleId}
										className={cn({
											"temat__select__container--danger": selectError,
										})}
										placeholder='Select Role'
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
									<Input
										type='password'
										name='password'
										placeholder={t("users.password")}
										{...restPassword}
										innerRef={innerRefPassword}
										pigment={errors?.password ? "danger" : "primary"}
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
									<Input
										type='password'
										name='confirmPassword'
										placeholder={t("users.confirmPassword")}
										{...restConfirmPassword}
										innerRef={innerRefConfirmPassword}
										pigment={errors?.confirmPassword ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button
						type='submit'
						form='users-add-form'
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
