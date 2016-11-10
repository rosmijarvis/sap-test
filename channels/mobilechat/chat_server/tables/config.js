/**
 * Table : Driver
 */
 


var db = require("../lib/Database"),
    dateHelper = require("../utility/DateHelper");

var Config = function(params) {

	if (typeof params === "undefined") {
		params = {};
	}
  //dashboard page start
  this.id = null;
  if (typeof params.id !== 'undefined') {
  		this.id = params.id;
  }
  if (typeof params.user !== 'undefined') {
      this.user = params.user;
  }
  this.password_expiry_period = null;
  if (typeof params.password_expiry_period !== 'undefined') {
        this.password_expiry_period = params.password_expiry_period;
  }
  this.otp_expiry_period = null;
  if (typeof params.otp_expiry_period !== 'undefined') {
        this.otp_expiry_period = params.otp_expiry_period;
  }
  this.message_expiry_period = null;
  if (typeof params.message_expiry_period !== 'undefined') {
        this.message_expiry_period = params.message_expiry_period;
  }
  this.lock_out_time = null;
  if (typeof params.lock_out_time !== 'undefined') {
        this.lock_out_time = params.lock_out_time;
  }
  this.number_of_login_attempts = null;
  if (typeof params.number_of_login_attempts !== 'undefined') {
        this.number_of_login_attempts = params.number_of_login_attempts;
  }
  this.number_of_password_recovery_requests = null;
  if (typeof params.number_of_password_recovery_requests !== 'undefined') {
        this.number_of_password_recovery_requests = params.number_of_password_recovery_requests;
  }
  this.time_range = null;
  if (typeof params.time_range !== 'undefined') {
        this.time_range = params.time_range;
  }
  this.log_off_time = null;
  if (typeof params.log_off_time !== 'undefined') {
        this.log_off_time = params.log_off_time;
  }
  if (typeof params.message_see_more !== 'undefined') {
        this.message_see_more = params.message_see_more;
  }
  
  //dashboard page end

  //user management page start
  this.user_id = null;
  if (typeof params.user_id !== 'undefined') {
        this.user_id = params.user_id;
  }
  if (typeof params.can_broadcast !== 'undefined') {
        this.can_broadcast = params.can_broadcast;
  }
  this.imei_number = null;
  if (typeof params.imei_number !== 'undefined') {
        this.imei_number = params.imei_number;
  }
  this.first_name = null;
  if (typeof params.first_name !== 'undefined') {
        this.first_name = params.first_name;
  }
  this.last_name = null;
  if (typeof params.last_name !== 'undefined') {
        this.last_name = params.last_name;
  }
  this.jid = null;
  if (typeof params.jid !== 'undefined') {
        this.jid = params.jid;
  }
  this.mail = null;
  if (typeof params.mail !== 'undefined') {
        this.mail = params.mail;
  }
  this.mobile = null;
  if (typeof params.mobile !== 'undefined') {
        this.mobile = params.mobile;
  }
  this.group_id = null;
  if (typeof params.group_id !== 'undefined') {
        this.group_id = params.group_id;
  }
  this.status = null;
  if (typeof params.status !== 'undefined') {
        this.status = params.status;
  }
  this.presence = null;
  if (typeof params.presence !== 'undefined') {
        this.presence = params.presence;
  }
  this.presence_jid = null;
  if (typeof params.presence_jid !== 'undefined') {
        this.presence_jid = params.presence_jid;
  }
  this.search_key = null;
  if (typeof params.search_key !== 'undefined') {
        this.search_key = params.search_key;
  }
  if (typeof params.is_active !== 'undefined') {
        this.is_active = params.is_active;
  }
  if (typeof params.limit !== 'undefined') {
        this.limit = params.limit;
  }
  if (typeof params.offset !== 'undefined') {
        this.offset = params.offset;
  }
  //user management page end
  if (typeof params.from_date !== 'undefined') {
        this.from_date = params.from_date;
  }
  if (typeof params.to_date !== 'undefined') {
        this.to_date = params.to_date;
  }
  if (typeof params.user_old_jid !== 'undefined') {
        this.user_old_jid = params.user_old_jid;
  }
  

  //email template page start
  if (typeof params.user_regstrn_email_content !== 'undefined') {
        this.user_regstrn_email_content = params.user_regstrn_email_content;
  }
  if (typeof params.pswd_recovery_otp_content !== 'undefined') {
        this.pswd_recovery_otp_content = params.pswd_recovery_otp_content;
  }
  if (typeof params.mobileno_change_content !== 'undefined') {
        this.mobileno_change_content = params.mobileno_change_content;
  }
  if (typeof params.alert_email_content !== 'undefined') {
        this.alert_email_content = params.alert_email_content;
  }

   //email template page end

   //Exchanged messages Report Starts
  if (typeof params.generated_date_and_time !== 'undefined') {
      this.generated_date_and_time = params.generated_date_and_time;
  }
   if (typeof params.pending_delivery_messages !== 'undefined') {
        this.pending_delivery_messages = params.pending_delivery_messages;
  }

  if (typeof params.received_messages !== 'undefined') {
        this.received_messages = params.received_messages;
  }

  if (typeof params.total_messages_count !== 'undefined') {
        this.total_messages_count = params.total_messages_count;
  }


   //Exchanged messages Report Ends
   
  if (typeof params.from_date !== 'undefined') {
        this.from_date = params.from_date;
  }
  if (typeof params.to_date !== 'undefined') {
        this.to_date = params.to_date;
  }
};
Config.prototype.getConfigData= function(req, callback) {
  var dataObject = [];
  //Add a comment to this line

  var queryString = "select * from config_table where id = 1";

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            callback(err, result);
        }
        else{
          console.log(err);
        }
    });

};

