import { registerComponent, Components, getSetting } from 'meteor/vulcan:core';
import React from 'react';
import { createStyles } from '@material-ui/core/styles';
import { AnalyticsContext } from "../../../lib/analyticsEvents";

// -- See here for all the tab content --
import menuTabs from './menuTabs'

const styles = createStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#ffffffd4",
    flexDirection: "row",
  }
}))

const TabNavigationMenuFooter = ({classes}) => {
  const { TabNavigationFooterItem } = Components

  return (
      <AnalyticsContext pageSectionContext="tabNavigationFooter">
        <div className={classes.root}>
          {menuTabs[getSetting('forumType')].map(tab => {
            if (!tab.showOnMobileStandalone) {
              return
            }
            // NB: No support for custom components or dividers on footer
            return <TabNavigationFooterItem
              key={tab.id}
              tab={tab}
            />
          })}
        </div>
      </AnalyticsContext>
  )
};

const TabNavigationMenuFooterComponent = registerComponent(
  'TabNavigationMenuFooter', TabNavigationMenuFooter, {styles}
);

declare global {
  interface ComponentTypes {
    TabNavigationMenuFooter: typeof TabNavigationMenuFooterComponent
  }
}
