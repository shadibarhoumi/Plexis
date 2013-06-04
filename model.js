Messages = new Meteor.Collection("messages");

Messages.allow({
	insert: function(userId, message) {
		return userId && message.owner === userId;
	}
});