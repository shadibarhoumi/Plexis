// both client and server code here


if (Meteor.isClient) {

  Template.conversation.branches = function() {
    var messages = Messages.find({}, {sort: [["branchId", "asc"], ["timestamp", "asc"]]}).fetch();
    var branches = []
    var currentBranch = -1;
    for (var i = 0; i < messages.length; i++) {
      if (currentBranch !== messages[i].branchId) {
        console.log('creating new branch!');
        branch = {branchId: messages[i].branchId, messages: [messages[i]]};
        branches.push(branch);
        currentBranch = messages[i].branchId
      } else {
        console.log('pushing to existing branch with message: ' + messages[i].message);
        branch.messages.push(messages[i]);
      }
    }
    return branches;
  };

  Template.conversation.events({
    'keyup .message': function(e) {
      if (e.keyCode === 13) {
        if (Meteor.user()) {
          console.log('putting stuff in database in keyup .message');
            Messages.insert({message: $(e.target).val(),
                            parentId: $(e.target).prev()[0].id,
                            branchId: $(e.target).parent().data('branchid'),
                            owner: Meteor.userId(),
                            username: Meteor.user().emails[0].address.replace(/\@.*$/, ''),
                            timestamp: new Date});
            $('.message').val('');
        } else {
          alert('you must be logged in to do this!');
        }
      }
        return false;
      },

      'click .submit': function(e) {
        if (Meteor.user()) {
          var $message = $(e.target).siblings('.message')
          console.log('putting stuff in database in click .submit');
            Messages.insert({message: $message.val(),
                            parentId: $message.prev()[0].id,
                            branchId: $(e.target).parent().data('branchid'),
                            owner: Meteor.userId(),
                            username: Meteor.user().emails[0].address.replace(/\@.*$/, ''),
                            timestamp: new Date});
            $message.val('');
        } else {
          alert('you must be logged in to do this!')
        }
        return false;
      },

      'click .branch-link': function(e) {
        // optimize this so we don't have to do another lookup
        var messages = Messages.find({}, {sort: [["branchId", "desc"]]}).fetch();
        var nextBranch = parseInt(messages[0].branchId) + 1;

        Messages.insert({
          message: $(e.target).siblings('.message-text').text(),
          parentId: $(e.target).parent()[0].id,
          branchId: nextBranch,
          owner: Meteor.userId(),
          username: Meteor.user().emails[0].address.replace(/\@.*$/, ''),
          timestamp: new Date});
        return false;
      }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
