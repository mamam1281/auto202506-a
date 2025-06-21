import svgPaths from "./svg-qqiofovau7";
import imgPro from "figma:asset/e14fe4489156901d6646a0a96c051e773d86023b.png";

function Pro() {
  return (
    <div
      className="absolute h-[30px] left-[270px] top-[625px] w-[70px]"
      data-name="pro"
    >
      <div
        className="absolute inset-0 rounded-md"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(123, 41, 205) 0%, rgb(135, 13, 209) 37.5%, rgb(91, 48, 246) 67.5%, rgb(128, 84, 242) 96%)",
        }}
      >
        <div className="absolute border border-[#7b29cd] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <div
        className="[background-size:auto,_cover] absolute bg-[position:0%_0%,_50%_50%] bg-clip-text bottom-[13.333%] font-['Work_Sans:SemiBold',_sans-serif] font-semibold leading-[0] left-1/2 right-[14.286%] text-[#ffffff] text-[12px] text-left top-[33.333%] tracking-[0.12px]"
        style={{
          WebkitTextFillColor: "transparent",
          backgroundImage: `linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%), url('${imgPro}')`,
        }}
      >
        <p className="adjustLetterSpacing block leading-[normal]">PRO</p>
      </div>
      <div
        className="absolute bg-center bg-cover bg-no-repeat bottom-[23.333%] left-[14.286%] right-[62.857%] top-[23.333%]"
        data-name="image 338"
        style={{ backgroundImage: `url('${imgPro}')` }}
      />
    </div>
  );
}

function Loding() {
  return (
    <div
      className="absolute size-[50px] top-[606px] translate-x-[-50%]"
      data-name="loding"
      style={{ left: "calc(50% - 125.5px)" }}
    >
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

function Frame1686560332() {
  return (
    <div
      className="absolute bottom-[54.902%] left-[62.747%] right-0 rounded-[50px] top-0"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgb(123, 41, 205) 0%, rgb(135, 13, 209) 37.5%, rgb(91, 48, 246) 67.5%, rgb(128, 84, 242) 96%)",
      }}
    >
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-[133px] py-[13px] relative size-full">
          <div className="font-['Work_Sans:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap">
            <p className="block leading-[normal] whitespace-pre">Sign in</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group1686560130() {
  return (
    <div className="absolute bottom-[-4.902%] contents left-0 right-0 top-[59.804%]">

      <div
        className="absolute bottom-[-4.902%] left-[62.747%] right-0 rounded-[51px] top-[59.804%]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(123, 41, 205) 0%, rgb(135, 13, 209) 37.5%, rgb(91, 48, 246) 67.5%, rgb(128, 84, 242) 96%)",
        }}
      />
      <div className="absolute bottom-[13.249%] font-['Work_Sans:Bold',_sans-serif] font-bold leading-[0] left-[74.119%] right-[11.691%] text-[#ffffff] text-[16px] text-center top-[76.471%]">
        <p className="block leading-[0.8]">Send Code</p>
      </div>
    </div>
  );
}

function DefalutLong() {
  return (
    <div
      className="absolute h-[154px] left-[-505px] top-[413px] w-[864px]"
      data-name="defalut_long"
    >
      <Frame1686560332 />
      <Group1686560130 />
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-[#1e1e1e] relative size-full" data-name="button">
      <div className="relative size-full">
        <Pro />
        <Loding />
        <DefalutLong />
      </div>
      <div className="absolute border border-[#000000] border-solid inset-0 pointer-events-none" />
    </div>
  );
}