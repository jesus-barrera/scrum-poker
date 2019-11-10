import React from 'react';
import Login from './Login.js';
import TeamView from './TeamView.js';
import MasterView from './MasterView.js';

function App() {
    var session = {name: "Nombre de la sesión", id: "5899999"};

    return (
        <div>
            <header>
                <h1>Scrum Poker!</h1>
            </header>

            <main>
                <MasterView session={session}/>
            </main>
        </div>
    );
}

export default App;
