import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useProductAdd, useProductUpdate } from "../../../actions/mutateHooks";
import { useCompanies } from "../../../actions/fetchHooks";
import { useAuthContext } from "../../../context/AuthContext";

import { Portal, Card, Collapse, Button, Text, Form, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import { IconClose } from "../../../components/ui/icons";

import AsyncSelect from "../../../components/forms/AsyncSelect";
import cn from "classnames";
import { errorToast, successToast } from "../../../helpers/toastEmitter";

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
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...payload,
			companyId: payload ? { value: payload?.companyId, label: payload?.companyName } : null,
		},
	});

	const [selectValue, setSelectValue] = useState(() => (payload ? { value: payload?.companyId, label: payload?.companyName } : null));
	const [selectError, setSelectError] = useState(null);

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
		if (!data.companyId?.value) {
			return setSelectError({ message: "Field is required" });
		} else {
			setSelectError(null);
		}

		const formData = new FormData();

		formData.append("barcode", data.barcode);
		formData.append("name", data.name);
		formData.append("companyId", data.companyId?.value);
		formData.append("description", data.description);
		formData.append("sku", data.sku);
		formData.append("minQty", data.minQty);

		if (userCan("productAddAdditionalDetails")) {
			if (data?.image?.length > 0) {
				formData.append("image", data.image[0]);
			}
			if (data.width) {
				formData.append("width", data.width);
			}
			if (data.height) {
				formData.append("height", data.height);
			}
			if (data.weight) {
				formData.append("weight", data.weight);
			}
			if (data.length) {
				formData.append("length", data.length);
			}
		}

		if (payload) {
			const formFinalData = { id: payload?.id, formData };
			return updateProduct(formFinalData);
		}
		return addProduct(formData);
	};

	const handleOnChangeCompanyId = (option: any) => {
		setValue("companyId", option);
		setSelectValue(option);
		if (selectError && option) {
			setSelectError(null);
		}
	};

	const { ref: innerRefName, ...restName } = register("name", {
		required: `${t("validation.fieldRequired")}`,
		minLength: { value: 6, message: `${t("validation.min6Chars")}` },
		maxLength: { value: 99, message: `${t("validation.max99Chars")}` },
	});
	const { ref: innerRefDescription, ...restDescription } = register("description", {
		minLength: { value: 6, message: `${t("validation.min6Chars")}` },
		maxLength: { value: 250, message: `${t("validation.max250Chars")}` },
	});
	const { ref: innerRefBarcode, ...restBarcode } = register("barcode", {
		maxLength: { value: 14, message: `${t("validation.max14Chars")}` },
		minLength: { value: 13, message: `${t("validation.min13Chars")}` },
	});
	const { ref: innerRefSku, ...restSku } = register("sku", {
		maxLength: { value: 99, message: `${t("validation.max99Chars")}` },
	});
	const { ref: innerRefQty, ...restQty } = register("minQty", {
		maxLength: { value: 9, message: `${t("validation.max9Chars")}` },
	});
	const { ref: innerRefImage, ...restImage } = register("image");
	const { ref: innerRefWeight, ...restWeight } = register("weight");
	const { ref: innerReflength, ...restlength } = register("length", {
		maxLength: { value: 6, message: `${t("validation.max6Chars")}` },
	});
	const { ref: innerRefWidth, ...restWidth } = register("width", {
		maxLength: { value: 6, message: `${t("validation.max6Chars")}` },
	});
	const { ref: innerRefHeight, ...restHeight } = register("height", {
		maxLength: { value: 6, message: `${t("validation.max6Chars")}` },
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
					<Text className='mb--0'>{payload ? t("products.updateProduct") : t("products.addProduct")}</Text>
				</Card.Header>
				<Card.Body>
					<Form id='permissions-add-form' onSubmit={handleSubmit(onSubmit)}>
						<Flex spacingY='md'>
							<Flex.Col col='12'>
								<FormControl
									label={t("products.barcode")}
									htmlFor='barcode'
									className={cn({
										"text--danger": errors?.barcode,
									})}
									hintMsg={errors?.barcode?.message}>
									<Input
										name='barcode'
										placeholder={t("products.barcode")}
										{...restBarcode}
										innerRef={innerRefBarcode}
										pigment={errors?.barcode ? "danger" : "primary"}
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
									<Input
										name='sku'
										placeholder={t("products.sku")}
										{...restSku}
										innerRef={innerRefSku}
										pigment={errors?.sku ? "danger" : "primary"}
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
									<Input
										type='number'
										name='minQty'
										placeholder={t("products.minQty")}
										{...restQty}
										innerRef={innerRefQty}
										pigment={errors?.minQty ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col={{ base: "12", xs: "6" }}>
								<FormControl
									label={t("products.company")}
									htmlFor='company'
									className={cn({
										"text--danger": selectError,
									})}
									hintMsg={selectError?.message}>
									<AsyncSelect
										useFetch={useCompanies}
										value={selectValue}
										onChange={handleOnChangeCompanyId}
										className={cn({
											"temat__select__container--danger": selectError,
										})}
										placeholder={t("products.company")}
									/>{" "}
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
									<Input
										name='name'
										placeholder={t("products.name")}
										{...restName}
										innerRef={innerRefName}
										pigment={errors?.name ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
							<Flex.Col col='12'>
								<FormControl
									label={t("products.description")}
									htmlFor='description'
									className={cn({
										"text--danger": errors?.description,
									})}
									hintMsg={errors?.description?.message}>
									<TextArea
										name='description'
										placeholder={t("products.description")}
										{...restDescription}
										innerRef={innerRefDescription}
										maxLength={250}
										pigment={errors?.description ? "danger" : "primary"}
									/>
								</FormControl>
							</Flex.Col>
							{userCan("productAddAdditionalDetails") && (
								<Flex.Col col='12'>
									<Collapse elevation='none' className='temat__form__collapse'>
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
														hintMsg={errors?.image?.message}>
														<Input
															type='file'
															name='image'
															placeholder={t("products.image")}
															{...restImage}
															innerRef={innerRefImage}
															pigment={errors?.image ? "danger" : "primary"}
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
														<Input
															type='number'
															name='width'
															placeholder={t("products.widthCm")}
															{...restWidth}
															innerRef={innerRefWidth}
															pigment={errors?.width ? "danger" : "primary"}
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
														<Input
															type='number'
															name='height'
															placeholder={t("products.heightCm")}
															{...restHeight}
															innerRef={innerRefHeight}
															pigment={errors?.height ? "danger" : "primary"}
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
														<Input
															type='number'
															name='weight'
															placeholder={t("products.weightKg")}
															{...restWeight}
															innerRef={innerRefWeight}
															pigment={errors?.weight ? "danger" : "primary"}
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
														<Input
															type='number'
															name='length'
															placeholder={t("products.lengthCm")}
															{...restlength}
															innerRef={innerReflength}
															pigment={errors?.length ? "danger" : "primary"}
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
					<Button type='submit' form='permissions-add-form' className='ml--2' isLoading={isLoadingAdd || isLoadingUpdate}>
						{payload ? t("common.update") : t("common.submit")}
					</Button>
				</Card.Footer>
			</Card>
		</Portal>
	);
};

export default ProductsForm;
