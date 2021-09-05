import { FormControl } from "@dodobrat/react-ui-kit";
import { Flex } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Controller } from "react-hook-form";
import { Input } from "@dodobrat/react-ui-kit";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { usePhoneCodes } from "../../../../actions/fetchHooks";
import { PhoneCode } from "./OrderStepShipping";
import { Checkbox } from "@dodobrat/react-ui-kit";

const OrderStepReceiver = ({ shipping, initialData, formProps: { control, errors, watch, getValues, reset } }: any) => {
	const { t } = useTranslation();

	const courierName = shipping?.shippingMethodId?.data?.courierName;
	const isCompany = watch("receiverIsCompany", initialData?.receiverIsCompany);

	return (
		<Flex>
			<Flex.Col col='12'>
				<FormControl
					label={t("orders.receiverName")}
					htmlFor='receiverName'
					className={cn({
						"text--danger": errors?.receiverName,
					})}
					hintMsg={errors?.receiverName?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<Input
									placeholder={t("orders.receiverName")}
									{...fieldRest}
									innerRef={ref}
									pigment={errors?.receiverName ? "danger" : "primary"}
								/>
							);
						}}
						name='receiverName'
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
					label={t("orders.phoneCode")}
					htmlFor='receiverPhoneCodeId'
					className={cn({
						"text--danger": errors?.receiverPhoneCodeId,
					})}
					hintMsg={errors?.receiverPhoneCodeId?.message}>
					<Controller
						render={({ field }) => (
							<AsyncSelect
								useFetch={usePhoneCodes}
								defaultSearchString={"359"}
								isClearable={false}
								defaultOptions
								preSelectOption
								searchStringLength={1}
								labelComponent={(data) => <PhoneCode data={data} />}
								className={cn({
									"temat__select__container--danger": errors?.receiverPhoneCodeId,
								})}
								{...field}
							/>
						)}
						name='receiverPhoneCodeId'
						control={control}
						defaultValue={null}
						rules={{
							required: "Field is Required",
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "7", xs: "8" }}>
				<FormControl
					label={t("orders.phone")}
					htmlFor='receiverPhone'
					className={cn({
						"text--danger": errors?.receiverPhone,
					})}
					hintMsg={errors?.receiverPhone?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<Input
									type='tel'
									placeholder={t("orders.phone")}
									{...fieldRest}
									innerRef={ref}
									pigment={errors?.receiverPhone ? "danger" : "primary"}
								/>
							);
						}}
						name='receiverPhone'
						control={control}
						defaultValue=''
						rules={{
							required: "Field is Required",
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
					label={t("orders.email")}
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
									placeholder={t("orders.email")}
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
							// required: "Field is required",
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
					label={t("orders.receiverIsCompany")}
					htmlFor='receiverIsCompany'
					className={cn({
						"text--danger": errors?.receiverIsCompany,
					})}
					hintMsg={errors?.receiverIsCompany?.message}>
					<Controller
						render={({ field }) => {
							const { ref, onChange, ...fieldRest } = field;
							return (
								<Checkbox
									{...fieldRest}
									onChange={(e) => onChange(e.target.checked)}
									innerRef={ref}
									pigment={errors?.receiverIsCompany ? "danger" : "primary"}>
									{t("orders.receiverIsCompany")}
								</Checkbox>
							);
						}}
						name='receiverIsCompany'
						control={control}
						defaultValue={false}
					/>
				</FormControl>
			</Flex.Col>

			{courierName === "econt" && (
				<>
					<Flex.Col col='12'>
						<FormControl
							label={t("orders.receiverAgentName")}
							htmlFor='receiverAgentName'
							className={cn({
								"text--danger": errors?.receiverAgentName,
							})}
							hintMsg={errors?.receiverAgentName?.message}>
							<Controller
								render={({ field }) => {
									const { ref, ...fieldRest } = field;
									return (
										<Input
											placeholder={t("orders.receiverAgentName")}
											{...fieldRest}
											innerRef={ref}
											pigment={errors?.receiverAgentName ? "danger" : "primary"}
										/>
									);
								}}
								name='receiverAgentName'
								control={control}
								defaultValue=''
								rules={{
									required: isCompany && "Field is required",
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
							label={t("orders.agentPhoneCode")}
							htmlFor='receiverAgentPhoneCodeId'
							className={cn({
								"text--danger": errors?.receiverAgentPhoneCodeId,
							})}
							hintMsg={errors?.receiverAgentPhoneCodeId?.message}>
							<Controller
								render={({ field }) => (
									<AsyncSelect
										useFetch={usePhoneCodes}
										defaultSearchString={"359"}
										isClearable={false}
										defaultOptions
										preSelectOption
										searchStringLength={1}
										labelComponent={(data) => <PhoneCode data={data} />}
										className={cn({
											"temat__select__container--danger": errors?.receiverAgentPhoneCodeId,
										})}
										{...field}
									/>
								)}
								name='receiverAgentPhoneCodeId'
								control={control}
								defaultValue={null}
								rules={{
									required: isCompany && "Field is Required",
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "7", xs: "8" }}>
						<FormControl
							label={t("orders.agentPhone")}
							htmlFor='receiverAgentPhone'
							className={cn({
								"text--danger": errors?.receiverAgentPhone,
							})}
							hintMsg={errors?.receiverAgentPhone?.message}>
							<Controller
								render={({ field }) => {
									const { ref, ...fieldRest } = field;
									return (
										<Input
											type='tel'
											placeholder={t("orders.agentPhone")}
											{...fieldRest}
											innerRef={ref}
											pigment={errors?.receiverAgentPhone ? "danger" : "primary"}
										/>
									);
								}}
								name='receiverAgentPhone'
								control={control}
								defaultValue=''
								rules={{
									required: isCompany && "Field is Required",
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
				</>
			)}

			{courierName === "speedy" && isCompany && (
				<Flex.Col col='12'>
					<FormControl
						label={t("orders.receiverAgentName")}
						htmlFor='receiverAgentName'
						className={cn({
							"text--danger": errors?.receiverAgentName,
						})}
						hintMsg={errors?.receiverAgentName?.message}>
						<Controller
							render={({ field }) => {
								const { ref, ...fieldRest } = field;
								return (
									<Input
										placeholder={t("orders.receiverAgentName")}
										{...fieldRest}
										innerRef={ref}
										pigment={errors?.receiverAgentName ? "danger" : "primary"}
									/>
								);
							}}
							name='receiverAgentName'
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
			)}
		</Flex>
	);
};

export default OrderStepReceiver;
