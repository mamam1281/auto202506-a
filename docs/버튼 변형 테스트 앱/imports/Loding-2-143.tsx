import svgPaths from "./svg-ofnbfx76dd";

export default function Loding() {
  return (
    <div className="relative size-full" data-name="loding">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 50 50"
      >
        <g id="loding">
          <path
            d={svgPaths.p128ec700}
            fill="url(#paint0_linear_2_93)"
            id="Ellipse 4324"
          />
          <path
            d={svgPaths.p21810f00}
            fill="url(#paint1_linear_2_93)"
            id="Ellipse 4323"
          />
        </g>
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint0_linear_2_93"
            x1="23.5777"
            x2="26.4225"
            y1="48.5777"
            y2="1.4224"
          >
            <stop stopColor="#7B29CD" />
            <stop offset="0.375" stopColor="#870DD1" />
            <stop offset="0.675" stopColor="#5B30F6" />
            <stop offset="0.96" stopColor="#8054F2" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint1_linear_2_93"
            x1="29.428"
            x2="46.7442"
            y1="3.38488"
            y2="24.4464"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#A2C5F6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}