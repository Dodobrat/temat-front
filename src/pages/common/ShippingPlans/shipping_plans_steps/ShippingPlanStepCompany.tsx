import { Form } from "@dodobrat/react-ui-kit";
import { FormControl } from "@dodobrat/react-ui-kit";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCompanies } from "../../../../actions/fetchHooks";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { useShippingPlansContext } from "../../../../context/ShippingPlansContext";
import cn from "classnames";
import { PortalWrapper } from "@dodobrat/react-ui-kit";
import { Button } from "@dodobrat/react-ui-kit";

const ShippingPlanStepCompany = ({ canProceed }) => {
	const formFooter = document.getElementById("shipping-plan-form-footer");

	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useShippingPlansContext();

	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			companyId: data?.companyId,
		},
	});

	const watchCompanyId = watch("companyId");

	const onSubmit = (data: any) => {
		setData((prev) => ({
			...prev,
			companyId: data.companyId,
		}));
		canProceed(true);
	};

	return (
		<Form id='shipping-plan-form' onSubmit={handleSubmit(onSubmit)}>
			<FormControl
				label={t("orders.companyId")}
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
							preSelectOption
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
			<PortalWrapper element={formFooter ?? null}>
				{watchCompanyId && (
					<Button type='submit' form='shipping-plan-form'>
						{t("common.next")}
					</Button>
				)}
			</PortalWrapper>
		</Form>
	);
};

export default ShippingPlanStepCompany;
