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
          data:
            userId: $scope.shared.currentUser.id

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
      $scope.listenToSongRoomEvent()
      io.socket.get '/song/subscribeSongRoom',
        id: song.id
        user: $scope.shared.currentUser
      , (data) ->
        $scope.retrieveSongListeners()

    $scope.listenToSongRoomEvent = ->
      io.socket.on 'songChatEntered', (data) ->
        console.log('Somebody entered the room')
        $scope.shared.listeners.push(data)
        $scope.shared.currentListenerId = data.listenerId if data.id == $scope.shared.currentUser.id
        $scope.$apply()

      io.socket.on 'songChatLeft', (data) ->
        angular.forEach $scope.shared.listeners, (listener) ->
          if listener.id == data.id
            songIndex = $scope.shared.listeners.indexOf(listener)
            $scope.shared.listeners.splice(songIndex, 1)
            $scope.$apply()
            return

    $scope.retrieveSongListeners = ->
      $http
        method: "GET"
        url: '/songListener'
        data:
          songId: $scope.currentSong.id
      .success (data) ->
        $scope.shared.listeners = data

    $scope.hideSongRoom = ->
      $scope.shared.chatOpened = false
]