import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  SimpleGrid,
  Stack,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NftFormCard from "components/add-guild/NftFormCard"
import PickGuildPlatform from "components/add-guild/PickGuildPlatform"
import PoapFormCard from "components/add-guild/PoapFormCard"
import TokenFormCard from "components/add-guild/TokenFormCard"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import JSConfetti from "js-confetti"
import { useEffect, useRef, useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { RequirementType } from "temporaryData/types"

const CreateGuildPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })
  const jsConfetti = useRef(null)
  const [tokensList, setTokensList] = useState(null)

  useEffect(() => {
    // Pick TG by default as a platform
    methods.reset({
      guildPlatform: "TG",
    })

    // Initializing confetti
    if (!jsConfetti.current) {
      jsConfetti.current = new JSConfetti()
    }

    // Fetch ERC-20 tokens from Coingecko
    if (!tokensList) {
      fetch("https://tokens.coingecko.com/uniswap/all.json")
        .then((rawData) => rawData.json())
        .then((data) => setTokensList(data.tokens))
        .catch(console.error)
    }
  }, [])

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: methods.control,
    name: "requirements",
  })
  const onSubmit = (data) => {
    jsConfetti.current?.addConfetti({
      confettiColors: [
        "#6366F1",
        "#22c55e",
        "#ef4444",
        "#3b82f6",
        "#fbbf24",
        "#f472b6",
      ],
    })

    // TODO...
    console.log(data)
  }

  const addRequirement = (type: RequirementType) => {
    appendRequirement({ type })
  }

  const newGuildName = useWatch({ control: methods.control, name: "name" })

  return (
    <FormProvider {...methods}>
      <Layout
        title={newGuildName || "Create Guild"}
        action={
          <Button
            disabled={!account}
            rounded="2xl"
            colorScheme="green"
            onClick={methods.handleSubmit(onSubmit)}
          >
            Summon
          </Button>
        }
      >
        {account ? (
          <VStack spacing={8} alignItems="start">
            <Section title="Choose a Realm">
              <PickGuildPlatform />
            </Section>

            <Section title="Choose a name for your Guild">
              <FormControl isRequired isInvalid={methods.formState.errors.name}>
                <Input
                  maxWidth="sm"
                  {...methods.register("name", {
                    required: "This field is required.",
                  })}
                />
                <FormErrorMessage>
                  {methods.formState.errors.name?.message}
                </FormErrorMessage>
              </FormControl>
            </Section>

            {requirementFields.length && (
              <Section title="Requirements">
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  spacing={{ base: 5, md: 6 }}
                >
                  {requirementFields.map((requirementForm, i) => {
                    const type: RequirementType = methods.getValues(
                      `requirements.${i}.type`
                    )

                    if (type === "TOKEN_HOLD") {
                      return (
                        <TokenFormCard
                          // eslint-disable-next-line react/no-array-index-key
                          key={i}
                          index={i}
                          tokensList={tokensList}
                          clickHandler={() => removeRequirement(i)}
                        />
                      )
                    }

                    if (type === "NFT_HOLD") {
                      return (
                        <NftFormCard
                          // eslint-disable-next-line react/no-array-index-key
                          key={i}
                          index={i}
                          clickHandler={() => removeRequirement(i)}
                        />
                      )
                    }

                    if (type === "POAP") {
                      // eslint-disable-next-line react/no-array-index-key
                      return <PoapFormCard key={i} index={i} />
                    }

                    return <></>
                  })}
                </SimpleGrid>
              </Section>
            )}

            <Section title={requirementFields.length ? "Add more" : "Requirements"}>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={{ base: 5, md: 6 }}
              >
                <AddCard
                  text="Hold an NFT"
                  clickHandler={() => addRequirement("NFT_HOLD")}
                />
                <AddCard
                  text="Hold a Token"
                  clickHandler={() => addRequirement("TOKEN_HOLD")}
                />
                <AddCard
                  text="Hold a POAP"
                  clickHandler={() => addRequirement("POAP")}
                />
              </SimpleGrid>
            </Section>
          </VStack>
        ) : (
          <Alert status="error" mb="6">
            <AlertIcon />
            <Stack>
              <AlertDescription position="relative" top={1}>
                Please connect your wallet in order to continue!
              </AlertDescription>
            </Stack>
          </Alert>
        )}
      </Layout>
    </FormProvider>
  )
}

export default CreateGuildPage