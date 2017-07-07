import React from 'react';

export default function AboutPageUser(props) {
  return (
    <div>
      <h3>User via dynamic route: {props.route.params.user}</h3>

      <p>Current user name is {props.route.params.user}</p>

      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}
