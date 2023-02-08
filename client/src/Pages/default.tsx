import React, { useState } from "react";
import Login from "../Components/Login";
import Register from "../Components/Register";
import './default.css';


const Default: React.FC<{}> = (prps) => {
    const [pType, setpType] = useState<'L' | 'R'>('L')
    const togglePage = () => {
        setpType(pType === 'L' ? 'R' : 'L')
    }
    return <div className="defaultWrapper">
        {
            (pType === 'L' &&
                <Login key="Login" togglePageMethod={togglePage} />) || (<Register togglePageMethod={togglePage} />)
        }
    </div>
}

export default Default;