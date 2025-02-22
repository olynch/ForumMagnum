import { ensureIndex } from '../../collectionIndexUtils';
import { forumTypeSetting } from '../../instanceSettings';
import Sequences from './collection';

declare global {
  interface SequencesViewTerms extends ViewTermsBase {
    view?: SequencesViewName
    userId?: string
  }
}

Sequences.addDefaultView((terms: SequencesViewTerms) => {
  const alignmentForum = forumTypeSetting.get() === 'AlignmentForum' ? {af: true} : {}
  let params = {
    selector: {
      hidden: false,
      ...alignmentForum
    }
  }
  return params;
})

function augmentForDefaultView(indexFields)
{
  return { hidden:1, af:1, isDeleted:1, ...indexFields };
}

Sequences.addView("userProfile", function (terms: SequencesViewTerms) {
  return {
    selector: {
      userId: terms.userId,
      isDeleted: false,
      draft: false,
      hideFromAuthorPage: false
    },
    options: {
      sort: {
        userProfileOrder: 1,
        createdAt: -1,
      }
    },
  };
});
ensureIndex(Sequences, augmentForDefaultView({ userId:1, userProfileOrder: -1 }));

Sequences.addView("userProfilePrivate", function (terms: SequencesViewTerms) {
  return {
    selector: {
      userId: terms.userId,
      isDeleted: false,
      $or: [
        {draft: true},
        {hideFromAuthorPage: true}
      ]
    },
    options: {
      sort: {
        draft: -1,
        userProfileOrder: 1,
        createdAt: -1,
      }
    },
  };
});

Sequences.addView("userProfileAll", function (terms: SequencesViewTerms) {
  return {
    selector: {
      userId: terms.userId,
      isDeleted: false
    },
    options: {
      sort: {
        draft: -1,
        hideFromAuthorPage: 1,
        userProfileOrder: 1,
        createdAt: -1
      }
    },
  };
});
ensureIndex(Sequences, augmentForDefaultView({ userId: 1, draft: 1, hideFromAuthorPage: 1, userProfileOrder: 1 }))

Sequences.addView("curatedSequences", function (terms: SequencesViewTerms) {
  return {
    selector: {
      userId: terms.userId,
      curatedOrder: {$exists: true},
      isDeleted: false,
      gridImageId: {$ne: null },
      draft: false,
    },
    options: {
      sort: {
        curatedOrder: -1,
        createdAt: -1
      }
    },
  };
});
ensureIndex(Sequences, augmentForDefaultView({ curatedOrder:-1 }));

Sequences.addView("communitySequences", function (terms: SequencesViewTerms) {
  return {
    selector: {
      userId: terms.userId,
      curatedOrder: {$exists: false},
      gridImageId: {$ne: null },
      isDeleted: false,
      draft: false,
      $or: [
        {canonicalCollectionSlug: ""},
        {canonicalCollectionSlug: {$exists: false}},
      ],
    },
    options: {
      sort: {
        createdAt: -1
      }
    },
  };
});
