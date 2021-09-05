import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const OrdersContext = createContext(null);

interface OrdersProviderProps {
	initialData?: any;
	initialStep?: number;
	children?: React.ReactNode;
}

const OrdersProvider: React.FC<OrdersProviderProps> = ({ children, initialData, initialStep }) => {
	const [currStep, setCurrStep] = useState(initialStep ?? 0);
	const [toggledSummaryPanels, setToggledSummaryPanels] = useState({
		payment: false,
		shipping: false,
		receiver: false,
		products: false,
		extras: false,
	});
	const [data, setData] = useState(
		initialData ?? {
			payment: {},
			shipping: {},
			receiver: {},
			products: [],
			extras: {},
		}
	);

	useEffect(() => {
		if (initialData) {
			setData(initialData);
		}
	}, [initialData]);

	useEffect(() => {
		if (initialStep) {
			setCurrStep(initialStep);
		}
	}, [initialStep]);

	const stepValue = useMemo(() => ({ currStep, setCurrStep }), [currStep, setCurrStep]);
	const panelsValue = useMemo(() => ({ toggledSummaryPanels, setToggledSummaryPanels }), [toggledSummaryPanels, setToggledSummaryPanels]);
	const dataValue = useMemo(() => ({ data, setData }), [data, setData]);

	return (
		<OrdersContext.Provider
			value={{
				stepValue,
				panelsValue,
				dataValue,
			}}>
			{children}
		</OrdersContext.Provider>
	);
};

export const useOrdersContext = () => {
	const context = useContext(OrdersContext);

	if (context === undefined) {
		throw new Error("useOrdersContext must be used within a OrdersProvider");
	}

	return context;
};

export default OrdersProvider;
