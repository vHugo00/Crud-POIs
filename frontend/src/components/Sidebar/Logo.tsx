export function Logo() {
  return (
    <strong className="mx-1 flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
      <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 16C2 8.268 8.268 2 16 2s14 6.268 14 14-6.268 14-14 14S2 23.732 2 16z"
        fill="#fff"
      />
      <path
        d="M8.328 7.84l-.75.936a1 1 0 00.1 1.356L14.5 16.5V26h3v-9.5l6.823-6.368a1 1 0 00.098-1.356l-.748-.935a1 1 0 00-1.462-.109L16 13.5 9.789 7.732a1 1 0 00-1.461.109z"
        fill="#FF0013"
      />
    </svg>
      <span className="sr-only lg:not-sr-only">XY INC.</span>
    </strong>
  )
}
