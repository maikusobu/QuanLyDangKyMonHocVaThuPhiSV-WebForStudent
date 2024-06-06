

// Loading.js
import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="spinner-border animate-spin inline-block w-40 h-40 border-4 rounded-full text-blue-500" role="status">
                <span className="visually-hidden"></span>
            </div>
        </div>
    );
};

export default Loading;
