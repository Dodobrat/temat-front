import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Input, Card, Portal, Form, Flex, FormControl, Text, Button } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useInvoiceAdd, useInvoiceUpdate } from "../../../actions/mutateHooks";
import { useCurrency, usePartners, usePaymentMethods } from "../../../actions/fetchHooks";
import { useAuthContext } from "../../../context/AuthContext";

import { IconClose } from "../../../components/ui/icons";
import WindowedAsyncSelect from "../../../components/forms/WindowedAsyncSelect";

import { successToast } from "../../../helpers/toastEmitter";
import { dirtyConfirmOnExit } from "../../../helpers/helpers";
import OrderStepProducts from "../Orders/order_steps/OrderStepProducts";
import { SwitchGroup } from "@dodobrat/react-ui-kit";
import { useState } from "react";

interface Props {
	onClose: () => void;
	payload?: any;
}

const InvoicesForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	const {
		userValue: { user },
	} = useAuthContext();
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const {
		control,
		watch,
		setValue,
		clearErrors,
		handleSubmit,
		formState: { errors, touchedFields },
	} = useForm({
		defaultValues: {
			...payload,
			companyId: user?.companyId,
		},
	});

	const [invoiceReceiver, setInvoiceReceiver] = useState(() => {
		if (payload) {
			if (payload?.partnerId) {
				return "partner";
			}
			return "receiver";
		}
		return "partner";
	});

	const { mutate: addInvoice, isLoading: isLoadingAdd } = useInvoiceAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("invoices");
				onClose();
			},
		},
	});

	const { mutate: updateInvoice, isLoading: isLoadingUpdate } = useInvoiceUpdate({
		specs: {
			id: payload?.id,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("invoices");
				queryClient.invalidateQueries(["invoiceById", { invoiceId: payload?.id }]);
				onClose();
			},
		},
	});

	const onSubmit = (data: any) => {
		const parsedProducts = data?.products?.reduce((prev, curr) => {
			const renamedCurr = {
				...curr,
				id: curr?.value,
				qty: curr?.quantity,
			};
			return [...prev, renamedCurr];
		}, []);
		const parsedData = {
			...data,
			contragentId: data?.partnerId?.value ?? null,
			products: parsedProducts,
			currencyId: data?.currencyId?.value,
			paymentMethodId: data?.paymentMethodId?.value,
		};
		console.log(parsedData);
		if (payload) {
			return updateInvoice(parsedData);
		}
		return addInvoice(parsedData);
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
					<Text className='mb--0'>{t(`action.${payload ? "update" : "add"}`, { entry: t("common.invoice") })}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='partners-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col='12'>
								<OrderStepProducts
									companyId={user?.companyId}
									selectProps={{
										defaultOptions: user?.companyId,
										querySpecialKey: user?.companyId,
										cacheUniqs: [user?.companyId],
									}}
									formProps={{ control, errors, watch, setValue, clearErrors }}
								/>
							</Flex.Col>
							<Flex.Col col={{ base: "12", lg: "6" }}>
								<FormControl
									label={t("field.paymentMethod")}
									htmlFor='paymentMethodId'
									className={cn({
										"text--danger": errors?.paymentMethodId,
									})}
									hintMsg={errors?.paymentMethodId?.message}>
									<Controller
										render={({ field }) => (
											<WindowedAsyncSelect
												inputId='paymentMethodId'
												useFetch={usePaymentMethods}
												defaultOptions={!payload}
												preSelectOption={!payload}
												// labelComponent={(item) => (currLocale === "bg" ? item?.name : item?.nameEn)}
												// filterKey={currLocale === "bg" ? "name" : "nameEn"}
												isFetchedAtOnce
												isClearable={false}
												isSearchable={false}
												className={cn({
													"temat__select__container--danger": errors?.paymentMethodId,
												})}
												{...field}
											/>
										)}
										name='paymentMethodId'
										control={control}
										defaultValue={null}
										rules={{
											required: t("validation.required"),
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", lg: "6" }}>
								<FormControl
									label={t("field.currency")}
									htmlFor='currencyId'
									className={cn({
										"text--danger": errors?.currencyId,
									})}
									hintMsg={errors?.currencyId?.message}>
									<Controller
										render={({ field }) => (
											<WindowedAsyncSelect
												inputId='currencyId'
												useFetch={useCurrency}
												defaultOptions={!payload}
												preSelectOption={!payload}
												isFetchedAtOnce
												labelComponent={(item) => `${item?.abbreviation} - ${item?.symbol}`}
												filterKey='abbreviation'
												isClearable={false}
												isSearchable={false}
												className={cn({
													"temat__select__container--danger": errors?.currencyId,
												})}
												{...field}
											/>
										)}
										name='currencyId'
										control={control}
										defaultValue={null}
										rules={{
											required: t("validation.required"),
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col='12'>
								<SwitchGroup
									wide
									onSwitch={({ option }) => setInvoiceReceiver(option.value)}
									activeOption={invoiceReceiver}
									options={[
										{ value: "partner", label: t("common.partner") },
										{ value: "receiver", label: t("common.receiver") },
									]}
								/>
							</Flex.Col>
							{invoiceReceiver === "partner" && (
								<Flex.Col col='12'>
									<FormControl
										label={t("common.partner")}
										htmlFor='partnerId'
										className={cn({
											"text--danger": errors?.partnerId,
										})}
										hintMsg={errors?.partnerId?.message}>
										<Controller
											render={({ field }) => (
												<WindowedAsyncSelect
													inputId='partnerId'
													useFetch={usePartners}
													defaultOptions={!payload}
													isClearable={false}
													className={cn({
														"temat__select__container--danger": errors?.partnerId,
													})}
													{...field}
												/>
											)}
											name='partnerId'
											control={control}
											defaultValue={null}
											// rules={{
											// 	required: t("validation.required"),
											// }}
										/>
									</FormControl>
								</Flex.Col>
							)}
							{invoiceReceiver === "receiver" && (
								<>
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
													maxLength: {
														value: 11,
														message: t("validation.maxLength", { value: 11 }),
													},
												}}
											/>
										</FormControl>
									</Flex.Col>
									<Flex.Col col={{ base: "12", xs: "6" }}>
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
									<Flex.Col col={{ base: "12", xs: "6" }}>
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
															name='city'
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
									<Flex.Col col={{ base: "12", xs: "6" }}>
										<FormControl
											label={t("field.address")}
											htmlFor='address'
											className={cn({
												"text--danger": errors?.address,
											})}
											hintMsg={errors?.address?.message}>
											<Controller
												render={({ field }) => {
													const { ref, ...fieldRest } = field;
													return (
														<Input
															name='address'
															placeholder={t("field.address")}
															{...fieldRest}
															innerRef={ref}
															pigment={errors?.address ? "danger" : "primary"}
														/>
													);
												}}
												name='address'
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
									<Flex.Col col='12'>
										<FormControl
											label={t("field.mol")}
											htmlFor='mol'
											className={cn({
												"text--danger": errors?.mol,
											})}
											hintMsg={errors?.mol?.message}>
											<Controller
												render={({ field }) => {
													const { ref, ...fieldRest } = field;
													return (
														<Input
															name='mol'
															placeholder={t("field.mol")}
															{...fieldRest}
															innerRef={ref}
															pigment={errors?.mol ? "danger" : "primary"}
														/>
													);
												}}
												name='mol'
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
								</>
							)}
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='partners-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{t(`action.${payload ? "update" : "add"}`, { entry: t("common.invoice") })}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default InvoicesForm;
