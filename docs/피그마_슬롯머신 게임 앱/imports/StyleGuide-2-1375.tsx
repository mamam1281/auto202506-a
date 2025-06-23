function TypographyNameCont() {
  return (
    <div className="relative shrink-0" data-name="typographyNameCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start leading-[0] p-0 relative text-[#1e1e1e] text-[32px] text-left text-nowrap">
        <div className="font-['Exo:Regular',_sans-serif] font-normal relative shrink-0">
          <p className="block leading-[20px] text-nowrap whitespace-pre">{`EXO `}</p>
        </div>
        <div className="font-['Exo:Bold',_sans-serif] font-bold relative shrink-0">
          <p className="block leading-[20px] text-nowrap whitespace-pre">
            Bold
          </p>
        </div>
      </div>
    </div>
  );
}

function TypographySizeCont() {
  return (
    <div className="relative shrink-0" data-name="typographySizeCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-0 relative">
        <div className="font-['Anonymous_Pro:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[32px] text-left w-44">
          <p className="block leading-[20px]">32px</p>
        </div>
      </div>
    </div>
  );
}

function Hi() {
  return (
    <div className="relative shrink-0" data-name="HI">
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative">
        <TypographyNameCont />
        <TypographySizeCont />
      </div>
    </div>
  );
}

function TypographyDetails() {
  return (
    <div
      className="[grid-area:1_/_1] bg-[#ffffff] h-[129px] ml-0 mt-[2.274px] relative w-[309px]"
      data-name="typographyDetails"
    >
      <div className="box-border content-stretch flex flex-col gap-6 h-[129px] items-start justify-start p-0 relative w-[309px]">
        <div className="font-['Exo:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#1a1a1a] text-[32px] text-left text-nowrap">
          <p className="block leading-[48px] whitespace-pre">Heading H1</p>
        </div>
        <Hi />
      </div>
    </div>
  );
}

function TypographyBlockHi() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="typographyBlock_HI"
    >
      <TypographyDetails />
      <div className="[grid-area:1_/_1] capitalize font-['Exo:Bold',_sans-serif] font-bold leading-[28px] ml-[424.319px] mt-0 relative text-[#ffffff] text-[32px] text-left w-[655.387px]">
        <p className="block mb-0">{`가나다라마바사 안녕하세요 `}</p>
        <p className="block">ABCDEFGHI 1234567890</p>
      </div>
    </div>
  );
}

function TypographyNameCont1() {
  return (
    <div className="relative shrink-0" data-name="typographyNameCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start leading-[0] p-0 relative text-[#1e1e1e] text-[24px] text-left text-nowrap">
        <div
          className="font-['DM_Sans:Regular',_sans-serif] font-normal relative shrink-0"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <p className="block leading-[20px] text-nowrap whitespace-pre">Exo</p>
        </div>
        <div className="font-['Exo:SemiBold',_sans-serif] font-semibold relative shrink-0">
          <p className="block leading-[20px] text-nowrap whitespace-pre">
            Semi Bold
          </p>
        </div>
      </div>
    </div>
  );
}

function TypographySizeCont1() {
  return (
    <div className="relative shrink-0" data-name="typographySizeCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-0 relative">
        <div className="font-['Exo:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#1a1a1a] text-[24px] text-left text-nowrap">
          <p className="block leading-[20px] whitespace-pre">24px</p>
        </div>
      </div>
    </div>
  );
}

function TypographyDetailsWrapper() {
  return (
    <div className="relative shrink-0" data-name="TypographyDetailsWrapper">
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative">
        <TypographyNameCont1 />
        <TypographySizeCont1 />
      </div>
    </div>
  );
}

function TypographyDetails1() {
  return (
    <div
      className="[grid-area:1_/_1] bg-[#ffffff] ml-0 mt-0 relative w-[309px]"
      data-name="typographyDetails"
    >
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative w-[309px]">
        <div className="font-['Exo:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#1e1e1e] text-[28px] text-left w-[170px]">
          <p className="block leading-[48px]">Heading H2</p>
        </div>
        <TypographyDetailsWrapper />
      </div>
    </div>
  );
}

function TypographyBlockH2() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="typographyBlock_H2"
    >
      <TypographyDetails1 />
      <div className="[grid-area:1_/_1] font-['Exo:SemiBold',_sans-serif] font-semibold leading-[0] ml-[424px] mt-0 relative text-[#ffffff] text-[24px] text-left w-[646px]">
        <p className="block leading-[28px]">
          가나다라마바사 안녕하세요 ABCDEFGHI 1234567890
        </p>
      </div>
    </div>
  );
}

function TypographyNameCont2() {
  return (
    <div className="relative shrink-0" data-name="typographyNameCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start leading-[0] p-0 relative text-[#1e1e1e] text-[24px] text-left text-nowrap">
        <div
          className="font-['DM_Sans:Regular',_sans-serif] font-normal relative shrink-0"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <p className="block leading-[20px] text-nowrap whitespace-pre">Exo</p>
        </div>
        <div className="font-['Exo:SemiBold',_sans-serif] font-semibold relative shrink-0">
          <p className="block leading-[20px] text-nowrap whitespace-pre">
            Semi Bold
          </p>
        </div>
      </div>
    </div>
  );
}

