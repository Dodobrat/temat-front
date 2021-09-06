import { useTranslation } from "react-i18next";
import { Flex, Heading, Card } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { IconEngineering } from "./icons";

const ComingSoon = ({ className, compact = false, ...rest }: any) => {
	const { t } = useTranslation();

	return (
		<Card {...rest} className={cn("p--4", className)}>
			<Flex align='center' spacingY='xl'>
				<Flex.Col col={compact ? "12" : { base: "12", md: "6" }}>
					<div style={{ textAlign: "center" }}>
						<Heading as={compact ? "h5" : "h1"}>{t("common.comingSoon")}</Heading>
						<Heading as={compact ? "p" : "h6"}>{t("common.underDevelopment")}</Heading>
					</div>
				</Flex.Col>
				<Flex.Col col={compact ? "12" : { base: "12", md: "6" }}>
					<Flex justify='center' align='center'>
						<IconEngineering
							style={{
								height: compact ? "clamp(12.5rem, 17.5vw, 22.5rem)" : "clamp(17.5rem, 25vw, 30rem)",
								width: "auto",
								opacity: 0.2,
							}}
						/>
					</Flex>
				</Flex.Col>
			</Flex>
		</Card>
	);
};

export default ComingSoon;
