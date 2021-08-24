import { ListGroup } from "@dodobrat/react-ui-kit";
import { Button } from "@dodobrat/react-ui-kit";
import { Badge } from "@dodobrat/react-ui-kit";
import { CollapseFade } from "@dodobrat/react-ui-kit";
import { Heading, Card, Flex, Text } from "@dodobrat/react-ui-kit";
import { useEffect, useState } from "react";
// import cn from "classnames";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { useOrderById, useOrderFileDownloadById, useOrderLabelDownloadById } from "../../../actions/fetchHooks";
import { useOrderFinish } from "../../../actions/mutateHooks";
import { LogoPdf } from "../../../components/ui/icons";
import Image from "../../../components/ui/Image";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { pickPigment } from "../../../components/util/table_cells/OrderStatusCell";
import { useAuthContext } from "../../../context/AuthContext";
import { parseDate } from "../../../helpers/dateHelpers";
import { errorToast, successToast } from "../../../helpers/toastEmitter";
import OrdersViewHistory from "./OrdersViewHistory";

const addressInfo = (order: { address: any }) => {
	const address = order?.address;

	const mainAddress = [address?.country, address?.city, address?.zipCode].filter((entry) => entry);
	const secondaryAddress = [address?.streetName, address?.streetNumber].filter((entry) => entry);

	const main = mainAddress.length > 0 ? mainAddress.join(", ") : null;
	const secondary = secondaryAddress.length > 0 ? secondaryAddress.join(" ") : null;
	const office = address?.officeName ?? null;

	return { main, secondary, office };
};

const clientInfo = (order: { client: any }) => {
	const client = order?.client;

	const receiverInfo = [client?.receiverName, client?.receiverPhone].filter((entry) => entry);
	const agentInfo = [client?.receiverAgentName, client?.receiverAgentPhone].filter((entry) => entry);
	const contactInfo = [client?.phone, client?.email].filter((entry) => entry);

	const receiver = receiverInfo.length > 0 ? receiverInfo.join(" | ") : null;
	const agent = agentInfo.length > 0 ? agentInfo.join(" | ") : null;
	const contact = contactInfo.length > 0 ? contactInfo.join(" | ") : null;

	return { receiver, agent, contact };
};

const paymentInfo = (order: { payment: any }) => {
	const payment = order?.payment;

	const shippingMethod = payment?.shippingMethodName;
	const paidBy = payment?.shippingPaidBy;
	const orderAmount = `${payment?.totalAmount} ${payment?.symbol}`;

	return { shippingMethod, paidBy, orderAmount };
};

const detailsInfo = (order: { details: any; files: any }) => {
	const details = order?.details;
	const files = order?.files;
	const companyId = order?.details?.companyId;
	const companyName = order?.details?.companyName;
	const status = order?.details?.status;
	const shipDate = parseDate(order?.details?.shipDate);

	const note = details?.customerNote ?? null;
	const company = { id: companyId, name: companyName };

	return { note, files, company, status, shipDate };
};

