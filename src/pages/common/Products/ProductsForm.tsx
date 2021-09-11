import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { Portal, Card, Collapse, Button, Text, Form, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useProductAdd, useProductUpdate } from "../../../actions/mutateHooks";
import { useCompanies, useProductById } from "../../../actions/fetchHooks";
import { useAuthContext } from "../../../context/AuthContext";

import WindowedAsyncSelect from "../../../components/forms/WindowedAsyncSelect";
import { IconClose } from "../../../components/ui/icons";

import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { confirmOnExit } from "../../../helpers/helpers";
import { imageValidator } from "../../../helpers/formValidations";
import OrderStepProducts from "../Orders/order_steps/OrderStepProducts";
import { parseProductsToFormData } from "../Orders/orderHelpers";
import { Checkbox } from "@dodobrat/react-ui-kit";

interface Props {
	onClose: () => void;
	payload?: any;
}

const ProductsForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;
	const {
		userValue: { user },
		userCan,
	} = useAuthContext();
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const defaultCompanyId = () => {
		if (payload && userCan(["productUpdateTheir", "productUpdate"])) {
			return payload?.companyId;
		}
		if (userCan("productCreate")) {
			return null;
		}
		if (userCan("productCreateTheir")) {
			return user?.companyId;
		}
	};

	const {
		control,
		watch,
		setValue,
		clearErrors,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...payload,
			products: [],
			image: "",
			companyId: defaultCompanyId(),
		},
	});

	const watchCompany = watch("companyId");
	const watchIsCombo = watch("isCombo");

	const { data, isFetching } = useProductById({
		specs: {
			param: payload?.id,
		},
		queryConfig: {
			enabled: !!payload && watchIsCombo > 0,
			onError: (err: any) => errorToast(err),
		},
		specialKey: { productId: payload?.id },
	});

	const parsedCombos = useMemo(() => {
		if (data) {
			return data?.data?.combos?.reduce((prev, curr) => {
				const parsedCurr = {
					data: curr,
					value: curr?.id,
					label: curr?.name,
					price: curr?.price,
					quantity: curr?.qty,
				};
				return [...prev, parsedCurr];
			}, []);
		}
		return [];
	}, [data]);

	useEffect(() => {
		if (watchCompany && !payload) {
			setValue("products", []);
		}
	}, [watchCompany, payload, setValue]);

	useEffect(() => {
		if (watchIsCombo > 0) {
			setValue("products", parsedCombos);
		}
	}, [watchIsCombo, setValue, parsedCombos]);

	const noAdditionalData = useMemo(() => {
		if (!payload) {
			return true;
		} else {
			let isCollapsedPanel = true;
			if (payload?.image || payload?.width || payload?.height || payload?.weight || payload?.length) {
				isCollapsedPanel = false;
			}
			return isCollapsedPanel;
		}
	}, [payload]);

	const [isCollapsed, setIsCollapsed] = useState(noAdditionalData);

	const { mutate: addProduct, isLoading: isLoadingAdd } = useProductAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("products");
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const { mutate: updateProduct, isLoading: isLoadingUpdate } = useProductUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("products");
				queryClient.invalidateQueries(["productById", { productId: payload?.id }]);
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = (data: any) => {
		const formData = new FormData();

		parseProductsToFormData(data.products, formData);

		for (const entry of Object.entries(data)) {
			if (Array.isArray(entry[1])) {
				continue;
			}
			if (typeof entry[1] === "boolean") {
				formData.append(entry[0], entry[1].toString());
			}
			if (!!entry[1]) {
				if (entry[1] instanceof FileList) {
					formData.append(entry[0], entry[1][0]);
				} else if (typeof entry[1] === "object") {
					formData.append(entry[0], entry[1]["value"]);
				} else if (typeof entry[1] === "string") {
					formData.append(entry[0], entry[1]);
				} else if (typeof entry[1] === "number") {
					formData.append(entry[0], entry[1].toString());
				}
			}
		}

		if (payload) {
			const formFinalData = { id: payload?.id, formData };
			return updateProduct(formFinalData);
		}
		return addProduct(formData);
	};

	return (
		<Portal onOutsideClick={() => confirmOnExit(onClose, t)} isOpen animation='none' {...rest}>
			<Card>
				<Card.Header
					actions={
						<Button equalDimensions sizing='sm' onClick={onClose} pigment='default'>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>{t(`action.${payload ? "update" : "add"}`, { entry: t("common.product") })}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='permissions-form' onSubmit={handleSubmit(onSubmit)}>
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
							<Flex.Col col='12'>
								<FormControl
									label={t("field.description")}
									htmlFor='description'
									className={cn({
										"text--danger": errors?.description,
									})}
									hintMsg={errors?.description?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<TextArea
													placeholder={t("field.description")}
													{...fieldRest}
													innerRef={ref}
													// maxLength={250}
													withCharacterCount={false}
													pigment={errors?.description ? "danger" : "primary"}
												/>
											);
										}}
										name='description'
										control={control}
										defaultValue=''
										rules={{
											required: t("validation.required"),
											minLength: {
												value: 2,
												message: t("validation.minLength", { value: 2 }),
											},
											maxLength: {
												value: 250,
												message: t("validation.maxLength", { value: 250 }),
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("field.barcode")}
									htmlFor='barcode'
									className={cn({
										"text--danger": errors?.barcode,
									})}
									hintMsg={errors?.barcode?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													name='barcode'
													placeholder={t("field.barcode")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.barcode ? "danger" : "primary"}
												/>
											);
										}}
										name='barcode'
										control={control}
										defaultValue=''
										rules={{
											required: t("validation.required"),
											minLength: {
												value: 13,
												message: t("validation.minLength", { value: 13 }),
											},
											maxLength: {
												value: 14,
												message: t("validation.maxLength", { value: 14 }),
											},
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("field.image")}
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
													placeholder={t("field.image")}
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
											validate: (files) => imageValidator({ file: files?.[0], t }),
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("field.sku")}
									htmlFor='sku'
									className={cn({
										"text--danger": errors?.sku,
									})}
									hintMsg={errors?.sku?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													name='sku'
													placeholder={t("field.sku")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.sku ? "danger" : "primary"}
												/>
											);
										}}
										name='sku'
										control={control}
										defaultValue=''
										rules={{
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
									label={t("field.minQty")}
									htmlFor='minQty'
									className={cn({
										"text--danger": errors?.minQty,
									})}
									hintMsg={errors?.minQty?.message}>
									<Controller
										render={({ field }) => {
											const { ref, ...fieldRest } = field;
											return (
												<Input
													name='minQty'
													type='number'
													placeholder={t("field.minQty")}
													{...fieldRest}
													innerRef={ref}
													pigment={errors?.minQty ? "danger" : "primary"}
												/>
											);
										}}
										name='minQty'
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

							{userCan("productCreate") && !payload && (
								<Flex.Col col='12'>
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
													isClearable={false}
													defaultOptions
													preSelectOption={!payload}
													className={cn({
														"temat__select__container--danger": errors?.companyId,
													})}
													{...field}
												/>
											)}
											name='companyId'
											control={control}
											defaultValue={null}
											rules={{
												required: t("validation.required"),
											}}
										/>
									</FormControl>
								</Flex.Col>
							)}

							<Flex.Col col='12'>
								<FormControl
									withLabel={false}
									htmlFor='isCombo'
									className={cn({
										"text--danger": errors?.isCombo,
									})}
									hintMsg={errors?.isCombo?.message}>
									<Controller
										render={({ field }) => {
											const { ref, onChange, ...fieldRest } = field;
											return (
												<Checkbox
													{...fieldRest}
													checked={field.value}
													onChange={(e) => onChange(e.target.checked)}
													innerRef={ref}
													isLoading={isFetching}
													pigment={errors?.isCombo ? "danger" : "primary"}>
													{t("field.isCombo")}
												</Checkbox>
											);
										}}
										name='isCombo'
										control={control}
										defaultValue={false}
									/>
								</FormControl>
							</Flex.Col>
							{watchIsCombo > 0 && (
								<Flex.Col col='12'>
									<OrderStepProducts
										companyId={watchCompany?.value ?? watchCompany}
										selectProps={{
											defaultOptions: !!watchCompany?.value ?? !!user?.companyId,
											querySpecialKey: watchCompany?.value ?? user?.companyId,
											cacheUniqs: [watchCompany?.value ?? user?.companyId],
										}}
										formProps={{ control, errors, watch, setValue, clearErrors }}
									/>
								</Flex.Col>
							)}
							{userCan("productAddAdditionalDetails") && (
								<Flex.Col col='12'>
									<Collapse
										elevation='none'
										className='temat__form__collapse'
										isCollapsed={isCollapsed}
										onToggle={(collapsed) => setIsCollapsed(!collapsed)}>
										<Collapse.Toggle collapseIndicator={false} className='justify--center'>
											<Text className='mb--0'>{t("action.add", { entry: t("common.details") })}</Text>
										</Collapse.Toggle>
										<Collapse.Content className='temat__form__collapse__content'>
											<Flex spacingY='md'>
												<Flex.Col col={{ base: "12", sm: "6" }}>
													<FormControl
														label={t("field.width")}
														htmlFor='width'
														className={cn({
															"text--danger": errors?.width,
														})}
														hintMsg={errors?.width?.message}>
														<Controller
															render={({ field }) => {
																const { ref, ...fieldRest } = field;
																return (
																	<Input
																		type='number'
																		name='width'
																		placeholder={t("field.widthCm")}
																		{...fieldRest}
																		innerRef={ref}
																		pigment={errors?.width ? "danger" : "primary"}
																	/>
																);
															}}
															name='width'
															control={control}
															defaultValue=''
															rules={{
																maxLength: { value: 6, message: `${t("validation.max6Chars")}` },
															}}
														/>
													</FormControl>
												</Flex.Col>
												<Flex.Col col={{ base: "12", sm: "6" }}>
													<FormControl
														label={t("field.height")}
														htmlFor='height'
														className={cn({
															"text--danger": errors?.height,
														})}
														hintMsg={errors?.height?.message}>
														<Controller
															render={({ field }) => {
																const { ref, ...fieldRest } = field;
																return (
																	<Input
																		type='number'
																		name='height'
																		placeholder={t("field.heightCm")}
																		{...fieldRest}
																		innerRef={ref}
																		pigment={errors?.height ? "danger" : "primary"}
																	/>
																);
															}}
															name='height'
															control={control}
															defaultValue=''
															rules={{
																maxLength: { value: 6, message: `${t("validation.max6Chars")}` },
															}}
														/>
													</FormControl>
												</Flex.Col>
												<Flex.Col col={{ base: "12", sm: "6" }}>
													<FormControl
														label={t("field.weight")}
														htmlFor='weight'
														className={cn({
															"text--danger": errors?.weight,
														})}
														hintMsg={errors?.weight?.message}>
														<Controller
															render={({ field }) => {
																const { ref, ...fieldRest } = field;
																return (
																	<Input
																		type='number'
																		name='weight'
																		placeholder={t("field.weightKg")}
																		{...fieldRest}
																		innerRef={ref}
																		pigment={errors?.weight ? "danger" : "primary"}
																	/>
																);
															}}
															name='weight'
															control={control}
															defaultValue=''
															rules={{
																maxLength: { value: 6, message: `${t("validation.max6Chars")}` },
															}}
														/>
													</FormControl>
												</Flex.Col>
												<Flex.Col col={{ base: "12", sm: "6" }}>
													<FormControl
														label={t("field.length")}
														htmlFor='length'
														className={cn({
															"text--danger": errors?.length,
														})}
														hintMsg={errors?.length?.message}>
														<Controller
															render={({ field }) => {
																const { ref, ...fieldRest } = field;
																return (
																	<Input
																		type='number'
																		name='length'
																		placeholder={t("field.lengthCm")}
																		{...fieldRest}
																		innerRef={ref}
																		pigment={errors?.length ? "danger" : "primary"}
																	/>
																);
															}}
															name='length'
															control={control}
															defaultValue=''
															rules={{
																maxLength: { value: 6, message: `${t("validation.max6Chars")}` },
															}}
														/>
													</FormControl>
												</Flex.Col>
											</Flex>
										</Collapse.Content>
									</Collapse>
								</Flex.Col>
							)}
						</Flex>
					</Form>
				</Card.Body>
				<Card.Footer justify='flex-end'>
					<Button type='submit' form='permissions-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{t(`action.${payload ? "update" : "add"}`, { entry: t("common.product") })}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default ProductsForm;
