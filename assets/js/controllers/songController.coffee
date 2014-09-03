myApp.controller "SongController", [
  "$scope", "$http", "$filter"

  ($scope, $http, $filter) ->
    io.socket.get "/song/subscribe", (data) ->
      $scope.songs = $filter('orderBy')(data,'-playCount', false)
      $scope.$apply()
      $('.songs').mixItUp()

    $scope.shared.chatOpened = false

    $scope.init = ->
      angular.element("#currentSongPlayer").jPlayer
      return

    $scope.updateSongs = (event) ->
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
      if $scope.currentSong != song
        $scope.currentSong = song
        $http
          url: "/song/#{song.id}/increasePlayCount"
          method: 'POST'
          data: $scope.currentUser

    $scope.songRank = (song) ->
      song.playCount

    $scope.isSongSelected = ->
      $scope.currentSong?

    $scope.playerShownClass = ->
      "hidden" unless $scope.currentSong?

    $scope.openChatClass = ->
      "move-right" if $scope.shared.chatOpened == true

    $scope.joinSongRoom = (song) ->
      $scope.shared.chatOpened = true
      io.socket.get '/song/subscribeSongRoom',
        id: song.id
      , (data) ->
        console.log('subscribed')

    $scope.hideSongRoom = ->
      $scope.shared.chatOpened = false
]