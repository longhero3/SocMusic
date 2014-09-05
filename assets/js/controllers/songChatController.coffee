myApp.controller 'SongChatController',[
  '$scope', '$http', 'myCache'
  ($scope, $http, myCache) ->

    $scope.chatArea = ""

    $scope.chatMessages = []

    $scope.$watch 'currentSong', ->
      if $scope.currentSong?
        io.socket.on 'songChat', (data) ->
          $scope.chatMessages.push(data)
          $scope.$apply()
          $scope.scrollToBottom('.chat-area')

        window.onbeforeunload = ->
          io.socket.get '/song/unsubscribeSongRoom',
            user: $scope.shared.currentUser
            songId: $scope.currentSong.id
            listenerId: $scope.shared.currentListenerId
          , (data) ->
            console.log('User left')

#        io.socket.get '/songListener',
#          songId: $scope.currentSong.id
#        , (data) ->
#          $scope.listeners = data
#          $scope.$apply()

    $scope.sendMessage = ($event) ->
      if $event.keyCode == 13
        messageData =
          id: $scope.currentSong.id
          sender: $scope.shared.currentUser
          content: $scope.chatInput
        io.socket.get '/song/sendSongMessage', messageData, (data) ->
          console.log("Message sent")

        $scope.chatMessages.push(messageData)
        $scope.chatInput = ""
        $scope.scrollToBottom('.chat-area')

    $scope.scrollToBottom = (element) ->
      angular.element(element).animate
        scrollTop: $(element)[0].scrollHeight
      , 1000

    $scope.messageClass = (message) ->
      if message.sender.id == $scope.shared.currentUser.id then "self-message" else "other-message"

    $scope.whoSay = (message) ->
      if message.sender.id == $scope.shared.currentUser.id
        "You say:"
      else
        "#{message.sender.name} says:"
]
