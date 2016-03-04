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
    this.handlers[ subject ] = this.collection.find({subject}).observe({added: callback});
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