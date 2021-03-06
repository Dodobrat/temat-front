import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { Form, Button, Flex, TextAreaComponent, FormControl, PortalWrapper } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useShippingPlanAdd, useShippingPlanUpdate } from "../../../../actions/mutateHooks";

import { useShippingPlansContext } from "../../../../context/ShippingPlansContext";

import CalendarPicker from "../../../../components/util/CalendarPicker";
import OrderStepProducts from "../../Orders/order_steps/OrderStepProducts";

import { getClosestValidDate } from "../../../../helpers/dateHelpers";
import { successToast } from "../../../../helpers/toastEmitter";

const parseShippingPlanData = (data) => {
	const parsedData: any = {};

	parsedData.companyId = data?.companyId?.value ?? data?.companyId;
	parsedData.dateExpected = data?.dateExpected?.toISOString().slice(0, 10);
	parsedData.products = data?.products?.reduce((acc, curr) => {
		return [...acc, { id: curr?.value, qty: curr?.quantity }];
	}, []);
	parsedData.extraInfo = data?.extraInfo;

	return parsedData;
};

const ShippingPlanStepSummary = ({ payload, onClose, onTouch }: any) => {
	const formFooter = document.getElementById("shipping-plan-form-footer");

	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const {
		dataValue: { data, setData },
	} = useShippingPlansContext();

	const {
		control,
		getValues,
		watch,
		setValue,
		clearErrors,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm({
		defaultValues: {
			...data,
			dateExpected: data?.dateExpected ?? getClosestValidDate(),
		},
	});

	useEffect(() => {
		onTouch?.(isDirty);
	}, [onTouch, isDirty]);

	const { mutate: addShippingPlan, isLoading: isLoadingAdd } = useShippingPlanAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("shippingPlans");
				onClose();
			},
		},
	});

	const { mutate: updateShippingPlan, isLoading: isLoadingUpdate } = useShippingPlanUpdate({
		specs: {
			planId: payload?.id,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("shippingPlans");
				queryClient.invalidateQueries("shippingPlanById");
				onClose();
			},
		},
	});

	const submitData = useCallback(() => {
		if (!payload) {
			return addShippingPlan(parseShippingPlanData(getValues()));
		} else {
			return updateShippingPlan(parseShippingPlanData(getValues()));
		}
	}, [addShippingPlan, updateShippingPlan, payload, getValues]);

	const onSubmit = (data: any) => {
		setData(data);
		submitData();
	};

	return (
		<Form id='shipping-plan-form' onSubmit={handleSubmit(onSubmit)}>
			<Flex>
				<Flex.Col col='12'>
					<OrderStepProducts
						selectProps={{ defaultOptions: true }}
						initialData={data.products}
						companyId={getValues("companyId")?.value ?? getValues("companyId")}
						formProps={{ control, errors, setValue, watch, clearErrors }}
					/>
				</Flex.Col>
				<Flex.Col col='12'>
					<FormControl
						label={t("field.dateExpected")}
						className={cn({
							"text--danger": errors?.dateExpected,
						})}
						hintMsg={errors?.dateExpected?.message}>
						<Controller
							render={({ field: { value, ...rest } }) => (
								<CalendarPicker
									selected={value}
									{...rest}
									inputProps={{
										pigment: errors?.dateExpected ? "danger" : "primary",
									}}
								/>
							)}
							name='dateExpected'
							control={control}
							defaultValue={null}
							rules={{
								required: t("validation.required"),
							}}
						/>
					</FormControl>
				</Flex.Col>
				<Flex.Col col='12'>
					<FormControl
						label={t("field.note")}
						htmlFor='extraInfo'
						className={cn({
							"text--danger": errors?.extraInfo,
						})}
						hintMsg={errors?.extraInfo?.message}>
						<Controller
							render={({ field }) => (
								<TextAreaComponent
									{...field}
									placeholder={t("field.note")}
									pigment={errors?.extraInfo ? "danger" : "primary"}
								/>
							)}
							name='extraInfo'
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
			</Flex>
			<PortalWrapper element={formFooter ?? null}>
				<Button type='submit' form='shipping-plan-form' isLoading={isLoadingAdd || isLoadingUpdate}>
					{t(`action.${payload ? "update" : "add"}`, { entry: t("common.shippingPlan") })}{" "}
				</Button>
			</PortalWrapper>
		</Form>
	);
};

export default ShippingPlanStepSummary;
