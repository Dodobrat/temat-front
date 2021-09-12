import { useTranslation } from "react-i18next";
import { Button, Input, ListGroup, Flex, FormControl } from "@dodobrat/react-ui-kit";

import { useOrderFileDelete } from "../../../../actions/mutateHooks";

import { successToast } from "../../../../helpers/toastEmitter";
import cn from "classnames";

import { IconTrash, LogoPdf } from "../../../../components/ui/icons";
import { Controller } from "react-hook-form";
import { imageValidator } from "../../../../helpers/formValidations";
import { TextArea } from "@dodobrat/react-ui-kit";
import { useEffect } from "react";

const OrderStepExtras = ({
	orderId,
	isUpdating,
	dataFiles,
	formProps: { control, errors, watch, setValue, getValues, setError, clearErrors },
}: any) => {
	const watchFiles = watch("files");

	useEffect(() => {
		if (dataFiles) {
			setValue("files", dataFiles);
		}
	}, [dataFiles, setValue]);

	const { t } = useTranslation();

	const removeFileFromList = (file) => {
		const newFilesList = watchFiles.filter((item) => item.name !== file.name);

		setValue("files", newFilesList);
	};

	const { mutate: deleteFile, isLoading: isLoadingDelete } = useOrderFileDelete({
		queryConfig: {
			onSuccess: (res: any) => successToast(res),
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
											type='button'
											onClick={() => {
												const isFile = file instanceof File;
												if (isUpdating) {
													if (isFile) {
														return removeFileFromList(file);
													} else {
														return deleteFile({ orderId, fileKey: file?.key });
													}
												}
												return removeFileFromList(file);
											}}>
											<IconTrash />
										</Button>
									</Flex.Col>
								</Flex>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
				<FormControl
					label={t("field.file", { count: 0 })}
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
													message: t("validation.sameFile"),
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
								if (files.length > 5) return t("validation.maxFiles", { value: 5 });
								for (const file of files) {
									if (typeof imageValidator({ file: file, t }) === "string") {
										return imageValidator({ file: file, multi: true, t });
									}
								}
							},
						}}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl
					label={t("field.note")}
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
									placeholder={t("field.note")}
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
							minLength: {
								value: 2,
								message: t("validation.minLength", { value: 2 }),
							},
							maxLength: {
								value: 250,
								message: t("validation.maxLength", { value: 250 }),
							},
						}}
					/>
				</FormControl>
			</Flex.Col>
		</Flex>
	);
};

export default OrderStepExtras;
