/**
 * Table : Driver
 */
var db = require("../lib/Database"),
    dateHelper = require("../utility/DateHelper");

var Message = function(params) {

	if (typeof params === "undefined") {
		params = {};
	}
  
  this.message_id = null;
  if (typeof params.message_id !== 'undefined') {
  		this.message_id = params.message_id;
  }
  if (typeof params.to_user !== 'undefined') {
      this.to_user = params.to_user;
  }
  if (typeof params.stanza !== 'undefined') {
      this.stanza = params.stanza;
  }
  if (typeof params.message !== 'undefined') {
      this.message = params.message;
  }
  if (typeof params.to_user !== 'undefined') {
      this.to_user = params.to_user;
  }
  if (typeof params.from_user !== 'undefined') {
      this.from_user = params.from_user;
  }
  if (typeof params.is_delivered !== 'undefined') {
      this.is_delivered = params.is_delivered;
  }
  if (typeof params.is_read !== 'undefined') {
      this.is_read = params.is_read;
  }
  if (typeof params.delay !== 'undefined') {
      this.delay = params.delay;
  }
  if (typeof params.jid_from !== 'undefined') {
      this.jid_from = params.jid_from;
  }
  if (typeof params.jid_to !== 'undefined') {
      this.jid_to = params.jid_to;
  }
  if (typeof params.jids !== 'undefined') {
      this.jids = params.jids;
  }
  if (typeof params.group_id !== 'undefined') {
      this.group_id = params.group_id;
  }
  if (typeof params.message_delivered_dtime !== 'undefined') {
      this.message_delivered_dtime = params.message_delivered_dtime;
  }
  if (typeof params.message_read_dtime !== 'undefined') {
      this.message_read_dtime = params.message_read_dtime;
  }
  if (typeof params.message_updated_dtime !== 'undefined') {
      this.message_updated_dtime = params.message_updated_dtime;
  }
  if (typeof params.message_created_dtime !== 'undefined') {
      this.message_created_dtime = params.message_created_dtime;
  }

  if (typeof params.received !== 'undefined') {
      this.received = params.received;
  }
  if (typeof params.read !== 'undefined') {
      this.read = params.read;
  }
  if (typeof params.message_id !== 'undefined') {
      this.message_id = params.message_id;
  }
  if (typeof params.user_id !== 'undefined') {
      this.user_id = params.user_id;
  }
  if (typeof params.sentTime !== 'undefined') {
      this.sentTime = params.sentTime;
  }
  if (typeof params.sentTimeMicro !== 'undefined') {
      this.sentTimeMicro = params.sentTimeMicro;
  }
  if (typeof params.i !== 'undefined') {
      this.i = params.i;
  }
  if (typeof params.self !== 'undefined') {
      this.self = params.self;
  }
  if (typeof params.readConfirm !== 'undefined') {
      this.readConfirm = params.readConfirm;
  }
  if (typeof params.receivedConfirm !== 'undefined') {
      this.receivedConfirm = params.receivedConfirm;
  }
};


