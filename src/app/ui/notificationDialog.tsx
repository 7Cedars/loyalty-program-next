import { useAppDispatch, useAppSelector} from "@/redux/hooks"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { notification } from "@/redux/reducers/notificationReducer"

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

const colourSchemeXMarkIcon = { 
  red: `text-red-600 hover:text-red-800`, 
  green: `text-green-600 hover:text-green-800`, 
  yellow: `text-yellow-600 hover:text-yellow-800`, 
  gray: `text-gray-600 hover:text-gray-800`, 
  invisible: `text-purple-600 hover:text-purple-800`, 
}

const colourProgressBar = { 
  red: `text-red-100/0 bg-red-600`, 
  green: `text-red-100/0 bg-green-600`, 
  yellow: `text-red-100/0 bg-yellow-600`, 
  gray: `text-red-100/0 bg-gray-600`, 
  invisible: `text-purple-100/0 bg-purple-600`, 
}


export const NotificationDialog = () => {
  const { notifications } = useAppSelector(state => state.notification)
  const dispatch = useAppDispatch()

  const notificationToShow = notifications.findLast(notification => notification.colour !== "invisible")
  let colour: "red" | "yellow" | "green" | "gray" | "invisible" = "gray"
  notificationToShow?.colour ? colour = notificationToShow?.colour : null 

  // NB You can set colours dynamically in tailwind CSS. 
  // See: https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values

  return (
    notificationToShow?.colour === undefined ||  notificationToShow?.colour === "invisible" ? null   
    : 
    <div className= {`relative border-2 rounded-lg h-12 flex flex-row items-center ${colourSchemeDialog[colour]}`}> 
        <div className={`grow flex flex-row justify-center ${colourSchemeText[colour]}`}>  
          <div  className="font-bold"> 
          { notificationToShow.message  }
          </div>
        </div>
        <button 
          className="font-bold text-lg pe-2"
          type="submit"
          onClick={() => dispatch(notification({
            id: notificationToShow.id,
            message: "Here is a message", 
            colour: "invisible", 
            progressInPercent: 60, 
            visible: false
          }))}
          >
            <XMarkIcon
              className={`h-6 w-6 content-center align-center ${colourSchemeXMarkIcon[colour]}`}
              aria-hidden="true"
            />
        </button>
      <div 
        className={`absolute bottom-0 text-xs font-medium text-center leading-none rounded-bl-md h-1 ${colourProgressBar[colour]}`}
        style={{width:`${notificationToShow.progressInPercent}%`}}> . </div>
    </div>
  )

  //  ${notifications[0].progress}

}