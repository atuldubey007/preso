if (Meteor.isClient) {
  Template.resolution.events({
    'click .delete' : function() {
      Meteor.call("deleteResolution", this._id);
      //console.log("Task Deleted!");
    },
    'click .toggle-checked' : function() {
      Meteor.call("updateResolution", this._id, !this.checked);
        console.log(this._id); 
      //console.log("Check the task!");
    },
    'click .toggle-private' : function() {
      Meteor.call("setPrivate", this._id, !this.private);
      //console.log("Task Privacy Modified!");
    }
  });

  Template.resolution.helpers({
    isOwner: function() {
      return this.owner === Meteor.userId();
    }
  });
}