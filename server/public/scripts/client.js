var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    })
    .when('/addEmployee' ,{
      templateUrl: '/views/templates/addEmployee.html',
      controller: 'AddEmployeeController',
      controllerAs: 'addEmployee'
    })
    .when('/employees' ,{
      templateUrl: '/views/templates/employees.html',
      controller: 'ViewEmployeeController',
      controllerAs: 'employeeController'
    })
    .otherwise({
      redirectTo: 'home'

    });
}]);

app.controller('HomeController', function() {
  console.log('home controller running');

  var self = this;

  self.message = "Home controller is the best!";



});//End HomeController

//add employee controller
app.controller('AddEmployeeController',["$http", function($http) {
  console.log('Add employee running');
  var self = this;
  self.message = "add Emp controller is the best!";

  self.newEmployee = {};
  self.employees = [];
  self.addEmployees = function() {
    console.log("new employee", self.newEmployee);

//POST request to add employee
    $http.post('/routes/addEmployee', self.newEmployee)
      .then(function(response) {
        self.newEmployee= {};
        console.log('POST finished. Get Employees again. ');

      });
    }
}]);//end add employee controller

//employees page
app.controller('ViewEmployeeController',["$http", function($http){
  console.log('employee controller running');
  var self = this;
  self.employees = [];
  self.monthly = [];
  getEmployees();
  getMonthlyCost();
  //request to get customer data
  function getEmployees() {
    $http.get('routes/employees')
    .then(function(response){
      self.employees = response.data;

      for (var i = 0; i < self.employees.length; i++) {
        if (self.employees[i].active == true) {
          self.employees[i].checkbox = "Active"
        } else {
          self.employees[i].checkbox = "Inactive"
        }
      }
      console.log("self.employees", self.employees);
    });
  }
  function getMonthlyCost() {
    $http.get('routes/monthly')
    .then(function(response){
      self.monthly = response.data;
    });
  }
  //post to determine Active/Inactive
  self.activity = function(activityObj){
    console.log("the chckbox works. here's the object: ", activityObj);
    $http.post('/routes/updateActivity', activityObj)
      .then(function(response) {
        getEmployees();
        getMonthlyCost();
        console.log('POST finished. Get Employees again. ');

      });
  }
  //DELETE a record
  self.deleteEmployee = function(deleteObj){
    console.log("Delete button pressed");
    $http.delete('routes/delete/' + deleteObj.id)
      .then(function(response){
        getEmployees();
        getMonthlyCost();
        console.log('DELETE finished. Get Employees again. ');
      });
  }
}]);