Message.prototype.add = function(req, callback) {

    var self = this;
    var dataObject = {};

    if (typeof self.stanza !== 'undefined') {
        dataObject.stanza = self.stanza;
    }
    if (typeof self.message !== 'undefined') {
        dataObject.message = self.message;
    }
    if (typeof self.to_user !== 'undefined') {
        dataObject.to_user = self.to_user;
    }
    if (typeof self.from_user !== 'undefined') {
        dataObject.from_user = self.from_user;
    }
    if (typeof self.delay !== 'undefined') {
        dataObject.delay = self.delay;
    }
    if (typeof self.group_id !== 'undefined') {
        dataObject.group_id = self.group_id;
    }
    var sent_date = new Date(parseInt(self.sentTime));
    console.log(sent_date);
    console.log('during add');
    if (typeof self.sentTime !== 'undefined') {
        dataObject.sentTime = dateHelper.toMySQL(sent_date);
    }
    if (typeof self.sentTime !== 'undefined') {
        dataObject.sentTimeMicro = self.sentTime;
    }
    dataObject.message_created_dtime = dateHelper.toMySQL(new Date());
    dataObject.message_updated_dtime = dateHelper.toMySQL(new Date());

    var queryString = "INSERT INTO `message` SET ? ";

    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            self.message_id = result.insertId;
        }
        console.log(queryString);
        console.log('msg table');
        callback(err, result);
    });

};
function groupSplit(gid) {
    var res = gid.split("@");
    return res[0];
}
Message.prototype.delete = function(req, callback) {

    var self = this;
    var dataObject = {};
    var queryString = "delete from message, message_status using message join message_status "
    +"on message.message_id = message_status.message_id where message.message_id = "+self.message_id;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if(err)
        {
          console.log(err);
        }
        console.log('msg table');
    });
};
Message.prototype.addStatus = function(req, callback) {

    var self = this;
    var dataObject = {};

    if (typeof self.message_id !== 'undefined') {
        dataObject.message_id = self.message_id;
    }
    if (typeof self.is_delivered !== 'undefined') {
        dataObject.received = self.is_delivered;
    }
    if (typeof self.is_read !== 'undefined') {
        dataObject.is_read = self.is_read;
    }
    if (typeof self.to_user !== 'undefined') {
        dataObject.user_id = self.to_user;
    }
    if (typeof self.delay !== 'undefined') {
        dataObject.delay = self.delay;
    }

    dataObject.readTime = '0';
    dataObject.receivedTime = '0';

    var queryString = "INSERT INTO `message_status` SET ?";

        console.log(queryString);
        console.log('msg status table');
        db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            //callback(err, result);
        }
        else{
          console.log(err);
        }
    });

};
Message.prototype.update = function(req, callback) {

    var self = this;
    var dataObject = [];
    var where = [];
    if (typeof self.stanza !== 'undefined') {
        dataObject.push(self.stanza);
    }
    console.log('update method');
    console.log(self.receivedConfirm);

    if(self.receivedConfirm == 1)
    {
        var queryString = "update message_status set receivedConfirm = 1 where message_id = "+self.message_id+" AND user_id = '"+self.from_user+"'";
        console.log(queryString);
        db.mysql.query(queryString, dataObject, function(err, result) {
            if (!err) {
                // no cb
            } else {
                console.log(err);
            }
        });
    }
    if(self.readConfirm == 1 )
    {
        var queryString = "update message_status set readConfirm = 1 where message_id = "+self.message_id+" AND user_id = '"+self.from_user+"'";
        console.log(queryString);
        db.mysql.query(queryString, dataObject, function(err, result) {
            if (!err) {
                // no cb
            } else {
                console.log(err);
            }
        });
    }
    if(self.readConfirm == 1 || self.receivedConfirm == 1){
        // Dont update
    }
    else 
    {
      if(self.message_delivered_dtime)
      {
          var queryString = "update message_status set received = "+self.is_delivered+", is_read = "+self.is_read+", receivedTime = '"+self.message_delivered_dtime+"', readTime = '"+self.message_read_dtime+"' where message_id = "+self.message_id+" AND user_id = '"+self.to_user+"'";

              console.log(queryString);
              console.log(dataObject);
              console.log('msg update status table')
          db.mysql.query(queryString, dataObject, function(err, result) {
              if (!err) {
                  //callback(err, result);
                  if(self.stanza)
                  {
                    var final_stanza = db.mysql.escape(self.stanza.toString());
                    console.log(self.stanza.toString());
                    console.log('self.stanza');
                    var queryString_update = "update message set stanza = "+final_stanza+" where message_id = "+self.message_id;
                    console.log(queryString);
                    if(db)
                    {
                      if(db.mysql)
                      {
                        if(db.mysql.query)
                        {
                          db.mysql.query(queryString_update, '', function(err, result) {
                            if (err) {
                                console.log(err);
                            }
                          });
                        }
                      }
                    }
                  }
              } else {
                  console.log(err);
              }
          });
      }
    }
};
Message.prototype.getRosterUserfln= function(req, callback) {

    var self = this;
    var user = self.from_user;
    var where = [];
    var dataObject = [];
    if (typeof user !== "undefined") {
      where.push("jid = ?");
      dataObject.push(user);
    }
    where = " WHERE " + where.join(" AND ");
    var queryString = "SELECT * FROM users "+ where; //To add message_id and the rest of the things
    console.log(queryString);
    console.log(user);
    db.mysql.query(queryString, dataObject, function(err, result) {
      callback(err, result);
    });
};
Message.prototype.getRosterUsers= function(req, callback) {
  var self = this;
  var user = self.from_user;
  console.log("User in getRosterUsers:: "+user);
  var where = [];
  var dataObject = [];
  if (typeof user !== "undefined") {
    where.push("m.from_user = ?");
    dataObject.push(user);
  }
  if (typeof user !== "undefined") {
    where.push("m.to_user = ?");
    dataObject.push(user);
  }
  where = " WHERE " + where.join(" OR ");
  var group_by = " GROUP BY m.from_user, m.to_user,u.first_name,u.last_name";
  
  var queryString = "SELECT m.from_user, m.to_user,u.first_name,u.last_name FROM message as m JOIN users as u ON "+ 
  "(u.jid = m.to_user OR u.jid = m.from_user) AND u.jid <>  '"+user+"'"+
  where + group_by;
  console.log(queryString);
  db.mysql.query(queryString, dataObject, function(err, result) {
    if(!err)
    {
        var queryString = "SELECT g.group_name as first_name, g.group_jid as group_jid from group_table as g JOIN group_user_table as gu ON g.group_jid = gu.group_jid where gu.user_id = '"+user+"' GROUP BY g.group_name, g.group_jid";
        console.log(queryString);
        
        db.mysql.query(queryString, dataObject, function(err, result_new) {
            var queryString_fields = "SELECT * from user_fields where user_id = '"+groupSplit(user)+"'";
            console.log(queryString_fields);
            db.mysql.query(queryString_fields, dataObject, function(err, result_fields) {
              if(err)
                console.log(err);
              console.log('$$$$$$ Money $$$$$$');
              console.log(result);
              console.log(result_new);
              var final_result = result.concat(result_new);
              console.log(final_result);
              console.log('$$$$$$ Money $$$$$$');
              callback(err, final_result, result_fields);
            });
        });
    }
    else {
        console.log(err);
    }  
  });
};


