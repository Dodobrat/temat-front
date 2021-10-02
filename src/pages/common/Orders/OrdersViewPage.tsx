import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Tooltip, ZoomPortal, Heading, Card, Flex, Text, Portal, CollapseFade, Badge, Button, ListGroup } from "@dodobrat/react-ui-kit";
// import cn from "classnames";

import { useOrderById, useOrderFileDownloadById, useOrderLabelDownloadById } from "../../../actions/fetchHooks";
import { useOrderFinish } from "../../../actions/mutateHooks";

import { useAuthContext } from "../../../context/AuthContext";

import { IconClose, IconEdit, LogoPdf } from "../../../components/ui/icons";
import Image from "../../../components/ui/Image";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { pickPigment } from "../../../components/util/table_cells/OrderStatusCell";
import OrdersViewHistory from "./OrdersViewHistory";

import { parseDate } from "../../../helpers/dateHelpers";
import { successToast } from "../../../helpers/toastEmitter";
import { parseBaseLink } from "../../../helpers/helpers";

const OrdersUpdateForm = lazy(() => import("./order_forms/OrdersUpdateForm"));

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

	//Not the perfect check for phoneCode availabilty
	const receiverInfo = [
		client?.receiverName,
		client?.receiverPhoneCode && `${client?.receiverPhoneCode} ${client?.receiverPhone}`,
	].filter((entry) => entry);
	const agentInfo = [
		client?.receiverAgentName,
		client?.receiverAgentPhoneCode && `${client?.receiverAgentPhoneCode} ${client?.receiverAgentPhone}`,
	].filter((entry) => entry);
	const contactInfo = [client?.phoneCode && `${client?.phoneCode} ${client?.phone}`, client?.email].filter((entry) => entry);

	const receiver = receiverInfo.length > 0 ? receiverInfo.join(" | ") : null;
	const agent = agentInfo.length > 0 ? agentInfo.join(" | ") : null;
	const contact = contactInfo.length > 0 ? contactInfo.join(" | ") : null;

	return { receiver, agent, contact };
};

