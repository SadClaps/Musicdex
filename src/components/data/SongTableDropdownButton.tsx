import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  Text,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
  VStack,
  IconButton,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { FiChevronDown, FiMoreHorizontal } from "react-icons/fi";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import { useStoreActions } from "../../store";

export function PlaylistSongTableDropDownMenu({
  song,
  ...rest
}: Omit<MenuProps, "children"> & { song: Song }) {
  const queue = useStoreActions((store) => store.playback.queueSongs);
  const addPlaylist = useStoreActions(
    (store) => store.addPlaylist.showPlaylistAddDialog
  );
  const copyToClipboard = useClipboardWithToast();

  return (
    <Menu {...rest} isLazy>
      <MenuButton
        //   py={2}
        icon={<FiMoreHorizontal />}
        as={IconButton}
        rounded="full"
        variant="ghost"
        colorScheme="n2"
        aria-label="More"
      ></MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            queue({ songs: [song], immediatelyPlay: true });
          }}
        >
          Play Now
        </MenuItem>
        <MenuItem
          onClick={() => {
            queue({ songs: [song], immediatelyPlay: false });
          }}
        >
          Add to Queue
        </MenuItem>
        <MenuItem
          onClick={() =>
            copyToClipboard(`${window.location.origin}/song/${song.id}`)
          }
        >
          Copy Song Link
        </MenuItem>
        <MenuItem
          onClick={() => {
            addPlaylist(song);
          }}
        >
          Add To Playlist...
        </MenuItem>
        <MenuDivider />
        <MenuItem>Go To Song Page</MenuItem>
        <MenuItem>Go To Video Page</MenuItem>
        <MenuItem>Go to Channel Page</MenuItem>
        {/* <MenuDivider /> */}
      </MenuList>
    </Menu>
  );
}
