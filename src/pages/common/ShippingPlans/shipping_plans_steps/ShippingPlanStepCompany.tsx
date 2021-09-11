import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Button, PortalWrapper, FormControl, Form } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useCompanies } from "../../../../actions/fetchHooks";
import { useShippingPlansContext } from "../../../../context/ShippingPlansContext";
import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";

const ShippingPlanStepCompany = ({ withPrefetch }) => {
	const [formFooter, setFormFooter] = useState(document.getElementById("shipping-plan-form-footer"));

	useEffect(() => {
		setFormFooter(document.getElementById("shipping-plan-form-footer"));
	}, []);

	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useShippingPlansContext();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			companyId: data?.companyId,
		},
	});

	const onSubmit = (data: any) => {
		setData((prev) => ({
			...prev,
			companyId: data.companyId,
		}));
	};

	return (
		<Form id='shipping-plan-form' onSubmit={handleSubmit(onSubmit)}>
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
							defaultOptions={withPrefetch}
							preSelectOption={withPrefetch}
							className={cn({
								"temat__select__container--danger": errors?.companyId,
							})}
							{...field}
						/>
					)}
					name='companyId'
					control={control}
					defaultValue={null}
					shouldUnregister
					rules={{
						required: t("validation.required"),
					}}
				/>
			</FormControl>
			<PortalWrapper element={formFooter}>
				<Button type='submit' form='shipping-plan-form'>
					{t("common.next")}
				</Button>
			</PortalWrapper>
		</Form>
	);
};

export default ShippingPlanStepCompany;
