// var fs = require('fs');
// var path = require("path");
// var CronJob = require('cron').CronJob;
// var _ = require("lodash");
// var logger = require("./logger");

// var job = new CronJob('00 00 00 * *', function(){
//     // Runs every day
//     // at 00:00:00 AM.
//     fs.readdir(path.join(__dirname, "logs"), function(err, files){
//         if(err){
//             logger.error("error reading log files");
//         } else{
//             var currentTime = new Date();
//             var weekFromNow = currentTime -
//                 (new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
//             _(files).forEach(function(file){
//                 var fileDate = file.split(".")[2]; // get the date from the file name
//                 if(fileDate){
//                     fileDate = fileDate.replace(/-/g,"/");
//                     var fileTime = new Date(fileDate);
//                     if((currentTime - fileTime) > weekFromNow){
//                         console.log("delete fIle",file);
//                         fs.unlink(path.join(__dirname, "logs", file),
//                             function (err) {
//                                 if (err) {
//                                     logger.error(err);
//                                 }
//                                 logger.info("deleted log file: " + file);
//                             });
//                     }
//                 }
//             });
//         }
//     });
// }, function () {
//     // This function is executed when the job stops
//     console.log("finished logrotate");
// },
// true, /* Start the job right now */
// 'Asia/Jerusalem' /* Time zone of this job. */
// );

// exports.startCronJob = function() {
// 	//job.start();
// };