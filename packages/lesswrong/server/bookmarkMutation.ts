import { addGraphQLMutation, addGraphQLResolvers } from './vulcan-lib';
import Users from '../lib/collections/users/collection';
import { updateMutator } from './vulcan-lib/mutators';
import * as _ from 'underscore';

addGraphQLMutation('setIsBookmarked(postId: String!, isBookmarked: Boolean!): User!');
addGraphQLResolvers({
  Mutation: {
    async setIsBookmarked(root: void, {postId,isBookmarked}: {postId: string, isBookmarked: boolean}, context: ResolverContext): Promise<DbUser> {
      const {currentUser} = context;
      if (!currentUser)
        throw new Error("Log in to use bookmarks");
      
      const oldBookmarksList = currentUser.bookmarkedPostsMetadata;
      const alreadyBookmarked = _.some(oldBookmarksList, bookmark=>bookmark.postId===postId);
      const newBookmarksList = (isBookmarked
        ? (alreadyBookmarked ? oldBookmarksList : [...(oldBookmarksList||[]), {postId}])
        : _.reject(oldBookmarksList, bookmark=>bookmark.postId===postId)
      );
      
      await updateMutator({
        collection: Users,
        documentId: currentUser._id,
        set: {bookmarkedPostsMetadata: newBookmarksList},
        currentUser, context,
        validate: false,
      });
      
      return await Users.findOne(currentUser._id);
    }
  }
});

