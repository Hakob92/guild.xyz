import {
  Box,
  Circle,
  Flex,
  Heading,
  HStack,
  Img,
  SimpleGrid,
  Spacer,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { PlatformType, Role } from "types"
import parseDescription from "utils/parseDescription"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import Requirements from "../Requirements"
import AccessIndicator from "../RolesByPlatform/components/RoleListItem/components/AccessIndicator"
import MemberCount from "./components/MemberCount"

type Props = {
  role: Role
}

const RoleCard = ({ role }: Props) => {
  const { guildPlatforms } = useGuild()
  const { isAdmin } = useGuildPermission()

  const [DynamicEditRole, setDynamicEditRole] = useState(null)

  useEffect(() => {
    if (isAdmin) {
      const EditRole = dynamic(
        () =>
          import("../RolesByPlatform/components/RoleListItem/components/EditRole")
      )
      setDynamicEditRole(EditRole)
    }
  }, [isAdmin])

  const { colorMode } = useColorMode()
  const iconSize = useBreakpointValue({ base: 48, md: 52 })

  return (
    <Card>
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <Flex
          direction="column"
          p={5}
          borderRightWidth={{ base: 0, md: 1 }}
          borderRightColor={colorMode === "light" ? "gray.200" : "gray.600"}
        >
          <HStack justifyContent="space-between" mb={6} spacing={4}>
            <HStack spacing={4}>
              <GuildLogo imageUrl={role.imageUrl} size={iconSize} iconSize={12} />
              <Heading as="h3" fontSize="xl" fontFamily="display">
                {role.name}
              </Heading>
            </HStack>

            <MemberCount memberCount={role.memberCount} />

            {DynamicEditRole && (
              <>
                <Spacer />
                <DynamicEditRole roleId={role.id} />
              </>
            )}
          </HStack>

          {role.description && (
            <Text mb={6} wordBreak="break-word">
              {parseDescription(role.description)}
            </Text>
          )}

          <Box mt="auto">
            {role.rolePlatforms?.map((platform) => {
              const guildPlatform = guildPlatforms?.find(
                (p) => p.id === platform.guildPlatformId
              )

              return (
                <HStack key={platform.guildPlatformId} pt="3">
                  <Circle size={6} overflow="hidden">
                    <Img
                      src={`/platforms/${PlatformType[
                        guildPlatform?.platformId
                      ]?.toLowerCase()}.png`}
                      alt={guildPlatform?.platformGuildName}
                      boxSize={6}
                    />
                  </Circle>
                  <Text as="span">
                    {guildPlatform?.platformId === PlatformType.DISCORD &&
                    !platform?.platformRoleData?.isGuarded
                      ? "Role in: "
                      : guildPlatform?.platformId === PlatformType.GOOGLE &&
                        typeof guildPlatform?.platformGuildData?.role === "string"
                      ? `${guildPlatform.platformGuildData.role[0].toUpperCase()}${guildPlatform.platformGuildData.role.slice(
                          1
                        )} access to: `
                      : "Access to: "}
                    <b>
                      {guildPlatform?.platformGuildName ||
                        (guildPlatform?.platformId === PlatformType.GITHUB &&
                          guildPlatform?.platformGuildId)}
                    </b>
                  </Text>
                </HStack>
              )
            })}
          </Box>
        </Flex>

        <Flex
          direction="column"
          p={5}
          pb={{ base: 14, md: 5 }}
          position="relative"
          bgColor={colorMode === "light" ? "gray.50" : "blackAlpha.300"}
        >
          <HStack justifyContent="space-between" spacing={0} mb={{ base: 4, md: 6 }}>
            <Text
              as="span"
              mt="1"
              mr="2"
              fontSize="xs"
              fontWeight="bold"
              color="gray"
              textTransform="uppercase"
              isTruncated
            >
              Requirements to qualify
            </Text>

            <AccessIndicator roleId={role.id} />
          </HStack>

          <Requirements requirements={role.requirements} logic={role.logic} />
        </Flex>
      </SimpleGrid>
    </Card>
  )
}

export default RoleCard
