import React from "react";
import PropTypes from "prop-types";

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar },
  },
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={avatar} alt="" />
      <h1 className="large">{name}</h1>
      <p className="lead">
        {status} {company && <span> at {company}</span>}
      </p>
      <p>{location && <span>{location}</span>}</p>
      <div className="icons my-1">
        {website && (
          <a
            href={`http://www.${website}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-globe fa-2x" />
          </a>
        )}
        {social && social.twitter && (
          <a
            href={`http://www.${social.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-twitter fa-2x" />
          </a>
        )}
        {social && social.facebook && (
          <a
            href={`http://www.${social.facebook}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-facebook fa-2x" />
          </a>
        )}
        {social && social.linkedin && (
          <a
            href={`http://www.${social.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-linkedin fa-2x" />
          </a>
        )}
        {social && social.youtube && (
          <a
            href={`http://www.${social.youtube}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-youtube fa-2x" />
          </a>
        )}
        {social && social.instagram && (
          <a
            href={`http://www.${social.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-instagram fa-2x" />
          </a>
        )}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileTop;
