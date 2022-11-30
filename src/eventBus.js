// https://lwebapp.com/en/post/event-bus
class EventBus {
  constructor() {
    // initialize event list
    this.eventObject = {};
    // id of the callback function list
    this.callbackId = 0;
  }
  // publish event
  publish(eventName, ...args) {
    // console.log("publishing", eventName)
    // Get all the callback functions of the current event
    const callbackObject = this.eventObject[eventName];
    // console.log("Event object", this.eventObject)
    if (!callbackObject) return console.warn(eventName + " not found!");

    // execute each callback function
    for (let id in callbackObject) {
      // pass parameters when executing
      callbackObject[id](...args);

      // The callback function that is only subscribed once needs to be deleted
      if (id[0] === "d") {
        delete callbackObject[id];
      }
    }
  }
  // Subscribe to events
  subscribe(eventName, callback) {
    // initialize this event
    if (!this.eventObject[eventName]) {
      // Use object storage to improve the efficiency of deletion when logging out the callback function
      this.eventObject[eventName] = {};
    }

    const id = this.callbackId++;

    // store the callback function of the subscriber
    // callbackId needs to be incremented after use for the next callback function
    this.eventObject[eventName][id] = callback;

    // Every time you subscribe to an event, a unique unsubscribe function is generated
    const unSubscribe = () => {
      // clear the callback function of this subscriber
      delete this.eventObject[eventName][id];

      // If this event has no subscribers, also clear the entire event object
      if (Object.keys(this.eventObject[eventName]).length === 0) {
        delete this.eventObject[eventName];
      }
    };

    return { unSubscribe };
  }

  // only subscribe once
  subscribeOnce(eventName, callback) {
    // initialize this event
    if (!this.eventObject[eventName]) {
      // Use object storage to improve the efficiency of deletion when logging out the callback function
      this.eventObject[eventName] = {};
    }

    // Callback function marked as subscribe only once
    const id = "d" + this.callbackId++;

    // store the callback function of the subscriber
    // callbackId needs to be incremented after use for the next callback function
    this.eventObject[eventName][id] = callback;

    // Every time you subscribe to an event, a unique unsubscribe function is generated
    const unSubscribe = () => {
      // clear the callback function of this subscriber
      delete this.eventObject[eventName][id];

      // If this event has no subscribers, also clear the entire event object
      if (Object.keys(this.eventObject[eventName]).length === 0) {
        delete this.eventObject[eventName];
      }
    };

    return { unSubscribe };
  }

  // clear event
  clear(eventName) {
    // If no event name is provided, all events are cleared by default
    if (!eventName) {
      this.eventObject = {};
      return;
    }

    // clear the specified event
    delete this.eventObject[eventName];
  }
}
/* 
The midi tracker needs to know:
When the clock ticks
When events should be added
When to fire events

What does it delegate to the eventBus?
Should it just be the eventBus?

Adding events:
  Should be able to handle an "every x ticks"
  Should be able to handle an immediate event (e.g. triggering from bass drum)

  What should happen when the clock ticks?
Increase tick or go to 0 if period is over
For all registered events, fire the ones on this tick
De-register / clean events

The midi tracker should keep track of EVENTS not actions?
[
  0: [ eventA, eventB, eventC]
  1: [ eventC]
]
In other words the miditrackers job is to schedule events
Not to pass messages between them

On every tick we check what is in that ticks message queue
and publish each of them to the event bus
the eventBus should handle notifying all the listeners
so that they can receive their new values

Adding Events: 
  Series: Queue each event with an id and a series id
  Instant: Queue the event on that tick
  CountDown/Countup events: These would be interesting cases
    For these events we want them to happen once but maintain state
    i.e. We want these to fire between ticks
Deleting Events:

Well then, how are the messages passed?

What does it need to know in order to do this effectively?


*/
class MidiTracker {
  eventBus
  busLength
  bus
  tickIndex
  clockTickTimes = []
  bpm = 0
  constructor(eventBus, busLength, initBus = [], tickIndex = 0) {
    this.eventBus = eventBus
    this.busLength = busLength
    this.initBus = initBus
    this.bus = initBus.length > 0 ? initBus : new Array(this.busLength).fill([])
    this.tickIndex = tickIndex
  }

