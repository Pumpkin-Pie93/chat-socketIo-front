import {io, Socket} from "socket.io-client";
import {MessageType, UserType} from "../types/types.ts";

// export const socket = io('http://localhost:3009')

export const api = {
  socket: null as null | Socket,
  createConnection(){
	this.socket = io('http://localhost:3009')
  },
  subscribe(initMessagesHandler: (messages:MessageType[]) => void,
            newMessageSentHandler: (message:MessageType) => void,
            userTypingHandler:(user:UserType)=> void
  )
  {
    this.socket?.on('init-messages-published',initMessagesHandler)
    this.socket?.on('new-message-sent',newMessageSentHandler)
    this.socket?.on('user-typing',userTypingHandler)

  },

  sendName(name:string){
    this.socket?.emit('user-send-name',name)
  },
  clientMessageSent(message:string){
    this.socket?.emit('client-message-sent',message,(error:string | null)=>{
      if(error) alert(error)
    })
  },
  typeMessage(){
    this.socket?.emit('client-typed')
  },
  destroyConnection(){
    this.socket?.disconnect()
    this.socket = null
  }

}