function openpopup(){
  alert(123579);
}


// ----------
// Declaring required variables
var digits = "0123456789";

// non-digit characters which are allowed in phone numbers
var phoneNumberDelimiters = "()- ";
// characters which are allowed in international phone numbers
// (a leading + is OK)
var validWorldPhoneChars = phoneNumberDelimiters + "+";
// Minimum no of digits in an international phone no.
var minDigitsInIPhoneNumber = 10;

function isInteger(s)
{   var i;
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}
function trim(s)
{   var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not a whitespace, append to returnString.
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (c != " ") returnString += c;
    }
    return returnString;
}
function stripCharsInBag(s, bag)
{   var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function checkInternationalPhone(strPhone){
var bracket=3
strPhone=trim(strPhone)
if(strPhone.indexOf("+")>1) return false
if(strPhone.indexOf("-")!=-1)bracket=bracket+1
if(strPhone.indexOf("(")!=-1 && strPhone.indexOf("(")>bracket)return false
var brchr=strPhone.indexOf("(")
if(strPhone.indexOf("(")!=-1 && strPhone.charAt(brchr+2)!=")")return false
if(strPhone.indexOf("(")==-1 && strPhone.indexOf(")")!=-1)return false
s=stripCharsInBag(strPhone,validWorldPhoneChars);
return (isInteger(s) && s.length >= minDigitsInIPhoneNumber);
}

function ValidatePhNumber(){
  var Phone=document.getElementById("mobile1");

  
  if ((Phone.value==null)||(Phone.value=="")){
    alert("Please Enter your Phone Number")
   
    return false
  }
  if (checkInternationalPhone(Phone.value)==false){
    alert("Please Enter a Valid Phone Number")
   
  
    return false
  }
  return true
 }

 function ValidateNumber(){
  var Phone=document.getElementById("mobile");

  
  if ((Phone.value==null)||(Phone.value=="")){
    alert("Please Enter your Phone Number")
   
    return false
  }
  if (checkInternationalPhone(Phone.value)==false){
    alert("Please Enter a Valid Phone Number")
 
  
    return false
  }
  return true
 }
 //-----------
var testcal;
var txtname;
var ctrlId;
 function testEmail(id,name){
  
    ctrlId = id;
    txtname = name;
   if(txtname=="mobileno_change_content")
      testcal = document.getElementsByName("mobileno_change_content")[0].value;
    else if(txtname=="alert_email_content")
      testcal = document.getElementsByName("alert_email_content")[0].value;
    else if(txtname=="user_regstrn_email_content")
      testcal = document.getElementsByName("user_regstrn_email_content")[0].value;
    else if(txtname=="pswd_recovery_otp_content")
      testcal = document.getElementsByName("pswd_recovery_otp_content")[0].value;
    else
      txtname ="";



    
 }
function valEmpty(){
  
  var idVal = document.getElementById(ctrlId).value;

 

  if(idVal.trim() == ""){
   
      alert("Email Content is Manadatory");

       if(testcal !="")
        document.getElementsByName(txtname)[0].value=testcal;

      return false;
    }
    return true;
}

function valTime(id){

 
  var louttime = document.getElementById("louttime").value;
  var lofftime = document.getElementById("lofftime").value;

    if(lofftime.trim() !="" && louttime.trim() !=""){
        var diff = lofftime - louttime;
        if(diff <= 0)
            alert("Lock Out Time should always be lesser than logoff time");

      }


}




function sync(domain)
{
  var n1 = document.getElementById('n1');
  var n2 = document.getElementById('n2');
  n2.value = n1.value+'@'+domain;
}

function sync1()
{
  var n1 = document.getElementById('edit_imei_n1');
  var n2 = document.getElementById('edit_imei_n2');
  n2.value = n1.value+'@'+window.location.hostname;
}
$( document ).ready(function() {
  $('#sandbox-container input').datepicker({
      autoclose: true
  });

  $('#sandbox-container input').on('show', function(e){
      console.debug('show', e.date, $(this).data('stickyDate'));
      
      if ( e.date ) {
           $(this).data('stickyDate', e.date);
      }
      else {
           $(this).data('stickyDate', null);
      }
  });

  $('#sandbox-container input').on('hide', function(e){
      console.debug('hide', e.date, $(this).data('stickyDate'));
      var stickyDate = $(this).data('stickyDate');
      
      if ( !e.date && stickyDate ) {
          console.debug('restore stickyDate', stickyDate);
          $(this).datepicker('setDate', stickyDate);
          $(this).data('stickyDate', null);
      }
  });
   

/****************************************************Export To CSV Report*****************************************************/

    function exportTableToCSV($table, filename) {

        var $rows = $table.find('tr:has(th,td)'),
            tmpColDelim = String.fromCharCode(11), 
            tmpRowDelim = String.fromCharCode(0), 
            colDelim = '","',
            rowDelim = '"\r\n"',

            csv = '"' + $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find('th,td');

                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    return text.replace(/"/g, '""'); 

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',

            // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
            .attr({
            'download': filename,
                'href': csvData,
                'target': '_blank'
        });
    }

/*************************************************Print Report Data********************************************************/

    function printData(divToPrint){
       var divToPrint1=document.getElementById(divToPrint);
       newWin= window.open("");
       newWin.document.write(divToPrint1.outerHTML);
       newWin.print();
       newWin.close();
    }

/***************************************************************************************************************************/

    $(".exportbtn1").on('click', function (event) {
        exportTableToCSV.apply(this, [$('#noof-msgs-exchanged-table'), 'Exchanged-Messages-Report.csv']);
    });
    $(".exportbtn2").on('click', function (event) {
        exportTableToCSV.apply(this, [$('#connected-users-table'), 'Connected-Users-Report.csv']);
    });
    $(".exportbtn3").on('click', function (event) {
        exportTableToCSV.apply(this, [$('#pending-msg-table'), 'Pending-Messages-Report.csv']);
    });
    $(".exportbtn4").on('click', function (event) {
        exportTableToCSV.apply(this, [$('#noof-msgssent-table'), 'No-of-Messages-Sent-Report.csv']);
    });

    $(".printbtn1").on('click', function (event) {
      var divToPrint = "noof-msgs-exchanged-table";
      printData.apply(this, [divToPrint]);
    });
    $(".printbtn2").on('click', function (event) {
      var divToPrint = "connected-users-table";
      printData.apply(this, [divToPrint]);
    });
    $(".printbtn3").on('click', function (event) {
      var divToPrint = "pending-msg-table";
      printData.apply(this, [divToPrint]);
    });
    $(".printbtn4").on('click', function (event) {
      var divToPrint = "noof-msgssent-table";
      printData.apply(this, [divToPrint]);
    });

/***************************************************************************************************************************/
    // $('#dashboardconfig').on('click', function (){
    //   alert('test');
    //   $('.navbar-nav li.active').removeClass('active');
    //   $('#dashboardconfig').addClass('active');
    // });
    // $('#reports').on('click', function (){
    //   $('.navbar-nav li.active').removeClass('active');
    //   $(this).addClass('active');
    // });

    $('#email_templates').change(function(){
      $('#email_contain').show();
    });
    $('.nav a').filter(function(){return this.href==location.href}).parent().addClass('active').siblings().removeClass('active')
      $('.nav a').click(function(){
        var href = $(this).attr('href');
        $(this).parent().addClass('active').siblings().removeClass('active');

    });
      if(window.location.pathname == '/groupmanagement')
      {
        $('#management').addClass('active');
        console.log('asdads')
      }

    $(".toggleModal").on("click", function(){
      alert('t');
    });
    $("ul.navbar-nav li").on("click",function(){
      $("ul.navbar-nav li").removeClass("active");
      $(this).addClass("active");
    });

    $('.alert-email').show();

    $('.exchanged-msgs').show();

    $("select").change(function () {
        $('div.table-to-hide').hide();
        $('div.table-to-hide.'+$(this).val()).show();
    });
    
    //delete user code
    $("#delete_user").on("click",function(){
     var atLeastOneIsChecked = $('input[name="checkBox[]"]:checked').length > 0;
      var checkedLength = $('input[name="checkBox[]"]:checked').length;
       if(atLeastOneIsChecked == false){
         alert("Please select the User to be deleted");
         return false;
      }else if(checkedLength == 1){
         if(confirm("Are you sure you want to delete the selected User") == true){
          var user_array = [];
        $(".user_select").each( function() {
          if($(this).prop('checked'))
          {
            user_array.push($(this).val());
          }
        });
        console.log(user_array);
        $("#delete_user_id").val(user_array);
        }else{
          $('input[name="checkBox[]"]').attr('checked',false);
          return false;
        }
      }
      else {
        alert("Please select one user at a time");
        $('input[name="checkBox[]"]').attr('checked',false);
        return false;
      }
      
    });
    $("#edit_imei").on("click",function(){
     var atLeastOneIsChecked = $('input[name="checkBox[]"]:checked').length > 0;
      var checkedLength = $('input[name="checkBox[]"]:checked').length;
       if(atLeastOneIsChecked == false){
         alert("Please select the User, whose imei number you wish to change");
         return false;
      }else if(checkedLength == 1){
        var user_array = [];
        $(".user_select").each( function() {
          if($(this).prop('checked'))
          {
            user_array.push($(this).val());
          }
        });
        console.log(user_array);
        $("#edit_imei_id").val(user_array);
        $("#edit_imei_n1").val(user_array[0]);
        $("#edit_imei_n2").val(user_array[0]+'@'+window.location.hostname);
        $("#user_old_jid").val(user_array[0]+'@'+window.location.hostname);
        
        $('#edit_imei_number_modal').modal('show');
      }
      else {
        alert("Please select one user at a time");
        $('input[name="checkBox[]"]').attr('checked',false);
        return false;
      }
      
    });
    //delete group code
     $("#delete_group").on("click",function(){
      var atLeastOneIsChecked = $('input[name="checkBox[]"]:checked').length > 0;
      //alert(atLeastOneIsChecked);
      var checkedLength = $('input[name="checkBox[]"]:checked').length;
       if(atLeastOneIsChecked == false){
         alert("Please select the Group to be deleted");
         return false;
      }else if(checkedLength == 1){
        if(confirm("Are you sure you want to delete the selected Group") == true){
          var group_array = [];
        $(".group_select").each( function() {
          if($(this).prop('checked'))
          {
            group_array.push($(this).val());
          }
          //return false;
        });
        console.log("The group ID is");
        console.log(group_array);
        $("#delete_group_id").val(group_array);
        }else{
          $('input[name="checkBox[]"]').attr('checked',false);
          return false;
        }
      }else{
        alert("Please select one Group at a time");
        $('input[name="checkBox[]"]').attr('checked',false);
        return false;
      }
    });
    //delete group code
   $("#can_broadcast").on("click",function(){
    var atLeastOneIsChecked = $('input[name="checkBox[]"]:checked').length > 0;
    var checkedLength = $('input[name="checkBox[]"]:checked').length;
       if(atLeastOneIsChecked == false){
         alert("Please select a User");
         return false;
      }else{
        var group_array = [];
      $(".user_select").each( function() {
        if($(this).prop('checked'))
        {
          group_array.push("'"+$(this).val()+"'");
        }
      });
      console.log(group_array);
      $("#broadcast_user_id").val(group_array);
      }
  });

    $("#is_active").on("click",function(){
      var atLeastOneIsChecked = $('input[name="checkBox[]"]:checked').length > 0;
      var checkedLength = $('input[name="checkBox[]"]:checked').length;
       if(atLeastOneIsChecked == false){
         alert("Please select a User");
         return false;
      }else{
        var group_array = [];
        $(".user_select").each( function() {
          if($(this).prop('checked'))
          {
            group_array.push("'"+$(this).val()+"'");
          }       
        });
     
        console.log(group_array);
        $("#active_user_id").val(group_array);
      }
  });
 
});

function openModalUser(user_id)
{
  console.log("The user ID when searched is ");
  angular.element(document.getElementById('usermanagement_page')).scope().toggleModal(user_id);
}

function openModalGroup(group_id,group)
{
  angular.element(document.getElementById('groupmgmnt_page')).scope().toggleModal(group_id);
}

function openModalAddUser()
{
  angular.element(document.getElementById('usermanagement_page')).scope().toggleModal();
}
function SearchSplit(url) {
    var res = url.split("?");
    return res[0];
}

var app = angular.module('usermgmt', []);
app.controller('userctrl', function($scope, $http, $location, $compile) {


  $scope.searchUsers = function(myE) {
      if($scope.search != '')
      {
          $http({
            url: SearchSplit(window.location.pathname), 
            method: "GET",
            params: {search_key: $scope.search, is_active: $scope.active}
        })
          .then(function(response) {
            console.log(response);
            $scope.show = true;
              $scope.results = response.data;
              if(response.data.length == 0)
                $scope.zero = true;
              else
                $scope.zero = false;
          });
      }
      else {
        $scope.show = false;
        $scope.zero = false;
      }
    }
    $scope.change_active = function (){
        if($scope.active)
        {
            $http({
              url: SearchSplit(window.location.pathname), 
              method: "GET",
              params: {search_key: $scope.search,is_active: $scope.active}
            })
            .then(function(response) {
              console.log(response);
              $scope.show = true;
                $scope.results = response.data;
                if(response.data.length == 0)
                  $scope.zero = true;
                else
                  $scope.zero = false;
            });
        }
        else {
          $scope.show = false;
          $scope.zero = false;
        }
    }

$scope.generate_report = function (){
      //console.log("The From Date is "+$scope.from_date);
      //console.log("The To Date is "+$scope.to_date);
      var date = new Date();

      // add a day
      date.setDate(date.getDate());
      $scope.from_date = $('#from_date').val();
      $scope.to_date = $('#to_date').val();
      var date1 = new Date($scope.from_date);
      var date2 = new Date($scope.to_date);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      if($scope.report_type == undefined || $scope.from_date == undefined || $scope.to_date == undefined){
        alert("Report Type, From date and To date are mandatory");
      } 
      else if($scope.from_date > $scope.to_date)
      {
        alert('From date should be lesser than to date');
        return false;
      }
      else if(diffDays > 10)
      {
        alert('Date range can only be 10 days max');
        return false;
      }
      else if(date1.getTime() >= date.getTime() || date2.getTime() >= date.getTime())
      {
        alert('Future dates are not allowed');
        return false;
      }
      else{
      if($scope.report_type == 4)
      {
        $http({
            url: '/reportanalysis', 
            method: "GET",
            params: {to_date: $scope.to_date,from_date: $scope.from_date,report_type: $scope.report_type}
          })
          .then(function(response) {
            console.log(response);
            $('#report_4').show();
            $('#report_1').hide();
            $('#report_2').hide();
            $('#report_3').hide();
            $scope.results = response.data;
          });
      }
      else if($scope.report_type == 3)
      {
        $http({
            url: '/reportanalysis', 
            method: "GET",
            params: {to_date: $scope.to_date,from_date: $scope.from_date,report_type: $scope.report_type}
          })
          .then(function(response) {
            console.log(response);
            $('#report_3').show();
            $('#report_1').hide();
            $('#report_2').hide();
            $('#report_4').hide();
            $scope.results = response.data;
          });
      }
      else if($scope.report_type == 2)
      {
        $http({
            url: '/reportanalysis', 
            method: "GET",
            params: {to_date: $scope.to_date,from_date: $scope.from_date,report_type: $scope.report_type}
          })
          .then(function(response) {
            console.log(response);
            $('#report_2').show();
            $('#report_1').hide();
            $('#report_3').hide();
            $('#report_4').hide();
            $scope.results = response.data;
          });
      }else if($scope.report_type == 1)
      {
        $http({
            url: '/reportanalysis', 
            method: "GET",
            params: {to_date: $scope.to_date,from_date: $scope.from_date,report_type: $scope.report_type}
          })
          .then(function(response) {
            console.log("!@#$"+response);
            $('#report_1').show();
            $('#report_2').hide();
            $('#report_3').hide();
            $('#report_4').hide();
            $scope.results = response.data;
          });
      }
    }
  }

//Get the value of selected option in Resend OTP select box
    $('#resendOTPList').on('change', function() {
        $('#resendOTPList').show();
    });

    $('#resend_otp').on('click', function() {
       var atLeastOneIsChecked = $('input[name="checkBox[]"]:checked').length > 0;
       var checkedLength = $('input[name="checkBox[]"]:checked').length;
      if(atLeastOneIsChecked == false){
         alert("Please select the User");
         return false;
      }
      else if(checkedLength == 1)
      {
        var select_value = $('#resendOTPList').val();
        var user_array = [];
        $(".user_select").each( function() {
          if($(this).prop('checked'))
          {
            user_array.push($(this).val());
          }         
        });
        
        console.log(user_array);
        $("#user_id_for_resend_otp").val(user_array);
      }
      else{
        alert('Please select one user at a time');
        return false;
      }
    });


    // $scope.isActive = function (viewLocation) { 
    //     return viewLocation === $location.path();
    // };

    /*Modal code start*/
      $scope.showModal = false;
      $scope.toggleModal = function(userID){
          console.log('userID::'+userID);
          $scope.showModal = !$scope.showModal;
          $http({
              url: window.location.pathname+'/getParticularUser', 
              method: "GET",
              params: {user_id: userID}
          })
          .then(function(response) {
            console.log(response.data[0]);
            $scope.edit_user = response.data[0];
          });
          $http({
              url: window.location.pathname+'/getparticulargroup', 
              method: "GET",
              params: {group_id: userID}
          })
          .then(function(response) {
            console.log(response.data);
            $scope.group_users = response.data;
          });
      };
      $scope.toggleModalAdd = function(userID){
          $scope.showModal = !$scope.showModal;
      };

      /*Modal code end*/

});


app.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });

