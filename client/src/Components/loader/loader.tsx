import React from "react";
import { ProgressSpinner } from 'primereact/progressspinner';
import './loader.css'


const Loader = () => {
    return (
        <div className="loaderWrapper">
            <div>
                <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="3"  animationDuration=".5s" />
            </div>
        </div>
    )
}

export default Loader;