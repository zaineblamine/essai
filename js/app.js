angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })
    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
        }
      }
    });

  $urlRouterProvider.otherwise("/event/home");
})
.controller('MainCtrl', function($scope, $timeout, $filter) {

  $scope.users = [
    {id: 1, name: "Valentina", selected: true},
    {id: 2, name: "Juan David", selected: false},
    {id: 3, name: "Osman", selected: false},
    {id: 4, name: "Silva", selected: false}
  ];

  $scope.groups = [
    {Id: 1, Name: "Admin", Selected: false},
    {Id: 2, Name: "Developers", Selected: false},
    {Id: 3, Name: "Testers", Selected: false},
    {Id: 4, Name: "Users", Selected: false}
  ];

  $scope.getOptionsSelected = function(options, valueProperty, selectedProperty){
    var optionsSelected = $filter('filter')(options, function(option) {return option[selectedProperty] == true; });
    return optionsSelected.map(function(group){ return group[valueProperty]; }).join(", ");
  };
})
.directive('ionMultipleSelect', ['$ionicModal', '$ionicGesture', function ($ionicModal, $ionicGesture) {
  return {
    restrict: 'E',
    scope: {
      options : "="
    },
    controller: function ($scope, $element, $attrs) {
      $scope.multipleSelect = {
        title:            $attrs.title || "Select Options",
        tempOptions:      [],
        keyProperty:      $attrs.keyProperty || "id",
        valueProperty:    $attrs.valueProperty || "value",
        selectedProperty: $attrs.selectedProperty || "selected",
        templateUrl:      $attrs.templateUrl || 'templates/multipleSelect.html',
        renderCheckbox:   $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
        animation:        $attrs.animation || 'slide-in-up'
      };

      $scope.OpenModalFromTemplate = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope,
          animation: $scope.multipleSelect.animation
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };

      $ionicGesture.on('tap', function (e) {
       $scope.multipleSelect.tempOptions = $scope.options.map(function(option){
         var tempOption = { };
         tempOption[$scope.multipleSelect.keyProperty] = option[$scope.multipleSelect.keyProperty];
         tempOption[$scope.multipleSelect.valueProperty] = option[$scope.multipleSelect.valueProperty];
         tempOption[$scope.multipleSelect.selectedProperty] = option[$scope.multipleSelect.selectedProperty];

         return tempOption;
       });
        $scope.OpenModalFromTemplate($scope.multipleSelect.templateUrl);
      }, $element);

      $scope.saveOptions = function(){
        for(var i = 0; i < $scope.multipleSelect.tempOptions.length; i++){
          var tempOption = $scope.multipleSelect.tempOptions[i];
          for(var j = 0; j < $scope.options.length; j++){
            var option = $scope.options[j];
            if(tempOption[$scope.multipleSelect.keyProperty] == option[$scope.multipleSelect.keyProperty]){
              option[$scope.multipleSelect.selectedProperty] = tempOption[$scope.multipleSelect.selectedProperty];
              break;
            }
          }
        }
        $scope.closeModal();
      };

      $scope.closeModal = function () {
        $scope.modal.remove();
      };
      $scope.$on('$destroy', function () {
          if ($scope.modal){
              $scope.modal.remove();
          }
      });
    }
  };
}]);
