ServerNotifications = class {
    constructor(name)
    {
        this.name = name;
        this.collection = new Mongo.Collection("notifications_" + this.name);
        this._ensureIndexes();
        this._startPublication();
        this._allowUpdates();
        return this;
    }

    _ensureIndexes()
    {
        this.collection._ensureIndex("intendedFor");
        this.collection._ensureIndex("date");
        this.collection._ensureIndex("subject");
    }

    _allowUpdates() {
        this.collection.allow({
            update: () => true
        });
    }

    _startPublication()
    {
        Meteor.publish(`notifications/${this.name}/publication`, (intendedFor, startingFrom) => {
            return this.collection.find({
                intendedFor,
                date: {
                    $gt: startingFrom
                }
            });
        });
    }

    notify(subject, title, message, intendedFor, options = {})
    {
        this.collection.insert({
            subject,
            title,
            message,
            intendedFor,
            options,
            date: new Date(),
            delivered: 0
        });
    }
}
