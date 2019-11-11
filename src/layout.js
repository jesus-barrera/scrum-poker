import React from 'react';

function Header(props) {
    return  (
        <header>
            <h1>Scrum Poker!</h1>
            {props.children}
        </header>
    );
}

function Page(props) {
    return (
        <div>
            {props.header}
            <main>
                {props.children}
            </main>
        </div>
    )
}

export {Page, Header};