//-------

Message.prototype.getRosterUsersForStatus= function(req, callback) {
  var self = this;
  var user = self.from_user;
  var where = [];
  var dataObject = [];
  if (typeof user !== "undefined") {
    where.push("m.from_user = ?");
    dataObject.push(user);
  }
  if (typeof user !== "undefined") {
    where.push("m.to_user = ?");
    dataObject.push(user);
  }
  where = " WHERE " + where.join(" OR ");
  var group_by = " GROUP BY m.from_user, m.to_user,u.first_name,u.last_name";
  
  var queryString = "SELECT m.from_user, m.to_user,u.first_name,u.last_name FROM message as m JOIN users as u ON "+ 
  "(u.jid = m.to_user OR u.jid = m.from_user) AND u.jid <>  '"+user+"'"+
  where + group_by;
  console.log(queryString);
  db.mysql.query(queryString, dataObject, function(err, result) {
    /*if(!err)
    {
        var queryString = "SELECT g.group_name as first_name, g.group_jid as group_jid from group_table as g JOIN group_user_table as gu ON g.group_jid = gu.group_jid where gu.user_id = '"+user+"' GROUP BY g.group_name, g.group_jid";
        console.log(queryString);
        db.mysql.query(queryString, dataObject, function(err, result_new) {
            console.log('$$$$$$ Money $$$$$$');
            console.log(result);
            console.log(result_new);
            var final_result = result.concat(result_new);
            console.log(final_result);
            console.log('$$$$$$ Money $$$$$$');
            callback(err, final_result);
        });
    }*/
    if(!err)
     callback(err,result,self.jids);

    else {
        console.log(err);
    }  
  });
};
//-------
Message.prototype.getGroupsWhereUserIsPresent = function(req, callback) {
  var self = this;
  var user = self.from_user;
  var where = [];
  var dataObject = [];
  
  var queryString = "select group_jid from group_user_table where user_id = '"+self.from_user+"'";
  console.log(queryString);
  db.mysql.query(queryString, dataObject, function(err, result) {
    if(!err)
    {
        callback(err, result,self.stanza,self.to_user,self.from_user,self.message,self.message_id,self.received,self.receivedTime,self.read,self.readTime,self.sentTimeMicro,self.senderid,self.sendername,self.group_id);
    }
    else {
        console.log(err);
    }  
  });
};
Message.prototype.getCronMessages = function(req, callback) {

    var self = this;
    var search_key = self.from_user;
    var user = self.from_user;
    var where = [];
    var dataObject = [];
    if (typeof search_key !== "undefined") {
      dataObject.push(user);
    }
    where = " WHERE ms.user_id = ? AND ms.received = 1";

    var queryString = "SELECT m.*,ms.* FROM message_status as ms join message as m ON m.message_id = ms.message_id join users as u ON u.jid = ms.user_id "+ where;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
      if(err)
      {
        console.log(err);
      }
      else {
        callback(err, result,self.i);
      }
    });
};
Message.prototype.getCronMessagesStatus = function(req, callback) {

    var self = this;
    var search_key = self.from_user;
    var user = self.from_user;
    var where = [];
    var dataObject = [];
    if (typeof search_key !== "undefined") {
      dataObject.push(user);
    }
    where = " WHERE m.from_user = ? AND (((ms.receivedConfirm IS NULL OR ms.receivedConfirm <> 1) AND ms.received = 2) OR ((ms.readConfirm IS NULL  OR ms.readConfirm <> 1) AND ms.is_read = 1))";

    var queryString = "SELECT m.*,ms.* FROM message_status as ms join message as m ON m.message_id = ms.message_id join users as u ON u.jid = ms.user_id "+ where;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
      if(err)
      {
        console.log(err);
      }
      else {
        callback(err, result,self.i);
      }
    });
};

