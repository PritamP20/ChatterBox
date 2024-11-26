import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatUI = ({room, name, img}) => {
  const [messages, setMessages] = useState<undefined | any[]>(undefined);
  const [currMsg, setCurrMsg] = useState();
  const [userMsg, setUserMsg] = useState([]);
  const [obj, setObj] = useState([]);
  const wsRef: any = useRef();
  const inputRef: any = useRef();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate()

  const Copy = () => {
    navigator.clipboard
      .writeText(room)
      .then(() => {
        console.log("Text copied to clipboard:", room);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  useEffect(() => {
    if(room=="-1"){
      navigate("/")
    }
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      console.log(event.data);
      const obj = JSON.parse(event.data);
      setObj((prev) => [...prev, obj]);
      setMessages((prevMessages) => {
        const newMessage = obj.msg;
        return [...(prevMessages || []), newMessage];
      });
    };

    ws.onopen = () => {
      ws.send(
        // JSON.stringify({ room: 'samruttha', type: 'join' })
        JSON.stringify({ room: room, type: 'join' })
      );
    };
    wsRef.current = ws;
  }, []);

  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      console.log("Disconnected from WebSocket");
      navigate("/")
    }
  };
  
  const sendMessage = () => {
    const message = inputRef.current?.value;
    setCurrMsg(message)
    setUserMsg(prev=>[...prev, message]);
    const time = new Date().getTime()
    if (message) {
      wsRef.current.send(
        JSON.stringify({
          room: room,
          type: 'chat',
          msg: message,
          name: name,
          time: new Date(time).toLocaleTimeString(),
          img: img
        })
      );
    }
    inputRef.current.value = '';
  };

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
    { room!="-1" ? <div className='flex justify-center items-center fixed text-white top-1 gap-2 text-sm'>
      <button className='border  p-1 backdrop-blur-xl bg-black font-light rounded-sm  shadow-sm' onClick={(e)=>Copy()}>{room}</button>
      <button className='border  p-1  backdrop-blur-xl bg-black font-ligh rounded-sm shadow-sm hover:bg-red-500' onClick={()=>handleDisconnect()}>Disconnect</button>
    </div>
    :
    <></>}
    <div className="flex flex-col h-[90vh] w-screen justify-between border border-black rounded-lg p-5 gap-4 backdrop-blur-lg">
      <div
        className="col-span-12 bg-#c4b5fd flex-1 rounded-lg gap-3 flex flex-col overflow-y-auto p-5"
      >
        {obj?.map((item, index) => {
          // return currMsg === item.msg ? (
          return userMsg.includes(item.msg) ? (
            <div
              key={index}
              className="p-2 font-semibold text-xl flex justify-end gap-3"
              // style={{ backgroundColor: '#a78bfa' }}
            >
              {/* {item.msg} */}
              <div className='flex flex-col'>
                <span className='text-start'>{item.msg}</span>
                <span className="text-xs font-light space-x-0 text-end">{item.name} : {item.time}</span>
              </div>
              <img className='h-[6vh] rounded-full' src={img} alt="" />
            </div>
          ) : (
            <div
              key={index}
              className="font-semibold text-xl flex items-start gap-2"
              // style={{ backgroundColor: '#a78bfa' }}
            >
              <img className='h-[6vh] rounded-full' src={item.img} alt="" />
              <div className='flex flex-col'>
                <span>{item.msg}</span>
                {/* <span>{JSON.stringify(item)}</span> */}
                <span className="text-xs font-light space-x-0 text-start">{item.name} : {item.time}</span>
              </div>
            </div>
          );
        })}
        {/* {messages?.map((item, index) => {
          return currMsg === item ? (
            <div
              key={index}
              className="p-2 border font-semibold text-xl flex justify-end"
              // style={{ backgroundColor: '#a78bfa' }}
            >
              {item}
            </div>
          ) : (
            <div
              key={index}
              className="p-2 border font-semibold text-xl flex"
              // style={{ backgroundColor: '#a78bfa' }}
            >
              {item}
            </div>
          );
        })} */}


        {/* This div is used to scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>

      <div className="col-span-12 h-[8%] flex justify-between items-center p-5 gap-2">
        <div className="col-span-10 flex flex-grow">
          <input
            ref={inputRef}
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage(); // Trigger message send on Enter key press
              }
            }}
          />
        </div>
        <button
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
    </>
  );
};

export default ChatUI;
