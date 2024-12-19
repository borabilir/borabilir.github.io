import { IconComponent } from "Core/types/Icon";

const DownloadIcon: IconComponent = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="ic_download" clipPath="url(#clip0_768_1449)">
      <path
        id="Icon"
        d="M10.5 10.5H1.5M9 5.5L6 8.5M6 8.5L3 5.5M6 8.5V1.5"
        stroke="currentColor"
        strokeWidth="1.66"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </g>
    <defs>
      <clipPath id="clip0_768_1449">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default DownloadIcon;