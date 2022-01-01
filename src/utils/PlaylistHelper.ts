// series of Helper functions for playlists

import { extractUsingFn, isSGPPlaylist } from "./SGPFunctions";

export function identifyPlaylistBannerImage(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    console.log('extracting..."');
    return extractUsingFn(playlist, {
      ":dailyrandom": (p, { ch }, d) => {
        return `/api/statics/channelImg/${ch || d?.channel?.id}/banner/3.jpeg`;
      },
      ":userweekly": (p, { user }, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}/banner/3.jpeg`;
        } else {
          return undefined;
        }
      },
      ":weekly": (p, { org }, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}/banner/3.jpeg`;
        } else {
          return undefined;
        }
      },
      ":history": (p, _, __) => {
        return undefined;
      },
    });
  } else {
    console.log(playlist);
    if (playlist.content && playlist.content[0]) {
      return `/api/statics/channelImg/${playlist.content[0].channel_id}/banner/3.jpeg`;
    } else {
      return undefined;
    }
  }
}

export function identifyPlaylistChannelImage(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    return extractUsingFn(playlist, {
      ":dailyrandom": (p, { ch }, d) => {
        return `/api/statics/channelImg/${ch || d?.channel.id}/200.png`;
      },
      ":userweekly": (p, { user }, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}/200.png`;
        } else {
          return undefined;
        }
      },
      ":weekly": (p, { org }, _) => {
        if (p.content && p.content[0]) {
          return `/api/statics/channelImg/${p.content[0].channel_id}/200.png`;
        } else {
          return undefined;
        }
      },
      ":history": (p, _, __) => {
        return undefined;
      },
    });
  } else {
    if (playlist.content && playlist.content[0]) {
      return `/api/statics/channelImg/${playlist.content[0].channel_id}/200.png`;
    } else {
      return undefined;
    }
  }
}

export function identifyTitle(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    return extractUsingFn(playlist, {
      ":dailyrandom": (p, { ch }, d) => {
        return `Daily Mix: ${d?.channel.english_name}`;
      },
      ":userweekly": (p, { user }, _) => {
        return `Your Weekly Mix`;
      },
      ":weekly": (p, { org }, _) => {
        return `${org} Weekly Mix`;
      },
      ":history": (p, _, __) => {
        return "Recently Played";
      },
    });
  } else {
    return playlist.title;
  }
}

export function identifyDescription(playlist: Partial<PlaylistFull>) {
  if (isSGPPlaylist(playlist.id!)) {
    return extractUsingFn(playlist, {
      ":dailyrandom": (p, { ch }, d) => {
        return `Generated by Holodex.`;
      },
      ":userweekly": (p, { user }, _) => {
        return `Generated weekly by Holodex based on your past listens.`;
      },
      ":weekly": (p, { org }, _) => {
        return `Generated every week by Holodex.`;
      },
      ":history": (p, _, __) => {
        return "Your recently played songs";
      },
    });
  } else {
    return playlist.description;
  }
}
