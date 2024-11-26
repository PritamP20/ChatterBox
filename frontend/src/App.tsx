import { useEffect, useState } from 'react';
import './App.css';
import ChatUI from './components/ChatUI';
import Intro from './components/Intro';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Client, Databases, Storage } from 'appwrite';

function App() {
  const [room, setRoom] = useState("-1");
  const [name, setName] = useState("");
  const [img, setImg] = useState();
  const [imgID, setImgId] = useState(-1)

  const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('6745f403000fe4ee4ffa');
  const database = new Databases(client);
  const storage = new Storage(client)
  return (
    <>

    <div className='flex justify-center h-[90vh] m-2'>
      <Router>
        <Routes>
          {/* Define the path for the Intro component */}
          <Route 
            path="/" 
            element={<Intro setRoom={setRoom} setName={setName} setImage={setImg} client={client} storage={storage} setImgId={setImgId}/>} 
          />

          {/* Define the path for the ChatUI component */}
          <Route 
            path="/room" 
            element={<ChatUI room={room} name={name} img={img}/>} 
          />
        </Routes>
      </Router>
    </div>

    </>

    // <ChatUI room={"samruttha"} name={"Pritam"} img={""}/>
  );
}

export default App;
