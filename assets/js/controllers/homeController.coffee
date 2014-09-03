myApp.controller 'HomeController', [
  '$scope', '$http', 'myCache'
  ($scope, $http, myCache) ->

    $scope.init = ->
      $scope.shared =
        currentUser: ""
      if myCache.get('currentUser')?
        $scope.shared.currentUser = myCache.get('currentUser')
      else
        $http
          url: '/unknownUser'
          method: 'POST'
        .success (data) ->
          myCache.put('currentUser', data)
          $scope.shared.currentUser = data
]