Config.prototype.getlogOutAndLockOutTimes= function(req, callback) {
  var dataObject = [];
  //Add a comment to this line

  var queryString = "select lock_out_time,log_off_time,number_of_login_attempts from config_table";

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            callback(err, result);
        }
        else{
          console.log(err);
        }
    });

};
Config.prototype.selectConfig = function(req, callback) {
    var queryString = "select * from config_table where id = 1";
    db.mysql.query(queryString, '', function(err, result) {
       if (!err) {
        callback(err, result);
      }
      else {
        console.log(err);
      }
     });
}
//To get Dashboardconfig data to Dashboardconfig html page
Config.prototype.editConfig = function(req, callback) {
    var self = this;
    console.log(self.id);
    var dataObject = [];
    
     if (typeof self.password_expiry_period !== 'undefined') {
         dataObject.push(self.password_expiry_period);
     }
     if (typeof self.otp_expiry_period !== 'undefined') {
         dataObject.push(self.otp_expiry_period);
     }
     if (typeof self.message_expiry_period !== 'undefined') {
         dataObject.push(self.message_expiry_period);
     }
     if (typeof self.lock_out_time !== 'undefined') {
         dataObject.push(self.lock_out_time);
     }
     if (typeof self.number_of_login_attempts !== 'undefined') {
         dataObject.push(self.number_of_login_attempts);
     }
     if (typeof self.number_of_password_recovery_requests !== 'undefined') {
         dataObject.push(self.number_of_password_recovery_requests);
     }
     if (typeof self.log_off_time !== 'undefined') {
         dataObject.push(self.log_off_time);
     }
     if(self.message_see_more != '')
          dataObject.push(self.message_see_more);
     var queryString = "UPDATE `config_table` SET password_expiry_period = ?"
     +", otp_expiry_period = ?"
     +", message_expiry_period = ?"
     +", lock_out_time = ?"
     +", number_of_login_attempts = ?"
     +", number_of_password_recovery_requests = ?"
     +", log_off_time = ?"
     +", message_see_more = ? WHERE id = 1";

     console.log(queryString);
     console.log(dataObject);
     db.mysql.query(queryString, dataObject, function(err, result) {
       if (!err) {
         self.message_id = result.insertId;
       }
            callback(err, result);
     });

};

Config.prototype.getGroupData = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    var limit = ''; 
    if (typeof self.search_key != '') {
        where = " WHERE group_name like ?";
        dataObject.push('%'+self.search_key+'%');
    }
    var offset = self.offset != '' ? self.offset : 0;
    limit = " LIMIT "+offset+", 10";
    var queryString = "SELECT * from group_table"+where+limit;

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            var queryString_count = "SELECT count(*) as count from group_table";
            db.mysql.query(queryString_count, '', function(err, count) {
              var pagination = {};
              pagination.offset = self.offset;
              pagination.limit = self.limit;
              pagination.count = count[0].count;
              callback(err, result, pagination);
            });
        }
    });

};

