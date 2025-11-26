export const GradientCheckIcon = ({ id }: { id: string }) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='mt-0.5 flex-shrink-0'
  >
    <defs>
      <linearGradient
        id={`check-gradient-${id}`}
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
    <circle
      cx='12'
      cy='12'
      r='10'
      stroke={`url(#check-gradient-${id})`}
      strokeWidth='2'
      fill='none'
    />
    <path
      d='M9 12l2 2 4-4'
      stroke={`url(#check-gradient-${id})`}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </svg>
);
