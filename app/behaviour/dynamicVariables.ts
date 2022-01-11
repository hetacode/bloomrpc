import { v4 as uuidv4 } from "uuid"

const variableAction: { [variable: string]: (p: string) => [string, boolean] } = {
  "{{:guid": generateGuid,
  // date now
  "{{:date": generateDate,
  // rnd 10
  // rnd 5 10
  "{{:rnd": generateRandom,
}

export const dynamicVariablesParser = (data: string) => {
  let result = data
  for (let [key, value] of Object.entries(variableAction)) {
    let variableOccurencesCount = result.match(new RegExp(key, "g"))?.length ?? 0
    for (let i = 0; i < variableOccurencesCount; i++) {
      let keyLength = key.length
      let variablePosition = result.indexOf(key)
      let variableEndPosition = result.indexOf("}}", variablePosition)
      if (variableEndPosition < 0) {
        continue
      }
      let params = result.substring(variablePosition + keyLength, variableEndPosition)

      let newValue = value(params.trim())
      if (newValue[1]) {
        // Remove closing braces
        result = result.substring(0, variablePosition + keyLength) + result.substring(variableEndPosition + 2)
        result = result.replace(key, newValue[0])
      }
    }
  }

  console.log(result)
  return result
}

function generateGuid(input: string): [string, boolean] {
  return [uuidv4(), true]
}

function generateDate(input: string): [string, boolean] {
  switch (input) {
    case "now":
      return [new Date().toISOString(), true]
  }

  return ["", false]
}

function generateRandom(input: string): [string, boolean] {
  if (!input) {
    return ["", false]
  }

  let inputArr = input.split(" ")
  let len = inputArr.length
  switch (len) {
    case 1:
      return [`${Math.floor(Math.random() * Number.parseInt(inputArr[0]))}`, true]
    case 2:
      let min = Number.parseInt(inputArr[0])
      let max = Number.parseInt(inputArr[1])
      return [`${Math.floor(Math.random() * (max - min) + min)}`, true]
    default:
      return ["", false]
  }
}