  handleClock(e){
    console.log("e", e)
    if(this.clockTickTimes.length){
      this.bpm = 60000 / ((e.timestamp - this.clockTickTimes[1]) * 12) // seems like bsp has 12 ppqn
    }
    this.clockTickTimes.unshift(e.timestamp)
    if(this.clockTickTimes.length > 5 ){
      this.clockTickTimes.pop()
    }
    console.log(this.bpm)
  }
  nudgeTick(offset){
    this.tickIndex = this.tickIndex + offset
  }
  tick(e){
    this.runAllEventsOnTick(this.tickIndex)
    this.tickIndex = this.tickIndex + 1
    if(this.tickIndex >= this.busLength ){
      this.tickIndex = 0
    }
    this.handleClock(e)
    // console.log("Running all events on current tick", this.tickIndex)
  }
  initEventBus(){
    this.eventBus.subscribe()
  }
  addEventToTick( _event, numTickToAddTo, addToCurrentTick=false){
    const tickToAddTo = addToCurrentTick ? this.tickIndex : numTickToAddTo
    this.bus[tickToAddTo] = [...this.bus[tickToAddTo], this.eventDecorator(_event)]
    // console.log("Bus after", this.bus[tickToAddTo])
  }
  addEventEveryNTicks( _event, nth, offset = 0){
    // console.log(`Adding ${_event} every ${nth}`)
    for (let i = offset; i < this.bus.length; i += nth) {
      this.addEventToTick(this.eventDecorator(_event), i)
    }
    console.log(this.bus)
  }
  eventDecorator(_event, runOnce = false, ){
    return {
      name: _event.name,
      _event,
      hasRun : false,
      runOnce,
    }
  }
  runEventNTimes(){

  }
  runEventOnce(_event, numTickToAddTo, addToCurrentTick = false ){
    const tickToAddTo = addToCurrentTick ? this.tickIndex : numTickToAddTo
    this.bus[tickToAddTo] = [...this.bus[tickToAddTo], this.eventDecorator(_event, true)]
  }
  runEventNow(_event ){
    this.publishEvent(this.eventDecorator(_event, true))
  }
  publishEvent(decoratedEvent) {
    this.eventBus.publish(decoratedEvent._event.name,decoratedEvent._event.func, decoratedEvent._event.num);
  }
  runAllEventsOnTick(tickIndex){
    // console.log("Events on this tick", this.bus[this.tickIndex] )
    if(this.bus[tickIndex].length > 0 ){
      this.bus[tickIndex].forEach( decoratedEvent => {
        this.publishEvent(decoratedEvent)
        if(decoratedEvent.runOnce && !decoratedEvent.hasRun){
          decoratedEvent.hasRun = true
          this.removeEventByNameOnTick(decoratedEvent.name, this.tickIndex)
        }
      })
    }
  }

  getEventsFromTick(){

  }

  getEventsByID(){

  }

  removeEventByNameOnTick(name, tick){
    const theTick = this.bus[tick]
    this.bus[tick] = theTick.filter(e => {
      e.name == name
    })
  }
  removeEventByNameFromAllTicks(name, tick){
    const theTick = this.bus[tick]
    this.bus[tick] = theTick.filter(e => {
      e.name == name
    })
  }
  removeAllEvents(){

  }
  reInit(){
    this.bus = this.initBus.length > 0 ? initBus : new Array(this.busLength).fill([])
  }
  clear(){
    this.bus = new Array(this.busLength).fill([])
  }
}


module.exports = {
  MidiTracker,
  EventBus
}
// eventBus.subscribe("eventX", (obj, num) => {
//   console.log("Module B", obj, num);
// });
// eventBus.subscribe("eventX", (obj, num) => {
//   console.log("Module C", obj, num);
// });

// publish event eventX
// eventBus.publish("eventX", { msg: "EventX published!" }, 1);

// clear
// eventBus.clear("eventX");

// Publish the event eventX again, since it has been cleared, all modules will no longer receive the message
// eventBus.publish("eventX", { msg: "EventX published again!" }, 2);
