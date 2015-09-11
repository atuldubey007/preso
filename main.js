Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient) {

  Meteor.subscribe("resolutionsPub");

  Template.body.helpers({
    resolutions : function () {
      if (Session.get('hideFinished')) {
        return Resolutions.find({ checked: {$ne: true}});
      } else {
        return Resolutions.find();
      }
    },
    hideFinished: function() {
      return Session.get('hideFinished');
    }
  });

  Template.body.events({
    'submit .new-resolution': function (event) {
      var title = event.target.title.value;
      
      Meteor.call("addResolution", title);
      
      event.target.title.value = "";
      console.log("New Task!");
      return false;
    },
    'change #checkme': function(event) {
      Session.set('hideFinished', event.target.checked);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //var myDB = new MongoInternals.RemoteCollectionDriver("mongodb://client-7e781c65:7cee2107-08bc-ff88-9771-7467c01c12c1@production-db-d3.meteor.io:27017/preso_meteor_com");
    //Resolutions = new Mongo.Collection('resolutions', {_driver: myDB});
  });

  Meteor.publish("resolutionsPub", function() {
    return Resolutions.find({
      $or : [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });  
  });
}



Meteor.methods({
  addResolution: function(title) {
    Resolutions.insert({
        title : title,
        createdAt: new Date(),
        owner: Meteor.userId()
      });
  },
  deleteResolution: function(id) {
    var res = Resolutions.findOne(id);
    if(res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Resolutions.remove(id);  
  },
  updateResolution: function(id, checked) {
    var res = Resolutions.findOne(id);
    if(res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Resolutions.update(id, {$set: {checked : checked}});
  },
  setPrivate: function(id, private) {
    var res = Resolutions.findOne(id);
    if(res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Resolutions.update(id, {$set: {private: private}});
  }
});