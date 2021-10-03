import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Card, Portal, Form, Flex, FormControl, Text, Button } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useInvoiceAdd } from "../../../actions/mutateHooks";
import { useCurrency, usePaymentMethods } from "../../../actions/fetchHooks";
import { useAuthContext } from "../../../context/AuthContext";

import { IconClose } from "../../../components/ui/icons";
import WindowedAsyncSelect from "../../../components/forms/WindowedAsyncSelect";

import { successToast } from "../../../helpers/toastEmitter";
import { dirtyConfirmOnExit } from "../../../helpers/helpers";
import OrderStepProducts from "../Orders/order_steps/OrderStepProducts";
import InvoiceStep from "./invoice_step/InvoiceStep";

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
		reset,
		getValues,
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

	const { mutate: addInvoice, isLoading: isLoadingAdd } = useInvoiceAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("invoices");
				onClose();
			},
		},
	});

	const handleOnReceiverReset = (receiver) => {
		if (receiver !== "partner") {
			reset({
				...getValues(),
				contragentId: null,
			});
		} else {
			reset({
				...getValues(),
				invoiceName: "",
				invoiceBulstat: "",
				invoiceBulstatVAT: "",
				invoiceCity: "",
				invoiceAddress: "",
				invoiceMol: "",
			});
		}
	};

	const onSubmit = (data: any) => {
		const parsedProducts = data?.products?.reduce((prev, curr) => {
			const renamedCurr = {
				price: curr?.price,
				id: curr?.value,
				qty: curr?.quantity,
			};
			return [...prev, renamedCurr];
		}, []);

		const parsedData = {
			...data,
			products: parsedProducts,
			currencyId: data?.currencyId?.value,
			paymentMethodId: data?.paymentMethodId?.value,
			contragentId: data?.contragentId?.value ?? null,
		};

		addInvoice(parsedData);
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
							<InvoiceStep payload={payload} onInputSwitch={handleOnReceiverReset} formProps={{ control, errors }} />
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='partners-form' className='ml--2' isLoading={isLoadingAdd}>
						{t(`action.${payload ? "update" : "add"}`, { entry: t("common.invoice") })}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default InvoicesForm;
