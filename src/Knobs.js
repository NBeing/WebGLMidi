
const coarseIncEndlessEncoder = (e, knobNumber) => {
  return e.rawValue
}

const noteLengths = [1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2]

const cycleArrayOfValuesEndlessEncoder = (e, knobNumber, params) => {
  const {arrayToCycle} = params
  return arrayToCycle[e.rawValue % arrayToCycle.length]
}
class Knobs {
  knobTrackers = []
  types = {
    cycle: cycleArrayOfValuesEndlessEncoder,
    value: coarseIncEndlessEncoder,
  }
  constructor(){}

  addKnobHandler( name, knobNumber, type, initialValue, params = {}){
    this.knobTrackers.push({
      knobNumber,
      name,
      value: initialValue,
      prevValue: initialValue,
      type: type,
      params,
      handler: this.types[type]
    })
    // console.log("Updated knobTrackers", this.knobTrackers)

  }
  getKnobValue(name){
    let knobIndex = this.knobTrackers.findIndex( knobObj => {
      return knobObj.name == name
    })
    if(knobIndex == -1){
      debugger;
      return
    }
    return this.knobTrackers[knobIndex].value
  }
  updateKnobs(e){
    const knobNumber = e.dataBytes[0]
    let knobIndex = this.knobTrackers.findIndex( knobObj => {
      return knobObj.knobNumber == knobNumber
    })
    if(knobIndex == -1){
      return
    }
    // console.log("Found Knob!", knobIndex)
    const updatedValue = this.knobTrackers[knobIndex].handler(e, knobNumber, this.knobTrackers[knobIndex].params)
    this.knobTrackers[knobIndex].value = updatedValue
    // console.log("Updated knobTrackers", this.knobTrackers)
  }
}

module.exports = {
  coarseIncEndlessEncoder,
  cycleArrayOfValuesEndlessEncoder,
  noteLengths,
  Knobs
}
// const smoothIncEndlessEncoder = (e, knobNumber, type = "absolute", min = -1, max = 1, numClicksOnKnob = 16) => {
//   console.log("Current value", knobTrackers[knobNumber], e.dataBytes[1])
//   if (type == "absolute") {
//     knobTrackers[knobNumber] = e.rawValue
//   } else if (e.dataBytes[1] == 1) {
//     // not sure if all relative encoders work like this
//     knobTrackers[knobNumber] = clamp(knobTrackers[knobNumber] + (max / numClicksOnKnob), max)
//   } else if (e.dataBytes[1] == 127) {
//     knobTrackers[knobNumber] = floorClamp(knobTrackers[knobNumber] - (max / numClicksOnKnob), min)
//   }
//   console.log("Updating: ", knobNumber, "Value", knobTrackers[knobNumber])
// }
// const coarseIncEndlessEncoder = (e,knobNumber ) => {
//   if(e.dataBytes[1] == 1){
//     knobTrackers[knobNumber] += 1
//   } else if(e.dataBytes[1] == 127){
//     knobTrackers[knobNumber] -= 1
//   }
//   console.log(knobTrackers[knobNumber])
// }

// const cycleArrayOfValuesEndlessEncoder = (e, knobNumber, arrayToCycle) => {
//   const max = arrayToCycle.length - 1
//   const min = 0
//   if (e.rawValue > knobTrackers[knobNumber].prevEncValue) {
//     knobTrackers[knobNumber].index = knobTrackers[knobNumber].index + 1
//     if (knobTrackers[knobNumber].index > max) {
//       knobTrackers[knobNumber].index = min
//     }
//   } else if (e.rawValue < knobTrackers[knobNumber].prevEncValue) {
//     knobTrackers[knobNumber].index = knobTrackers[knobNumber].index - 1
//     if (knobTrackers[knobNumber].index < 0) {
//       knobTrackers[knobNumber].index = max
//     }
//   }
//   // if(e.dataBytes[1] == 1){
//   //   knobTrackers[knobNumber].index = knobTrackers[knobNumber].index + 1
//   //   if(knobTrackers[knobNumber].index > max){
//   //     knobTrackers[knobNumber].index = min
//   //   }
//   // } else if(e.dataBytes[1] == 127){
//   //   knobTrackers[knobNumber].index = knobTrackers[knobNumber].index - 1
//   //   if(knobTrackers[knobNumber].index < 0){
//   //     knobTrackers[knobNumber].index = max
//   //   }
//   // }
//   knobTrackers[knobNumber].value = arrayToCycle[knobTrackers[knobNumber].index]
//   knobTrackers[knobNumber].prevEncValue = e.rawValue

//   console.log("Cycle val", knobTrackers[knobNumber].value)
// }