//To add a group to GROUP table
var db = require("../lib/Database"),
    dateHelper = require("../utility/DateHelper");
var ltx = require('ltx');
var GroupMessage = function(params) {

    if (typeof params === "undefined") {
        params = {};
    }

    this.group_id = null;
    if (typeof params.group_id !== 'undefined') {
        this.group_id = params.group_id;
    }
    if (typeof params.stanza !== 'undefined') {
        this.stanza = params.stanza;
    }
    if (typeof params.group_name !== 'undefined') {
        this.group_name = params.group_name;
    }
    if (typeof params.is_owner !== 'undefined') {
        this.is_owner = params.is_owner;
    }
    if (typeof params.status !== 'undefined') {
        this.status = params.status;
    }
    if (typeof params.id_admin !== 'undefined') {
        this.id_admin = params.id_admin;
    }
    if (typeof params.group_created_dtime !== 'undefined') {
        this.group_created_dtime = params.group_created_dtime;
    }
    if (typeof params.group_updated_dtime !== 'undefined') {
        this.group_updated_dtime = params.group_updated_dtime;
    }
    if (typeof params.created_by_user_id !== 'undefined') {
        this.created_by_user_id = params.created_by_user_id;
    }
    if (typeof params.user_id !== 'undefined') {
        this.user_id = params.user_id;
    }
    if (typeof params.is_admin !== 'undefined') {
        this.is_admin = params.is_admin;
    }
    if (typeof params.deleted_dtime !== 'undefined') {
        this.deleted_dtime = params.deleted_dtime;
    }
    if (typeof params.group_type !== 'undefined') {
        this.group_type = params.group_type;
    }
    if (typeof params.group_jid !== 'undefined') {
        this.group_jid = params.group_jid;
    }
    if (typeof params.message_id !== 'undefined') {
        this.message_id = params.message_id;
    }
    if (typeof params.delivered !== 'undefined') {
        this.delivered = params.delivered;
    }
    if (typeof params.id !== 'undefined') {
        this.id = params.id;
    }
    if (typeof params.i !== 'undefined') {
        this.i = params.i;
    }
    if (typeof params.jids !== 'undefined') {
        this.jids = params.jids;
    }

      if (typeof params.is_broadcast !== 'undefined') {
        this.is_broadcast = params.is_broadcast;
    }
}


GroupMessage.prototype.createGroup = function(req, callback) {

    var self = this;
    var dataObject = {};

    if (typeof self.group_id !== 'undefined') {
        dataObject.group_id = self.group_id;
    }
    if (typeof self.group_name !== 'undefined') {
        dataObject.group_name = self.group_name;
    }
    if (typeof self.created_by_user_id !== 'undefined') {
        dataObject.created_by_user_id = self.created_by_user_id;
    }
    if (typeof self.is_deleted !== 'undefined') {
        dataObject.is_deleted = self.is_deleted;
    }
    if (typeof self.group_type !== 'undefined') {
        dataObject.group_type = self.group_type;
    }
    if (typeof self.deleted_dtime !== 'undefined') {
        dataObject.deleted_dtime = self.deleted_dtime;
    }
    if (typeof self.group_jid !== 'undefined') {
        dataObject.group_jid = self.group_jid;
    }
    if (typeof self.group_jid !== 'undefined') {
        dataObject.group_jid = self.group_jid;
    }
    if (typeof self.is_broadcast !== 'undefined') {
        dataObject.is_broadcast = self.is_broadcast;
    }

    dataObject.group_created_dtime = dateHelper.toMySQL(new Date());
    dataObject.group_updated_dtime = dateHelper.toMySQL(new Date());
    dataObject.deleted_dtime = dateHelper.toMySQL(new Date());

    var queryString = "INSERT INTO `group_table` SET ? ";
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            self.message_id = result.insertId;
        }
        callback(err, result);
    });
}

function RosterSplit(jid) {
    var res = jid.split("/");
    return res[0];
}


