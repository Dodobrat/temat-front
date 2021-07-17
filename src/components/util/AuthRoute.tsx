import React from "react";
import { Redirect, Route } from "react-router";
import { useAuthContext } from "../../context/AuthContext";

const AuthRoute = ({ component, ...rest }) => {
	const {
		tokenValue: { token },
	} = useAuthContext();

	if (!token) return <Redirect push to='/guest' />;

	return <Route component={component} {...rest} />;
};

export default AuthRoute;
