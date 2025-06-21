import svgPaths from "./svg-yh1nl3agrd";

function Bar() {
  return (
    <div
      className="absolute bottom-[279px] h-2 left-1/2 translate-x-[-50%] w-[247px]"
      data-name="Bar"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 247 8"
      >
        <g id="Bar">
          <rect
            fill="var(--fill-0, #0F2749)"
            height="8"
            id="Rectangle 1"
            rx="4"
            width="247"
          />
          <path
            d={svgPaths.p270d7c00}
            fill="var(--fill-0, #ED172B)"
            id="Rectangle 2"
          />
        </g>
      </svg>
    </div>
  );
}

function Model() {
  return (
    <div
      className="absolute h-[57px] rounded-[51px] translate-x-[-50%] translate-y-[-50%] w-[203px]"
      data-name="MODEL"
      style={{
        top: "calc(50% - 45px)",
        left: "calc(50% - 2px)",
        backgroundImage:
          "linear-gradient(90deg, rgb(205, 41, 93) 0%, rgba(209, 13, 196, 0.83) 37.5%, rgba(206, 48, 246, 0.79) 67.5%, rgb(239, 84, 242) 96%)",
      }}
    >
      <div className="box-border content-stretch flex flex-row h-[57px] items-center justify-between p-0 relative w-[203px]">
        <div
          className="[text-shadow:rgba(0,0,0,0.25)_0px_4px_4px] absolute font-['Inter:Bold',_sans-serif] font-bold h-14 leading-[0] not-italic text-[0px] text-center text-slate-100 top-[3px] translate-x-[-50%] w-[145px]"
          style={{ left: "calc(50% + 1px)" }}
        >
          <p className="block leading-[48px] text-[40px]">MODEL</p>
        </div>
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <div className="bg-slate-900 relative size-full" data-name="onboarding">
      <Bar />
      <Model />
    </div>
  );
}