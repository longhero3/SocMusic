myApp.controller "SongController", [
  "$scope", "$http", "$filter"

  ($scope, $http, $filter) ->
    io.socket.get "/song/subscribe", (data) ->
      $scope.songs = $filter('orderBy')(data,'-playCount', false)
      $scope.$apply()
      $('.songs').mixItUp()

    $scope.init = ->
      angular.element("#currentSongPlayer").jPlayer
      return

    $scope.updateSongs = (event) ->
      console.log("Song update event")
      switch event.verb
        when 'updated'
          $scope.updateSong(event)
        else
          console.log('nothing happended')

      $scope.$apply()
      $('.songs').mixItUp('sort', 'order:desc')

      angular.element("#currentSongPlayer").html("")
      angular.element("#currentSongPlayer").html("<div id='song-player'></div>")
      angular.element("#song-player").jPlayer
        ready: ->
          $(this).jPlayer "setMedia",
            title: $scope.currentSong.name + " - " + $scope.currentSong.singer
            mp3: "http://localhost:1337/uploads/#{$scope.currentSong.src}"

          $(this).jPlayer "play"

          return

        supplied: "mp3"
        size:
          width: "100%",
          height: "180px"
      return

    io.socket.on "song", $scope.updateSongs

    $scope.updateSong = (event) ->
      angular.forEach $scope.songs, (song) ->
        if song.id == event.id
          song.playCount = event.data.playCount
          return

    $scope.playSong = (song) ->
      $http.get("/song/#{song.id}/increasePlayCount")
      $scope.currentSong = song


    $scope.songRank = (song) ->
      song.playCount

    $scope.isSongSelected = ->
      $scope.currentSong?

    $scope.playerShownClass = ->
      console.log $scope.currentSong?
      "hidden" unless $scope.currentSong?
]