var app = angular.module('myApp', ['ngGrid','ui.bootstrap','ngAnimate']);

app.controller('MyCtrl', function($scope, $modal) {
    $scope.myData = [{ID:"PRO-10015089",Title: "O.A.RFQ For Steel", StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:10000,CurrentStage:"Request For Quote",Status:"Started",action:""},
					{ID:"PRO-10015089",Title: "O.A.RFQ For Steel",StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:20000,CurrentStage:"Request For Quote",Status:"Started",action:""},
                     {ID:"PRO-10015089",Title: "O.A.RFQ For Electrical",StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:30000,CurrentStage:"Request For Quote",Status:"Issued",action:""},
                     {ID:"PRO-10015089",Title: "O.A.RFQ For Steel",StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:50000,CurrentStage:"Request For Quote",Status:"Started",action:""},
                     {ID:"PRO-10015089",Title: "O.A.RFQ For Electrical", StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:40000,CurrentStage:"Request For Quote",Status:"Issued",action:""},
					 {ID:"PRO-10015089",Title: "O.A.RFQ For Electrical ",StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:40000,CurrentStage:"Request For Quote",Status:"Issued",action:""},
					 {ID:"PRO-10015089",Title: "O.A.RFQ For Electrical",StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:40000,CurrentStage:"Request For Quote",Status:"Issued",action:""},
					 {ID:"PRO-10015089",Title: "O.A.RFQ For Electrical", StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:40000,CurrentStage:"Request For Quote",Status:"Issued",action:""},
					 {ID:"PRO-10015089",Title: "O.A.RFQ For Electrical", StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:40000,CurrentStage:"Request For Quote",Status:"Issued",action:""},
					 {ID:"PRO-10015089",Title: "O.A.RFQ For Electrical", StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:40000,CurrentStage:"Request For Quote",Status:"Issued",action:""},
					 {ID:"PRO-10015089",Title: "O.A.RFQ For Electrical", StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:40000,CurrentStage:"Request For Quote",Status:"Issued",action:""},
					 {ID:"PRO-10015089",Title: "O.A.RFQ For Electrical ", StartDate:"09/30/2015",LastDate:"10/30/2015",owner:"Saket",amount:40000,CurrentStage:"Request For Quote",Status:"Issued",action:""}];
    $scope.gridOptions = { 
	  paginationPageSizes: [10, 10],
    paginationPageSize: 10,
	rowHeight:30,
        data: 'myData',		
        enableCellSelection: true,
        enableRowSelection: false,
		
        enableCellEditOnFocus: true,
        columnDefs: [{field:'ID', displayName:'ID',cellClass: 'id-cls', enableCellEdit: true},
					{field: 'Title', displayName: 'Title',cellClass:'title_cls', enableCellEdit: true},                    		
					{ field: 'StartDate', displayName: 'StartDate',cellClass:'status_cls',type: 'date'},
					{ field: 'LastDate', displayName: 'LastDate',cellClass:'status_cls',type: 'date'},
                     {field:'owner', displayName:'Owner',cellClass:'owner_cls', enableCellEdit: true},
                     {field:'amount', displayName:'Amount($)',cellClass: 'amount-cls',enableCellEdit: true},
					 {field:'CurrentStage', displayName:'CurrentStage',cellClass:'status_cls', enableCellEdit: true},
					 {field:'Status', displayName:'Status',cellClass:'status_cls',enableCellEdit: true},
					 {field:'action',displayName:'Action', cellClass: 'action-cls',
					 cellTemplate:'<div class="btn-group"><a class="btn dropdown-toggle " data-toggle="dropdown" style="margin-left:2em;padding:1%" href="#" ><button>Actions</button></a><ul class="dropdown-menu   menubar">  <li ng-click="editForm(row)" >EDIT</li> <li ng-click="viewForm(row)" >VIEW</li></ul></div>', enableCellEdit: false}
					
					 ]
				
    };
	$scope.newForm = function () {
	debugger
	$scope.modalObj = $modal.open({
      backdrop: false,
      templateUrl: 'NewCntrl.html',
      controller: 'NewCntrl',
      windowClass: 'center-modal', 
      
    });
	
  };
	$scope.editForm = function (row) {
	$scope.data=[];
	$scope.data= JSON.stringify(row.entity); 
	$scope.modalObj = $modal.open({
      backdrop: false,
      templateUrl: 'EditCntrl.html',
      controller: 'EditCntrl',
      windowClass: 'center-modal',
	  resolve: {
		 data: function () {
           return $scope.data;
        }
	  }    
    });
	 localStorage.setItem("rowData",$scope.data);
  };
	$scope.viewForm = function (row) {
	$scope.data=[];
	   $scope.data= JSON.stringify(row.entity); 
	  
	debugger
	$scope.modalObj = $modal.open({
      templateUrl: 'ViewCntrl.html',
      controller: 'ViewCntrl',
      windowClass: 'center-modal',
	  resolve: {
		 data: function () {
           return $scope.data;
        }
	  }    
    });
	 localStorage.setItem("rowData",$scope.data);
  };





});


//controller for Edit
app.controller('EditCntrl', function ($scope, $modalInstance, data) {
    $scope.data = JSON.parse(data);
	 $scope.cancelDelete = function () {
 $modalInstance.dismiss('cancel');
  };
  $scope.save=function()
  {
	  confirm('Succesfully Updated');
 	 $modalInstance.dismiss('cancel');
 	 
  };
});
//controller for View
app.controller('ViewCntrl', function ($scope, $modalInstance, data) {
    $scope.data = JSON.parse(data);
	 $scope.cancelDelete = function () {
 $modalInstance.dismiss('cancel');
  };
});
//controller for New
app.controller('NewCntrl', function ($scope, $modalInstance) {

	 $scope.cancelDelete = function () {
 $modalInstance.dismiss('cancel');
  };
  $scope.save=function()
  {
	  confirm('Succesfully Created');
 	 $modalInstance.dismiss('cancel');
 	 
  };
});

