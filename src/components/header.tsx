import React from 'react';
import '../sass/header.scss';

export class Header extends React.Component{

    render(){
        return <header className='Header'>
            <div>
                <div>
                <h1>
                    <span className='Left'>Admin </span> <span className='Right'>Panel</span>
                </h1>
                </div>
            </div>
        </header>
    }        
}