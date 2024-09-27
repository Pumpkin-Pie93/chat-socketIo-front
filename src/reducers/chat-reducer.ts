import {api} from "../api/api.ts";
import {MessageType, UserType} from "../types/types.ts";
import {AppDispatch} from "../store/chat-store.ts";


type StateType = {
  messages:MessageType[]
  typingUsers:UserType[]
}


const initialState:StateType = {
  messages:[],
  typingUsers:[]
}

export const chatReducer = (state = initialState,action:CommonActions):StateType => {
   switch (action.type) {
     case 'MESSAGES_RECEIVED':{
       return {...state, messages:action.messages}
  }
  case 'NEW_MESSAGE_RECEIVED':{
       return {...state,
         messages:[...state.messages,action.message],
         typingUsers: state.typingUsers.filter((u)=> u.id !== action.message.user.id)
       }
  }
     case "USER_TYPING":{
       return {...state,typingUsers:[...state.typingUsers.filter(u => u.id !== action.user.id),action.user]}
     }
     default :
    return state
  }
}

type CommonActions = MessagesReceived | NewMessagesReceived | TypingUser

const messagesReceived = (messages:MessageType[]) => ({type:'MESSAGES_RECEIVED',messages} as const)
type MessagesReceived = ReturnType<typeof messagesReceived>

const newMessageReceived = (message:MessageType) => ({type:'NEW_MESSAGE_RECEIVED',message} as const)
type NewMessagesReceived = ReturnType<typeof newMessageReceived>

const typingUser = (user:UserType) => ({type:'USER_TYPING',user} as const)
type TypingUser = ReturnType<typeof typingUser>

export const createConnection = () => (dispatch:AppDispatch)  => {
  api.createConnection()
  api.subscribe(
    (messages:MessageType[])=>{
      dispatch(messagesReceived(messages))
    },
    (message:MessageType)=>{
      dispatch(newMessageReceived(message))
    },
    (user:UserType)=>{
      dispatch(typingUser(user))
    }
  )
}

export const setClientName = (name:string) => (dispatch:AppDispatch) => {
  api.sendName(name)
}
export const typeMessage = () => (dispatch:AppDispatch) => {
  api.typeMessage()
}
export const sendMessage = (message:string) => (dispatch:AppDispatch) => {
  api.clientMessageSent(message)
}
export const destroyConnection = () => (dispatch:AppDispatch)  => {
  api.destroyConnection()
}