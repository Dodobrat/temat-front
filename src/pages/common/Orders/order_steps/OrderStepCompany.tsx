import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { FormControl, Form, PortalWrapper, Button, Flex } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useOrdersContext } from "../../../../context/OrdersContext";

import { useCompanies } from "../../../../actions/fetchHooks";

import WindowedAsyncSelect from "../../../../components/forms/WindowedAsyncSelect";

const OrderStepCompany = ({ useContext = useOrdersContext, withPrefetch }) => {
	const [formFooter, setFormFooter] = useState(document.getElementById("orders-form-footer"));

	useEffect(() => {
		setFormFooter(document.getElementById("orders-form-footer"));
	}, []);

	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
		stepValue: { setCurrStep },
	} = useContext();

	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			companyId: data?.payment?.companyId ?? null,
		},
	});

	const watchCompany = watch("companyId");

	const onSubmit = (data: any) => {
		setData((prev) => ({
			...prev,
			payment: {
				...prev.payment,
				companyId: data.companyId,
			},
		}));
		setCurrStep(1);
	};

	return (
		<Form id='orders-form' onSubmit={handleSubmit(onSubmit)}>
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
			<PortalWrapper element={formFooter ?? null}>
				<Flex wrap='nowrap' justify='flex-end' className='w-100' style={{ flex: 1 }}>
					<Flex.Col col='auto'>
						{watchCompany?.value && (
							<Button type='submit' form='orders-form'>
								{t("common.next")}
							</Button>
						)}
					</Flex.Col>
				</Flex>
			</PortalWrapper>
		</Form>
	);
};

export default OrderStepCompany;
