
import '../globals.css'
export default function layout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="absolute flex h-full w-full grid grid-cols-1 justify-items-center bg-slate-100 overflow-hidden">
        {children}
    </div>
  )
}



