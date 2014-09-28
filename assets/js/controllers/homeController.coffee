myApp.controller 'HomeController', [
  '$scope', '$http', 'myCache', '$sce'
  ($scope, $http, myCache) ->

    $scope.init = ->
      $scope.shared =
        currentUser: ""
        listeners: []
        currentListenerId: ""
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