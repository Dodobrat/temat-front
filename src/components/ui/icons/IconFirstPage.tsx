import * as React from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgIconFirstPage(
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
      <path d="M24 0v24H0V0h24z" fill="none" opacity={0.87} />
      <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z" />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgIconFirstPage);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
