import { useAppDispatch, useAppSelector} from "@/redux/hooks"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { notification, updateNotificationVisibility } from "@/redux/reducers/notificationReducer"
import { Button } from "./Button"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useWalletClient } from "wagmi"

const colourSchemeDialog = { 
  red: `border-red-600 bg-red-300`, 
  green: `border-green-600 bg-green-300`,
  yellow: `border-yellow-600 bg-yellow-300`,
  gray: `border-gray-600 bg-gray-300`, 
  invisible: `border-purple-600 bg-purple-300`, 
}

const colourSchemeText = { 
  red: `text-red-600`,
  green: `text-green-600`,
  yellow: `text-yellow-600`,
  gray: `text-gray-600`,
  invisible: `text-purple-600`,
}

export const NotificationDialog = () => {
  const { notifications } = useAppSelector(state => state.notification)
  const { open, close } = useWeb3Modal()
  const { data: walletClient, status } = useWalletClient();
  const dispatch = useAppDispatch()

  const handleLoginRequest = async () => {
    open({view: "Networks"}) 
  }

  const notificationToShow = notifications.findLast(notification => notification.isVisible !== false)
  let colour: "red" | "yellow" | "green" | "gray" | "invisible" = "gray"
  notificationToShow?.colour ? colour = notificationToShow?.colour : "gray" 

  console.log("notificationToShow: ", notificationToShow)

  if (notificationToShow === undefined ) {
    return null 
  }

  return (
    notificationToShow?.isVisible === false ? null  
    : 
    <div className= {`z-20 p-2 mx-8 m-2 grow-0 rounded-lg h-fit flex flex-row shadow-[0_6px_12px_-3px_rgba(0,0,0,0.5)] items-center ${colourSchemeDialog[colour]}`}> 
        <div className={`grow flex flex-row justify-center ${colourSchemeText[colour]}`}>  
          <div className="pe-1 text-center"> 
          { notificationToShow.message  }
          </div>

          { notificationToShow.loginButton ? 
            <div className="w-24 px-3 flex underline"> 
              <button onClick = {() => {!walletClient ? open({view: "Connect"}) : open({view: "Networks"}) }}> 
               login
              </button>
            </div> 
            : null
          } 
        </div>
        <button 
          className={`font-bold text-lg  px-1 ${colourSchemeText[colour]}`}         
          type="submit"
          onClick={() => dispatch(updateNotificationVisibility({
            id: notificationToShow.id,
            isVisible: false
          }))}
          >
            <XMarkIcon
              className={`h-6 w-6 content-center align-center ${colourSchemeText[colour]} `}
              aria-hidden="true"
            />
        </button>
      <div 
        className={`absolute bottom-0 text-xs font-medium text-center leading-none rounded-bl-md h-1 ${colourSchemeText[colour]} `}
        style={{width:`${notificationToShow.progressInPercent}%`}}> . </div>
    </div>
  )

  //  ${notifications[0].progress}

}  // NB You can set colours dynamically in tailwind CSS. 
// See: https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values