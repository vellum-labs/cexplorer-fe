export const ExposureIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <defs>
      <linearGradient
        id='gradient-exposure'
        x1='0'
        y1='0'
        x2='24'
        y2='24'
        gradientUnits='userSpaceOnUse'
      >
        <stop offset='0%' stopColor='#0094D4' />
        <stop offset='100%' stopColor='#8E2DE2' />
      </linearGradient>
    </defs>
    <path
      d='M12 6v12'
      stroke='url(#gradient-exposure)'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M17.196 9L6.804 15'
      stroke='url(#gradient-exposure)'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M6.804 9L17.196 15'
      stroke='url(#gradient-exposure)'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
);
