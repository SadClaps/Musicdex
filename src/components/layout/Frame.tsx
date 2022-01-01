import {
  useDisclosure,
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Flex,
  ChakraProps,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { FiHome, FiHeart, FiClock, FiServer, FiSettings } from "react-icons/fi";
import Footer from "./Footer";
import { Player } from "../player/Player";
import { AddToPlaylistModal } from "../playlist/AddToPlaylistModal";
import { NavBar } from "../nav/NavBar";
import { LinkItemProps, SidebarContent } from "../nav/Sidebar";
import { YoutubePlayer } from "../player/YoutubePlayer";
import { YouTubePlayer } from "youtube-player/dist/types";

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, path: "/" },
  { name: "Recently Played", icon: FiClock, path: "/history" },
  { name: "Liked Songs", icon: FiHeart, path: "/liked" },
  { name: "My Playlists", icon: FiServer, path: "/playlists" },
  { name: "Settings", icon: FiSettings, path: "/settings" },
];

const POSITIONS: { [key: string]: ChakraProps } = {
  background: {
    position: "fixed",
    h: "100%",
    w: "100%",
    zIndex: -1,
  },
  sidebar: {
    position: "fixed",
  },
};

export default function FrameWithHeader({
  children,
}: {
  children?: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const colorMode = useColorModeValue("applight", "appdark");

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  function onReady(event: { target: YouTubePlayer }) {
    setPlayer(event.target);
  }

  return (
    <Box
      h="100vh"
      w="100vw"
      className={colorMode}
      bg={useColorModeValue("bg.100", "bg.900")}
      overflow="hidden"
    >
      <Flex direction="column" h="100vh" overflow="hidden">
        {/* Generic Display: always present */}
        <NavBar onOpen={onOpen} />

        {/* Mobile Display: (provide close method) */}
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} linkItems={LinkItems} />
          </DrawerContent>
        </Drawer>
        <Flex
          flexGrow={1}
          flexFlow="row nowrap"
          alignItems="stretch"
          overflow="hidden"
        >
          <SidebarContent
            onClose={onClose}
            display={{ base: "none", lg: "block" }}
            paddingTop="4"
            linkItems={LinkItems}
          />

          <Flex
            // ml={{ base: 0, md: 60 }}
            direction="column"
            alignItems="stretch"
            overflowY="scroll"
            h="100%"
            position="relative"
            flexGrow={1}
            flexShrink={1}
            zIndex={2}
          >
            {children}
            <Footer></Footer>
            <Box
              {...POSITIONS["background"]}
              // visibility={currentSong?"visible":"hidden"}
            >
              <Box
                width="100%"
                height="100%"
                position="absolute"
                float="initial"
                bgColor="bgAlpha.900"
              ></Box>
              {YoutubePlayer(onReady)}
            </Box>
          </Flex>
        </Flex>
        <Player player={player} />
        <AddToPlaylistModal />
      </Flex>
    </Box>
  );
}
