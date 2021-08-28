import React from "react";
import { Container, Flex } from "@dodobrat/react-ui-kit";

interface PageFooterProps {
	children?: React.ReactNode;
}

const PageFooter: React.FC<PageFooterProps> = ({ children, ...rest }) => {
	return (
		<Container className='py--4 px--3' {...rest}>
			<Flex spacingX={null} spacingY={null}>
				<Flex.Col as='span'>&copy; Temat {new Date().getFullYear()}</Flex.Col>
			</Flex>
		</Container>
	);
};

export default PageFooter;
