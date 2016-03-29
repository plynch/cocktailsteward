var app = angular.module('drinkRec', [])
  .constant('R', window.R)
  // use in views, ng-repeat="x in _.range(3)"
  .run(function ($rootScope) {
     $rootScope.R = window.R;
  });

app.controller('drinkRecCtrl', function($scope, $http) {
  $scope.userInput = '';
  $scope.showPrompt = true;
  $scope.showResult = false;

  $http.get('../data/recipes.json')
    .then(function(res){
      $scope.drinkList = res.data;
      $scope.getRandomDrink();
    });

  $scope.pickDrink = function() {
    var choices = $scope.getDrinks();
    if (choices.length === 0) {
      $scope.getRandomDrink();
    } else {
      var rand = Math.floor((Math.random() * choices.length));
      $scope.selectedDrink = choices[rand];
    }
    toggle();
  }

  $scope.pickAnything = function() {
    $scope.getRandomDrink();
    toggle();
  }

  $scope.reRoll = function() {
    var choices = $scope.getDrinks();
    if (choices.length < 2) {
      $scope.getRandomDrink();
    } else {
      var oldDrink = $scope.selectedDrink;
      var counter = 0;
      while (oldDrink === $scope.selectedDrink && counter < 3) {
        var rand = Math.floor((Math.random() * choices.length));
        $scope.selectedDrink = choices[rand];
        counter++;
      }
      if ($scope.selectedDrink === oldDrink) $scope.getRandomDrink();
    }
  }

  $scope.getRandomDrink = function() {
    var rand = Math.floor((Math.random() * $scope.drinkList.length));
    $scope.selectedDrink = $scope.drinkList[rand];
    $scope.userInput = '';
  }

  $scope.doOver = function() {
    $scope.userInput = '';
    toggle();
  }

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

  function toggle() {
    $scope.showPrompt = !$scope.showPrompt;
    $scope.showResult = !$scope.showResult;
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