Posts = new Mongo.Collection('posts');
Tags = new Mongo.Collection('tags');
Users = new Mongo.Collection('users');

const postAutocompleteSettings = {
  position: 'bottom',
  limit: 5,
  rules: [
    {
      token: '#',
      collection: Tags,
      field: 'name',
      template: Meteor.isClient ? Template.autocompleteTag : null
    },
    {
      token: '@',
      collection: Users,
      field: 'name',
      template: Meteor.isClient ? Template.autocompleteUser : null
    }
  ]
};

Posts.attachSchema(
  new SimpleSchema({
    content: {
      type: String,
      autoform: {
        type: 'autocomplete-textarea',
        rows: 6,
        settings: postAutocompleteSettings
      }
    }
  })
);

Tags.attachSchema(
  new SimpleSchema({
    name: {
      type: String,
      max: 30,
      min: 4,
      regEx: /^[^\s\#]+$/,
      label: 'tag'
    }
  })
);

Users.attachSchema(
  new SimpleSchema({
    name: {
      type: String,
      min: 4,
      max: 30,
      regEx: /^[^\s\@]+$/,
      label: 'username'
    }
  })
);

if (Meteor.isClient) {
  sAlert.config({
    position: 'top'
  });
  
  Template.main.helpers({
    tagsCount() {
      return Tags.find().count();
    },

    usersCount() {
      return Users.find().count();
    }
  });

  Template.tags.helpers({
    tags() {
      return Tags.find();
    }
  });

  Template.users.helpers({
    users() {
      return Users.find();
    }
  });

  AutoForm.addHooks(null, {
    onSuccess() {
      sAlert.success('Thank you!');
    },

    onError() {
      sAlert.error('Something went wrong');
    }
  });
}
