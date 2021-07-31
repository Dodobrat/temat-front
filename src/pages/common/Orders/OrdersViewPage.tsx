import { ListGroup } from "@dodobrat/react-ui-kit";
import { Button } from "@dodobrat/react-ui-kit";
import { Badge } from "@dodobrat/react-ui-kit";
import { CollapseFade } from "@dodobrat/react-ui-kit";
import { Heading, Card, Flex, Text } from "@dodobrat/react-ui-kit";
import { useState } from "react";
// import cn from "classnames";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useOrderById } from "../../../actions/fetchHooks";
import { LogoPdf } from "../../../components/ui/icons";
import Image from "../../../components/ui/Image";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { parseDate } from "../../../helpers/dateHelpers";
import { errorToast } from "../../../helpers/toastEmitter";
import OrdersViewHistory from "./OrdersViewHistory";

const addressInfo = (order: { address: any }) => {
	const address = order?.address;

	const mainAddress = [address?.country, address?.city, address?.zipCode].filter((entry) => entry);
	const secondaryAddress = [address?.streetName, address?.streetNumber].filter((entry) => entry);

	const main = mainAddress.length > 0 ? mainAddress.join(", ") : <span className='text--opaque'>N/A</span>;
	const secondary = secondaryAddress.length > 0 ? secondaryAddress.join(" ") : <span className='text--opaque'>N/A</span>;

	return { main, secondary };
};

const clientInfo = (order: { client: any }) => {
	const client = order?.client;

	const receiverInfo = [client?.receiverName, client?.receiverPhone].filter((entry) => entry);
	const agentInfo = [client?.receiverAgentName, client?.receiverAgentPhone].filter((entry) => entry);
	const contactInfo = [client?.phone, client?.email].filter((entry) => entry);

	const receiver = receiverInfo.length > 0 ? receiverInfo.join(" | ") : <span className='text--opaque'>N/A</span>;
	const agent = agentInfo.length > 0 ? agentInfo.join(" | ") : <span className='text--opaque'>N/A</span>;
	const contact = contactInfo.length > 0 ? contactInfo.join(" | ") : <span className='text--opaque'>N/A</span>;

	return { receiver, agent, contact };
};

const detailsInfo = (order) => {
	const details = order?.details;
	const files = order?.files;

	const note = details?.customerNote ?? <span className='text--opaque'>N/A</span>;

	return { note, files };
};

const OrdersViewPage = () => {
	const { id: orderId }: any = useParams();
	const { t } = useTranslation();

	const [loadOrderHistory, setLoadOrderHistory] = useState(false);

	const loadHistory = () => setLoadOrderHistory((prev) => !prev);

	const { data: orderData } = useOrderById({
		specs: {
			filters: {
				history: "true",
				products: "true",
				files: "true",
			},
		},
		queryConfig: {
			onError: (err: any) => errorToast(err),
		},
		specialKey: orderId,
	});

	const { data: order } = orderData ?? { data: null };

	console.log(order);

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
						<Button pigment='secondary'>{parseDate(order?.details?.dateCreated, true) ?? "Date Added"}</Button>
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
											<Flex.Col col={{ base: "12", xl: "6" }} className='h--100'>
												<Heading as='p'>{t("orders.address")}</Heading>
												<Text className='mb--1'>
													Address: <strong>{addressInfo(order).main}</strong>
												</Text>
												<Text className='mb--0'>
													Street: <strong>{addressInfo(order).secondary}</strong>
												</Text>
											</Flex.Col>
											<Flex.Col col={{ base: "12", xl: "6" }}>
												<Heading as='p'>{t("orders.clientInfo")}</Heading>
												<Text className='mb--1'>
													Receiver: <strong>{clientInfo(order).receiver}</strong>
												</Text>
												<Text className='mb--1'>
													Agent: <strong>{clientInfo(order).agent}</strong>
												</Text>
												<Text className='mb--0'>
													Contact: <strong>{clientInfo(order).contact}</strong>
												</Text>
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
								{detailsInfo(order).files?.length > 0 && (
									<ListGroup elevation='none' className='outline mb--2'>
										<ListGroup.Header>Files</ListGroup.Header>
										{detailsInfo(order).files?.map((file) => (
											<ListGroup.Item
												href={file?.link}
												key={file?.link}
												target='_blank'
												rel='noopener noreferrer'
												download>
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
								<Text className='mb--1'>Note: {detailsInfo(order).note}</Text>
							</Card.Body>
						</Card>
					</Flex.Col>
				</Flex>
			</PageContent>
		</PageWrapper>
	);
};

export default OrdersViewPage;
