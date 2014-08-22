myApp.controller "UserController", [
  "$scope"
  ($scope) ->
    io.socket.get "/user/subscribe", (data, qwe) ->
      $scope.users = data
      console.log data
      console.log qwe
      $scope.$apply()
      return

    $scope.updateUsers = (event) ->
      console.log "Event name:" + event.verb
      switch event.verb
        when "updated"
          $scope.updateUser event
        when "destroyed"
          $scope.destroyUser event
        when "created"
          $scope.createUser event
        else
          return false
      $scope.$apply()
      return

    io.socket.on "user", $scope.updateUsers
    $scope.updateUser = (event) ->
      angular.forEach $scope.users, (user) ->
        if user.id is event.data.id
          angular.forEach event.data, (value, key) ->
            user[key] = value
            return

          true

      return

    $scope.destroyUser = (event) ->
      angular.forEach $scope.users, (user) ->
        if user.id is event.id
          $scope.users.splice $scope.users.indexOf(user), 1
          true

      return

    $scope.createUser = (event) ->
      $scope.users.push event.data
      return

    $scope.loginStatus = (user) ->
      (if user.online then "online" else "offline")

    $scope.roleIcon = (user) ->
      (if user.admin then "admin" else "pawn")
]