function TypographySizeCont2() {
  return (
    <div className="relative shrink-0" data-name="typographySizeCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-0 relative">
        <div className="font-['Exo:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#1a1a1a] text-[24px] text-left text-nowrap">
          <p className="block leading-[20px] whitespace-pre">20px</p>
        </div>
      </div>
    </div>
  );
}

function TypographyDetailsWrapper1() {
  return (
    <div className="relative shrink-0" data-name="TypographyDetailsWrapper">
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative">
        <TypographyNameCont2 />
        <TypographySizeCont2 />
      </div>
    </div>
  );
}

function TypographyDetails2() {
  return (
    <div
      className="[grid-area:1_/_1] bg-[#ffffff] ml-0 mt-0 relative w-[309px]"
      data-name="typographyDetails"
    >
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative w-[309px]">
        <div className="font-['Exo:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#1e1e1e] text-[28px] text-left w-[170px]">
          <p className="block leading-[48px]">Heading H3</p>
        </div>
        <TypographyDetailsWrapper1 />
      </div>
    </div>
  );
}

function TypographyBlockH3() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="typographyBlock_H2"
    >
      <TypographyDetails2 />
      <div className="[grid-area:1_/_1] font-['Exo:SemiBold',_sans-serif] font-semibold leading-[0] ml-[424px] mt-0 relative text-[#ffffff] text-[20px] text-left w-[646px]">
        <p className="block leading-[28px]">
          가나다라마바사 안녕하세요 ABCDEFGHI 1234567890
        </p>
      </div>
    </div>
  );
}

function TypographyNameCont3() {
  return (
    <div className="relative shrink-0" data-name="typographyNameCont">
      <div className="box-border content-stretch flex flex-row font-['Exo:Regular',_sans-serif] font-normal gap-1 items-start justify-start leading-[0] p-0 relative text-[#1e1e1e] text-[16px] text-left text-nowrap">
        <div className="relative shrink-0">
          <p className="block leading-[20px] text-nowrap whitespace-pre">EXO</p>
        </div>
        <div className="relative shrink-0">
          <p className="block leading-[20px] text-nowrap whitespace-pre">
            Regular
          </p>
        </div>
      </div>
    </div>
  );
}

function TypographySizeCont3() {
  return (
    <div className="relative shrink-0" data-name="typographySizeCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-0 relative">
        <div className="font-['Exo:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#1a1a1a] text-[16px] text-left text-nowrap">
          <p className="block leading-[20px] whitespace-pre">16px</p>
        </div>
      </div>
    </div>
  );
}

function TypographyDetailsWrapper2() {
  return (
    <div className="relative shrink-0" data-name="TypographyDetailsWrapper">
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative">
        <TypographyNameCont3 />
        <TypographySizeCont3 />
      </div>
    </div>
  );
}

function TypographyDetails3() {
  return (
    <div
      className="[grid-area:1_/_1] bg-[#ffffff] ml-0 mt-0 relative w-[309px]"
      data-name="typographyDetails"
    >
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative w-[309px]">
        <div className="font-['Exo:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#1e1e1e] text-[16px] text-left text-nowrap">
          <p className="block leading-[48px] whitespace-pre">Heading H5</p>
        </div>
        <TypographyDetailsWrapper2 />
      </div>
    </div>
  );
}

function TypographyBlockBody() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="typographyBlock_BODY"
    >
      <TypographyDetails3 />
      <div className="[grid-area:1_/_1] font-['Exo:Regular',_sans-serif] font-normal leading-[0] ml-[424px] mt-0 relative text-[#ffffff] text-[16px] text-left w-[492.035px]">
        <p className="block leading-[28px]">
          가나다라마바사 안녕하세요 ABCDEFGHI 1234567890
        </p>
      </div>
    </div>
  );
}

function TypographyNameCont4() {
  return (
    <div className="relative shrink-0" data-name="typographyNameCont">
      <div className="box-border content-stretch flex flex-row font-['IBM_Plex_Sans_KR:Bold',_sans-serif] gap-1 items-start justify-start leading-[0] not-italic p-0 relative text-[#1e1e1e] text-[14px] text-left text-nowrap">
        <div className="relative shrink-0">
          <p className="block leading-[28px] text-nowrap whitespace-pre">
            IBMKR
          </p>
        </div>
        <div className="relative shrink-0">
          <p className="block leading-[28px] text-nowrap whitespace-pre">
            REGULAR
          </p>
        </div>
      </div>
    </div>
  );
}

function TypographySizeCont4() {
  return (
    <div className="relative shrink-0" data-name="typographySizeCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-0 relative">
        <div className="font-['Exo:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#1a1a1a] text-[18px] text-left text-nowrap">
          <p className="block leading-[20px] whitespace-pre">14px</p>
        </div>
      </div>
    </div>
  );
}

