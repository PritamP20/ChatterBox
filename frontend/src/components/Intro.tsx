import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Client, Databases, Storage } from 'appwrite';
import { ID } from 'appwrite';

const Intro = ({ setRoom, setName, setImage, client, storage, setImgId }) => {
  const [roomCode, setRoomCode] = useState('');
  const [join, setJoin] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isRoomCodeVisible, setRoomCodeVisible] = useState(false);
  const [localName, setLocalName] = useState('');
  const [localImage, setLocalImage] = useState(null);
  const navigation = useNavigate();

  // const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('6745f403000fe4ee4ffa');
  // const database = new Databases(client);
  // const storage = new Storage(client)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localName) {
      setFormError('Name is required');
      return;
    }

    if (!localImage) {
      setFormError('Image is required');
      return;
    }

    if (join && !roomCode) {
      setFormError('Room code is required to join');
      return;
    }

    // Set states for parent
    setName(localName);
    setImage(localImage);

    if (join) {
      setRoom(roomCode);
    } else {
      const newRoomCode = createRoomCode();
      setRoom(newRoomCode);
    }

    setFormError('');
    setFormSuccess(`Successfully ${join ? 'joined' : 'created'} room!`);

    // Navigate after updating state
    setTimeout(() => {
      navigation("/room");
    }, 500);
  };

  const createRoomCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleJoinRoom = () => {
    setJoin(true);
    setRoomCodeVisible(true);
  };

  const handleCreateRoom = () => {
    setJoin(true);
    setRoomCodeVisible(false);
    const newRoomCode = createRoomCode();
    setRoomCode(newRoomCode);
    setRoom(newRoomCode)
    setFormSuccess(`Room created with code: ${newRoomCode}`);
    setRoom(newRoomCode);
  };

  const handleImageChange = async (e:any) => {
    const file = e.target.files[0];
    try {
      const fileId = ID.unique()
      const data = await storage.createFile('6745f4140009884cffea',fileId, file)
      console.log("Image uploaded in appWrite: ",data)
      const imageURL = await storage.getFilePreview('6745f4140009884cffea', fileId)
      console.log("Upload image: ", imageURL.href)
      setImgId(fileId)
      setLocalImage(imageURL.href)
    } catch (error) {
      console.log("app write error: ", error)
    }
    if (file && file.type.startsWith('image/')) {
      // setLocalImage(URL.createObjectURL(file));
      setFormError('');
    } else {
      setFormError('Please upload a valid image.');
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 h-[60vh] m-auto border backdrop-blur-sm  border-black rounded-lg items-center w-full max-w-lg p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Welcome to the Chat App</h2>
      <form className="flex flex-col space-y-4 gap-4 " onSubmit={handleSubmit}>
        <label className='flex gap-2 text-lg'>
          <span className='m-auto text-white'>Name:</span>
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder='Enter Your Name'
            className="border p-2 rounded-md w-full placeholder:text-black"
            required
          />
        </label>
        <label className='flex gap-2 text-lg'>
        <span className='m-auto text-white'>Img:</span>
          <input
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded-md w-full"
            accept="image/*"
          />
        </label>
        {localImage && <img src={localImage} alt="Preview" className="w-20 h-20 rounded-md object-cover" />}
        {formError && <p className="text-red-500">{formError}</p>}
        {formSuccess && <p className="text-white">{formSuccess}</p>}
        {!isRoomCodeVisible ? (
          <div className="flex gap-4 justify-between">
            <button type="button" onClick={handleJoinRoom} className="bg-black text-white hover:bg-white hover:text-black py-2 px-4 rounded-md">
              Join Room
            </button>
            <button type="button" onClick={handleCreateRoom} className="bg-black text-white hover:bg-white hover:text-black py-2 px-4 rounded-md">
              Create Room
            </button>
          </div>
        ) : (
          <label>
            Room Code:
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
          </label>
        )}
        <button type="submit" className="bg-black hover:bg-white hover:text-black text-white py-2 px-4 rounded-md mt-4">
          Enter
        </button>
      </form>
    </div>
  );
};

export default Intro;
