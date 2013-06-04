Messages = new Meteor.Collection("messages");

Messages.allow({
	insert: function(userId, message) {
		console.log('in message.allow');
		return userId && message.owner === userId;
	}
});