function TypographyDetailsWrapper3() {
  return (
    <div className="relative shrink-0" data-name="TypographyDetailsWrapper">
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative">
        <TypographyNameCont4 />
        <TypographySizeCont4 />
      </div>
    </div>
  );
}

function TypographyDetails4() {
  return (
    <div
      className="[grid-area:1_/_1] bg-[#ffffff] ml-0 mt-0 relative w-[309px]"
      data-name="typographyDetails"
    >
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative w-[309px]">
        <div className="font-['IBM_Plex_Sans_KR:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#1e1e1e] text-[14px] text-left text-nowrap">
          <p className="block leading-[28px] whitespace-pre">TOKEN</p>
        </div>
        <TypographyDetailsWrapper3 />
      </div>
    </div>
  );
}

function TypographyBlockTokenNumber() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="typographyBlock_Token-Number"
    >
      <TypographyDetails4 />
      <div className="[grid-area:1_/_1] font-['IBM_Plex_Sans_KR:Bold',_sans-serif] leading-[0] ml-[424px] mt-0 not-italic relative text-[#ffffff] text-[14px] text-left w-[424.182px]">
        <p className="block leading-[28px]">
          가나다라마바사 안녕하세요 ABCDEFGHI 1234567890
        </p>
      </div>
    </div>
  );
}

function TypographyNameCont5() {
  return (
    <div className="relative shrink-0" data-name="typographyNameCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start leading-[0] p-0 relative text-[#1e1e1e] text-[18px] text-left text-nowrap">
        <div
          className="font-['DM_Sans:Regular',_sans-serif] font-normal relative shrink-0"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <p className="block leading-[20px] text-nowrap whitespace-pre">
            Epilogue
          </p>
        </div>
        <div className="font-['Epilogue:Bold',_sans-serif] font-bold relative shrink-0">
          <p className="block leading-[20px] text-nowrap whitespace-pre">
            Bold
          </p>
        </div>
      </div>
    </div>
  );
}

function TypographySizeCont5() {
  return (
    <div className="relative shrink-0" data-name="typographySizeCont">
      <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-0 relative">
        <div className="font-['Exo:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#1a1a1a] text-[18px] text-left text-nowrap">
          <p className="block leading-[20px] whitespace-pre">16px</p>
        </div>
      </div>
    </div>
  );
}

function TypographyDetailsWrapper4() {
  return (
    <div className="relative shrink-0" data-name="TypographyDetailsWrapper">
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative">
        <TypographyNameCont5 />
        <TypographySizeCont5 />
      </div>
    </div>
  );
}

function TypographyDetails5() {
  return (
    <div
      className="[grid-area:1_/_1] bg-[#ffffff] ml-0 mt-0 relative w-[309px]"
      data-name="typographyDetails"
    >
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative w-[309px]">
        <div className="font-['Epilogue:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#1e1e1e] text-[16px] text-left text-nowrap">
          <p className="block leading-[28px] whitespace-pre">TOKEN</p>
        </div>
        <TypographyDetailsWrapper4 />
      </div>
    </div>
  );
}

function TypographyBlockTokenNumber1() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="typographyBlock_Token-Number"
    >
      <TypographyDetails5 />
      <div className="[grid-area:1_/_1] font-['Epilogue:Bold',_sans-serif] font-bold leading-[0] ml-[424px] mt-0 relative text-[#ffffff] text-[16px] text-left w-[424.182px]">
        <p className="block leading-[28px]">
          가나다라마바사 안녕하세요 ABCDEFGHI 1234567890
        </p>
      </div>
    </div>
  );
}

function TypographyWrapper() {
  return (
    <div
      className="[grid-area:1_/_1] h-[725.335px] ml-0 mt-[111.817px] relative w-[1079.71px]"
      data-name="typographyWrapper"
    >
      <div className="box-border content-stretch flex flex-col gap-16 h-[725.335px] items-start justify-start leading-[0] p-0 relative w-[1079.71px]">
        <TypographyBlockHi />
        <TypographyBlockH2 />
        <TypographyBlockH3 />
        <TypographyBlockBody />
        <TypographyBlockTokenNumber />
        <TypographyBlockTokenNumber1 />
      </div>
    </div>
  );
}

function Headings() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Headings"
    >
      <div
        className="[grid-area:1_/_1] h-0 ml-0 mt-[62.646px] relative w-[1080px]"
        data-name="Divider"
      >
        <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1080 2"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, #F7F7FB)"
              strokeWidth="2"
              x2="1080"
              y1="1"
              y2="1"
            />
          </svg>
        </div>
      </div>
      <TypographyWrapper />
      <div className="[grid-area:1_/_1] capitalize font-['Exo:Bold',_sans-serif] font-bold h-[28.756px] ml-0 mt-0 relative text-[32px] text-left text-slate-100 w-[242px]">
        <p className="block leading-[28px]">2. TYPOGRAPHY</p>
      </div>
    </div>
  );
}

export default function StyleGuide() {
  return (
    <div className="bg-[#1a1a1a] relative size-full" data-name="Style Guide">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start px-5 py-8 relative size-full">
          <Headings />
        </div>
      </div>
    </div>
  );
}