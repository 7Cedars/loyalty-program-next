// import '../../globals.css'
import "../../globals.css"

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      
      <div className="absolute top-0 h-screen w-full flex space-x-0 border-2 border-red-800">
        {children}
      </div>
  
  )
}
