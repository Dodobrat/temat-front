import React from "react";
import ReactDOM from "react-dom";
import "./assets/app.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "@dodobrat/react-ui-kit";

ReactDOM.render(
	<ConfigProvider>
		<App />
	</ConfigProvider>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
