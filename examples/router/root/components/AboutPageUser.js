import React from 'react';

export default function AboutPageUser(props) {
  return (
    <div>
      <h3>User via dynamic route: {props.match.params.user}</h3>

      <p>Current user name is {props.match.params.user}</p>

      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}
