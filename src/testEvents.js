const runDummyEvents = (midiTracker) => {
  midiTracker.addEventToTick({
    name: "nameEvent",
    func: () => {
      // console.log("Running NameEvent")
      // if(overrides.hasOwnProperty('u_time')){
      //   overrides.u_time++ 
      // } else {
      //   overrides.u_time = 0
      // }

      // console.log("This event just once per cycle", testObj)
    },
    num: 2
  },
    2
  )
  midiTracker.addEventToTick(
    {
      name: "nuTimer",
      func: () => {
        // console.log("spawning nu_time")
        // spawnTimer("nu_time")
      },
      num: 2
    },
    0
  )
  midiTracker.runEventOnce(
    {
      name: "runOnce",
      func: () => console.log("This Event runs once..."),
      num: 2
    },
    0,
    1
  )
  window.setTimeout(() => {
    midiTracker.runEventNow(
      {
        name: "runNow",
        func: () => console.log("This Event runs NOW..."),
        num: 2
      },
      0,
      1
    )
  }, 1000)
  midiTracker.addEventEveryNTicks(
    {
      name: "nTicksTest",
      func: () => console.log("This Event every..."),
      num: 2
    },
    2,
    1
  )
}

function makeMidiMessage(data) {
  return {
    data: [data]
  }
}

module.exports = {
  runDummyEvents,
  makeMidiMessage
}