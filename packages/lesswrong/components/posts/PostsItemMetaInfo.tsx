import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import { createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames'

const styles = createStyles((theme) => ({
  root: {
    color: theme.palette.grey[600],
    fontSize: "1.1rem",
    display: "flex",
    alignItems: "center",
  },
}))

const PostsItemMetaInfo = ({children, classes, className}) => {
  return <Typography
    component='span'
    className={classNames(classes.root, className)}
    variant='body2'>
      {children}
  </Typography>
}

const PostsItemMetaInfoComponent = registerComponent('PostsItemMetaInfo', PostsItemMetaInfo, {styles});

declare global {
  interface ComponentTypes {
    PostsItemMetaInfo: typeof PostsItemMetaInfoComponent
  }
}

