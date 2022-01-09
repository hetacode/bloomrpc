import { v4 as uuidv4 } from "uuid"

const variableAction: { [variable: string]: (p: string) => string } = {
  "{{:guid}}": generateGuid,
  // TODO:
  // :date now
  // :rnd min max - random between
}

export const dynamicVariablesParser = (data: string) => {
  let result = data
  for (let [key, value] of Object.entries(variableAction)) {
    let variableOccurencesCount = result.match(new RegExp(key, "g"))?.length ?? 0
    for (let i = 0; i < variableOccurencesCount; i++) {
      result = result.replace(key, value(key))
    }
  }
  return result
}

function generateGuid(input: string) {
  return uuidv4()
}
