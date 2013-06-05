// both client and server code here

// function getHashtag (message) {
//   hashtag = message.split(/[#]+/).pop().toLowerCase()
//   if !(message.split(/[#]+/).length === 1) {
//     return hashtag;
//   }
//   else {
//     return null;
//   }
// }

// function getTopic (message) {
//   words = message.split(" ");
//   for (var i=0;i<words.length;i++) { 
//     if ($.inArray(words[i], topics)) { //unsure of how list of topics are being stored: using topics variable for now, should throw some error
//       return words[i];
//       foundTopic = true;
//       break;
//     }
//     if !(foundTopic) {
//       return null;
//     }
//   }
// }

if (Meteor.isClient) {

  Template.users.email = function(id) {
    return Meteor.users.find({_id: id}).emails[0].address;
  }

  Template.users.users = function() {
      return Meteor.users.find({}).fetch();
  }

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

  Template.conversation.numberBranches = function() {
    // return index of last branch
    var messages = Messages.find({}, {sort: [["branchId", "desc"]]}).fetch();
    var lastBranchIndex = parseInt(messages[0].branchId);
    return lastBranchIndex + 1;
  }

  Template.conversation.isMine = function(owner) {
    return owner === Meteor.userId();
  }

  Template.user.user = function() {
    if(Meteor.user()) {
      return Meteor.user().username;
    }
    
  };


  Template.logout.events({
    'click #sign-out': function() {
      Meteor.logout();
      return false;
    }
  });

  Template.conversation.events({
    'keyup .message': function(e) {
      if (e.keyCode === 13) {
        if (Meteor.user() ) {
          console.log('putting stuff in database in keyup .message');
          Messages.insert({message: $(e.target).val(),
            //parentId: $(e.target).prev()[0].id,
            parentId: $(e.target).parent().prev()[0].id,
            branchId: $(e.target).parent().parent().data('branchid'),
            owner: Meteor.userId(),
            //username: Meteor.user().emails[0].address.replace(/\@.*$/, ''),
            username: Template.user.user(),
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
          //username: Meteor.user().emails[0].address.replace(/\@.*$/, ''),
          username: Template.user.user(),
          timestamp: new Date});
        $message.val('');
      } else {
        alert('you must be logged in to do this!')
      }
      return false;
    },

    'click .branch-link': function(e) {
        // optimize this so we don't have to do another lookup
        // don't add one because number branches returns lastBranchIndex + 1
        var nextBranch = Template.conversation.numberBranches();

        Messages.insert({
          message: $(e.target).siblings('.message-text').text(),
          parentId: $(e.target).parent()[0].id,
          branchId: nextBranch,
          owner: Meteor.userId(), // 'true owner' of this duplicate is brancher, not necessarily orig message author
          // owner: $(e.target).siblings('.owner').val()       <-- this is optimal, but permissions don't allow it
          username: $(e.target).siblings('.username').text(), // copy over username instead of do lookup
          timestamp: new Date});
        return false;
      }
    });

Template.register.events({
  'click #create-account, keyup #account-email, keyup #account-name, keyup #account-password' : function(e, t) {
    if (e.keyCode === 13 || e.type === 'click') {
      var email = t.find('#account-email').value
      , password = t.find('#account-password').value
      , fullname = t.find('#account-name').value;
          // Trim and validate the input

          Accounts.createUser({email: email, password : password, username: fullname}, function(err){
            if (err) {
              console.log('gone pooped!');
              // Inform the user that account creation failed
            } else {
              console.log('account made');
              $('#account-email').val('');
              $('#account-name').val('');
              $('#account-password').val('');
              $('.register-form').css("display", "none");

              // Success. Account has been created and the user
              // has logged in successfully. 
            }

          });
        }
        return false;
      }
    });


Template.login.events({

  'click #login-button, keyup #login-email, keyup #login-password' : function(e, t){
        // retrieve the input field values
        if (e.keyCode === 13 || e.type === 'click') {
          var email = t.find('#login-email').value
          , password = t.find('#login-password').value;

            // Trim and validate your fields here.... 

            // If validation passes, supply the appropriate fields to the
            // Meteor.loginWithPassword() function.
            Meteor.loginWithPassword(email, password, function(err){
              if (err) {
                console.log('cool story bro, try again');
                //Notifications.insert({text: 'Error Logging In!', type: 'login-error', ttl: 3});
              }
              // The user might not have been found, or their passwword
              // could be incorrect. Inform the user that their
              // login attempt has failed. 
              else {
                console.log('you\'ve earn an Internet logged in');

                //Notifications.insert({text: 'Login Success!', type: 'login-success', ttl: 1});
              }
            });
          }
          return false; 
        }
      });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
