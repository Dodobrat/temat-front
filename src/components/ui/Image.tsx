import cn from "classnames";
import { IconImage } from "../ui/icons";

interface Props {
	imgSrc?: string;
	className?: string;
	alt?: string;
	[key: string]: any;
}

const Image = (props: Props) => {
	const { imgSrc, alt, className, ...rest } = props;

	return (
		<div className={cn("temat__avatar", className)}>
			{imgSrc ? (
				<img src={imgSrc} alt={alt} {...rest} className='temat__avatar__img' />
			) : (
				<IconImage className='temat__avatar__fallback' />
			)}
		</div>
	);
};

export default Image;