Config.prototype.getReportThree = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    var group_by = ' GROUP BY u.first_name,u.last_name';
    if (self.user_id != '') {
      dataObject.push(self.user_id);
      dataObject.push(self.from_date);
      dataObject.push(self.to_date);
      var where = " WHERE m.from_user = ? AND ms.received = 1 AND m.message_updated_dtime > ? AND m.message_updated_dtime < ?"+group_by;
    }
    else {
      dataObject.push(self.from_date);
      dataObject.push(self.to_date);
      var where = " WHERE ms.received = 1 AND m.message_updated_dtime > ? AND m.message_updated_dtime < ?"+group_by;
    }
    var queryString = "SELECT u.first_name,u.last_name, count(ms.message_id) as count from users as u join message as m ON u.jid = m.from_user join message_status as ms ON ms.message_id = m.message_id "+where;

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            callback(err, result);
        }
    });
};
Config.prototype.getReportTwo = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    var group_by = ' GROUP BY DATE(m.message_updated_dtime)';
    if (self.user_id != '') {
      dataObject.push(self.user_id);
      dataObject.push(dateHelper.toMySQL(new Date(self.from_date)));
      dataObject.push(dateHelper.toMySQL(new Date(self.to_date)));
      console.log(dataObject);
      var where = " WHERE m.from_user = ? AND m.message_updated_dtime > ? AND m.message_updated_dtime < ?"+group_by;
    }
    else {
      dataObject.push(dateHelper.toMySQL(new Date(self.from_date)));
      dataObject.push(dateHelper.toMySQL(new Date(self.to_date)));
      console.log(dataObject);
      var where = " WHERE m.message_updated_dtime > ? AND m.message_updated_dtime < ?"+group_by;
    }
    var queryString = "SELECT count(m.message_id) as count, DATE(m.message_updated_dtime) as date from message as m "+where;

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            callback(err, result);
        }
    });
};

//To get User data to User management html page
Config.prototype.getConfig = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    var limit = ''; 
    if (self.search_key != '') {
        where = " WHERE (u.first_name like ? OR u.last_name like ?)";
        dataObject.push('%'+self.search_key+'%');
        dataObject.push('%'+self.search_key+'%');
    }
    if(self.is_active != '')
    {
        if(self.search_key != '')
          where += " AND uf.is_active = "+self.is_active;
        else
          where += " WHERE uf.is_active = "+self.is_active;
    }
    var offset = self.offset != '' ? self.offset : 0;
    limit = " ORDER BY uf.created_date desc LIMIT "+offset+", 10";
    var queryString = "SELECT u.*, uf.* from users as u join user_fields as uf ON (u.user_id = uf.user_id)"+where+limit;


    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            //callback(err, result);
            var queryString_count = "SELECT count(*) as count from users";
            db.mysql.query(queryString_count, '', function(err, count) {
              var pagination = {};
              pagination.offset = self.offset;
              pagination.limit = self.limit;
              pagination.count = count[0].count;
              callback(err, result, pagination);
            });
        }
    });

};
function groupSplit(gid) {
    var res = gid.split("@");
    return res[0];
}
Config.prototype.editImeiNumber = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    var queryString = "update users set user_id = "+self.imei_number+", imei_number = '"+self.imei_number+"', jid = '"+self.jid+"' where jid = '"+self.user_old_jid+"';";
    queryString_user_fields = "update user_fields set user_id = "+self.imei_number+" where user_id = "+groupSplit(self.user_old_jid)+";";
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            db.mysql.query(queryString_user_fields, dataObject, function(err, result) {
              if(!err)
              {
                callback(err, result);
              }
              else {
                console.log(err);
              }
            });
        }
        else {
          console.log(err);
        }
    });

};

Config.prototype.getReportFour = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    var limit = '';

     if (typeof self.from_date !== 'undefined') {
         dataObject.push(self.from_date);
     }
     if (typeof self.to_date !== 'undefined') {
         dataObject.push(self.to_date);
     }
    
    if (self.from_date != '' && self.to_date != '') {
      var where = ' GROUP BY u.first_name,u.last_name';  
    }
    else {
      var group_by = ' GROUP BY u.first_name,u.last_name';
      var where = " WHERE m.message_updated_dtime > "+"'"+dateHelper.toMySQL(new Date(self.from_date))+"'"+" AND m.message_updated_dtime < "+"'"+dateHelper.toMySQL(new Date(self.to_date))+"'"+group_by;          
    }
    var offset = self.offset != '' ? self.offset : 0;
    var queryString = "SELECT u.first_name,u.last_name, count(m.message_id) as count from users as u join message as m ON u.jid = m.from_user"+where;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
      console.log(err);
      console.log(result);
        if (!err) {
            //callback(err, result);
            var queryString_count = "SELECT count(message_id) as count from message";
            db.mysql.query(queryString_count, '', function(err, count) {
              var pagination = {};
              pagination.offset = self.offset;
              pagination.limit = self.limit;
              pagination.count = count[0].count;
              callback(err, result, pagination);
            });
        }
    });

};