const OrdersViewPage = () => {
	const { id: orderId }: any = useParams();
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const {
		userValue: { user },
		userCan,
	} = useAuthContext();

	const [loadOrderHistory, setLoadOrderHistory] = useState(false);
	const [clickedFileKey, setClickedFileKey] = useState(null);

	const loadHistory = () => setLoadOrderHistory((prev) => !prev);

	const { data: orderData } = useOrderById({
		specs: {
			filters: {
				products: "true",
				files: "true",
			},
		},
		queryConfig: {
			onError: (err: any) => errorToast(err),
		},
		specialKey: { orderId: orderId, filters: ["products", "files"] },
	});

	const { data: label, refetch: geOrderLabel } = useOrderLabelDownloadById({
		queryConfig: {
			onError: (err: any) => errorToast(err),
		},
		specialKey: { orderId: orderId },
	});

	const { data: file } = useOrderFileDownloadById({
		queryConfig: {
			enabled: !!clickedFileKey,
			onError: (err: any) => errorToast(err),
		},
		specialKey: { orderId: orderId, fileKey: clickedFileKey },
	});

	useEffect(() => {
		if (label) {
			const {link, file} = label?.data;

			if (link) {
			 	window.open(link, "_blank");
			 } else if(file) {
				let pdfWindow = window.open("");
				pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64," + encodeURI(label.data.file) + "'></iframe>")
			 }
			}
		}, [label]);

	useEffect(() => {
		if (file) {
			const link = file?.data?.link;
			if (link) {
				window.open(file?.data?.link, "_blank");
			}
		}
	}, [file]);

	const { data: order } = orderData ?? { data: null };

	const { mutate: finishOrder, isLoading: isLoadingFinish } = useOrderFinish({
		specs: {
			orderId: order?.details?.id,
		},
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("orders");
				queryClient.invalidateQueries("orderById");
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const noAddressData = !addressInfo(order).main && !addressInfo(order).secondary && !addressInfo(order).office;
	const noClientData = !clientInfo(order).receiver && !clientInfo(order).agent && !clientInfo(order).contact;
	const noDetailsData = detailsInfo(order).files?.length === 0 && !detailsInfo(order).note;

	const NoResults = () => <strong className='text--opaque'>N/A</strong>;

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Order #{orderId}</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Order #{orderId}
						</Heading>
					</Flex.Col>
					<Flex.Col col='auto'>
						<Button pigment='none'>{parseDate(order?.details?.dateCreated, true) ?? "Date Added"}</Button>
					</Flex.Col>
					{userCan("deliveryLabelCreate") && (
						<Flex.Col col='auto'>
							<Button pigment='info' onClick={geOrderLabel} >
								Get Label
							</Button>
						</Flex.Col>
					)}
					<Flex.Col col='auto'>
						<Button
							pigment='success'
							onClick={() => (order?.details?.status !== "Shipped" ? finishOrder() : null)}
							isLoading={isLoadingFinish}>
							{order?.details?.status !== "Shipped" ? "Finish Order" : "Finished"}
						</Button>
					</Flex.Col>
				</Flex>
			</PageHeader>
			<PageContent>
				<Flex wrap={{ base: "wrap", xl: "nowrap" }} spacingX='md' spacingY='md'>
					<Flex.Col col={{ base: "12", md: "6", xl: "reset" }}>
						<Flex direction='column' spacingY='md'>
							{/* <Flex.Col className='w--100'>
								<Card>
									<Card.Body>
										<Heading as='p'>{t("orders.progress")}</Heading>
										Progress
									</Card.Body>
								</Card>
							</Flex.Col> */}
							<Flex.Col className='w--100'>
								<Card>
									<Card.Body>
										<Heading as='p'>{t("orders.products")}</Heading>
										{order?.products.length > 0 ? (
											<ListGroup elevation='none' className='outline'>
												{order?.products?.map((product) => (
													<ListGroup.Item
														className='p--2'
														key={product?.productId}
														as={Link}
														to={`/app/products/${product?.productId}`}>
														<Flex align='center' wrap={{ base: "wrap", md: "nowrap" }}>
															<Flex.Col col={{ base: "12", md: "reset" }}>
																<Flex wrap='nowrap' align='center'>
																	<Flex.Col className='temat__table__img'>
																		<Image
																			imgSrc={product?.image}
																			alt={product?.description ?? product?.label}
																		/>
																	</Flex.Col>
																	<Flex.Col>
																		<Text className='mb--0'>{product?.name}</Text>
																	</Flex.Col>
																</Flex>
															</Flex.Col>
															<Flex.Col col={{ base: "12", md: "auto" }}>
																<Flex wrap='nowrap' align='center'>
																	<Flex.Col col='auto'>
																		<Badge sizing='lg' pigment='warning'>
																			{t("orders.sku")}: {product?.sku}
																		</Badge>
																	</Flex.Col>
																	<Flex.Col col='auto'>
																		<Badge sizing='lg' pigment='warning'>
																			{t("orders.qty")}: {product?.required}
																		</Badge>
																	</Flex.Col>
																</Flex>
															</Flex.Col>
														</Flex>
													</ListGroup.Item>
												))}
											</ListGroup>
										) : (
											<span className='text--opaque'>N/A</span>
										)}
									</Card.Body>
								</Card>
							</Flex.Col>
							<Flex.Col className='w--100'>
								<Card>
									<Card.Body>
										<Flex align='stretch' spacingX='md' spacingY='md'>
											<Flex.Col col={{ base: "12", xl: "6", fhd: "4" }} className='h--100'>
												<Heading as='p'>{t("orders.address")}</Heading>
												{noAddressData && <NoResults />}
												{detailsInfo(order).shipDate && (
													<Text className='mb--1'>
														Ship Date: <strong>{detailsInfo(order).shipDate}</strong>
													</Text>
												)}
												{paymentInfo(order).shippingMethod && (
													<Text className='mb--1'>
														Ship Method: <strong>{paymentInfo(order).shippingMethod}</strong>
													</Text>
												)}
												{addressInfo(order).main && (
													<Text className='mb--1'>
														Address: <strong>{addressInfo(order).main}</strong>
													</Text>
												)}
												{addressInfo(order).secondary && (
													<Text className='mb--0'>
														Street: <strong>{addressInfo(order).secondary}</strong>
													</Text>
												)}
												{addressInfo(order).office && (
													<Text className='mb--0'>
														Office: <strong>{addressInfo(order).office}</strong>
													</Text>
												)}
											</Flex.Col>
											<Flex.Col col={{ base: "12", xl: "6", fhd: "4" }}>
												<Heading as='p'>{t("orders.client")}</Heading>
												{noClientData && <NoResults />}
												{clientInfo(order).receiver && (
													<Text className='mb--1'>
														Receiver: <strong>{clientInfo(order).receiver}</strong>
													</Text>
												)}
												{clientInfo(order).agent && (
													<Text className='mb--1'>
														Agent: <strong>{clientInfo(order).agent}</strong>
													</Text>
												)}
												{clientInfo(order).contact && (
													<Text className='mb--0'>
														Contact: <strong>{clientInfo(order).contact}</strong>
													</Text>
												)}
											</Flex.Col>
											<Flex.Col col={{ base: "12", xl: "12", fhd: "4" }}>
												<Heading as='p'>{t("orders.payment")}</Heading>
												{noClientData && <NoResults />}
												{paymentInfo(order).paidBy && (
													<Text className='mb--1'>
														Paid By: <strong>{paymentInfo(order).paidBy}</strong>
													</Text>
												)}
												{paymentInfo(order).orderAmount && (
													<Text className='mb--0'>
														Amount: <strong>{paymentInfo(order).orderAmount}</strong>
													</Text>
												)}
											</Flex.Col>
										</Flex>
									</Card.Body>
								</Card>
							</Flex.Col>
							<Flex.Col className='w--100'>
								<Card>
									<Button as='div' wide pigment='none' leftAlignContent onClick={loadHistory}>
										<Heading as='p' className='mb--1'>
											{t(`common.${loadOrderHistory ? "hide" : "show"}`)} {t("orders.history")}
										</Heading>
									</Button>
									<CollapseFade in={loadOrderHistory}>
										<OrdersViewHistory order={order} />
									</CollapseFade>
								</Card>
							</Flex.Col>
						</Flex>
					</Flex.Col>
					<Flex.Col col={{ base: "12", md: "6", xl: "auto" }} className='temat__view__aside'>
						<Card className='temat__view__aside__card'>
							<Card.Body>
								<Heading as='p'>{t("orders.additionalInfo")}</Heading>
								{noDetailsData && <NoResults />}
								{detailsInfo(order).status && (
									<Flex align='center' disableNegativeSpace className='mb--2 p--2 outline flavor--default'>
										<Flex.Col>Status</Flex.Col>
										<Flex.Col col='auto'>
											<Badge pigment={pickPigment(detailsInfo(order).status)} sizing='lg'>
												{detailsInfo(order).status}
											</Badge>
										</Flex.Col>
									</Flex>
								)}
								{detailsInfo(order).files?.length > 0 && (
									<ListGroup elevation='none' className='outline mb--2'>
										<ListGroup.Header>Files</ListGroup.Header>
										{detailsInfo(order).files?.map((file: any) => (
											<ListGroup.Item key={file?.key} onClick={() => setClickedFileKey(file?.key)}>
												<Flex wrap='nowrap' align='center'>
													<Flex.Col col='auto'>
														<LogoPdf height='2rem' width='2rem' />
													</Flex.Col>
													<Flex.Col>{file?.name}</Flex.Col>
												</Flex>
											</ListGroup.Item>
										))}
									</ListGroup>
								)}
								{user?.roleName === "ADMIN" && detailsInfo(order).company.name && (
									<ListGroup elevation='none' className='outline mb--2'>
										<ListGroup.Header>Company Name</ListGroup.Header>
										<ListGroup.Item as={Link} to={`/app/companies/${detailsInfo(order).company.id}`}>
											{detailsInfo(order).company.name}
										</ListGroup.Item>
									</ListGroup>
								)}
								{detailsInfo(order).note && (
									<ListGroup elevation='none' className='outline'>
										<ListGroup.Header>Note</ListGroup.Header>
										<ListGroup.Item>{detailsInfo(order).note}</ListGroup.Item>
									</ListGroup>
								)}
							</Card.Body>
						</Card>
					</Flex.Col>
				</Flex>
			</PageContent>
		</PageWrapper>
	);
};

export default OrdersViewPage;
