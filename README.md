# Scrum Poker App

Online implementation of the planning poker technique for teams that work remotely.

### Try it

See the demo here [Scrum Poker App](https://scrum-pocker.herokuapp.com/).

### Requirements

All you need is... not love, but the latest version of Node.js to run this app.

### File structure
The app is split in the `client/` and the `server/` directories. The client is no less
than a react app created with `cra`, and the server is written with node
using the Express.js framework, tough it is not used that much. The communication
is handled with Socket.IO in both client and server.

### Development

Since this is a Node.js + React.js app combo, you need to start the node
server and the react development server.

First, in the project root directory, install the server dependencies and start
the node server:
`npm install` y `node server`.

Now, go to the `client` directory to install the client dependencies
and start the react app development server:
`npm install` y `npm start`.

Access the app through `http://localhost:3000`. Changes inside `client/` folder
will be "fast reloaded", but changes on the server side require a manual restart.

### Build and deploy

Inside the `client` directory, run `npm run build` to create the production build
for the React App. Make sure you've already installed the dependencies with `npm install`,
in both, server and client.
The node server is configured to serve the react production files, so all you have
to do now is to run the node server as mentioned earlier, and this time enter the
application through the default HTTP port.

Note that the node server behaves the same in both, production and development.
When you enter `http://localhost:3000` you're just connecting to the server using
the development version of the client.
