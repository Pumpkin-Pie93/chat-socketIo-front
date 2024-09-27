import './App.css'
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/chat-store.ts";
import {createConnection, destroyConnection, sendMessage, setClientName, typeMessage} from "./reducers/chat-reducer.ts";
import {MessageType, UserType} from "./types/types.ts";


function App() {

  // const [chatMessages,setChatMessages] = useState<MessageType[]>([])

  const[userName,setUserName] = useState('Anonim')
  const[autoScroll,setAutoScroll] = useState(true)
  const [newMessage,setNewMessage] = useState('')
  const [lastScrollTop,setLastScrollTop] = useState(0)

  const chatMessages = useSelector<AppRootStateType,MessageType[]>((state:AppRootStateType) => state.chat.messages)
  const typingUsers = useSelector<AppRootStateType,UserType[]>((state:AppRootStateType) => state.chat.typingUsers)
  const dispatch = useDispatch()

  useEffect(() => {

    dispatch(createConnection())
    // Очистка подписок при размонтировании компонента
    return () => {
      dispatch(destroyConnection())
    };
  }, []);

  useEffect(() => {
    if(autoScroll){
      messagesAnchorRef.current?.scrollIntoView({behavior:'smooth'})
    }
  }, [chatMessages]);

  const messagesAnchorRef = useRef<HTMLDivElement>(null);


  if(!chatMessages.length){
    return <div>Loading................</div>
  }

  const newMessageHandler = (e:ChangeEvent<HTMLTextAreaElement>) =>{
  setNewMessage(e.currentTarget.value)
  }

  const addNewMessageInChat = () => {
    // socket.emit('client-message-sent',newMessage)
    dispatch(sendMessage(newMessage))
    setNewMessage('')
  }

  const typeMessageHandler = () => {
    if(newMessage.length > 0) {
      dispatch(typeMessage())
    }
  }

  const AutoScrollModeHAndler = (e:React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = e.currentTarget

    const maxScrollPosition = element.scrollHeight - element.clientHeight
    if(element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 20){
      setAutoScroll(true)

    }else {
      setAutoScroll(false)
    }
    setLastScrollTop(element.scrollTop)
  }

  return (
    <div className={'chat'}>
      <div className={'chatDisplay'} onScroll={AutoScrollModeHAndler}>
        {chatMessages.map((el:MessageType) => {
          return <li key={el.id}><span>{el.user.name}:</span>{el.message}
            <hr/>
          </li>
        })}
        {typingUsers.map((el:UserType) => {
          return <div key={el.id}>
            <b>{el.name}:  </b>...🖋
          </div>
        })}
        <div ref={messagesAnchorRef}></div>
      </div>
      <div className={'chatInterface'}>
        <div className={'rowFlexWrap'}>
          <input value={userName} onChange={(e) => setUserName(e.currentTarget.value)}/>
          <button
            onClick={() => dispatch(setClientName(userName))}
            className={'button'}>
            Send My name
          </button>
        </div>
        <div className={'rowFlexWrap'}>
          <textarea value={newMessage}
                    onKeyDown={typeMessageHandler}
                    onChange={newMessageHandler}
                    name={'messageInput'}/>
          <button onClick={addNewMessageInChat} className={'button'}>sent message</button>
        </div>
      </div>

    </div>

  )
}

export default App
