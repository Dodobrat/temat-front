import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Button, Input, ListGroup, Flex, FormControl } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";
import { useOrderFileDelete } from "../../../../actions/mutateHooks";

import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import cn from "classnames";

import { IconTrash, LogoPdf } from "../../../../components/ui/icons";

const OrderStepFiles = ({ useContext = useOrdersContext, updateForm = false }: { [key: string]: any }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		dataValue: { data, setData },
	} = useContext();

	const [currFile, setCurrFile] = useState("");
	const [fileError, setFileError] = useState(null);

	const handleOnUpload = (e: any) => {
		const existingFiles = data.files.filter((file) => file.name === e.target.files[0]?.name);
		const uploadLimit = data.files.length > 4;

		if (existingFiles.length > 0) {
			return setFileError({
				message: "File name already exists!",
			});
		}
		if (uploadLimit) {
			return setFileError({
				message: "Max 5 files allowed!",
			});
		}
		setData((prev: any) => ({
			...prev,
			files: [...prev.files, e.target.files[0]],
		}));
		setCurrFile("");
		setFileError(null);
	};

	const removeFileFromList = (file) => {
		const newFilesList = data.files.filter((item) => item.name !== file.name);

		setData((prev: any) => ({
			...prev,
			files: [...newFilesList],
		}));
	};

	const { mutate: deleteFile, isLoading: isLoadingDelete } = useOrderFileDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orderById");
			},
			onError: (err: any) => errorToast(err),
		},
	});

	return (
		<>
			{data.files?.length > 0 && (
				<ListGroup elevation='none' className='my--2 outline' isLoading={isLoadingDelete}>
					{data.files.map((file) => (
						<ListGroup.Item key={file?.name} className='px--2'>
							<Flex wrap='nowrap' align='center'>
								<Flex.Col col='auto'>
									<LogoPdf height='2rem' width='2rem' />
								</Flex.Col>
								<Flex.Col>{file?.name}</Flex.Col>
								<Flex.Col col='auto'>
									<Button
										equalDimensions
										pigment='danger'
										onClick={() =>
											updateForm
												? deleteFile({ orderId: data?.orderId, fileKey: file?.key })
												: removeFileFromList(file)
										}>
										<IconTrash />
									</Button>
								</Flex.Col>
							</Flex>
						</ListGroup.Item>
					))}
				</ListGroup>
			)}
			<FormControl
				label={t("orders.files")}
				htmlFor='files'
				className={cn({
					"text--danger": fileError,
				})}
				hintMsg={fileError?.message}>
				<Input type='file' name='files' accept='application/pdf' value={currFile} onChange={handleOnUpload} />
			</FormControl>
		</>
	);
};

export default OrderStepFiles;
