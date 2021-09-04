import { FormControl } from "@dodobrat/react-ui-kit";
import { PortalWrapper } from "@dodobrat/react-ui-kit";
import { TextArea } from "@dodobrat/react-ui-kit";
import { Flex } from "@dodobrat/react-ui-kit";
import { Button } from "@dodobrat/react-ui-kit";
import { Form } from "@dodobrat/react-ui-kit";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CalendarPicker from "../../../../components/util/CalendarPicker";
import { useShippingPlansContext } from "../../../../context/ShippingPlansContext";
// import OrderStepProducts from "../../Orders/order_steps/OrderStepProducts";
import cn from "classnames";
import { getClosestValidDate } from "../../../../helpers/dateHelpers";

const ShippingPlanStepSummary = () => {
	const formFooter = document.getElementById("shipping-plan-form-footer");

	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useShippingPlansContext();

	const {
		control,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...data,
			dateExpected: data?.dateExpected ?? getClosestValidDate(),
		},
	});

	console.log(data);

	const handleValueUpdate = (key, val) => {
		setData((prev) => ({
			...prev,
			[key]: val,
		}));
	};

	const onSubmit = (data: any) => {
		console.log(data);
	};

	return (
		<Form id='shipping-plan-form' onSubmit={handleSubmit(onSubmit)}>
			<Flex>
				{/* <Flex.Col col='12'>
					<OrderStepProducts useContext={useShippingPlansContext} companyId={data?.companyId?.value ?? data?.companyId} />
				</Flex.Col> */}
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
					{/* <FormControl label={t("plans.dateExpected")}>
						<CalendarPicker selected={data?.dateExpected} onChange={(date) => handleValueUpdate("dateExpected", date)} />
					</FormControl> */}
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
				<span onClick={() => console.log(getValues())}>test</span>
				<Button type='submit' form='shipping-plan-form'>
					{t("common.submit")}
				</Button>
			</PortalWrapper>
		</Form>
	);
};

export default ShippingPlanStepSummary;