GroupMessage.prototype.addUsersToGroupIn = function(req, callback) {
    var self = this;
    var dataObject = {};
    var queryString_sel = "select user_id from group_user_table WHERE group_id = "+self.group_id;
    db.mysql.query(queryString_sel, '', function(err, existing_users) {
        console.log(existing_users);
        
        for(var i=0;i<self.user_id.length;i++)
        {
            if(existing_users.indexOf(self.user_id[i].participantJID) == '-1')
            {
                if (typeof self.group_id !== 'undefined') {
                    dataObject.group_id = self.group_id;
                }

                if (typeof self.user_id !== 'undefined') {
                    dataObject.user_id = RosterSplit(self.user_id[i].participantJID );
                }
                if (typeof self.id_admin !== 'undefined') {
                    dataObject.id_admin = self.id_admin;
                }
                if (typeof self.deleted_dtime !== 'undefined') {
                    dataObject.deleted_dtime = self.deleted_dtime;
                }
                if (typeof self.is_owner !== 'undefined') {
                    dataObject.is_owner = self.is_owner;
                }
                if (typeof self.added_dtime !== 'undefined') {
                    dataObject.added_dtime = self.added_dtime;
                }
                if (typeof self.status !== 'undefined') {
                    dataObject.status = self.status;
                }
                if (typeof self.group_jid !== 'undefined') {
                    dataObject.group_jid = self.group_jid;
                }
                dataObject.added_dtime = dateHelper.toMySQL(new Date());
                dataObject.deleted_dtime = dateHelper.toMySQL(new Date());

                var queryString = "INSERT INTO `group_user_table` SET ? ";
                console.log(queryString);
                console.log(dataObject);
                db.mysql.query(queryString, dataObject, function(err, result) {
                    if (!err) {
                        var queryString_sel = "select users.* from users JOIN group_user_table ON users.jid = group_user_table.user_id WHERE group_user_table.group_id = "+self.group_id;
                        db.mysql.query(queryString_sel, '', function(err, result_users) {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                callback(err,result_users);
                            }
                        });
                    }
                    else{
                        console.log(err);
                    }
                });
            }
        }
    });
}

GroupMessage.prototype.updateBroadcastName = function(req){

    var broadCastNameGroup = this.user_id;
    var groupbd_id = this.group_id;
    var queryString_update = "update group_table set group_name='"+broadCastNameGroup+"' where group_id ="+groupbd_id ;

    db.mysql.query(queryString_update, '', function(err, existing_users) {
        if(err){
            console.log("Error Log :: "+err);
        }
    });
}
GroupMessage.prototype.addUsersToGroup = function(req, callback) {
    var self = this;
    var dataObject = {};

    if (typeof self.group_id !== 'undefined') {
        dataObject.group_id = self.group_id;
    }

    if (typeof self.user_id !== 'undefined') {
        dataObject.user_id = self.user_id;
    }
    if (typeof self.id_admin !== 'undefined') {
        dataObject.id_admin = self.id_admin;
    }
    if (typeof self.deleted_dtime !== 'undefined') {
        dataObject.deleted_dtime = self.deleted_dtime;
    }
    if (typeof self.is_owner !== 'undefined') {
        dataObject.is_owner = self.is_owner;
    }
    if (typeof self.added_dtime !== 'undefined') {
        dataObject.added_dtime = self.added_dtime;
    }
    if (typeof self.status !== 'undefined') {
        dataObject.status = self.status;
    }
    if (typeof self.group_jid !== 'undefined') {
        dataObject.group_jid = self.group_jid;
    }
    dataObject.added_dtime = dateHelper.toMySQL(new Date());
    dataObject.deleted_dtime = dateHelper.toMySQL(new Date());

    var queryString = "INSERT INTO `group_user_table` SET ? ";
    console.log(queryString);
    console.log(dataObject);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            var queryString = "select users.* from users JOIN group_user_table ON users.jid = group_user_table.user_id WHERE group_user_table.group_id = "+self.group_id;
            db.mysql.query(queryString, '', function(err, result_users) {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    callback(err,result_users);
                }
            });
        }
        else{
            console.log(err);
        }
    });
}


//-----------------------------------------------------------------------------------------------------

