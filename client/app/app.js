var app = angular.module('drinkRec', []);

app.controller('drinkRecCtrl', function($scope, $http) {

  $http.get('../data/recipes.json')
    .then(function(res){
      $scope.drinkList = res.data;
      var rand = Math.floor((Math.random() * $scope.drinkList.length) + 1);
      $scope.selectedDrink = $scope.drinkList[rand];
    });
});