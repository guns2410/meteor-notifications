# meteor-notifications
Exchange Notification Messages between Server and Clients via DDP Connection

## Installation

```
meteor add gunjansoni:notifications
```

This package can have a same back-end server or different client server, typically, a micro-service configuration.

--------------------------------------------------------------------------------

## Server Side

 The variable `ServerNotifications` is available on the Server side.

```
 var userNotifications = new ServerNotifications("user_notifications");

 // some database operations here...
 var userId = "UserId of the user the message is intended for";

 userNotifications.notify("someSubject", "Message Title", "Your Message Here...", userId, options);
```

ServerNotifications accept the below parameters:
- subject: The subject of the message on which the client performs actions
- title: Title of the Message
- message: The actual message
- intendedFor: The UserId of the user for whom the message is intended for
- options (optional): Other Options that you would wish to pass with the notification message

--------------------------------------------------------------------------------

## Client Side

The variable `ClientNotifications` is available on the Client

```
var userNotifications = new ClientNotifications("user_notifications");
```

You can pass an additional parameter of the DDP URL to connect to another server

```
 var userNotifications = new ClientNotifications("user_notifications", "http://localhost:4000");
```

Now we need to listen to a specific subject and pass a date starting from to listen to messages. You can pass a valid date object from the past to read previous messages.

```
 userNotifications.listen(Meteor.userId(), new Date());
```

With an `on` event you can pass a callback to perform an action on the message.

```
userNotifications.on("someSubject", function(message) {
    // perform an action with the message
});
```

The message object return on the `on` event has the below items:
- _id: MongoID of the message
- date: The Date Object the message was created
- intendedFor: UserId of the user the message is intended for
- title: The Title of the message
- message: The actual message that was sent
- subject: The subject on which the client is listening to
- options: additional options sent by the server along with the message

--------------------------------------------------------------------------------

For using Subscriptions and getting all the notification count, here is a react example. The same could be done in Blaze much easier, however, putting a React Example as getting lot of requests on React Example.

```
TopMenuNotification = React.createClass({

  mixins: [ ReactMeteorData ],

  getMeteorData() {
    let data   = {loading: true, notifications: [], count: 0};
    let handle = UserNotifications.subscription;
    if (handle.ready())
    {
      data.loading       = false;
      data.notifications = UserNotifications.collection.find({}, {limit: 6, sort: {date: -1}}).fetch();
      data.count         = UserNotifications.collection.find({delivered: 0}).count();
    }
    return data;
  },

  render() {
    // Render your component here...
  }
});
```

--------------------------------------------------------------------------------

The Notification Constructor is as below:

- name: Name of the Notification that was initialized with
- connection: Meteor object for the same server setup and DDP.Connect object for a remote connection
- collection: the Collection responsible for storing the notifications
- subscription: Live subscription handle
- handlers: An object holding all the observers responsible to live querying the changes

You can call `userNotifications.stop()` to stop the subscription and clear the subscription, suggested within the Logout method.

--------------------------------------------------------------------------------

This package is very new and I would want you to help improving it.

For improving the package, please submit a pull request on the GitHub repo.
