import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Button, Input, ListGroup, Flex, FormControl } from "@dodobrat/react-ui-kit";

import { useOrderFileDelete } from "../../../../actions/mutateHooks";

import { errorToast, successToast } from "../../../../helpers/toastEmitter";
import cn from "classnames";

import { IconTrash, LogoPdf } from "../../../../components/ui/icons";
import { Controller } from "react-hook-form";
import { imageValidator } from "../../../../helpers/formValidations";
import { TextArea } from "@dodobrat/react-ui-kit";

const OrderStepFiles = ({
	orderId,
	updateForm = false,
	initialData,
	formProps: { control, errors, watch, setValue, getValues, setError, clearErrors },
}: {
	[key: string]: any;
}) => {
	const watchFiles = watch("files", initialData?.files);

	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const removeFileFromList = (file) => {
		const newFilesList = watchFiles.filter((item) => item.name !== file.name);

		setValue("files", newFilesList);
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
		<Flex>
			<Flex.Col col='12'>
				{watchFiles?.length > 0 && (
					<ListGroup elevation='none' className='my--2 outline' isLoading={isLoadingDelete}>
						{watchFiles.map((file) => (
							<ListGroup.Item key={file?.name} className='px--2'>
								<Flex wrap='nowrap' align='center'>
									<Flex.Col col='auto'>
										<LogoPdf height='2rem' width='2rem' />
									</Flex.Col>
									<Flex.Col>{file?.name}</Flex.Col>
									{file?.size && (
										<Flex.Col col='auto'>
											<small>
												<em>{(file?.size / (1024 * 1024)).toFixed(2)} MB</em>
											</small>
										</Flex.Col>
									)}
									<Flex.Col col='auto'>
										<Button
											equalDimensions
											pigment='danger'
											onClick={() =>
												updateForm ? deleteFile({ orderId, fileKey: file?.key }) : removeFileFromList(file)
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
						"text--danger": errors?.files,
					})}
					hintMsg={errors?.files?.message}>
					<Controller
						render={({ field }) => {
							const { ref, onChange, value, ...fieldRest } = field;
							return (
								<Input
									type='file'
									multiple
									accept='application/pdf'
									{...fieldRest}
									onChange={(e) => {
										for (const uploadedFile of e.target.files) {
											if (watchFiles.filter((file) => file.name === uploadedFile.name).length > 0) {
												return setError("files", {
													type: "manual",
													message: "A file with the same name already exists",
												});
											}
										}
										clearErrors();
										setValue("files", [...getValues("files"), ...e.target.files]);
									}}
									value=''
									innerRef={ref}
									pigment={errors?.files ? "danger" : "primary"}
								/>
							);
						}}
						name='files'
						control={control}
						defaultValue=''
						rules={{
							validate: (files) => {
								if (files.length > 5) return `Max 5 files allowed`;
								for (const file of files) {
									if (typeof imageValidator({ file: file }) === "string") {
										return imageValidator({ file: file, multi: true });
									}
								}
							},
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label='Delivery Note'
					htmlFor='customerNote'
					className={cn({
						"text--danger": errors?.customerNote,
					})}
					hintMsg={errors?.customerNote?.message}>
					<Controller
						render={({ field }) => {
							const { ref, ...fieldRest } = field;
							return (
								<TextArea
									placeholder='Enter Note'
									{...fieldRest}
									innerRef={ref}
									style={{ minHeight: "unset" }}
									// maxLength={250}
									withCharacterCount={false}
									pigment={errors?.customerNote ? "danger" : "primary"}
								/>
							);
						}}
						name='customerNote'
						control={control}
						defaultValue=''
						rules={{
							minLength: { value: 2, message: "Min 2 characters" },
							maxLength: { value: 250, message: "Max 250 characters" },
						}}
					/>
				</FormControl>
			</Flex.Col>
		</Flex>
	);
};

export default OrderStepFiles;
