import { Components, registerComponent } from 'meteor/vulcan:core';
import { useSingle } from '../../../lib/crud/withSingle';
import React from 'react';
import { Comments } from '../../../lib/collections/comments';
import { createStyles } from '@material-ui/core/styles';

const styles = createStyles(theme => ({
  root: {
    opacity: 0.5,
  },
  meta: {
    fontSize: 12,
    marginLeft: 3,
    fontStyle: "italic",
  },
}));

const CommentDeletedMetadata = ({documentId, classes}: {
  documentId: string,
  classes: any,
}) => {
  const { document } = useSingle({
    documentId,
    collection: Comments,
    fragmentName: 'DeletedCommentsMetaData',
  });
  if (document && document.deleted) {
    const deletedByUsername = document.deletedByUser && document.deletedByUser.displayName;
    return (
      <div className={classes.root}>
        <div className={classes.meta}>
          {deletedByUsername && <span>Deleted by {deletedByUsername}</span>}, {document.deletedDate && <span>
            <Components.CalendarDate date={document.deletedDate}/>
          </span>} 
        </div>
        {document.deletedReason &&
          <div className={classes.meta}>
            Reason: {document.deletedReason}
          </div>
        }
      </div>
    )
  } else {
    return null
  }
};

const CommentDeletedMetadataComponent = registerComponent(
  'CommentDeletedMetadata', CommentDeletedMetadata, {styles}
);

declare global {
  interface ComponentTypes {
    CommentDeletedMetadata: typeof CommentDeletedMetadataComponent,
  }
}

