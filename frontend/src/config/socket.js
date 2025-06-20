import socket from 'socket.io-client';


let socketInstance = null;


export const initializeSocket = (project_id) => {
    socketInstance = socket("https://ask-to-ai-5.onrender.com", {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            project_id
        }   
    });

    // Join the room named after the project_id once connected
    socketInstance.on('connect', () => {
        socketInstance.emit('joinRoom', project_id);
    });

    return socketInstance;
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}
