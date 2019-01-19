using('System.Network.HTTP.WebPage');
using('Emerge.Business.Layout.MyBusinessLayout');

class MyBusinessSignUp extends WebPage {
  static get path(){
    return "/sign-up";
  }

  ctor(req, res){
    this.ldap = System.getModule('ldapjs');
    this.mongo = System.getModule('/stack/models/mongo');
    let layout = new MyBusinessLayout();
    this.html = layout.html;
    this.init(req, res, this.html);
    this.render();
  }

  onPost(){
    let subject = 'cn=admin,dc=desktop,dc=expert',
        credentials = 'Rpclay3093$',
        user = {
          firstname		: this.req.post.firstname,
          lastname		: this.req.post.lastname,
          email			: this.req.post.email,
          password		: this.req.post.password
        },
        cb = function(error){
          console.log(arguments); 
        };
    this.addEntry(subject, credentials, user, cb);
  }

  addFormToMondoDB(){
    this.async = true;
    let form = {
      post: this.req.post,
      headers: this.req.headers,
      dateCreated: Date.now()
    };

    this.mongo.db.collections.insert('forms', form, (err, result) => {
      this.async = false;
      this.httpResponse = [err, result];
      this.onComplete();
    }); 
  }

  addEntry(subject, credentials, user, cb){
    /*
      # Entry 1: cn=russell.c.page@gmail.com,cn=emerge.business,ou=people,dc=de...
      dn: cn=russell.c.page@gmail.com,cn=emerge.business,ou=people,dc=desktop,dc=expert
      cn: russell.c.page@gmail.com
      gidnumber: 501
      givenname: Russell
      homedirectory: /home/users/russell.c.page@gmail.com
      objectclass: inetOrgPerson
      objectclass: posixAccount
      objectclass: top
      sn: Page
      uid: russell.c.page@gmail.com
      uidnumber: 1001
      userpassword: {MD5}/cBmWbhuNRbXSvrqekjqPg==
  	*/

    var client = this.ldap.createClient({
      url: 'ldap://localhost:389'
    });

    let email = user.email,
        firstname = user.firstname,
        lastname = user.lastname,
        password = user.password,
        entryID = 'cn=' + email + ',cn=emerge.business,ou=people,dc=desktop,dc=expert',
        entry = {
          cn: email,
          gidnumber: 501,
          givenname: firstname,
          homedirectory: '/home/users/'+email,
          objectclass: ['inetOrgPerson','posixAccount', 'top'],
          sn: lastname,
          uid: email,
          uidnumber: 1001,
          userpassword: password,
        };
	//console.log(entryID, entry);
    client.bind(subject, credentials, (err, res) => {
      let authorized = false;
      if(err) {
        if(cb) cb(err);
      }
      else {
        //subject is authorized
        authorized = true;
        client.add(entryID, entry, addError => {
          if(addError) {
            if(cb) cb(addError, 'could not add entry ' + entryID, entry);
          }
          //close connection
          client.unbind(unbindError => {
            if(unbindError) {
              if(cb) cb(unbindError);
            }
          });
        });
      }
    });


  }
}




