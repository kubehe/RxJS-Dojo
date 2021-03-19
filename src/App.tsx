import * as React from 'react';
import Header from "./Header";
import {Alerts} from "./alerts";
import {CreateAlertButton} from "./CreateAlertButton";
import {Router} from "react-router-dom";
import {Route, Switch} from "react-router";
import {browserHistory} from "./browserHistory";

export const App: React.FC = () => (
  <Router history={browserHistory}>
      <Header/>
      <Alerts/>
      <div className='App-container'>

          <Switch>
              <Route path='/awesome'>{() => <div>Awesome Page</div>}</Route>
              <Route path='/great'>{() => <div>Great Page</div>}</Route>
              <Route path='/'>{() => <div>Welcome Page</div>}</Route>
          </Switch>

          <CreateAlertButton />
      </div>
  </Router>
);

export default App;
