import { FormControl } from "@dodobrat/react-ui-kit";
import { Input } from "@dodobrat/react-ui-kit";
import { Flex } from "@dodobrat/react-ui-kit";
import { Controller } from "react-hook-form";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { IconEyeCrossed, IconEye } from "../../../../components/ui/icons";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { useCompanies, useRoles, useWarehouses } from "../../../../actions/fetchHooks";

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
								inputId='user-role-id'
								useFetch={useRoles}
								isClearable={false}
								defaultOptions
								preSelectOption={!payload}
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
										isVisible ? <IconEyeCrossed className='dui__icon' /> : <IconEye className='dui__icon' />
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
										isVisible ? <IconEyeCrossed className='dui__icon' /> : <IconEye className='dui__icon' />
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
			<Flex.Col col={{ base: "12", xs: "6" }}>
				<FormControl
					label={t("users.company")}
					htmlFor='companyId'
					className={cn({
						"text--danger": errors?.companyId,
					})}
					hintMsg={errors?.companyId?.message}>
					<Controller
						render={({ field }) => (
							<AsyncSelect
								inputId='user-company-id'
								useFetch={useCompanies}
								isClearable={false}
								defaultOptions
								className={cn({
									"temat__select__container--danger": errors?.companyId,
								})}
								placeholder='Select Company'
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
					label={t("users.warehouse")}
					htmlFor='warehouseId'
					className={cn({
						"text--danger": errors?.warehouseId,
					})}
					hintMsg={errors?.warehouseId?.message}>
					<Controller
						render={({ field }) => (
							<AsyncSelect
								inputId='user-warehouse-id'
								useFetch={useWarehouses}
								isClearable={false}
								defaultOptions
								className={cn({
									"temat__select__container--danger": errors?.warehouseId,
								})}
								placeholder='Select Warehouse'
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
