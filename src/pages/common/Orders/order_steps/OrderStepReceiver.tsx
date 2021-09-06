import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { Input, Flex, Checkbox, FormControl } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { usePhoneCodes } from "../../../../actions/fetchHooks";

import AsyncSelect from "../../../../components/forms/AsyncSelect";
import PhoneCode from "../../../../components/util/PhoneCode";

const OrderStepReceiver = ({ shipping, initialData, formProps: { control, errors, watch } }) => {
	const { t } = useTranslation();

	const courierName = shipping?.shippingMethodId?.data?.courierName;
	const isCompany = watch("receiverIsCompany", initialData?.receiverIsCompany);

	return (
		<Flex>
			<Flex.Col col='12'>
				<FormControl
					label={t("field.name")}
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
									placeholder={t("field.name")}
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
			<Flex.Col col={{ base: "5", md: "4" }}>
				<FormControl
					label={t("field.phoneCode")}
					htmlFor='receiverPhoneCodeId'
					className={cn({
						"text--danger": errors?.receiverPhoneCodeId,
					})}
					hintMsg={errors?.receiverPhoneCodeId?.message}>
					<Controller
						render={({ field }) => {
							const searchString = field.value?.value ? "" : field?.value ?? "359";
							return (
								<AsyncSelect
									useFetch={usePhoneCodes}
									defaultSearchString={searchString}
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
							);
						}}
						name='receiverPhoneCodeId'
						control={control}
						defaultValue={null}
						rules={{
							required: t("validation.required"),
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col={{ base: "7", xs: "8" }}>
				<FormControl
					label={t("field.phone")}
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
									placeholder={t("field.phone")}
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
							required: t("validation.required"),
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
							// required: t("validation.required"),
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
					withLabel={false}
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
									checked={field.value}
									onChange={(e) => onChange(e.target.checked)}
									innerRef={ref}
									pigment={errors?.receiverIsCompany ? "danger" : "primary"}>
									{t("field.receiverIsCompany")}
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
							label={t("field.agentName")}
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
											placeholder={t("field.agentName")}
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
									required: isCompany && t("validation.required"),
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
					<Flex.Col col={{ base: "5", md: "4" }}>
						<FormControl
							label={t("field.phoneCode")}
							htmlFor='receiverAgentPhoneCodeId'
							className={cn({
								"text--danger": errors?.receiverAgentPhoneCodeId,
							})}
							hintMsg={errors?.receiverAgentPhoneCodeId?.message}>
							<Controller
								render={({ field }) => {
									const searchString = field.value?.value ? "" : field?.value ?? "359";
									return (
										<AsyncSelect
											useFetch={usePhoneCodes}
											defaultSearchString={searchString}
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
									);
								}}
								name='receiverAgentPhoneCodeId'
								control={control}
								defaultValue={null}
								rules={{
									required: isCompany && t("validation.required"),
								}}
							/>
						</FormControl>
					</Flex.Col>
					<Flex.Col col={{ base: "7", xs: "8" }}>
						<FormControl
							label={t("field.phone")}
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
											placeholder={t("field.phone")}
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
									required: isCompany && t("validation.required"),
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
				</>
			)}

			{courierName === "speedy" && isCompany && (
				<Flex.Col col='12'>
					<FormControl
						label={t("field.agentName")}
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
										placeholder={t("field.agentName")}
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
			)}
		</Flex>
	);
};

export default OrderStepReceiver;
