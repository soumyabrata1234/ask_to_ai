import React, { useState, useEffect } from 'react';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import { getWebContainer } from '../config/webcontainer.js';

const Project = () => {
    const [runProcess, setRunProcess] = useState(null);
    const [webContainer, setWebContainer] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [openFiles, setOpenFiles] = useState([]);
    const [fileTree, setFileTree] = useState({});
    const [sender, setSender] = useState('');
    const location = useLocation();
    const { name } = location.state || {};
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const token = localStorage.getItem('token');
    const [iframeurl, setIframeurl] = useState(null);
    const url = import.meta.env.VITE_BACKEND_URL ;
    // 🔴 Early return if name is missing (location.state is null)
    if (!name) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500 text-xl font-semibold">
                ⚠️ Error: Project not found. Please access this page through the proper route.
            </div>
        );
    }

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
            `${url}/project/add-user`,
            { name, users: added },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedUsers([]);
        setIsModalOpen(false);
    };

    useEffect(() => {
        axios.get(`${url}/user/getall`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setUsers(res.data)).catch(console.log);

        initializeSocket(name);
        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container);
                console.log("container started");
            });
        }

        receiveMessage('receiveMessage', (message) => {
            const isAI = message?.sender?._id === 'ai' || message.sender === 'AI';

            if (isAI) {
                const parsedMessage = JSON.parse(message.message);
                webContainer?.mount(message.fileTree);

                if (message.fileTree) {
                    setFileTree(message.fileTree || {});
                }

                if (parsedMessage.fileTree) {
                    setFileTree(parsedMessage.fileTree);
                }
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
                const res = await axios.get(`${url}/project/get-users/${name}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMembers(res.data.users);
                setSender(res.data.email);
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
                <div className="mb-4 flex gap-2">
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Collaborator</button>
                    <button onClick={() => setIsMembersModalOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Show Members</button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto mb-4 p-4 bg-gray-700 rounded shadow-inner" style={{ overflowX: 'hidden', minHeight: 0 }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl w-fit p-2 rounded break-words ${msg.isAI ? 'bg-gray-900' : 'bg-gray-600'}`}>
                                <div className="font-semibold mb-1 text-sm">
                                    {msg.isAI ? 'ai' : (msg.sender || 'User')}
                                </div>
                                <div className="text-sm">
                                    {msg.isAI ? (
                                        <Markdown>{msg.message}</Markdown>
                                    ) : (
                                        <span>{msg.message}</span>
                                    )}
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
            <div className="right bg-red-50 flex-grow h-full flex">
                <div className="explorer h-full max-w-40 min-w-32 bg-gray-600">
                    <div className="file-tree w-full">
                        {Object.keys(fileTree).map((file, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentFile(file);
                                    setOpenFiles([...new Set([...openFiles, file])]);
                                }}
                                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full">
                                <p className='font-semibold text-lg text-gray-800'>{file}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="code-editor flex flex-col flex-grow h-full bg-gray-400 shrink">
                    <div className="top flex bg-gray-500 justify-between w-full relative">
                        <div className="files flex">
                            {openFiles.map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentFile(file)}
                                    className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                    <p className='font-semibold text-gray-800 text-lg'>{file}</p>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={async () => {
                                await webContainer.mount(fileTree);

                                const installProcess = await webContainer.spawn("npm", ["install"]);

                                installProcess.output.pipeTo(new WritableStream({
                                    write(chunk) {
                                        console.log(chunk);
                                    }
                                }));

                                 if (runProcess) {
                                        runProcess.kill()
                                    }

                                const runprocess = await webContainer.spawn("npm", ["start"]);

                                runprocess.output.pipeTo(new WritableStream({
                                    write(chunk) {
                                        console.log(chunk);
                                    }
                                }));

                                 setRunProcess(runprocess);

                                webContainer.on('server-ready', (port, url) => {
                                    console.log(`Server is running at ${url}`);
                                    setIframeurl(url);
                                });
                            }}
                            className="absolute right-4 top-2 bg-gray-200 text-gray-800 px-4 py-1 rounded shadow hover:bg-gray-300"
                        >
                            run
                        </button>
                    </div>

                  <div className="code-content p-4 bg-gray-400 h-full overflow-y-auto">
  {currentFile ? (
    <textarea
      className="w-full h-full text-sm text-gray-800 bg-white p-2 rounded resize-none"
      value={fileTree[currentFile]?.file?.contents || ''}
      onChange={(e) => {
        const newContent = e.target.value;
        setFileTree(prev => ({
          ...prev,
          [currentFile]: {
            ...prev[currentFile],
            file: {
              ...prev[currentFile].file,
              contents: newContent
            }
          }
        }));
      }}
    />
  ) : (
    <p className="text-gray-500">Select a file to view its content</p>
  )}

<div className="code-content p-4 bg-gray-400 h-full flex flex-col gap-4 overflow-hidden">
  {currentFile ? (
    <textarea
      className="w-full flex-1 text-sm text-gray-800 bg-white p-2 rounded resize-none"
      value={fileTree[currentFile]?.file?.contents || ''}
      onChange={(e) => {
        const newContent = e.target.value;
        setFileTree(prev => ({
          ...prev,
          [currentFile]: {
            ...prev[currentFile],
            file: {
              ...prev[currentFile].file,
              contents: newContent
            }
          }
        }));
      }}
    />
  ) : (
    <p className="text-gray-500">Select a file to view its content</p>
  )}

  {/* Iframe Preview Section */}
  {iframeurl && webContainer && (
    <div className="flex flex-col border border-gray-500 rounded bg-white h-[300px]">
      <div className="address-bar">
        <input
          type="text"
          onChange={(e) => setIframeurl(e.target.value)}
          value={iframeurl}
          className="w-full p-2 px-4 bg-white-200 text-black border-b border-gray-100"
        />
      </div>
      <iframe src={iframeurl} className="w-full flex-1" />
    </div>
  )}
</div>



</div>


                </div>
            </div>
        </div>
    );
};

export default Project;
