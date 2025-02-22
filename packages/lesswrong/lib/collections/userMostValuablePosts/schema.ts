import { schemaDefaultValue } from '../../collectionUtils';
import { foreignKeyField } from '../../utils/schemaUtils'
import { userOwns } from '../../vulcan-users/permissions';

const schema: SchemaType<DbUserMostValuablePost> = {
  userId: {
    ...foreignKeyField({
      idFieldName: "userId",
      resolverName: "user",
      collectionName: "Users",
      type: "User",
      nullable: true,
    }),
    canRead: [userOwns, 'admins'],
    canCreate: ['members'],
    canUpdate: [userOwns, 'admins'],
  },
  postId: {
    ...foreignKeyField({
      idFieldName: "postId",
      resolverName: "post",
      collectionName: "Posts",
      type: "Post",
      nullable: true,
    }),
    canRead: [userOwns, 'admins'],
    canCreate: ['members'],
    canUpdate: [userOwns, 'admins'],
  },
  deleted: {
    type: Boolean,
    canRead: [userOwns, 'admins'],
    canCreate: ['members'],
    canUpdate: [userOwns, 'admins'],
    hidden: true,
    optional: true,
    ...schemaDefaultValue(false),
  },
};

export default schema;
