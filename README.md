meteor-notifications
====================
Exchange Notification Messages between Server and Clients via DDP Connection

Installation
------------

    meteor add gunjansoni:notifications


This package can have a same back-end server or different client server, typically, a micro-service configuration.


----------


>  **Server Side:**

 The variable `ServerNotifications` is available on the Server side.

     var userNotifications = new ServerNotifications("user_notifications");

     // some database operations here...
     var userId = "UserId of the user the message is intended for";

     userNotifications.notify("someSubject", "Message Title", "Your Message Here...", userId, options);

ServerNotifications accept the below parameters:

 - subject: The subject of the message on which the client performs actions
 - title: Title of the Message
 - message: The actual message
 - intendedFor: The UserId of the user for whom the message is intended for
 - options (optional): Other Options that you would wish to pass with the notification message

----------

> **Client Side:**

The variable `ClientNotifications` is available on the Client

    var userNotifications = new ClientNotifications("user_notifications");

You can pass an additional parameter of the DDP URL to connect to another server

     var userNotifications = new ClientNotifications("user_notifications", "http://localhost:4000");

Now we need to listen to a specific subject and pass a date starting from to listen to messages. You can pass a valid date object from the past to read previous messages.

     userNotifications.listen(Meteor.userId(), new Date());

With an `on` event you can pass a callback to perform an action on the message.

    userNotifications.on("someSubject", function(message) {
        // perform an action with the message
    });

The message object return on the `on` event has the below items:

 - _id: MongoID of the message
 - date: The Date Object the message was created
 - intendedFor: UserId of the user the message is intended for
 - title: The Title of the message
 - message: The actual message that was sent
 - subject: The subject on which the client is listening to
 - options: additional options sent by the server along with the message
