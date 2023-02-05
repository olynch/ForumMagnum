import React from 'react'
import { Components, registerComponent } from '../../lib/vulcan-lib'
import { useCurrentUser } from '../common/withUser'

const RAHome = () => {
  const currentUser = useCurrentUser();
  const {RecentDiscussionFeed, HomeLatestPosts, StickiedPosts, CurrentSpotlightItem} = Components

  const recentDiscussionCommentsPerPost = (currentUser && currentUser.isAdmin) ? 4 : 3;
 
  return (
    <React.Fragment>
      <CurrentSpotlightItem />
      {/* <StickiedPosts /> */}

      <HomeLatestPosts />
      
      <RecentDiscussionFeed
        af={false}
        commentsLimit={recentDiscussionCommentsPerPost}
        maxAgeHours={18}
      />
    </React.Fragment>
  )
}

const RAHomeComponent = registerComponent('RAHome', RAHome)

declare global {
  interface ComponentTypes {
    RAHome: typeof RAHomeComponent
  }
}
