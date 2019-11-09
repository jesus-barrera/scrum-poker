import React from 'react';
import Login from './Login.js';
import Grid from './Grid.js';

function App() {
    return (
        <div>
            <header>
                <h1>Scrum Poker!</h1>
            </header>

            <main>
                <Login />
                <Grid />
            </main>
        </div>
    );
}

export default App;
