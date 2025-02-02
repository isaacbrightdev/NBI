const GradientCircles = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 600 600"
    {...props}
  >
    <circle
      cx="300"
      cy="300"
      r="300"
      fill="url(#a)"
      transform="rotate(-180 300 300)"
    />
    <circle
      cx="350"
      cy="350"
      r="250"
      fill="url(#b)"
      transform="rotate(-180 350 350)"
    />
    <circle
      cx="400"
      cy="400"
      r="200"
      fill="url(#c)"
      transform="rotate(-180 400 400)"
    />
    <circle
      cx="450"
      cy="450"
      r="150"
      fill="url(#d)"
      transform="rotate(-180 450 450)"
    />
    <defs>
      <linearGradient
        id="a"
        x1="587.059"
        x2="-117.524"
        y1="600"
        y2="220.216"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tw-primary)" />
        <stop offset="1" stopColor="var(--tw-secondary)" />
      </linearGradient>
      <linearGradient
        id="b"
        x1="589.216"
        x2="2.063"
        y1="600"
        y2="283.514"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tw-primary)" />
        <stop offset="1" stopColor="var(--tw-secondary)" />
      </linearGradient>
      <linearGradient
        id="c"
        x1="591.373"
        x2="121.65"
        y1="600"
        y2="346.811"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tw-primary)" />
        <stop offset="1" stopColor="var(--tw-secondary)" />
      </linearGradient>
      <linearGradient
        id="d"
        x1="593.529"
        x2="241.238"
        y1="600"
        y2="410.108"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tw-primary)" />
        <stop offset="1" stopColor="var(--tw-secondary)" />
      </linearGradient>
    </defs>
  </svg>
);

export default GradientCircles;
