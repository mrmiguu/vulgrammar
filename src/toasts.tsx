import toast from 'react-hot-toast'

type InteractiveToastOptions = Partial<{
  className: string
  closeStyle: '✓' | '✗'
}>

const interactiveToast = (text: string, { className, closeStyle = '✓' }: InteractiveToastOptions = {}) => {
  return new Promise<void>(resolve => {
    toast(
      t => (
        <span className="flex gap-4">
          <div className={`flex items-center p-0 text-end ${className}`}>{text}</div>
          <button
            className={`px-2 py-3 w-8 text-xl animate-bounce text-yellow-50 ${
              closeStyle === '✗' ? 'bg-red-500' : 'bg-green-500'
            } rounded-md shadow-[0_1px_1px_0_rgba(0,0,0,0.4)]`}
            onClick={() => {
              toast.dismiss(t.id)
              resolve()
            }}
          >
            {closeStyle}
          </button>
        </span>
      ),
      { duration: Infinity },
    )
  })
}

export default interactiveToast
