import robotImage from '../assets/robot.png'
import userImage from '../assets/user.png'
import './ChatMessage.css'



export function ChatMessage({ message, sender, time }) {
  /* const { message, sender } = props; */

  /* 
  if (sender === 'robot') {
    return (
      <div>
        <img src="images/robot.png" width="50" />
        {message}
      </div>
    )
  } */
  return (
    <div className={
      sender === 'user'
        ? 'chat-message-user'
        : 'chat-message-robot'
    } >

      {sender === 'robot' && (
        <img src={robotImage} className="chat-message-profile" />
      )}

      <div className="chat-messages-text" dir="auto">{message}
        <div className="time">{time}</div>
      </div>



      {sender === 'user' && (
        <img src={userImage} className="chat-message-profile" />
      )}
    </div>
  )
}