GroupMessage.prototype.removeUsersFromGroup = function(req, callback) {
    var self = this;
    var dataObject = {};

    if (typeof self.group_id !== 'undefined') {
        dataObject.group_id = self.group_id;
    }

    if (typeof self.user_id !== 'undefined') {
        dataObject.user_id = self.user_id;
    }

    var queryString = "DELETE FROM group_user_table WHERE group_id = "+self.group_id+" and user_id = '"+self.user_id+"'";
    console.log(queryString);
    console.log(dataObject);
    db.mysql.query(queryString, dataObject, function(err, result) {
        console.log(err);
        if (!err) {
            //self.message_id = result.insertId;
        }
        callback(err, result);
    });
}


//-----------------------------------------------------------------------------------------------------
GroupMessage.prototype.updateGroupStanza= function(req, callback)
{
  var self = this;
  var dataObject = {};
  if (typeof self.group_id !== 'undefined') {
    dataObject.group_id = self.group_id;
  }
  var final_stanza = db.mysql.escape(self.stanza.toString());
  var queryString = "UPDATE group_table set stanza = "+final_stanza+" where group_id = "+self.group_id;
  console.log(queryString);
  db.mysql.query(queryString, dataObject, function(err, result) {
      console.log(err);
      if (!err) {
          //self.message_id = result.insertId;
      }
      else {
        callback(err, result);
      }
   });
 }

