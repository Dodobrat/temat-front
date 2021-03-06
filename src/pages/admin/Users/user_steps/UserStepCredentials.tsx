import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { Flex, FormControl } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useCompanies, useRoles, useWarehouses } from "../../../../actions/fetchHooks";

import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";
import { InputComponent } from "@dodobrat/react-ui-kit";
import PasswordInput from "../../../../components/forms/PasswordInput";

interface Props {
	payload?: any;
	formProps: any;
}

const UserStepCredentials = ({ payload, formProps: { control, errors, watch } }: Props) => {
	const { t } = useTranslation();

	const watchPass = watch("password", "");

	return (
		<>
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("field.username")}
					htmlFor='username'
					className={cn({
						"text--danger": errors?.username,
					})}
					hintMsg={errors?.username?.message}>
					<Controller
						render={({ field }) => (
							<InputComponent
								{...field}
								placeholder={t("field.username")}
								disabled={!!payload}
								pigment={errors?.username ? "danger" : "primary"}
							/>
						)}
						name='username'
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
							pattern: {
								value: /^[a-zA-Z0-9]+$/,
								message: t("validation.pattern"),
							},
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("field.role")}
					htmlFor='roleId'
					className={cn({
						"text--danger": errors?.roleId,
					})}
					hintMsg={errors?.roleId?.message}>
					<Controller
						render={({ field }) => (
							<WindowedAsyncSelect
								inputId='role'
								useFetch={useRoles}
								isClearable={false}
								defaultOptions
								isFetchedAtOnce
								preSelectOption={!payload}
								className={cn({
									"temat__select__container--danger": errors?.roleId,
								})}
								placeholder={t("field.select", { field: t("field.role") })}
								{...field}
							/>
						)}
						name='roleId'
						control={control}
						defaultValue={null}
						rules={{
							required: t("validation.required"),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("field.password")}
					htmlFor='password'
					className={cn({
						"text--danger": errors?.password,
					})}
					hintMsg={errors?.password?.message}>
					<Controller
						render={({ field }) => <PasswordInput {...field} pigment={errors?.password ? "danger" : "primary"} />}
						name='password'
						control={control}
						defaultValue=''
						rules={{
							required: payload ? false : t("validation.required"),
							pattern: {
								value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,250}$/,
								message: t("validation.passRequirements"),
							},
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("field.confirmPassword")}
					htmlFor='confirmPassword'
					className={cn({
						"text--danger": errors?.confirmPassword,
					})}
					hintMsg={errors?.confirmPassword?.message}>
					<Controller
						render={({ field }) => <PasswordInput {...field} pigment={errors?.confirmPassword ? "danger" : "primary"} />}
						name='confirmPassword'
						control={control}
						defaultValue=''
						rules={{
							validate: (val) => val === watchPass || t("validation.passMatch"),
							required: !payload ? t("validation.required") : false,
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("field.company")}
					htmlFor='companyId'
					className={cn({
						"text--danger": errors?.companyId,
					})}
					hintMsg={errors?.companyId?.message}>
					<Controller
						render={({ field }) => (
							<WindowedAsyncSelect
								inputId='companyId'
								useFetch={useCompanies}
								isClearable
								defaultOptions
								className={cn({
									"temat__select__container--danger": errors?.companyId,
								})}
								placeholder={t("field.select", { field: t("field.company") })}
								{...field}
							/>
						)}
						name='companyId'
						control={control}
						defaultValue={null}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("field.warehouse")}
					htmlFor='warehouseId'
					className={cn({
						"text--danger": errors?.warehouseId,
					})}
					hintMsg={errors?.warehouseId?.message}>
					<Controller
						render={({ field }) => (
							<WindowedAsyncSelect
								inputId='warehouseId'
								useFetch={useWarehouses}
								isClearable
								defaultOptions
								className={cn({
									"temat__select__container--danger": errors?.warehouseId,
								})}
								placeholder={t("field.select", { field: t("field.warehouse") })}
								{...field}
							/>
						)}
						name='warehouseId'
						control={control}
						defaultValue={null}
					/>
				</FormControl>
			</Flex.Col>
		</>
	);
};

export default UserStepCredentials;
