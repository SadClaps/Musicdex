import { Box, useColorModeValue, Text } from "@chakra-ui/react";
import { Fragment, Suspense } from "react";
import { XHRError } from "../components/common/XHRError";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useClient } from "../modules/client";
import { formatPlaylistID } from "../modules/playlist/useFormatPlaylist";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";

export default function History() {
  // const history = useStoreState((store) => store.playback.history);
  const { isLoggedIn, user } = useClient();
  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");
  // const {description, }
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  function Content() {
    const { data: playlist, ...status } = usePlaylist(
      formatPlaylistID(":history", {
        user_id: user?.id,
      })
    );
    return (
      <Fragment>
        <PlaylistHeading
          title={playlist?.title || "Recently Played"}
          description={playlist?.description || "Your recently played songs"}
          canEdit={false}
          editMode={false}
          count={playlist?.content?.length || 0}
        />
        {playlist?.content && (
          <PlaylistButtonArray
            playlist={playlist}
            canEdit={false}
            editMode={false}
            onPlayClick={() => {
              setPlaylist({ playlist });
            }}
            onAddQueueClick={() => {
              playlist.content &&
                queueSongs({
                  songs: [...playlist.content],
                  immediatelyPlay: false,
                });
            }}
          />
        )}
        <Suspense fallback={<div>Loading...</div>}>
          {playlist?.content && (
            <SongTable songs={playlist.content} virtualized />
          )}
        </Suspense>
      </Fragment>
    );
  }

  return (
    <PageContainer>
      <ContainerInlay mt="12">
        {isLoggedIn ? <Content /> : <XHRError />}
      </ContainerInlay>
    </PageContainer>
  );
}
