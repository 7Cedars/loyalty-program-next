import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '../../types'

type UpdateVisibiltyProps = {
  id: string;
  isVisible?: boolean; 
}

interface NotificationState {
  notifications: Notification[]
}

const initialState: NotificationState = {
  notifications: []
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: initialState,
  reducers: {
    /** Note: 
     *  if id is not found, notification will add a new notification
     *  if there is a duplicate Id, notification will update info that is provided.
    */

    notification: (state, action: PayloadAction<Notification>) => {
      let notificationIds = state.notifications.map(notification => notification.id)
      let index = notificationIds.indexOf(action.payload.id)
      let notificationVisibles= state.notifications.map(notification => notification.isVisible)

      if (index === -1) { 
        const newNotification: Notification = {
          id: action.payload.id, 
          message: "",
          colour:  "gray",
          durationInMs: "noTimer",
          loginButton: false, 
          progressInPercent: "noProgress",
          isVisible: true
        }
        state.notifications.push(newNotification)
      }
      
      notificationIds = state.notifications.map(notification => notification.id)
      index = notificationIds.indexOf(action.payload.id)

      action.payload.message ? 
        state.notifications[index].message = action.payload.message : null 

      action.payload.colour ? 
        state.notifications[index].colour = action.payload.colour : null

      action.payload.isVisible ? 
        state.notifications[index].isVisible = action.payload.isVisible : null

      action.payload.loginButton ? 
        state.notifications[index].loginButton = action.payload.loginButton : null

      action.payload.progressInPercent ? 
        state.notifications[index].progressInPercent = action.payload.progressInPercent : null
    }, 
    prioritizeNotification: (state, action: PayloadAction<string>) => {
      const notificationIds = state.notifications.map(notification => notification.id)
      const index = notificationIds.indexOf(action.payload) 

      if (index !== -1) {
        state.notifications.push(state.notifications[index])   
        state.notifications.splice(index, 1)
      }
    }, 
    updateNotificationVisibility: (state, action: PayloadAction< UpdateVisibiltyProps >) => {
      const selectedNotification = state.notifications.find(notification => notification.id === action.payload.id)
      if (selectedNotification) { 
        selectedNotification.isVisible = action.payload.isVisible; 

        state.notifications = state.notifications.map(notification => 
          notification.id === action.payload.id ? selectedNotification : notification
          )
        }

    },
  }
})

export const { notification, prioritizeNotification, updateNotificationVisibility } = notificationsSlice.actions

export default notificationsSlice.reducer