Config.prototype.getReportThree = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    var limit = '';
    
     if (typeof self.from_date !== 'undefined') {
         dataObject.push(self.from_date);
     }
     if (typeof self.to_date !== 'undefined') {
         dataObject.push(self.to_date);
     }

    if (self.from_date == '' && self.to_date == '') {
      var where = ' GROUP BY u.first_name,u.last_name';
    }
    else {
      var group_by = ' GROUP BY u.first_name,u.last_name';
      var where = " WHERE m.message_updated_dtime > "+"'"+dateHelper.toMySQL(new Date(self.from_date))+"'"+" AND m.message_updated_dtime < "+"'"+dateHelper.toMySQL(new Date(self.to_date))+"' AND ms.received = 1"+group_by; 
    }
    var queryString = "SELECT u.first_name,u.last_name, count(ms.message_id) as count from users as u join message as m ON u.jid = m.from_user join message_status as ms ON ms.message_id = m.message_id "+where;

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
      console.log(err);
      console.log(result);
        if (!err) {
            //callback(err, result);
            var queryString_count = "SELECT count(message_id) as count from message";
            db.mysql.query(queryString_count, '', function(err, count) {
              var pagination = {};
              pagination.offset = self.offset;
              pagination.limit = self.limit;
              pagination.count = count[0].count;
              callback(err, result, pagination);
            });
        }
    });
};
Config.prototype.getReportTwo = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    var limit = '';
    var group_by = " GROUP BY DATE(m.message_updated_dtime)";
    where = " WHERE m.message_updated_dtime > "+"'"+dateHelper.toMySQL(new Date(self.from_date))+"'"+" AND m.message_updated_dtime < "+"'"+dateHelper.toMySQL(new Date(self.to_date))+"'"+group_by;          
    var queryString = "select DISTINCT DATE(m.message_updated_dtime) as date, GROUP_CONCAT(DISTINCT u.first_name) as name from message as m join users as u ON m.from_user = u.jid "+where;

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            var queryString_count = "SELECT count(*) as count from users";
            db.mysql.query(queryString_count, '', function(err, count) {
              var pagination = {};
              pagination.offset = self.offset;
              pagination.limit = self.limit;
              pagination.count = count[0].count;
              callback(err, result, pagination);
            });
        }
    });
};

Config.prototype.getReportOne = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    var limit = '';
    
     if (typeof self.from_date !== 'undefined') {
         dataObject.push(self.from_date);
     }
     if (typeof self.to_date !== 'undefined') {
         dataObject.push(self.to_date);
     }

    var queryString = "select DATE(message_updated_dtime) as date, count(message_id) as count from message where message_updated_dtime > "+"'"+dateHelper.toMySQL(new Date(self.from_date))+"'"+" AND message_updated_dtime < "+"'"+dateHelper.toMySQL(new Date(self.to_date))+"'"+" group by DATE(message_updated_dtime)";

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            callback(err, result);
        }
    });
};

Config.prototype.canBroadcast = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    if (self.can_broadcast != '') {
        dataObject.push(self.can_broadcast);
    }
    if (self.user_id != '') {
        where = " WHERE user_id IN("+self.user_id+")";
        dataObject.push(self.user_id);
    }
    var queryString = "update user_fields set can_broadcast = ?"+where;
    console.log(dataObject);
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
      console.log(err);
      console.log(result);
        if (!err) {
            //callback(err, result);
            var queryString_count = "SELECT count(message_id) as count from message";
            db.mysql.query(queryString_count, '', function(err, count) {
              var pagination = {};
              pagination.offset = self.offset;
              pagination.limit = self.limit;
              pagination.count = count[0].count;
              callback(err, result, pagination);
            });
        }
    });
};
Config.prototype.activeUsers = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    if (self.is_active != '') {
        dataObject.push(self.is_active);
    }
    if (self.user_id != '') {
        where = " WHERE user_id IN ("+self.user_id+")";
        dataObject.push(self.user_id);
    }
    var queryString = "update user_fields set is_active = ?"+where;
    console.log(dataObject);
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            callback(err, result);
        }
        else {
          console.log(err);
        }
    });

};

