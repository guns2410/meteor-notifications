ClientNotifications = class {
  constructor(name, remoteUrl = "")
  {
    this.name       = name;
    this.connection = Meteor;
    if (remoteUrl && remoteUrl !== "")
    {
      this.connection = new DDPConnector(remoteUrl).getConnection();
      this.collection = new Mongo.Collection("notifications_" + this.name, this.connection);
    } else
    {
      this.collection = new Mongo.Collection("notifications_" + this.name);
    }

    this.collection.allow({update: (id, doc) => true});

    this.subscription = null;
    this.handlers     = {};
    return this;
  }

  listen(intendedFor, startingFrom)
  {
    let subscriptionName = `notifications/${this.name}/publication`;
    this.subscription    = this.connection.subscribe(subscriptionName, intendedFor, startingFrom);
  }

  on(subject, callback)
  {
      let callbackfunction = (message) => {
          callback(message);
          this.collection.update({_id: message._id}, {$set: {delivered: 1}});
      }
    this.handlers[ subject ] = this.collection.find({subject}).observe({added: callbackfunction});
  }

  stop()
  {
    if (this.subscription !== null)
    {
      this.subscription.stop();
      _.each(this.handlers, (handler, subject) =>
      {
        handler.stop();
        delete this.handlers[ subject ];
      });
      this.subscription = null;
    }
  }
}
