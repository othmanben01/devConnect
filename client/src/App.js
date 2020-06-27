import React, { Fragment, useEffect } from "react";
import "./App.css";
import "font-awesome/css/font-awesome.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import Landing from "./components/layout/landing";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Alert from "./components/common/alert";
// Redux
import { Provider } from "react-redux";
import store from "./store/store";
import setAuthToken from "./components/utils/setAuthToken";
import { loadUser } from "./store/actions/auth";
import { getCurrentProfile } from "./store/actions/profile";
import Dashboard from "./components/dashboard/dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-form/create-profile";
import EditProfile from "./components/profile-form/edit-profile";
import AddExperience from "./components/profile-form/add-experience";
import AddEducation from "./components/profile-form/add-education";
import Profiles from "./components/profiles/profiles";
import Profile from "./components/profile/profile";
import Posts from "./components/posts/posts";
import Post from "./components/post/post";

if (localStorage.token) setAuthToken(localStorage.token);

const App = () => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.dispatch(loadUser());
      store.dispatch(getCurrentProfile());
    }
  }, []);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
              <Route exact path="/profile/:id" component={Profile} />
              <Route exact path="/profiles" component={Profiles} />
              <PrivateRoute exact path="/posts" component={Posts} />
              <PrivateRoute exact path="/posts/:id" component={Post} />
            </Switch>
          </section>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
