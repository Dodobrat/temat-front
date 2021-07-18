import * as React from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgIconMinus(
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
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 13H5v-2h14v2z" />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgIconMinus);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
