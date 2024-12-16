const CourseBookVariantImage = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 187 135"
    fill="none"
    {...props}
  >
    <mask
      id="a"
      width="187"
      height="135"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
      style={{ maskType: 'alpha' }}
    >
      <rect width="186.081" height="135" fill="var(--tw-secondary)" rx="10" />
    </mask>
    <g mask="url(#a)">
      <rect width="186.081" height="135" fill="url(#b)" rx="10" />
      <circle
        cx="162"
        cy="124"
        r="144"
        fill="url(#c)"
        transform="rotate(-180 162 124)"
      />
      <circle
        cx="186"
        cy="148"
        r="120"
        fill="url(#d)"
        transform="rotate(-180 186 148)"
      />
      <circle
        cx="210"
        cy="172"
        r="96"
        fill="url(#e)"
        transform="rotate(-180 210 172)"
      />
      <circle
        cx="234"
        cy="196"
        r="72"
        fill="url(#f)"
        transform="rotate(-180 234 196)"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        d="M93.285 94.57a38.87 38.87 0 0 0-23.549-12.383A4.198 4.198 0 0 1 66 77.989V44.197a4.196 4.196 0 0 1 4.785-4.156 39.038 39.038 0 0 1 22.5 12.258V94.57ZM93.285 94.57a38.87 38.87 0 0 1 23.549-12.383 4.194 4.194 0 0 0 3.736-4.198V44.197a4.203 4.203 0 0 0-4.785-4.156 39.04 39.04 0 0 0-22.5 12.258V94.57Z"
      />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1="182.068"
        x2=".365"
        y1="135"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tw-primary)" />
        <stop offset="1" stopColor="var(--tw-secondary)" />
      </linearGradient>
      <linearGradient
        id="c"
        x1="299.788"
        x2="-38.412"
        y1="268"
        y2="85.704"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tw-primary)" />
        <stop offset="1" stopColor="var(--tw-secondary)" />
      </linearGradient>
      <linearGradient
        id="d"
        x1="300.824"
        x2="18.99"
        y1="268"
        y2="116.087"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tw-primary)" />
        <stop offset="1" stopColor="var(--tw-secondary)" />
      </linearGradient>
      <linearGradient
        id="e"
        x1="301.859"
        x2="76.392"
        y1="268"
        y2="146.469"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tw-primary)" />
        <stop offset="1" stopColor="var(--tw-secondary)" />
      </linearGradient>
      <linearGradient
        id="f"
        x1="302.894"
        x2="133.794"
        y1="268"
        y2="176.852"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tw-primary)" />
        <stop offset="1" stopColor="var(--tw-secondary)" />
      </linearGradient>
    </defs>
  </svg>
);

export default CourseBookVariantImage;
