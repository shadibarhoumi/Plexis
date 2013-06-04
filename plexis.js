// both client and server code here

if (Meteor.isClient) {

  Template.chat.chat = function() {
    return Messages.find({}).fetch();
  };

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

  Template.chat.events({
    'click #submit, keyup #message': function(e) {
      if (e.keyCode === 13 || e.type === 'click') {
        message = $('#message').val()
        Messages.insert({message: message, owner: Meteor.userId(), username: Meteor.user().emails[0].address.replace(/\@.*$/, '')});
        $('#message').val('');
      }
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
