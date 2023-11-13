import '../globals.css'

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      
      <div className="h-screen w-full flex flex-row space-x-0 border-2 border-red-800">
        {children}
      </div>
  
  )
}
