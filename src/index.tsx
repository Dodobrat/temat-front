import React from "react";
import ReactDOM from "react-dom";
import "./assets/app.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "@dodobrat/react-ui-kit";
import AuthProvider from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import { GlobalOptions } from "@dodobrat/react-ui-kit/build/helpers/global.types";

import "./i18n";

const queryClient = new QueryClient();

const appConfig: GlobalOptions = {
	containerSize: "xl",
};

ReactDOM.render(
	<ConfigProvider config={appConfig}>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<App />
			</AuthProvider>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	</ConfigProvider>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
