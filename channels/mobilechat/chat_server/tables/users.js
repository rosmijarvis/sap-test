/**
 * Table : Driver
 */
var db = require("../lib/Database"),
    dateHelper = require("../utility/DateHelper");
var async = require('async');
var Users = function(params) {

	if (typeof params === "undefined") {
		params = {};
	}
  
  this.user_id = null;
  if (typeof params.user_id !== 'undefined') {
  		this.user_id = params.user_id;
  }
  if (typeof params.imei_number !== 'undefined') {
      this.imei_number = params.imei_number;
  }
  if (typeof params.first_name !== 'undefined') {
      this.first_name = params.first_name;
  }
  if (typeof params.last_name !== 'undefined') {
      this.last_name = params.last_name;
  }
  if (typeof params.jid !== 'undefined') {
      this.jid = params.jid;
  }
  if (typeof params.mail !== 'undefined') {
      this.mail = params.mail;
  }
  if (typeof params.mobile !== 'undefined') {
      this.mobile = params.mobile;
  }
  if (typeof params.group_id !== 'undefined') {
      this.group_id = params.group_id;
  }
  if (typeof params.status !== 'undefined') {
      this.status = params.status;
  }
  if (typeof params.id !== 'undefined') {
      this.id = params.id;
  }
  if (typeof params.result_users !== 'undefined') {
      this.result_users = params.result_users;
  }
  if (typeof params.stanza !== 'undefined') {
      this.stanza = params.stanza;
  }
  if (typeof params.group_plain_jid !== 'undefined') {
      this.group_plain_jid = params.group_plain_jid;
  }

  if (typeof params.read !== 'undefined') {
      this.read = params.read;
  }

  if (typeof params.readTime !== 'undefined') {
      this.readTime = params.readTime;
  }

  if (typeof params.received !== 'undefined') {
      this.received = params.received;
  }

  if (typeof params.receivedTime !== 'undefined') {
      this.receivedTime = params.receivedTime;
  }

  if (typeof params.reg_token !== 'undefined') {
      this.reg_token = params.reg_token;
  }

  if (typeof params.raw_token !== 'undefined') {
      this.raw_token = params.raw_token;
  }

  if (typeof params.to_hide_jid !== 'undefined') {
      this.to_hide_jid = params.to_hide_jid;
  }

  if (typeof params.dtime !== 'undefined') {
      this.dtime = params.dtime;
  }
};
function groupSplit(gid) {
    var res = gid.split("@");
    return res[0];
}
Users.prototype.changeMobileNumber = function(req, callback) {

    var self = this;
    var where = [];
    var dataObject = [];

    var status = self.status;
    if (typeof self.mobile !== 'undefined' && self.mobile != '') {
      dataObject.push(self.mobile);
    }
    if (typeof self.user_id !== 'undefined' && self.user_id != '') {
      dataObject.push(self.user_id);
    }
    where = " WHERE " + where.join(" AND ");
    var queryString = "UPDATE users SET mobile = ? where user_id = ?";
    console.log(queryString);
    console.log(dataObject);
    db.mysql.query(queryString, dataObject, function(err, result) {
      callback(err, result);
    });

};
Users.prototype.getUserWithId = function(req, callback) {

    var self = this;
    var where = [];
    var dataObject = [];
    if (typeof self.user_id !== 'undefined' && self.user_id != '') {
      dataObject.push(self.user_id);
    }
    where = " WHERE user_id = '"+self.user_id+"'";
    var queryString = "select * from users "+where;
    console.log(queryString);
    console.log("we r here ram ");

    db.mysql.query(queryString, dataObject, function(err, result) {
      if(err)
      {
        console.log(err);
      }
      else {
        callback(err, result, self.id, self.result_users, self.stanza, self.group_plain_jid, self.read, self.received, self.receivedTime, self.readTime);
      }
    });
};
Users.prototype.addStatus = function(req, callback) {

    var self = this;
    var where = [];
    var dataObject = [];

    var status = self.status;
    
    where = " WHERE jid = '"+self.jid+"'";
    var queryString = "UPDATE users SET status = "+status+where;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
      if(err)
        console.log(err);
      else {
        console.log('status:'+status);
        if(status)
        {
          where = " WHERE user_id = '"+groupSplit(self.jid)+"'";
          var dtime = dateHelper.toMySQL(new Date());
          var queryString = "UPDATE user_fields SET login_time = '"+dtime+"'"+where;
          db.mysql.query(queryString, dataObject, function(err, result) {
            if(err);
              console.log(err);
          });
        }
      }
    });
};
Users.prototype.getRegistrationToken = function(req, callback) {

    var self = this;
    var where = '';
    var dataObject = [];

    where = " WHERE jid IN ("+self.jid+")";
    var queryString = "select gcm_token from users "+where;
    console.log(queryString);
    db.mysql.query(queryString, dataObject, function(err, result) {
      if(err)
        console.log(err);
      else
        callback(err, result);
    });
};
Users.prototype.storeGcmToken = function(req, callback) {
    var self = this;
    var where = '';
    var dataObject = [];

    dataObject.push(self.reg_token);
    dataObject.push(self.jid);

    where = " WHERE jid = ?";
    var queryString = "update users set gcm_token = ? "+where;
    console.log(queryString);
    console.log(dataObject);
    db.mysql.query(queryString, dataObject, function(err, result) {
      if(err)
        console.log(err);
      else
        callback(err, result, self.raw_token);
    });
}
Users.prototype.getHiddenUsers = function(req, callback) {
    var self = this;
    var where = '';
    var dataObject = [];

    dataObject.push(self.user_id);

    where = " WHERE user_id = ?";
    var queryString = "select hidden_jids from user_fields "+where;
    console.log(queryString);
    console.log(dataObject);
    db.mysql.query(queryString, dataObject, function(err, result) {
      if(err)
        console.log(err);
      else
        callback(err, result, self.to_hide_jid, self.user_id);
    });
}
Users.prototype.updateHiddenUser = function(req, callback) {
    var self = this;
    var where = '';
    var dataObject = [];

    dataObject.push(self.user_id);

    where = " WHERE user_id = ?";
    var queryString = "update user_fields set hidden_jids = '"+self.to_hide_jid+"'"+where;
    console.log(queryString);
    console.log(dataObject);
    db.mysql.query(queryString, dataObject, function(err, result) {
      if(err)
        console.log(err);
        //callback(err, result, self.to_hide_jid);
    });
}

