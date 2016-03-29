var app = angular.module('drinkRec', [])
  .constant('R', window.R)
  // use in views, ng-repeat="x in _.range(3)"
  .run(function ($rootScope) {
     $rootScope.R = window.R;
  });

app.controller('drinkRecCtrl', function($scope, $http) {
  $scope.userInput = '';

  $http.get('../data/recipes.json')
    .then(function(res){
      $scope.drinkList = res.data;
      var rand = Math.floor((Math.random() * $scope.drinkList.length));
      $scope.selectedDrink = $scope.drinkList[rand];
    });

  $scope.getDrinks = function() {
    return R.filter(isAnOption, $scope.drinkList);
  }

  $scope.getAllNames = function() {
    return R.map(drinkName, $scope.getDrinks());
  }

  function drinkName(drink) {
    return drink.name;
  }

  function drinkIngredients(drink){
    return drink.ingredients.map(getIngredientString).join(' ').toLowerCase();
  }

  function getIngredientString(ingredientObject) {
    if (ingredientObject.special) return ingredientObject.special;
    if (ingredientObject.label) return ingredientObject.label + ' ' + ingredientObject.ingredient;
    if (ingredientObject.ingredient) return ingredientObject.ingredient;
    return '';
  }

  function isAnOption(drink){
    if ($scope.userInput === '') return true;
    return drinkIngredients(drink).indexOf($scope.userInput.toLowerCase()) !== -1;
  }

});