import React, { useState, useEffect } from 'react';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Markdown from 'markdown-to-jsx'; // ✅ Added for AI markdown rendering

const Project = () => {
      const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])
     const [ fileTree, setFileTree ] = useState({})
    const [sender, setSender] = useState('');
    const location = useLocation();
    const [members, setMembers] = useState([]);
    const { name } = location.state;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

   

    const handleSend = () => {
        if (input.trim()) {
            sendMessage('sendMessageToRoom', { project_id: name, message: input, sender });
           
            setMessages((prevMessages) => [
                ...prevMessages,
                { message: input, align: 'right', sender }
            ]);
            setInput('');
        }
    };

    const toggleUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const addCollaborators = async () => {
        const added = users
            .filter((user) => selectedUsers.includes(user.id))
            .map((user) => user._id.toString());
        await axios.put(
            'http://localhost:3000/project/add-user',
            { name, users: added },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedUsers([]);
        setIsModalOpen(false);
    };

    useEffect(() => {
        axios.get('http://localhost:3000/user/getall', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setUsers(res.data)).catch(console.log);

        initializeSocket(name);

        receiveMessage('receiveMessage', (message) => {
           const parsedMessage =JSON.parse(message.message); 
           console.log(parsedMessage);
            if(parsedMessage.fileTree) {
                setFileTree(parsedMessage.fileTree);    
            }
            //console.log(parsedMessage.sender);
            const isAI = message?.sender?._id === 'ai' || message.sender === 'AI';
            if(message?.sender?._id === 'ai') {
                //message.sender = 'AI'; // Set sender to 'AI' for AI messages
                message.message = message.message.text() || 'AI response'; // Ensure message is defined
            }
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    ...message,
                    align: isAI ? 'left' : (message.sender === sender ? 'right' : 'left'),
                    isAI
                }
            ]);
        });

        const fetchMembers = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/project/get-users/${name}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMembers(res.data.users);
                setSender(res.data.email); // Set sender email
            } catch (error) {
                console.error('Error fetching project members:', error);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            {/* Left Section */}
            <div className="w-5/12 bg-gray-800 flex flex-col p-4 relative">
                {/* Buttons */}
                <div className="mb-4 flex gap-2">
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Collaborator</button>
                    <button onClick={() => setIsMembersModalOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Show Members</button>
                </div>

                {/* Chat Area */}
                <div
                    className="flex-1 flex flex-col gap-2 overflow-y-auto mb-4 p-4 bg-gray-700 rounded shadow-inner"
                    style={{ overflowX: 'hidden', minHeight: 0 }}
                >
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.align === 'right' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xl w-fit p-2 rounded break-words ${msg.isAI ? 'bg-gray-900' : 'bg-gray-600'}`}>
                                <div className="font-semibold mb-1  text-sm">
                                    {msg.isAI ? 'ai' : (msg.sender || 'User')}
                                </div>
                                <div className="text-sm ">
                                    <div >
                                        {msg.isAI ? (
                                        <Markdown className="">{msg.message}</Markdown>
                                    ) : (
                                        <span className="">{msg.message}</span>
                                    )}
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-600 rounded bg-gray-800 text-gray-200"
                    />
                    <button onClick={handleSend} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Send
                    </button>
                </div>

                {/* Collaborator Modal */}
                {isModalOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                        <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-4">Select Collaborators</h2>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {users.map((user) => (
                                    <label key={user.id} className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleUser(user.id)}
                                            className="text-blue-500"
                                        />
                                        <span>{user.name} ({user.email})</span>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">Cancel</button>
                                <button onClick={addCollaborators} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Members Modal */}
                {isMembersModalOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                        <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-4">Project Members</h2>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {members.length === 0 ? (
                                    <p className="text-gray-400">No members found.</p>
                                ) : (
                                    members.map((member) => (
                                        <div key={member._id || member.id} className="text-sm">
                                            <span className="font-semibold">{member.name}</span> ({member.email})
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button onClick={() => setIsMembersModalOpen(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Section */}
            <div className=" right  bg-red-50 flex-grow h-full flex">

               <div className="explorer h-full max-w-40 min-w-32 bg-gray-600">
                    <div className="file-tree w-full">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                    }}
                                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full">
                                    <p
                                        className='font-semibold text-lg text-gray-800'
                                    >{file}</p>
                                    <br />
                                </button>))

                        }
                    </div>
                    

                </div>
                
                  <div className="code-editor flex flex-col flex-grow h-full bg-gray-400 shrink">

                    <div className="top flex bg-gray-500 justify-between w-full">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                        <p
                                            className='font-semibold text-gray-800 text-lg'
                                        >{file}</p>
                                    </button>
                                ))
                            }
                        </div>

                        
                       
                              </div>

                     <div className="bottom bg-gray-400 ">
                            <div className="code-content p-4 bg-gray-400 h-full overflow-y-auto">
                                {currentFile ? (
                                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                                        {fileTree[currentFile]?.file?.contents || 'No content available'}
                                    </pre>
                                ) : (
                                    <p className="text-gray-500">Select a file to view its content</p>
                                )}  
                     </div>
                         

            </div>

        </div>
                </div>
            </div>
    );
};

export default Project;
