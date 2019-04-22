import { addGraphQLMutation, addGraphQLResolvers, editMutation } from 'meteor/vulcan:core';
import { EmailTokens } from '../../lib/collections/emailTokens/collection.js';
import { Random } from 'meteor/random';
import { Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

let emailTokenTypesByName = {};

export class EmailTokenType
{
  constructor({ name, onUseAction, resultComponentName }) {
    if(!name || !onUseAction || !resultComponentName)
      throw new Error("EmailTokenType: missing required argument");
    if (name in emailTokenTypesByName)
      throw new Error("EmailTokenType: name must be unique");
    
    this.name = name;
    this.onUseAction = onUseAction;
    this.resultComponentName = resultComponentName;
    emailTokenTypesByName[name] = this;
  }
  
  generateToken = async (userId, params) => {
    if (!userId) throw new Error("Missing required argument: userId");
    
    const token = Random.secret();
    await EmailTokens.insert({
      token: token,
      tokenType: this.name,
      userId: userId,
      used: false,
      params: params,
    });
    return token;
  }
  
  generateLink = async (userId, params) => {
    if (!userId) throw new Error("Missing required argument: userId");
    
    const token = await this.generateToken(userId, params);
    const prefix = Utils.getSiteUrl().slice(0,-1);
    return `${prefix}/emailToken/${token}`;
  }
  
  handleToken = async (token) => {
    const user = await Users.findOne({_id: token.userId});
    const actionResult = await this.onUseAction(user, token.params);
    return {
      componentName: this.resultComponentName,
      props: {...actionResult}
    };
  }
}


addGraphQLMutation('useEmailToken(token: String): JSON');
addGraphQLResolvers({
  Mutation: {
    async useEmailToken(root, {token}, context) {
      const results = await EmailTokens.find({ token }).fetch();
      if (results.length !== 1)
        throw new Error("Invalid email token");
      const tokenObj = results[0];
      
      if (!(tokenObj.tokenType in emailTokenTypesByName))
        throw new Error("Email token has invalid type");
      
      const tokenType = emailTokenTypesByName[tokenObj.tokenType];
      const resultProps = await tokenType.handleToken(tokenObj);
      await editMutation({
        collection: EmailTokens,
        documentId: tokenObj._id,
        set: {
          used: true
        },
        unset: {},
        validate: false
      });
      
      return resultProps;
    }
  }
});


export const UnsubscribeAllToken = new EmailTokenType({
  name: "unsubscribeAll",
  onUseAction: async (user) => {
    await editMutation({ // FIXME: Doesn't actually do the thing
      collection: Users,
      documentId: user._id,
      set: {
        unsubscribeFromAll: true,
      },
      unset: {},
      validate: false,
    });
    return {message: "You have been unsubscribed from all emails on LessWrong." };
  },
  resultComponentName: "EmailTokenResult",
});
