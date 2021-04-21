import { resolveModuleName } from "typescript";

export const getResultsFromPlaylist = (data) => {
  console.log("Some information about this playlist", data.body);
  console.log(data.body.tracks.items);
  var song_items = data.body.tracks.items;
  var results = song_items.map((item) => {
    const smallestAlbumImage = item.track.album.images.reduce(
      (smallest, image) => {
        if (image.height < smallest.height) return image;
        return smallest;
      },
      item.track.album.images[0]
    );

    return {
      artist: item.track.artists[0].name,
      title: item.track.name,
      uri: item.track.uri,
      albumUrl: smallestAlbumImage.url,
    };
  });

  return results; 
};

export const getPlaylistIDFromBody = (body) => {
  var playlist_list = body.playlists.items; //list of playlists
  var length_playlist = playlist_list.length;
  var selected_playlist =
    playlist_list[Math.trunc(Math.random() * length_playlist)];
  var playlist_id = selected_playlist.id;
  return playlist_id;
};

export const getPlaylistFromEmotion = (spotifyApi, emotionRes) => {
  spotifyApi
    .searchPlaylists(emotionRes)
    .then(
      function (data) {
        return data.body;
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    )
    .then((body) => {
      var playlist_list = body.playlists.items; //list of playlists
      var length_playlist = playlist_list.length;
      var selected_playlist =
        playlist_list[Math.trunc(Math.random() * length_playlist)];
      var playlist_id = selected_playlist.id;
      return spotifyApi.getPlaylist(playlist_id);
    })
    .then(
      function (data) {
        console.log("Some information about this playlist", data.body);
        console.log(data.body.tracks.items);
        var song_items = data.body.tracks.items;
        var results = song_items.map((item) => {
          const smallestAlbumImage = item.track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            item.track.album.images[0]
          );

          return {
            artist: item.track.artists[0].name,
            title: item.track.name,
            uri: item.track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        });

        return results;
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    )
    .catch(() => {
      console.log("Error catched");
    });
};
