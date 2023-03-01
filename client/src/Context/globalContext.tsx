import React, { createContext, useState } from "react";
import { loggedUser } from "../Models/Model";

type GlobalContextType = {
    data: loggedUser;
    setuserDetails: (data: any) => void,
    setloading: (data: boolean) => void
}
export const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider: React.FC<any> = ({ children }) => {
    const [gstate, Setgstate] = useState<loggedUser>({ loading: false, userDetails: {} });

    const setuserDetails = (data: any) => {
        Setgstate({ ...gstate, userDetails: data });
    }

    const setloading = (isLoading: boolean) => {
        // Setgstate({ ...gstate,loading:data });
        Setgstate(prev => ({
            ...prev,
            loading: isLoading
        }))
    }
    return <GlobalContext.Provider value={{ data: gstate, setloading, setuserDetails }}>
        {children}
    </GlobalContext.Provider>
}

export default GlobalProvider;