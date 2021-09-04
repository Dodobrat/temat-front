import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { Form, Button, Flex, TextArea, FormControl, PortalWrapper } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useShippingPlanAdd, useShippingPlanUpdate } from "../../../../actions/mutateHooks";

import { useShippingPlansContext } from "../../../../context/ShippingPlansContext";

import CalendarPicker from "../../../../components/util/CalendarPicker";
import OrderStepProducts from "../../Orders/order_steps/OrderStepProducts";

import { getClosestValidDate } from "../../../../helpers/dateHelpers";
import { errorToast, successToast } from "../../../../helpers/toastEmitter";

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

const ShippingPlanStepSummary = ({ payload, onClose }) => {
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
		formState: { errors },
	} = useForm({
		defaultValues: {
			...data,
			dateExpected: data?.dateExpected ?? getClosestValidDate(),
		},
	});

	const { mutate: addShippingPlan, isLoading: isLoadingAdd } = useShippingPlanAdd({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("shippingPlans");
				onClose();
			},
			onError: (err: any) => errorToast(err),
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
			onError: (err: any) => errorToast(err),
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
						initialData={data.products}
						companyId={getValues("companyId")?.value ?? getValues("companyId")}
						formProps={{ control, errors, setValue, watch, clearErrors }}
					/>
				</Flex.Col>
				<Flex.Col col='12'>
					<FormControl
						label={t("plans.dateExpected")}
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
								required: "Field is required",
							}}
						/>
					</FormControl>
				</Flex.Col>
				<Flex.Col col='12'>
					<FormControl
						label={t("plans.extraInfo")}
						htmlFor='extraInfo'
						className={cn({
							"text--danger": errors?.extraInfo,
						})}
						hintMsg={errors?.extraInfo?.message}>
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
										pigment={errors?.extraInfo ? "danger" : "primary"}
									/>
								);
							}}
							name='extraInfo'
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
			</Flex>
			<PortalWrapper element={formFooter ?? null}>
				<Button type='submit' form='shipping-plan-form' isLoading={isLoadingAdd || isLoadingUpdate}>
					{t("common.submit")}
				</Button>
			</PortalWrapper>
		</Form>
	);
};

export default ShippingPlanStepSummary;
