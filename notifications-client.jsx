ClientNotifications = class {
  constructor(name, remoteUrl = "")
  {
    this.name       = name;
    this.connection = Meteor;
    if (remoteUrl && remoteUrl !== "")
    {
      if (typeof remoteUrl === "string")
      {
          this.connection = new DDPConnector(remoteUrl).getConnection();
      } else
      {
          this.connection = remoteUrl;
      }

        this.collection = new Mongo.Collection("notifications_" + this.name, this.connection);
    } else
    {
      this.collection = new Mongo.Collection("notifications_" + this.name);
    }

    this.collection.allow({
      update: (id, doc) => true
    });

    this.subscription = null;
    this.handlers     = {};
    return this;
  }

  listen(intendedFor, startingFrom)
  {
    let subscriptionName = `notifications/${this.name}/publication`;
    if (this.subscription) this.subscription.stop();
    this.subscription = this.connection.subscribe(subscriptionName, intendedFor, startingFrom);
  }

  on(subject, callback)
  {
    let callbackfunction = (message) =>
    {
      callback(message);
      this.collection.update({
        _id: message._id
      }, {
        $set: {
          delivered: 1
        }
      });
    }
      if (!this.handlers[ subject ])
      {
          this.handlers[ subject ] = this.collection.find({subject, delivered: 0}).observe({added: callbackfunction});
      }
  }

  allNotifications(selector = {}, options = {})
  {
    return this.collection.find(selector, options);
  }

  removeOn(subject)
  {
    if (this.handlers[ subject ])
    {
      this.handlers[ subject ].stop();
      delete this.handlers[ subject ]
    }
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
