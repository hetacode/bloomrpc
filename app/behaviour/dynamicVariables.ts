import { v4 as uuidv4 } from "uuid"

const variableAction: { [variable: string]: (p: string) => string } = {
  "{{:guid": generateGuid,
  "{{:date": generateDate,
  // TODO:
  // :rnd min max - random between
}

export const dynamicVariablesParser = (data: string) => {
  let result = data
  for (let [key, value] of Object.entries(variableAction)) {
    let variableOccurencesCount = result.match(new RegExp(key, "g"))?.length ?? 0
    for (let i = 0; i < variableOccurencesCount; i++) {
      let keyLength = key.length
      let variablePosition = result.indexOf(key)
      let variableEndPosition = result.indexOf("}}", variablePosition + 1)
      let params = result.substring(variablePosition + keyLength + 1, variableEndPosition)

      // Remove closing braces
      result = result.substring(0, variablePosition + keyLength) + result.substring(variableEndPosition + 2);
      result = result.replace(key, value(params))
    }
  }

  console.log(result)
  return result
}

function generateGuid(input: string) {
  return uuidv4()
}

function generateDate(input: string) {
  switch (input) {
    case "now":
      return (new Date()).toLocaleDateString();
  }

  return ""
}