const paymentInfo = (order: { payment: any }) => {
	const payment = order?.payment;

	const shippingMethod = payment?.shippingMethodName;
	const paidBy = payment?.shipmentPayeeName;
	const orderAmount = `${payment?.totalAmount ?? "0"} ${payment?.symbol}`;
	const currency = payment?.symbol;

	return { shippingMethod, paidBy, orderAmount, currency };
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

	const [showOrdersUpdateForm, setShowOrdersUpdateForm] = useState({ state: false, payload: null });
	const [downloadPopUp, setDownloadPopUp] = useState({ state: false, payload: null });

	const closeDownloadPopUp = () => setDownloadPopUp({ state: false, payload: null });
	const closeOrdersUpdateForm = () => setShowOrdersUpdateForm((prev) => ({ ...prev, state: false }));

	const loadHistory = () => setLoadOrderHistory((prev) => !prev);

	const { data: orderData } = useOrderById({
		specs: {
			filters: {
				products: "true",
				files: "true",
			},
		},
		specialKey: { orderId: orderId, filters: ["products", "files"] },
	});

	const { data: label, refetch: getOrderLabel } = useOrderLabelDownloadById({
		queryConfig: {
			onSuccess: (res) => {
				setDownloadPopUp({
					state: true,
					payload: (
						<iframe
							title='shipping_label'
							width='100%'
							height='100%'
							style={{ border: "none", minHeight: "60vh" }}
							src={parseBaseLink(res)}
						/>
					),
				});
			},
		},
		specialKey: { orderId: orderId },
	});

	const { data: file } = useOrderFileDownloadById({
		queryConfig: {
			enabled: !!clickedFileKey,
		},
		specialKey: { orderId: orderId, fileKey: clickedFileKey },
	});

	useEffect(() => {
		if (label) {
			setDownloadPopUp((prev) => ({
				...prev,
				payload: (
					<iframe
						title='shipping_label'
						width='100%'
						height='100%'
						style={{ border: "none", minHeight: "60vh" }}
						src={parseBaseLink(label)}
					/>
				),
			}));
		}
	}, [label]);

	useEffect(() => {
		if (file) {
			const { link } = file?.data;
			if (link) {
				window.open(link, "_blank");
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
		},
	});

	const noAddressData = !addressInfo(order).main && !addressInfo(order).secondary && !addressInfo(order).office;
	const noClientData = !clientInfo(order).receiver && !clientInfo(order).agent && !clientInfo(order).contact;

	const NoResults = () => <strong className='text--opaque'>{t("common.na")}</strong>;

	return (
		<PageWrapper>
			<Helmet>
				<title>
					{process.env.REACT_APP_NAME} | {t("common.order")} #{orderId}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.order")} #{orderId}
						</Heading>
					</Flex.Col>
					<Flex.Col col='auto'>
						<Button pigment='none'>{parseDate(order?.details?.dateCreated, true) ?? "Date Added"}</Button>
					</Flex.Col>
					<Flex.Col col={{ base: "12", md: "auto" }}>
						<Flex align='center' justify='flex-end'>
							{userCan(["orderUpdate", "orderUpdateTheir"]) && (
								<Flex.Col col='auto'>
									<Tooltip sizing='xs' content={<strong>{t(`action.edit`).toUpperCase()}</strong>}>
										<Button
											pigment='warning'
											equalDimensions
											onClick={() => setShowOrdersUpdateForm({ state: true, payload: { id: order?.details?.id } })}>
											<IconEdit />
										</Button>
									</Tooltip>
								</Flex.Col>
							)}
							{userCan("deliveryLabelCreate") && (
								<Flex.Col col='auto'>
									<Button pigment='info' onClick={getOrderLabel}>
										{t("order.getLabel")}
									</Button>
								</Flex.Col>
							)}
							{userCan("orderFinishPack") && (
								<Flex.Col col='auto'>
									<Button
										pigment='success'
										onClick={() => (order?.details?.status !== "Shipped" ? finishOrder() : null)}
										isLoading={isLoadingFinish}>
										{order?.details?.status !== "Shipped" ? t("order.finishOrder") : t("order.finished")}
									</Button>
								</Flex.Col>
							)}
						</Flex>
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
										<Heading as='p'>Progress</Heading>
										Progress
									</Card.Body>
								</Card>
							</Flex.Col> */}
							<Flex.Col className='w--100'>
								<Card>
									<Card.Body>
										<Heading as='p'>{t("common.product", { count: 0 })}</Heading>
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
																			{t("field.price")}: {product?.price}{" "}
																			{paymentInfo(order).currency ?? ""}
																		</Badge>
																	</Flex.Col>
																	<Flex.Col col='auto'>
																		<Badge sizing='lg' pigment='warning'>
																			{t("common.qty")}: {product?.required}
																		</Badge>
																	</Flex.Col>
																</Flex>
															</Flex.Col>
														</Flex>
													</ListGroup.Item>
												))}
											</ListGroup>
										) : (
											<NoResults />
										)}
									</Card.Body>
								</Card>
							</Flex.Col>
							<Flex.Col className='w--100'>
								<Card>
									<Card.Body>
										<Flex align='stretch' spacingX='md' spacingY='md'>
											<Flex.Col col={{ base: "12", xl: "6", fhd: "4" }} className='h--100'>
												<Heading as='p'>{t("common.address")}</Heading>
												{noAddressData && <NoResults />}
												{detailsInfo(order).shipDate && (
													<Text className='mb--1'>
														{t("field.shipDate")}: <strong>{detailsInfo(order).shipDate}</strong>
													</Text>
												)}
												{paymentInfo(order).shippingMethod && (
													<Text className='mb--1'>
														{t("field.shippingMethod")}: <strong>{paymentInfo(order).shippingMethod}</strong>
													</Text>
												)}
												{addressInfo(order).main && (
													<Text className='mb--1'>
														{t("common.address")}: <strong>{addressInfo(order).main}</strong>
													</Text>
												)}
												{addressInfo(order).secondary && (
													<Text className='mb--0'>
														{t("common.street")}: <strong>{addressInfo(order).secondary}</strong>
													</Text>
												)}
												{addressInfo(order).office && (
													<Text className='mb--0'>
														{t("field.office")}: <strong>{addressInfo(order).office}</strong>
													</Text>
												)}
											</Flex.Col>
											<Flex.Col col={{ base: "12", xl: "6", fhd: "4" }}>
												<Heading as='p'>{t("common.client")}</Heading>
												{noClientData && <NoResults />}
												{clientInfo(order).receiver && (
													<Text className='mb--1'>
														{t("common.receiver")}: <strong>{clientInfo(order).receiver}</strong>
													</Text>
												)}
												{clientInfo(order).agent && (
													<Text className='mb--1'>
														{t("common.agent")}: <strong>{clientInfo(order).agent}</strong>
													</Text>
												)}
												{clientInfo(order).contact && (
													<Text className='mb--0'>
														{t("common.contact")}: <strong>{clientInfo(order).contact}</strong>
													</Text>
												)}
											</Flex.Col>
											<Flex.Col col={{ base: "12", xl: "12", fhd: "4" }}>
												<Heading as='p'>{t("step.payment")}</Heading>
												{noClientData && <NoResults />}
												{paymentInfo(order).paidBy && (
													<Text className='mb--1'>
														{t("common.paidBy")}: <strong>{paymentInfo(order).paidBy}</strong>
													</Text>
												)}
												{paymentInfo(order).orderAmount && (
													<Text className='mb--0'>
														{t("common.amount")}: <strong>{paymentInfo(order).orderAmount}</strong>
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
											{t("order.showHideHistory", { state: loadOrderHistory ? t("common.hide") : t("common.show") })}
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
								<Heading as='p'>{t("common.details")}</Heading>
								{detailsInfo(order).status && (
									<Flex align='center' disableNegativeSpace className='mb--2 p--2 outline flavor--default'>
										<Flex.Col>{t("field.status")}</Flex.Col>
										<Flex.Col col='auto'>
											<Badge pigment={pickPigment(detailsInfo(order).status)} sizing='lg'>
												{detailsInfo(order).status}
											</Badge>
										</Flex.Col>
									</Flex>
								)}
								<ListGroup elevation='none' className='outline mb--2'>
									<ListGroup.Header>{t("field.file", { count: detailsInfo(order).files?.length })}</ListGroup.Header>
									{detailsInfo(order).files?.length > 0 ? (
										detailsInfo(order)?.files?.map((file: any) => (
											<ListGroup.Item key={file?.key} onClick={() => setClickedFileKey(file?.key)}>
												<Flex wrap='nowrap' align='center'>
													<Flex.Col col='auto'>
														<LogoPdf height='2rem' width='2rem' />
													</Flex.Col>
													<Flex.Col>{file?.name}</Flex.Col>
												</Flex>
											</ListGroup.Item>
										))
									) : (
										<ListGroup.Item>
											<NoResults />
										</ListGroup.Item>
									)}
								</ListGroup>
								{user?.roleName === "ADMIN" && detailsInfo(order).company.name && (
									<ListGroup elevation='none' className='outline mb--2'>
										<ListGroup.Header>{t("field.company")}</ListGroup.Header>
										<ListGroup.Item as={Link} to={`/app/companies/${detailsInfo(order).company.id}`}>
											{detailsInfo(order).company.name}
										</ListGroup.Item>
									</ListGroup>
								)}
								<ListGroup elevation='none' className='outline'>
									<ListGroup.Header>{t("field.note")}</ListGroup.Header>
									<ListGroup.Item>{detailsInfo(order).note ?? <NoResults />}</ListGroup.Item>
								</ListGroup>
							</Card.Body>
						</Card>
					</Flex.Col>
				</Flex>
			</PageContent>
			<Portal
				animation='zoom'
				sizing='lg'
				isOpen={downloadPopUp.state}
				onClose={closeDownloadPopUp}
				onOutsideClick={closeDownloadPopUp}>
				<Card>
					<Card.Header
						actions={
							<Button equalDimensions sizing='sm' onClick={closeDownloadPopUp} pigment='default'>
								<IconClose />
							</Button>
						}>
						<Text className='mb--0'>{t("action.download", { entry: t("field.file") })}</Text>
					</Card.Header>
					<Card.Body>{downloadPopUp.payload}</Card.Body>
				</Card>
			</Portal>
			<Suspense fallback={<div />}>
				<ZoomPortal in={showOrdersUpdateForm.state}>
					<OrdersUpdateForm onClose={closeOrdersUpdateForm} payload={showOrdersUpdateForm.payload} />
				</ZoomPortal>
			</Suspense>
		</PageWrapper>
	);
};

export default OrdersViewPage;
