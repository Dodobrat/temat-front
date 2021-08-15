import { useTranslation } from "react-i18next";
import { Flex, Heading, Card } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { UnderDevelopment } from "./graphics";

const ComingSoon = ({ className, ...rest }: any) => {
	const { t } = useTranslation();

	return (
		<Card {...rest} className={cn("p--4", className)}>
			<Flex align='center' spacingY='xl'>
				<Flex.Col col={{ base: "12", md: "6" }}>
					<div style={{ textAlign: "center" }}>
						<Heading>{t("common.comingSoon")}</Heading>
						<Heading as='h6'>{t("common.underDevelopment")}</Heading>
					</div>
				</Flex.Col>
				<Flex.Col col={{ base: "12", md: "6" }}>
					<div className='d--grid'>
						<UnderDevelopment
							style={{
								maxHeight: "clamp(17.5rem, 25vw, 30rem)",
							}}
						/>
					</div>
				</Flex.Col>
			</Flex>
		</Card>
	);
};

export default ComingSoon;
