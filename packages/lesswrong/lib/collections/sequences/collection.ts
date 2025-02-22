import { createCollection } from '../../vulcan-lib';
import { userCanDo, userOwns } from '../../vulcan-users/permissions';
import schema from './schema';
import { makeEditable } from '../../editor/make_editable';
import { addUniversalFields, getDefaultResolvers } from '../../collectionUtils'
import { getDefaultMutations, MutationOptions } from '../../vulcan-core/default_mutations';
import { forumTypeSetting } from '../../instanceSettings';

const options: MutationOptions<DbSequence> = {
  newCheck: (user: DbUser|null, document: DbSequence|null) => {
    if (!user || !document) return false;
    // Either the document is unowned (and will be filled in with the userId
    // later), or the user owns the document, or the user is an admin
    return (!document.userId || userOwns(user, document)) ?
      userCanDo(user, 'sequences.new.own') :
      userCanDo(user, `sequences.new.all`)
  },

  editCheck: (user: DbUser|null, document: DbSequence|null) => {
    if (!user || !document) return false;
    return userOwns(user, document) ? userCanDo(user, 'sequences.edit.own') : userCanDo(user, `sequences.edit.all`)
  },

  removeCheck: (user: DbUser|null, document: DbSequence|null) => {
    if (!user || !document) return false;
    return userOwns(user, document) ? userCanDo(user, 'sequences.edit.own') : userCanDo(user, `sequences.edit.all`)
  },
}

interface ExtendedSequencesCollection extends SequencesCollection {
  // Functions in search/utils.ts
  toAlgolia: (sequence: DbSequence) => Promise<Array<AlgoliaDocument>|null>
}

export const Sequences: ExtendedSequencesCollection = createCollection({
  collectionName: 'Sequences',
  typeName: 'Sequence',
  collectionType: forumTypeSetting.get() === "EAForum" ? "pg" : "mongo",
  schema,
  resolvers: getDefaultResolvers('Sequences'),
  mutations: getDefaultMutations('Sequences', options),
  logChanges: true,
})

makeEditable({
  collection: Sequences,
  options: {
    order: 20,
  }
})
addUniversalFields({collection: Sequences})

export default Sequences;
