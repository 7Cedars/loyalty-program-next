import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '../../types'

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
      console.log(`addNotification called. Action Payload: ${Object.values(action.payload)} `)
      let notificationIds = state.notifications.map(notification => notification.id)
      let index = notificationIds.indexOf(action.payload.id)

      console.log("INDEX notification1: ", index)

      if (index === -1) { 
        const newNotification: Notification = {
          id: action.payload.id, 
          message: "",
          colour:  "gray",
          durationInMs: "noTimer",
          progressInPercent: "noProgress",
          visible: true
        }
        state.notifications.push(newNotification)
      }
      
      notificationIds = state.notifications.map(notification => notification.id)
      index = notificationIds.indexOf(action.payload.id) 

      console.log("INDEX notification2: ", index)

      action.payload.message ? 
        state.notifications[index].message = action.payload.message : null 

      action.payload.colour ? 
        state.notifications[index].colour = action.payload.colour : null

      // Durantion still has to be coded - tough one.  
      action.payload.durationInMs ? 
        state.notifications[index].durationInMs = action.payload.durationInMs : null

      action.payload.visible ? 
        state.notifications[index].visible = false : null

      action.payload.progressInPercent ? 
        state.notifications[index].progressInPercent = action.payload.progressInPercent : null

       console.log("action.payload.visible: ", action.payload.visible)
      console.log("state.notifications[index]", Object.keys(state.notifications[index]),  Object.values(state.notifications[index]))


    }, 
    prioritizeNotification: (state, action: PayloadAction<string>) => {
      console.log("prioritizeNotification called")
      const notificationIds = state.notifications.map(notification => notification.id)
      const index = notificationIds.indexOf(action.payload) 

      if (index !== -1) {
        state.notifications.push(state.notifications[index])   
        state.notifications.splice(index, 1)
      }
    }, 
    // purgeInvisibleNotifications: (state, action: PayloadAction<NotificationId>) => {
    //   console.log("removeNotification called")
    //   state.notifications.filter(
    //     notification => { notification.id !== action.payload.id } 
    //   )
    // }, 
    // deleteNotifications: (state, action: PayloadAction<NotificationId>) => {
    //   console.log("removeNotification called")
    //   state.notifications.filter(
    //     notification => { notification.id !== action.payload.id } 
    //   )
    // }
  }
})

export const { notification, prioritizeNotification } = notificationsSlice.actions

export default notificationsSlice.reducer