import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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
	const [hasReachedEnd, setHasReachedEnd] = useState(false);

	useEffect(() => {
		if (currStep >= 6) {
			setHasReachedEnd(true);
		}
	}, [currStep]);

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

	const endValue = useMemo(() => ({ hasReachedEnd, setHasReachedEnd }), [hasReachedEnd, setHasReachedEnd]);
	const stepValue = useMemo(() => ({ currStep, setCurrStep }), [currStep, setCurrStep]);
	const panelsValue = useMemo(() => ({ toggledSummaryPanels, setToggledSummaryPanels }), [toggledSummaryPanels, setToggledSummaryPanels]);
	const dataValue = useMemo(() => ({ data, setData }), [data, setData]);

	const closeAllPanelsExcept = useCallback(
		(key) => {
			const editedSummaryPanels: any = Object.keys(panelsValue.toggledSummaryPanels).reduce((prev, curr) => {
				return { ...prev, [curr]: curr !== key };
			}, {});
			setTimeout(() => {
				setToggledSummaryPanels(editedSummaryPanels);
			}, 1);
		},
		[panelsValue.toggledSummaryPanels]
	);

	return (
		<OrdersContext.Provider
			value={{
				endValue,
				stepValue,
				panelsValue,
				dataValue,
				closeAllPanelsExcept,
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
