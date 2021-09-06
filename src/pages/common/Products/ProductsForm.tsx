import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { Portal, Card, Collapse, Button, Text, Form, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useProductAdd, useProductUpdate } from "../../../actions/mutateHooks";
import { useCompanies } from "../../../actions/fetchHooks";
import { useAuthContext } from "../../../context/AuthContext";

import AsyncSelect from "../../../components/forms/AsyncSelect";
import { IconClose } from "../../../components/ui/icons";

import { errorToast, successToast } from "../../../helpers/toastEmitter";
import { confirmOnExit } from "../../../helpers/helpers";
import { imageValidator } from "../../../helpers/formValidations";
import OrderStepProducts from "../Orders/order_steps/OrderStepProducts";
import { parseProductsToFormData } from "../Orders/orderHelpers";

interface Props {
	onClose: () => void;
	payload?: any;
}

const ProductsForm = (props: Props) => {
	const { onClose, payload, ...rest } = props;
	const { userCan } = useAuthContext();
	const { t } = useTranslation();

	const queryClient = useQueryClient();

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
			companyId: payload && payload?.companyId ? { value: payload?.companyId, label: payload?.companyName } : null,
		},
	});

	const watchCompany = watch("companyId");

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
				onClose();
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = (data: any) => {
		console.log(data);

		const formData = new FormData();

		parseProductsToFormData(data.products, formData);

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
			return updateProduct(formFinalData);
		}
		return addProduct(formData);
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
					<Text className='mb--0'>{payload ? t("products.updateProduct") : t("products.addProduct")}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='permissions-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col='12'>
								<OrderStepProducts
									companyId={watchCompany?.value}
									selectProps={{
										defaultOptions: !!watchCompany?.value,
										querySpecialKey: watchCompany?.value,
										cacheUniqs: [watchCompany?.value],
									}}
									formProps={{ control, errors, watch, setValue, clearErrors }}
								/>
							</Flex.Col>
							<Flex.Col col='12'>
								<FormControl
									label={t("products.barcode")}
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
													placeholder={t("products.barcode")}
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
											required: "Field is required",
											maxLength: { value: 14, message: `${t("validation.max14Chars")}` },
											minLength: { value: 13, message: `${t("validation.min13Chars")}` },
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("products.sku")}
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
													placeholder={t("products.sku")}
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
											maxLength: { value: 99, message: `${t("validation.max99Chars")}` },
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("products.minQty")}
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
													placeholder={t("products.minQty")}
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
											required: "Field is required",
											maxLength: { value: 9, message: `${t("validation.max9Chars")}` },
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("products.company")}
									htmlFor='companyId'
									className={cn({
										"text--danger": errors?.companyId,
									})}
									hintMsg={errors?.companyId?.message}>
									<Controller
										render={({ field }) => (
											<AsyncSelect
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
											required: "Field is required",
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("products.name")}
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
													placeholder={t("products.name")}
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
											required: `${t("validation.fieldRequired")}`,
											minLength: { value: 2, message: `${t("validation.min6Chars")}` },
											maxLength: { value: 99, message: `${t("validation.max99Chars")}` },
										}}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col='12'>
								<FormControl
									label='Description'
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
													placeholder='Enter Description'
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
											required: "Field is required",
											minLength: { value: 2, message: "Min 2 characters" },
											maxLength: { value: 250, message: "Max 250 characters" },
										}}
									/>
								</FormControl>
							</Flex.Col>
							{userCan("productAddAdditionalDetails") && (
								<Flex.Col col='12'>
									<Collapse
										elevation='none'
										className='temat__form__collapse'
										isCollapsed={isCollapsed}
										onToggle={(collapsed) => setIsCollapsed(!collapsed)}>
										<Collapse.Toggle collapseIndicator={false} className='justify--center'>
											<Text className='mb--0'>{t("products.addAdditionalData")}</Text>
										</Collapse.Toggle>
										<Collapse.Content className='temat__form__collapse__content'>
											<Flex spacingY='md'>
												<Flex.Col col='12'>
													<FormControl
														label={t("products.image")}
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
																		placeholder={t("products.image")}
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
												<Flex.Col col={{ base: "12", sm: "6" }}>
													<FormControl
														label={t("products.width")}
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
																		placeholder={t("users.widthCm")}
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
														label={t("products.height")}
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
																		placeholder={t("users.heightCm")}
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
														label={t("products.weight")}
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
																		placeholder={t("users.weightKg")}
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
														label={t("products.length")}
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
																		placeholder={t("users.lengthCm")}
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
						{payload ? t("common.update") : t("common.submit")}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default ProductsForm;
