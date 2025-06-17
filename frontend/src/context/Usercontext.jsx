import React, { createContext, useState } from 'react';

// Create and export the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [email, setemail] = useState("");

    return (
        <UserContext.Provider value={{ email, setemail }}>
            {children}
        </UserContext.Provider>
    );
};
