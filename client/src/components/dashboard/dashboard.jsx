import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../store/actions/profile";
import Spinner from "../layout/spinner.jsx";
import { Link } from "react-router-dom";
import DashboardActions from "./dashboard-actions";
import Experiences from "./experiences";
import Educations from "./educations";

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  if (loading && profile === null) return <Spinner />;
  return (
    <Fragment>
      <h2 className="large text-primary">Dashboard</h2>
      <h4>
        <i className="fa fa-user"> </i>
        {"   Welcome"} {user && user.name}
      </h4>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experiences experience={profile.experience} />
          <Educations education={profile.education} />
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fa fa-user-minus" /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