Config.prototype.addUser = function(req, callback) {
    var self = this;
    var dataObject = [];
        var queryString = "insert into users (user_id,first_name,last_name,imei_number,jid,mail,mobile,group_id,status) values ('"+self.user_id+"', '"+self.first_name+"', '"+self.last_name+"', '"+self.imei_number+"', '"+self.jid+"', '"+self.mail+"', '"+self.mobile+"', 0, 0)";
        console.log("Getting data in form");
        console.log(queryString);
        db.mysql.query(queryString, dataObject, function(err, result) {
            if (!err) {
              var created_date = dateHelper.toMySQL(new Date());
              var queryString2 = "INSERT INTO user_fields (user_id, can_broadcast, is_active, recovery, created_date) VALUES('"+self.user_id+"', '0', '1',(select number_of_password_recovery_requests from config_table where id = 1),'"+created_date+"');"
                db.mysql.query(queryString2, dataObject, function(err, result) {
                  if(!err){
                    callback(err, result);
                  }else{
                    console.log(err);
                  }
                });
            }
            else{
              console.log(err);
            } 
        });
    
};
Config.prototype.updateRecovery = function(req, callback) {
  var self = this;
  var dataObject = [];
  var queryString_sel = "select recovery from user_fields where user_id = '"+self.user_id+"'";
  db.mysql.query(queryString_sel, dataObject, function(err, result) {
    if(err)
    {
      console.log(err);
    }
    else 
    {
      console.log(result);
      var recovery = parseInt(result[0].recovery) - 1;
      if(recovery < 0) recovery = 0; 
      var queryString = "update user_fields set recovery = '"+recovery+"' where user_id = '"+self.user_id+"'";
      console.log(queryString);
      db.mysql.query(queryString, dataObject, function(err, result_update) {
          if (!err) {
              callback(err,result,recovery);
          }
          else{
            console.log(err);
          } 
      });
    }
  });
};
Config.prototype.updateUserRecovery = function(req, callback) {
  var self = this;
  var dataObject = [];
  var queryString = "update user_fields set recovery = (select number_of_password_recovery_requests from config_table where id = 1) where user_id = '"+self.user_id+"'";
  db.mysql.query(queryString, dataObject, function(err, result) {
    if(err)
    {
      console.log(err);
    }
  });
};
Config.prototype.updateUser = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = ''; 
    if (self.user_id[1] != '') {
        dataObject.push(self.user_id[1]);
    }
    console.log("The ID is");
    console.log(self.user_id[1]);
    if (self.user_id != '') {
        where = " WHERE user_id = '"+self.user_id+"'";
        var queryString = "update users set first_name = '"+self.first_name+"', last_name = '"+self.last_name+"', imei_number = '"+self.imei_number+"', jid = '"+self.jid+"', mail = '"+self.mail+"', mobile = '"+self.mobile+"'"+where;
        console.log("Getting data in form");
        console.log(queryString);
        console.log(dataObject);
        db.mysql.query(queryString, dataObject, function(err, result) {
            if (!err) {
                callback(err, result);
            }
            else{
              console.log(err);
            } 
        });
    }
};



//getParticularUserdata
Config.prototype.getParticularUserdata = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = ''; 
     if (typeof self.user_id !== 'undefined') {
         dataObject.push(self.user_id);
     }
     console.log("The user ID is");
    console.log(self.user_id);
    if (self.user_id != '') {
        where = " WHERE u.user_id = ?";
        dataObject.push(self.user_id);
    }
    var queryString = "select u.*, uf.* from users as u join user_fields as uf on u.user_id = uf.user_id"+where;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            callback(err, result);
        }
        else{
          console.log(err);
        }
    });

};

