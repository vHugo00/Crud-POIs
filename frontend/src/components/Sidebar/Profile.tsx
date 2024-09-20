export interface ProfileProps {}

export function Profile() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="https://github.com/vHugo00.png"
        className="h-10 w-10 rounded-full"
        alt=""
      />
      <div className="flex flex-col">
        <span className="block text-sm font-semibold text-zinc-700 dark:text-zinc-100">
          Vitor Hugo
        </span>
        <span className="block text-sm text-zinc-500 dark:text-zinc-400">
          vv001226@gmail.com
        </span>
      </div>

    </div>
  )
}
