const createBehavior = ( _this, name,  type, operatesOn, tickEvery, on, fn) => {
  
    return {
      name,
      tickEvery,
      ttlInTicks: tickEvery,
      on,
      fn,
      _this,
      type,
      operatesOn
    }
  }
  class Behavior { 
    value
    ttlInTicks
    hasRun = false
  
    constructor(
      name,
      tickEvery,
      on,
      fn,
      type,
      operatesOn,
      initialValue
    ){
      this.name = name,
      this.tickEvery = tickEvery,
      this.ttlInTicks = tickEvery,
      this.on = on,
      this.fn = fn,
      this.type = type,
      this.operatesOn = operatesOn
      this.value = initialValue
      this.initialValue = this.value
    }
    tick(_override){
      this.ttlInTicks = this.ttlInTicks - 1;
      if (this.ttlInTicks == 0){
        _override = this.fn(_override, this)
        this.ttlInTicks = this.tickEvery
        this.hasRun = true
      }
      return _override
    }
    getValue(){
      return this.value
    }
    getHasRun(){
      return this.hasRun
    }
    getType(){
      return this.type
    }
    getOperatesOn(){
      return this.operatesOn
    }
    setValue( _val ){
      this.value = _val
    }
    getDefaultValue(){
      return this.initialValue
    }
  }
  
  // This tracks the sync from the midi controller
  class Midi_Clock {
    ticks = 0
    TICKS_PER_BEAT
    BEATS_PER_MEASURE
    overrides = {}
    behaviors = [];
    // The midi clock sends 24 messages per quarter note
    constructor(_ticks_per_beat = 24, _beats_per_measure = 4) {
      this.TICKS_PER_BEAT = _ticks_per_beat || this.TICKS_PER_BEAT
      this.BEATS_PER_MEASURE = _beats_per_measure || this.BEATS_PER_MEASURE
    }
    addBehavior( behavior ){
      this.behaviors.push(behavior)
    }
    tick() {
      this.ticks = this.ticks + 1
      if(!this.behaviors.length){
        return;
      }
      this.behaviors.forEach(b => {
        const val = b.tick(this.overrides)
        if(val[b.getOperatesOn()]){
          if(b.getType() == "ONCE" && b.getHasRun()){
            delete this.overrides[b.getOperatesOn()] 
          } else {
            this.overrides[b.getOperatesOn()] = val[b.getOperatesOn()] 
          }
        }
      })
    }
    getTick() {
      return this.ticks
    }
    setTick(_val) {
      this.ticks = val
    }
    reset() {
      this.ticks = 0
    }
    checkPulse() {
      return this.ticks == this.TICKS_PER_BEAT
    }
    checkMeasure() {
      return this.ticks == this.TICKS_PER_BEAT * this.BEATS_PER_MEASURE
    }
    getOverrides(){
      // console.log("getting", this.overrides)
      return this.overrides
    }
    filterRunOnceOverrides(){
        // console.log(this.behaviors)
        // if(this.behaviors.length < 1){
        //   return;
        // }
        // this.behaviors = this.behaviors.filter(behavior => {
        //   console.log("In filter", behavior)
        //   if(behavior.getHasRun() == true && behavior.type == "ONCE"){
        //     console.log("Deleting")
        //     return false
        //   }
        //   return true
        // })
    }
  }
  // Just create a queue you dum dum
const testBehavior = new Behavior(
    "test",
    24,
    null,
    (override, _this) => {
      const newColor = [Math.random(), Math.random(), Math.random(),1.0]
      _this.setValue(newColor)
      override.color = newColor
      return override
    },
    "PERSIST",
    "color",
    [0,0,0,0]
  )
  const testBehavior2 = new Behavior(
    "updateClock",
    1,
    null,
    (override, _this) => {
      const newTime = override.u_time == undefined ? 0 : override.u_time + .01 
      _this.setValue(newTime)
      override.u_time = newTime
      return override
    },
    "PERSIST",
    "color",
    0,
  )
  const testBehavior3 = new Behavior(
    "texRotation",
    24,
    null,
    (override, _this) => {
      console.log("override", override.texRotation)
      const newRotation = override.texRotation == undefined ? _this.getDefaultValue() : [[Math.random() * 10, Math.random() * 10]]
      console.log(newRotation)
      _this.setValue(newRotation)
      override.texRotation = newRotation
      return override
    },
    "PERSIST",
    "color",
    [Math.random() * 10, Math.random() * 10]
  )
  // Clock.addBehavior(testBehavior)
  // Clock.addBehavior(testBehavior2)
  // Clock.addBehavior(testBehavior3)
  
