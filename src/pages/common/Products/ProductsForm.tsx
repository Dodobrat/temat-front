import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useProductAdd, useProductUpdate } from "../../../actions/mutateHooks";
import { useCompanies } from "../../../actions/fetchHooks";

import { Portal, Card, Button, Text, Form, Flex, FormControl, Input, TextArea } from "@dodobrat/react-ui-kit";
import { IconClose } from "../../../components/ui/icons";

import AsyncSelect from "../../../components/forms/AsyncSelect";
import cn from "classnames";

interface Props {
	onClose: () => void;
	payload?: any;
}

const ProductsForm = (props: Props) => {
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
			companyId: payload ? { value: payload?.companyId, label: payload?.companyName } : null,
		},
	});

	const [selectValue, setSelectValue] = useState(() => (payload ? { value: payload?.companyId, label: payload?.companyName } : null));
	const [selectError, setSelectError] = useState(null);

	const { mutate: addProduct, isLoading: isLoadingAdd } = useProductAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				console.log(res);
				queryClient.invalidateQueries("products");
				onClose();
			},
			onError: (err: any) => console.log(err),
		},
	});

	const { mutate: updateProduct, isLoading: isLoadingUpdate } = useProductUpdate({
		queryConfig: {
			onSuccess: (res: any) => {
				console.log(res);
				queryClient.invalidateQueries("products");
				onClose();
			},
			onError: (err: any) => console.log(err),
		},
	});

	const onSubmit = (data: any) => {
		if (!data.companyId?.value) {
			return setSelectError({ message: "Field is required" });
		} else {
			setSelectError(null);
		}
		const sanitizedData = {
			// barcode: data.barcode,
			name: data.name,
			companyId: data.companyId?.value,
			description: data.description,
			sku: data.sku,
			minQty: data.minQty,
		};
		if (payload) {
			sanitizedData["id"] = payload.id;
			return updateProduct(sanitizedData);
		}
		return addProduct(sanitizedData);
	};

	const handleOnChangeCompanyId = (option: any) => {
		setValue("companyId", option);
		setSelectValue(option);
		if (selectError && option) {
			setSelectError(null);
		}
	};

	const { ref: innerRefName, ...restName } = register("name", {
		required: "Field is required",
		// minLength: { value: 6, message: "Min 6 characters" },
		// maxLength: { value: 99, message: "Max 99 characters" },
	});
	const { ref: innerRefDescription, ...restDescription } = register("description", {
		// required: "Field is required",
		// minLength: { value: 6, message: "Min 6 characters" },
		// maxLength: { value: 250, message: "Max 250 characters" },
	});
	const { ref: innerRefBarcode, ...restBarcode } = register("barcode", {
		// required: "Field is required",
	});
	const { ref: innerRefSku, ...restSku } = register("sku", {
		// required: "Field is required",
	});
	const { ref: innerRefQty, ...restQty } = register("minQty", {
		// required: "Field is required",
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