//getParticularGroupsdata
Config.prototype.getParticularGroupsdata = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    console.log(self.group_id);
    if (self.group_id != '') {
        where = "  WHERE group_user_table.group_id = "+self.group_id;
        dataObject.push(self.group_id);
    }
    var queryString = "select users.*,group_user_table.*,user_fields.* from users JOIN group_user_table ON users.jid = group_user_table.user_id JOIN user_fields ON users.user_id = user_fields.user_id"+where;

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
          console.log(result);
            callback(err, result);
        }
        else{
          console.log(err);
        }
    });

};
Config.prototype.deleteUser = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    console.log(self.user_id);
    if (self.user_id != '') {
        where = " WHERE user_id = '"+self.user_id+"'";
        var queryString = "DELETE from users"+where;
        console.log(queryString);
        console.log(dataObject);
        db.mysql.query(queryString, dataObject, function(err, result) {
            if (!err) {
              var queryString2 = "DELETE from user_fields"+where;
              db.mysql.query(queryString2, dataObject, function(err, result) {
                if(!err){
                  callback(err, result);
                }else{
                  console.log(err);
                }
              });
            }
            else{
              console.log(err);
            }
        });
    }

};
//delete group
Config.prototype.deleteGroup = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    console.log('The group ID is');
    console.log(self.group_id);
    if (self.group_id != '') {
        where = " WHERE group_id IN ("+self.group_id+")";
	var queryString = "DELETE from group_table"+where;
    
	console.log(queryString);
	console.log(dataObject);
	db.mysql.query(queryString, dataObject, function(err, result) {
	    if (!err) {
	      var queryString2 = "DELETE from group_user_table"+where;
	      db.mysql.query(queryString2, dataObject, function(err, result) {
      		if(!err){
      		  callback(err, result);
      		}else{
      		  console.log(err);
      		}
	      });
	    }
	    else{
	      console.log(err);
	    }
	});
  }
};
//-------log out and lock out times


//change admin  
 Config.prototype.changeAdmin = function(req, callback) {
     var self = this;      
     var dataObject = [];   
     if (typeof self.user_id !== 'undefined') {
         dataObject.push(self.user_id);
     }
     if (typeof self.group_id !== 'undefined') {
         dataObject.push(self.group_id);
     }   
     var where = '';     
     console.log('The IDs are');
     console.log(self.group_id);
     console.log(self.user_id);     
     if (self.group_id != '' && self.user_id != '') {      
         where = " WHERE group_id = ?";     
     }     
     var queryString = "UPDATE group_user_table SET id_admin = ?"+where;
 
     console.log(queryString); 
     console.log(dataObject);      
     db.mysql.query(queryString, dataObject, function(err, result) {     
         if (!err) {     
             callback(err, result);      
         }     
         else{     
           console.log(err);     
         }     
     });     
}

//get email content into email templates html page
Config.prototype.getEmailContent = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = ' where id = 1';
    var queryString = "SELECT * from email_templates_table"+where;

    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
        if (!err) {
            callback(err, result);
        }
    });

};

//update email content to db
Config.prototype.updateEmailContent = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    console.log(self.id);

    if (typeof self.user_regstrn_email_content !== 'undefined') {
         dataObject.push(self.user_regstrn_email_content);
     }
     if (typeof self.pswd_recovery_otp_content !== 'undefined') {
         dataObject.push(self.pswd_recovery_otp_content);
     }
     if (typeof self.mobileno_change_content !== 'undefined') {
         dataObject.push(self.mobileno_change_content);
     }

    if (self.id != '') {
        dataObject.push(self.id);
        where = " WHERE id = 1";
        var user_regstrn_email_content = db.mysql.escape(self.user_regstrn_email_content.toString());
        var queryString = "update email_templates_table set user_regstrn_email_content = "+user_regstrn_email_content+", pswd_recovery_otp_content = '"+self.pswd_recovery_otp_content+"', mobileno_change_content = '"+self.mobileno_change_content+"', alert_email_content = '"+self.alert_email_content+"'"+where;
        console.log(queryString);
        console.log(dataObject);
        db.mysql.query(queryString, dataObject, function(err, result) {
            if (!err) {
                callback(err, result);
            }
            else{
              console.log(err);
            }
        });
    }
};
//     console.log(queryString);
//     db.mysql.query(queryString, dataObject, function(err, result) {
//         if (!err) {
//             callback(err, result);
//         }
//         else{
//           console.log(err);
//         }
//     });

// }


Config.prototype.resendOTPToUser = function(req, callback) {
    var self = this;
    var dataObject = [];
    var where = '';
    if (typeof self.user_id !== 'undefined') {
         dataObject.push(self.user_id);
     }
      console.log(self.user_id);
      var queryString = "select * from users where user_id = "+self.user_id;
      console.log(queryString);
      console.log(dataObject);
      db.mysql.query(queryString, dataObject, function(err, result) {
          if (!err) {
              callback(err, result);
          }
          else{
            console.log(err);
          }
      });
};
exports.Config = Config;