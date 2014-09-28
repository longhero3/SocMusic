myApp.service 'myCache', ['DSCacheFactory', (DSCacheFactory) ->
  myCache = DSCacheFactory 'SocialMusicCache',
    maxAge: 900000
    cacheFlushInterval: 3600000
    deleteOnExpire: 'aggressive'
    storageMode: 'localStorage'
]