Message.prototype.getSearchContact = function(req, callback) {

    var self = this;
    var search_key = self.stanza;
    var user = self.from_user;
    var where = [];
    var dataObject = [];
    if (typeof search_key !== "undefined") {
      where.push("first_name LIKE ? OR last_name LIKE ?");
      dataObject.push('%'+search_key+'%');
      dataObject.push('%'+search_key+'%');
    }
    if (typeof user !== "undefined") {
      where.push("jid <> ?");
      dataObject.push(user);
    }
    where = " WHERE " + where.join(" AND ");

    var queryString = "SELECT * FROM `users` "+ where;
    console.log(queryString);
    console.log(search_key);  
    db.mysql.query(queryString, dataObject, function(err, result) {
      callback(err, result);
    });
};

Message.prototype.getRosterMessages= function(req, callback) {

    var self = this;
    var user = self.from_user;
    var from_date = self.message_delivered_dtime;
    var to_date = self.message_read_dtime;
    var where = [];
    var dataObject = [];
    if (typeof user !== "undefined") {
      where.push("from_user = ?");
      dataObject.push(user);
    }
    if (typeof user !== "undefined") {
      where.push("to_user = ?");
      dataObject.push(user);
    }
    if (from_date == '' && to_date == '') {
      var date = new Date();
      date.setDate(date.getDate() - 10);
      MyDateString = date.getFullYear() + '-'
             + ('0' + (date.getMonth()+1)).slice(-2) + '-'
             + ('0' + date.getDate()).slice(-2) + ' 00:00:00';
      where_next = " AND m.sentTime > '"+MyDateString+"'";
    }
    var group_by = " GROUP BY m.stanza,m.message,m.group_id, m.to_user, m.from_user,m.sentTime,m.sentTimeMicro ORDER BY m.sentTime;";
    where = " WHERE (from_user = '"+user+"' OR to_user = '"+user+"' OR ms.user_id = '"+user+"')";
    var queryString = "SELECT m.stanza,m.message,m.group_id,m.to_user,m.from_user,m.sentTime,m.sentTimeMicro,ms.* FROM message as m join message_status as ms ON m.message_id = ms.message_id left join group_user_table as gu ON gu.group_jid = m.to_user left join group_table as g ON g.group_jid = gu.group_jid"+ where+where_next+group_by;
    console.log(queryString);
    console.log('User:'+user);
    db.mysql.query(queryString, dataObject, function(err, result) {
      var queryString_grp = "select group_jid from group_user_table where user_id = '"+user+"'";
      db.mysql.query(queryString_grp, [], function(err, result_group) {
         callback(err, result, result_group);
      });
    });
};
Message.prototype.getRosterMessagesDate= function(req, callback) {
    var self = this;
    var user = self.from_user;
    var from_date = self.message_delivered_dtime;
    var to_date = self.message_read_dtime;
    var where = '';
    var dataObject = [];

    var fromdate = from_date+' 00:00:00';
    var todate = to_date+' 00:00:00';

    if (from_date != '' && to_date != '') {
      var where_date = " m.sentTime > '"+fromdate+"' AND m.sentTime < '"+todate+"'";
      var where_checker_date = " m.sentTime < '"+fromdate+"'";
    }
    var group_by = " GROUP BY m.stanza,m.message, m.group_id, m.to_user, m.from_user,m.sentTime,m.sentTimeMicro ORDER BY m.sentTime;";
    //where = " WHERE (from_user = '"+user+"' OR to_user = '"+user+"' OR ms.user_id = '"+user+"')";

    where = " WHERE ((from_user = '"+self.jid_to+"' AND to_user = '"+self.jid_from+"') AND  "+where_date+") OR "+
    " ((from_user = '"+self.jid_from+"' AND to_user = '"+self.jid_to+"') AND  "+where_date+")";

    var where_checker = " WHERE ((from_user = '"+self.jid_to+"' AND to_user = '"+self.jid_from+"') AND  "+where_checker_date+") OR "+
    " ((from_user = '"+self.jid_from+"' AND to_user = '"+self.jid_to+"') AND  "+where_checker_date+")";

    var queryString = "SELECT m.stanza,m.message,m.group_id,m.to_user,m.from_user,m.sentTime,m.sentTimeMicro,ms.* FROM message as m join message_status as ms ON m.message_id = ms.message_id left join group_user_table as gu ON gu.group_jid = m.to_user left join group_table as g ON g.group_jid = gu.group_jid"+ where+group_by;
    var queryString_checker = "SELECT count(m.message_id) as count FROM message as m join message_status as ms ON m.message_id = ms.message_id left join group_user_table as gu ON gu.group_jid = m.to_user left join group_table as g ON g.group_jid = gu.group_jid"+ where_checker;
    console.log(queryString);
    console.log(queryString_checker);
    console.log('queryString_checker');
    console.log('User dateee:'+user);
    db.mysql.query(queryString, dataObject, function(err, result) {
        db.mysql.query(queryString_checker, dataObject, function(err, checker) {
          callback(err, result, checker);
        });
    });
};

Message.prototype.getOfflineMessages = function(req, callback) {

  	var self = this;
  	var where = [];
  	var dataObject = [];

   	if (typeof self.user !== "undefined") {
   		where.push("to_user = ?");
   		dataObject.push(self.to_user);
   	}

  	where = " WHERE (m.delay = 1 and m.to_user = '"+self.to_user+"') OR (ms.user_id = '"+self.to_user+"' AND ms.delay = 1)";
    var queryString = "SELECT * FROM `message` as m join message_status as ms ON m.message_id = ms.message_id "+ where;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
         
         if(!err)
         {
            callback(err, result);
            var queryString_update = "update message set delay = 0 where to_user = '"+self.to_user+"'";
            db.mysql.query(queryString_update, dataObject, function(err, result) {
              if(err)
              {
                console.log(err);
              }
            });
            var queryString_update_s = "update message_status set delay = 0 where user_id = '"+self.to_user+"'";
            db.mysql.query(queryString_update_s, dataObject, function(err, result) {
              if(err)
              {
                console.log(err);
              }
            });
            console.log(queryString_update);
            console.log(queryString_update_s);
         }
         else {
          console.log(err);
         }
    });


};

exports.Message = Message;
