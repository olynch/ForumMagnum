import React from 'react';
import { Components, registerComponent } from '../../lib/vulcan-lib';
import { AnalyticsContext } from "../../lib/analyticsEvents";

const styles = (theme: ThemeType): JssStyles => ({
  description: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit*4,
  },
})

const EASequencesHome = ({classes}: {
  classes: ClassesType;
}) => {
  const { SingleColumnSection, SectionTitle, SequencesNewButton, Typography, EACoreReading, ContentStyles } = Components
  
  return <AnalyticsContext pageContext="eaSequencesHome">
    <SingleColumnSection>
      <SectionTitle title="Core Reading" />
      <EACoreReading />
      <SectionTitle  title="Sequences" >
        <SequencesNewButton />
      </SectionTitle>
      <ContentStyles contentType="post">
        <Typography variant='body1' className={classes.description} gutterBottom>
          Sequences are collections of posts on a common theme, or that build on each other. They
          help authors to develop ideas in ways that would be difficult in a single post. You can also
          add posts written by other people to a sequence if you think they should be read together.
        </Typography>
      </ContentStyles>
      <div className={classes.sequencesGridWrapperWrapper}>
        <Components.SequencesGridWrapper
          terms={{'view': 'communitySequences', limit: 12}}
          showAuthor={true}
          showLoadMore={true}
        />
      </div>
    </SingleColumnSection>
  </AnalyticsContext>
};

const EASequencesHomeComponent = registerComponent('EASequencesHome', EASequencesHome, {styles});

declare global {
  interface ComponentTypes {
    EASequencesHome: typeof EASequencesHomeComponent
  }
}
