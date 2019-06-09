import React from 'react';
import { HashRouter, Route, Switch, Link } from 'react-router-dom';

const RedTetris = () => (
  <HashRouter>
    <Link to="/">Home</Link>
    <Link to="/rooms">Rooms</Link>
    <Link to="/profile">Profile</Link>
    <Link to="/room[hello]">Specific room</Link>
    <Switch>
      {/* <Route path="/" exact component={} /> */}
      <Route path="/" exact render={() => <>Home</>} />
      <Route path="/rooms" render={() => <>In rooms</>} />
      <Route path="/profile" render={() => <>In profile</>} />
      <Route path="/:room[:username]" render={() => <>In room</>} />
      <Route render={() => <>404</>} />
    </Switch>
  </HashRouter>
);

/*
http://<server_name_or_ip>:<port>/#<room>[<player_name>]
*/

export default RedTetris;
