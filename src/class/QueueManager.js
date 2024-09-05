import '../extensions/array'

class QueueManager {
  constructor(queueKey, collection, config) {
    this.config = config
    this.queueKey = queueKey // Store the queue key for later use

    // Retrieve firstRoundCompleted from localStorage or initialize as empty
    const firstRoundFromStorage = JSON.parse(
      localStorage.getItem('firstRoundCompleted')
    )
    this.firstRoundCompleted = firstRoundFromStorage || {}

    // Retrieve the queue from localStorage, or create a new one if not found
    const queueFromStorage = JSON.parse(localStorage.getItem(queueKey))
    if (!queueFromStorage) {
      this.queue = this._createQueue(collection)
      this._initializeFirstRoundState()
      this._saveState() // Save initial state to localStorage
      return
    }

    // Initialize the queue from storage and handle empty arrays
    Object.keys(config).forEach((key) => {
      if (queueFromStorage.hasOwnProperty(key)) {
        if (queueFromStorage[key].flat().length === 0) {
          const newQueue = this._createQueue(collection)
          this.queue = { ...this.queue, [key]: newQueue[key] }
        } else {
          this.queue = queueFromStorage // Load the queue from storage
        }
      }
    })

    this._initializeFirstRoundState()
  }

  /**
   * Initialize the first round completion state for each key.
   */
  _initializeFirstRoundState() {
    Object.keys(this.config).forEach((key) => {
      if (!this.firstRoundCompleted.hasOwnProperty(key)) {
        this.firstRoundCompleted[key] = false
      }
    })

    // Save the firstRoundCompleted state to localStorage
    this._saveState()
  }

  /**
   * Save the current queue and firstRoundCompleted state to localStorage.
   */
  _saveState() {
    localStorage.setItem(this.queueKey, JSON.stringify(this.queue))
    localStorage.setItem(
      'firstRoundCompleted',
      JSON.stringify(this.firstRoundCompleted)
    )
  }

  /**
   *
   * @param {Array} collection
   * @returns
   */
  _createQueue(collection) {
    const shuffledCollection = collection.shuffle()
    const organizedCollection = Object.groupBy(
      shuffledCollection,
      ({ difficulty }) => difficulty
    )
    return this._transformCollection(organizedCollection)
  }

  _transformCollection(collection) {
    const queueSet = {}
    for (const key in this.config) {
      if (Object.prototype.hasOwnProperty.call(collection, key)) {
        const length = this.config[key]
        const items = collection[key]

        const subArrays = []
        for (let i = 0; i < items.length; i += length) {
          subArrays.push(items.slice(i, i + length))
        }

        queueSet[key] = subArrays
      }
    }

    return queueSet
  }

  isFirstRoundCompleted(key) {
    return this.firstRoundCompleted[key]
  }

  dequeue(key) {
    if (this.queue.hasOwnProperty(key)) {
      const arrays = this.queue[key]

      // Find the first non-empty array and dequeue the first element
      for (const array of arrays) {
        if (array.length > 0) {
          array.shift()

          // Check if the first sub-array is now empty to mark the first round as completed
          if (!this.firstRoundCompleted[key] && array.length === 0) {
            this.firstRoundCompleted[key] = true
          }
          break
        }
      }

      // Optionally remove empty sub-arrays after dequeuing
      this.queue[key] = arrays.filter((array) => array.length > 0)

      // Save updated state to localStorage
      this._saveState()
    }
  }

  getNext(key) {
    if (this.queue.hasOwnProperty(key)) {
      const arrays = this.queue[key]
      for (const array of arrays) {
        if (array.length > 0) {
          return array[0]
        }
      }
    }

    return null
  }
}

export default QueueManager