Users.prototype.checkUserOffline = function(req, callback) {
    var self = this;
    var where = '';
    var dataObject = [];

    dataObject.push(self.jid);
    dataObject.push(self.jid);
    dataObject.push(self.jid);
    console.log('checkUserOffline');
    console.log(dataObject);
    async.waterfall([
        function(callback){
          var queryString = "select log_off_time from config_table";
          db.mysql.query(queryString, [], function(err, log_off_time) {
            if(err)
              console.log(err);
            else 
              callback(null, log_off_time);
          });
        },
        function(log_off_time, callback){
          var queryString = "select login_time from user_fields where user_id = '"+groupSplit(self.jid)+"'";
          db.mysql.query(queryString, [], function(err, login_time) {
            if(err)
              console.log(err);
            else 
              callback(null, log_off_time, login_time);
          });
        },
        function(log_off_time, login_time, callback){
          
          var date = new Date();
          date.setMinutes(date.getMinutes() - log_off_time[0].log_off_time);
          var final_date = dateHelper.toMySQL(new Date(date));

          // Calculation of login time with logout time
          console.log(login_time);
          var login_dtime = new Date(login_time[0].login_time);
          login_dtime.setMinutes(login_dtime.getMinutes() + log_off_time[0].log_off_time);

          console.log('login_dtime:: ultra'+login_dtime);
          if(new Date().getTime() < login_dtime.getTime())
          {
            var result = ['Tchat'];
            callback(null, result);
          }
          else {
            var where = "where (m.to_user = ? OR m.from_user = ? OR gu.user_id = ?) AND (g.group_updated_dtime >= '"+final_date+"' OR m.message_updated_dtime >= '"+final_date+"')";

            var queryString = "select g.group_id, m.message_id from message as m join group_table as g join group_user_table as gu ON g.group_id = gu.group_id "+where;
            
            console.log(queryString);
            db.mysql.query(queryString, dataObject, function(err, result) {
              if(err)
                console.log(err);
              else
                callback(null, result);
            });
          }
        }
    ], function (err, result) {
        console.log('Lasso of truth:: '+self.jid);
        console.log(self.jid);
        if(self.jid)
          callback(null, result, self.jid);
        else
          callback(null, [], []);
        // result now equals 'done'
    });
}
exports.Users = Users;