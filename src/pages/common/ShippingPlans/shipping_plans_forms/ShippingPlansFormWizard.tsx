import { useEffect, useState } from "react";
import { Button, Card, Flex, Input, FormControl } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useAuthContext } from "../../../../context/AuthContext";
import OrderStepProducts from "../../Orders/order_steps/OrderStepProducts";
import { useShippingPlansContext } from "../../../../context/ShippingPlansContext";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { useCompanies } from "../../../../actions/fetchHooks";
import DatePicker, { registerLocale } from "react-datepicker";
import { TextArea } from "@dodobrat/react-ui-kit";

import enGb from "date-fns/locale/en-GB";
import { useShippingPlanAdd, useShippingPlanUpdate } from "../../../../actions/mutateHooks";
import { errorToast, successToast } from "../../../../helpers/toastEmitter";

interface Props {
	payload: any;
	onClose: any;
}

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

const parseProductsToContext = (products) => {
	const productsWithIds = [];
	for (const product of products) {
		productsWithIds.push({ ...product, value: product?.productId, quantity: product?.expected });
	}
	return productsWithIds;
};

const ShippingPlansFormWizard = (props: Props) => {
	registerLocale("en-gb", enGb);

	const { onClose, payload } = props;

	const queryClient = useQueryClient();
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useShippingPlansContext();

	const {
		userValue: { user },
	} = useAuthContext();

	const [canProceed, setCanProceed] = useState(false);

	useEffect(() => {
		if (user.roleName !== "ADMIN" && !payload) {
			setData((prev) => ({
				...prev,
				companyId: user?.companyId,
			}));
			setCanProceed(true);
		}
	}, [setData, user?.companyId, user.roleName, payload]);

	useEffect(() => {
		if (payload) {
			setData((prev) => ({
				...prev,
				companyId: payload?.companyId,
				products: parseProductsToContext(payload?.products),
				dateExpected: payload?.dateExpected ? new Date(payload?.dateExpected) : null,
				extraInfo: payload?.extraInfo ?? "",
			}));
			setCanProceed(true);
		}
	}, [setData, payload]);

	const handleValueUpdate = (key, val) => {
		setData((prev) => ({
			...prev,
			[key]: val,
		}));
	};

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

	const isNotSunday = (date) => {
		const day = new Date(date).getDay();
		return day !== 0;
	};

	const excludeUnavailableDates = () => {
		const excludedDates = [];

		const currDate = new Date();
		const isCurrSaturday = currDate.getDay() === 6;
		const currHour = currDate.getHours();

		if (isCurrSaturday && currHour > 12) {
			excludedDates.push(currDate);
		}

		return excludedDates;
	};

	return (
		<>
			<Card.Body>
				{!canProceed && user?.roleName === "ADMIN" && (
					<FormControl label={t("orders.companyId")} htmlFor='companyId'>
						<AsyncSelect
							useFetch={useCompanies}
							isClearable={false}
							value={data?.companyId}
							onChange={(option: any) => setData((prev: any) => ({ ...prev, companyId: option }))}
						/>
					</FormControl>
				)}
				{data?.companyId && canProceed && (
					<Flex>
						<Flex.Col col='12'>
							<OrderStepProducts useContext={useShippingPlansContext} companyId={data?.companyId?.value ?? data?.companyId} />
						</Flex.Col>
						<Flex.Col col='12'>
							<FormControl label={t("plans.dateExpected")} htmlFor='dateExpected'>
								<DatePicker
									selected={data?.dateExpected}
									onChange={(date) => handleValueUpdate("dateExpected", date)}
									className='w--100'
									id='dateExpected'
									dateFormat={"dd MMMM, yyyy"}
									calendarStartDay={1}
									locale='en-gb'
									fixedHeight
									minDate={new Date()}
									showWeekNumbers
									shouldCloseOnSelect
									excludeDates={excludeUnavailableDates()}
									filterDate={isNotSunday}
									customInput={<Input />}
								/>
							</FormControl>
						</Flex.Col>
						<Flex.Col col='12'>
							<FormControl label={t("plans.extraInfo")} htmlFor='extraInfo'>
								<TextArea
									value={data?.extraInfo}
									name='extraInfo'
									maxLength={250}
									onChange={(e) => handleValueUpdate("extraInfo", e.target.value)}
								/>
							</FormControl>
						</Flex.Col>
					</Flex>
				)}
			</Card.Body>
			{data?.companyId && (
				<Card.Footer justify='flex-end'>
					<Button
						pigment='primary'
						isLoading={isLoadingAdd || isLoadingUpdate}
						onClick={() => {
							if (data?.companyId && !canProceed) {
								return setCanProceed(true);
							}
							if (!payload) {
								return addShippingPlan(parseShippingPlanData(data));
							} else {
								return updateShippingPlan(parseShippingPlanData(data));
							}
						}}>
						{!canProceed ? t("common.next") : t("common.submit")}
					</Button>
				</Card.Footer>
			)}
		</>
	);
};

export default ShippingPlansFormWizard;
