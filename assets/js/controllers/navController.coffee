myApp.controller 'NavController', [
  '$scope', '$http', 'myCache'
  ($scope, $http, myCache) ->

    $scope.setUsername = ($event) ->
      if [13, 9].indexOf($event.keyCode) > -1
        $http
          url: '/unknownUser'
          method: 'POST'
          data:
            id: $scope.shared.currentUser.id
            name: name
        .success (data) ->
          myCache.put('currentUser', $scope.shared.currentUser)
          $scope.editing = false

    $scope.userNavClass = ->
      if $scope.editing then "col-md-4" else "col-md-3"
]