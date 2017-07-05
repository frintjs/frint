import React from 'react';
import { Outlet } from 'frint-router-react';

import TopNav from './TopNav';

export default function Root() {
  return (
    <div>
      <TopNav />

      <Outlet />
    </div>
  );
}
