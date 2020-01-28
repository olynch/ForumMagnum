import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { withMulti } from '../../lib/crud/withMulti';
import MenuItem from '@material-ui/core/MenuItem'
import { LWEvents } from '../../lib/collections/lwevents/collection'
import withUser from '../common/withUser';

const LastVisitList = ({ results, loading, clickCallback }) => {
  if (!loading && results) {
    return (results.map((event) =>
        <MenuItem key={event._id} dense onClick={() => clickCallback(event.createdAt)}>Visit at: <Components.CalendarDate date={event.createdAt}/> </MenuItem>
      ))
  } else {
    return <Components.Loading />
  }
}

const LastVisitListComponent = registerComponent(
  "LastVisitList", LastVisitList, {
    hocs: [
      withUser,
      withMulti({
        collection: LWEvents,
        fragmentName: 'lastEventFragment',
        enableTotal: false,
      })
    ]
  }
);

declare global {
  interface ComponentTypes {
    LastVisitList: typeof LastVisitListComponent,
  }
}

