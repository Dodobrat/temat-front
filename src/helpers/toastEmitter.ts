import { toast } from "react-toastify";

export const successToast = (data: { success: string }) => {
	const { success: message } = data;

	return toast.success(message, {
		position: "bottom-left",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	});
};

export const errorToast = (data) => {
	const { message } = data;

	return toast.error(message, {
		position: "bottom-left",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	});
};

export const warningToast = (data) => {
	return toast.warning(data, {
		position: "bottom-left",
		autoClose: false,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	});
};
