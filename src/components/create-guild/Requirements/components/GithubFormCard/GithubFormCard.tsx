import { Divider, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useEffect } from "react"
import { useController, useFormState } from "react-hook-form"
import { Requirement } from "types"
import GithubStar from "./components/GithubStar"

type Props = {
  index: number
  field: Requirement
}

const githubRequirementTypes = [
  {
    label: "Star a reposiroty",
    value: "GITHUB_STARRING",
    GithubRequirement: GithubStar,
  },
]

const GithubFormCard = ({ index, field }: Props) => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `requirements.${index}.type`,
    rules: { required: "It's required to select a type" },
  })

  useEffect(() => onChange("GITHUB_STARRING"), [])

  const { errors } = useFormState()

  const selected = githubRequirementTypes.find((reqType) => reqType.value === value)

  return (
    <>
      <FormControl isInvalid={!!errors?.requirements?.[index]?.type?.message}>
        <FormLabel>Type</FormLabel>
        <StyledSelect
          defaultValue={"GITHUB_STARRING"}
          options={githubRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) => {
            onChange(newValue?.value)
          }}
          ref={ref}
          value={selected}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.GithubRequirement && (
        <>
          <Divider />
          <selected.GithubRequirement index={index} />
        </>
      )}
    </>
  )
}

export default GithubFormCard
