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
        <>
            {props.header}
            <main>
                {props.children}
            </main>
        </>
    )
}

export {Page, Header};
