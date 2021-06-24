import axios from "axios";

const setAuthHeader = (token: string) => {
	if (token) {
		axios.defaults.headers.common["auth-token"] = token;
	} else {
		delete axios.defaults.headers.common["auth-token"];
	}
};

export default setAuthHeader;
