import React from 'react'

const WelcomeMessage = ({ username }: { username: string }) => {

    return (
        <div className="text-center pb-4">
            <h1 className="text-lg font-light text-gray-400">
                Welcome back,{' '}
                <span className="text-light-green">{username}</span>.
                Enjoy reviewing , rating and watching...
            </h1>
        </div>
    )
}

export default WelcomeMessage