GroupMessage.prototype.setOfflineGroup = function(req, callback)
{
  var self = this;
  var dataObject = {};
  if (typeof self.user_id !== 'undefined') {
    dataObject.user_id = self.user_id;
  }
  var queryString = "UPDATE group_user_table set status = 1 where group_id = "+self.group_id+" AND user_id = '"+self.user_id+"'";
  console.log(queryString);
  db.mysql.query(queryString, dataObject, function(err, result) {
      console.log(err);
      if (!err) {
          //self.message_id = result.insertId;
      }
      //callback(err, result);
  });
}
GroupMessage.prototype.getOfflineGroup = function(req, callback)
{
  var self = this;
  var dataObject = {};
  if (typeof self.user_id !== 'undefined') {
    dataObject.user_id = self.user_id;
  }
  var queryString = "select g.*,gu.* from group_table as g join group_user_table as gu ON gu.group_id = g.group_id where gu.status = 0 AND gu.user_id = '"+self.user_id+"'";
  console.log(queryString);
  db.mysql.query(queryString, dataObject, function(err, result) {
      console.log(err);
      if (!err) {
          //self.message_id = result.insertId;
      }
      callback(err, result, self.jids, self.i);
  });
}
GroupMessage.prototype.updateGroupTable = function(req, callback) {

    var self = this;
    var dataObject = {};

    if (typeof self.group_id !== 'undefined') {
        dataObject.group_id = self.group_id;
    }
    if (typeof self.group_name !== 'undefined') {
        dataObject.group_name = self.group_name;
    }
    if (typeof self.group_created_dtime !== 'undefined') {
        dataObject.group_created_dtime = self.group_created_dtime;
    }
    if (typeof self.group_updated_dtime !== 'undefined') {
        dataObject.group_updated_dtime = self.group_updated_dtime;
    }
    if (typeof self.created_by_user_id !== 'undefined') {
        dataObject.created_by_user_id = self.created_by_user_id;
    }
    if (typeof self.is_deleted !== 'undefined') {
        dataObject.is_deleted = self.is_deleted;
    }
    if (typeof self.deleted_dtime !== 'undefined') {
        dataObject.deleted_dtime = self.deleted_dtime;
    }
    if (typeof self.group_type !== 'undefined') {
        dataObject.group_type = self.group_type;
    }
    if (typeof self.user_id !== 'undefined') {
        dataObject.user_id = self.user_id;
    }
    if (typeof self.admin_id !== 'undefined') {
        dataObject.group_type = self.admin_id;
    }
    if (typeof self.added_dtime !== 'undefined') {
        dataObject.group_type = self.added_dtime;
    }
    if (typeof self.status !== 'undefined') {
        dataObject.group_type = self.status;
    }
    if (typeof self.is_owner !== 'undefined') {
        dataObject.is_owner = self.is_owner;
    }
    if (typeof self.group_jid !== 'undefined') {
        dataObject.group_jid = self.group_jid;
    }
    dataObject.group_created_dtime = dateHelper.toMySQL(new Date());
    dataObject.group_updated_dtime = dateHelper.toMySQL(new Date());
    dataObject.deleted_dtime = dateHelper.toMySQL(new Date());
    //change query to update group table
    var queryString = "UPDATE TABLE `group_table` SET ? ";

    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            self.group_id = result.insertId;
        }
        callback(err, result);
    });

}
GroupMessage.prototype.deleteGroupTable = function(req, callback) {

    var self = this;
    var dataObject = {};

    if (typeof self.group_id !== 'undefined') {
        dataObject.group_id = self.group_id;
    }
    if (typeof self.group_name !== 'undefined') {
        dataObject.group_name = self.group_name;
    }
    if (typeof self.group_created_dtime !== 'undefined') {
        dataObject.group_created_dtime = self.group_created_dtime;
    }
    if (typeof self.group_updated_dtime !== 'undefined') {
        dataObject.group_updated_dtime = self.group_updated_dtime;
    }
    if (typeof self.created_by_user_id !== 'undefined') {
        dataObject.created_by_user_id = self.created_by_user_id;
    }
    if (typeof self.is_deleted !== 'undefined') {
        dataObject.is_deleted = self.is_deleted;
    }
    if (typeof self.deleted_dtime !== 'undefined') {
        dataObject.deleted_dtime = self.deleted_dtime;
    }
    if (typeof self.group_type !== 'undefined') {
        dataObject.group_type = self.group_type;
    }
    if (typeof self.user_id !== 'undefined') {
        dataObject.user_id = self.user_id;
    }
    if (typeof self.admin_id !== 'undefined') {
        dataObject.group_type = self.admin_id;
    }
    if (typeof self.added_dtime !== 'undefined') {
        dataObject.group_type = self.added_dtime;
    }
    if (typeof self.status !== 'undefined') {
        dataObject.group_type = self.status;
    }

    dataObject.group_created_dtime = dateHelper.toMySQL(new Date());
    dataObject.group_updated_dtime = dateHelper.toMySQL(new Date());
    dataObject.deleted_dtime = dateHelper.toMySQL(new Date());

    var queryString = "INSERT INTO `group_table` SET ? ";
    //change query to delete participant
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            self.group_id = result.insertId;
        }
        callback(err, result);
    });

}
GroupMessage.prototype.updateGroupJid = function(req, callback) {
    var self = this;
    var dataObject = {};
    var where = [];

    var queryString = "update group_table set group_jid = '"+self.group_jid+"' WHERE group_id = "+self.group_id;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if(err)
        {
            console.log(err);
        }
    });
}
GroupMessage.prototype.getGroupinfo = function(req, callback) {

    var self = this;
    var dataObject = {};
    var where = [];
    var queryString = "select group_table.*,users.*,group_user_table.* from users JOIN group_user_table ON users.jid = group_user_table.user_id JOIN group_table ON group_user_table.group_id = group_table.group_id WHERE group_user_table.group_id = "+self.group_id;
    console.log(queryString);
    console.log(self.group_id+'<<<<<<<');
    var i = self.i;
    var group_name = self.group_name;
    var group_jid = self.group_jid;
    db.mysql.query(queryString, dataObject, function(err, result) {
      console.log(result);
      console.log(err);
      console.log(i);
      callback(err, result, i, group_name, group_jid, self.is_broadcast);
    });

}
GroupMessage.prototype.getGroupuserinfoIn = function(req, callback) {

    var self = this;
    var dataObject = {};
    var where = [];
    var queryString = "select * from users where jid IN ("+self.user_id+")";
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
      console.log(result);
      console.log(err);
      callback(err, result);
    });

}
//--------mrk
GroupMessage.prototype.getGroupuserinfo = function(req, callback) {

    var self = this;
    var dataObject = {};
    var where = [];
    var queryString = "select * from users where jid = '"+self.user_id+"'";
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
      console.log(result);
      console.log(err);
      callback(err, result);
    });

}
GroupMessage.prototype.getGroupUsers = function(req, callback) {

    var self = this;
    var where = [];
    var dataObject = [];
    var group_id = self.group_id;
    // if (typeof group_id !== "undefined") {
    //   where.push("group_id = ?");
    //   dataObject.push(group_id);
    // }
    where = " WHERE group_id="+group_id;

    var queryString = "select user_id from group_user_table"+where;
    console.log(queryString);
    console.log('grp id: '+group_id);
    db.mysql.query(queryString, dataObject, function(err, result) {
      if(!err)
        callback(err, result);
      else
        console.log(err);
    });
} 
GroupMessage.prototype.getGroupMessageStatusInfo = function(req, callback) {

    var self = this;
    var dataObject = [];
    var where = [];
    var queryString = "select ms.is_read,ms.readTime,ms.receivedTime,ms.received,ms.message_id,u.user_id,u.first_name,u.last_name from message_status as ms join users as u on (ms.user_id = u.jid) where message_id = "+self.message_id;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if(err)
        {
            console.log("The error is");
            console.log(err);
        }
        else {
            callback(err, result);
        }
    }); 
}
GroupMessage.prototype.exitGroup = function(req, callback) {
    var self = this;
    var dataObject = [];
    if (typeof self.group_id !== 'undefined') {
        dataObject.push(self.group_id);
    }
    if (typeof self.user_id !== 'undefined') {
        dataObject.push(self.user_id);
    }
    var where = " WHERE group_id = ? AND user_id = ?";

    var queryString_sel = "select is_owner from group_user_table "+where;
    db.mysql.query(queryString_sel, dataObject, function(err, result) {
        if(!err)
        {
            var queryString_del = "DELETE from group_user_table "+where;
            console.log('del');
            db.mysql.query(queryString_del, dataObject, function(err, result_del) {
                if(!err){
                    console.log(result[0]);
                    if(result[0])
                    {
                        var queryString_update = "update group_user_table set is_owner = 1 where group_id = "+self.group_id+" LIMIT 1";
                        db.mysql.query(queryString_update, dataObject, function(err, result_up) {
                            // Owner exited - send back who is the new owner
                            if(err)
                            {
                                console.log(err);
                            }
                            else {
                                var final_query = "select u.* from group_user_table as g join users as u on g.user_id = u.jid where g.is_owner = 1 and g.group_id = "+self.group_id;
                                db.mysql.query(final_query, '', function(err, result_final) {
                                    //callback(err,result_final); call back after update
                                    if(result_final && result_final[0])
                                    {
                                        var final_query_update = "update group_user_table set id_admin = '"+result_final[0].jid+"' where group_id = "+self.group_id;
                                        db.mysql.query(final_query_update, '', function(err, result_updated) {
                                            callback(err,result_final);
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        callback(err, ''); // Owner did not exit
                    }
                }
                else
                    console.log(err);
            });
        }
        else
            console.log(err);
    });
}
GroupMessage.prototype.offlineGroupSave = function(req, callback) {

    var self = this;
    var dataObject = {};

    if (typeof self.user_id !== 'undefined') {
        dataObject.user_id = self.user_id;
    }
    if (typeof self.stanza !== 'undefined') {
        dataObject.stanza = self.stanza;
    }
    if (typeof self.delivered !== 'undefined') {
        dataObject.delivered = self.delivered;
    }

    var queryString = "INSERT INTO `group_offline` SET ? ";
    console.log(queryString);
    console.log(dataObject);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            //callback(err,result_users);
        }
        else{
            console.log(err);
        }
    });
}
GroupMessage.prototype.offlineGroupGet = function(req, callback) {

    var self = this;
    var dataObject = [];

    if (typeof self.user_id !== 'undefined') {
        dataObject.push(self.user_id);
    }
    if (typeof self.delivered !== 'undefined') {
        dataObject.push(self.delivered);
    }

    var queryString = "select * from `group_offline` where user_id = ? AND delivered = ?";
    console.log(queryString);
    console.log(dataObject);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            callback(err,result);
        }
        else{
            console.log(err);
        }
    });
}
GroupMessage.prototype.offlineGroupUpdate = function(req, callback) {

    var self = this;
    var dataObject = [];

    if (typeof self.delivered !== 'undefined') {
        dataObject.push(self.delivered);
    }
    if (typeof self.id !== 'undefined') {
        dataObject.push(self.id);
    }
    var queryString = "update `group_offline` SET delivered = ? where id = ?";
    console.log(queryString);
    console.log(dataObject);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            //callback(err,result);
        }
        else{
            console.log(err);
        }
    });
}
exports.GroupMessage = GroupMessage;