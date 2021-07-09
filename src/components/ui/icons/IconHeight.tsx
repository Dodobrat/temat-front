import * as React from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgIconHeight(
  { title, titleId, ...props }: React.SVGProps<SVGSVGElement> & SVGRProps,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      aria-label="icon"
      ref={svgRef}
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M13 6.99h3L12 3 8 6.99h3v10.02H8L12 21l4-3.99h-3z" />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgIconHeight);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
