import "../extensions/array";

class QueueManager {
  constructor(queueKey, collection, config) {
    this.config = config;
    this.firstRoundCompleted = {}; // Track first round completion state for each key
    const queueFromStorage = JSON.parse(localStorage.getItem(queueKey));
    if (!queueFromStorage) {
      this.queue = this._createQueue(collection);
      this._initializeFirstRoundState();
      return;
    }

    Object.keys(config).forEach((key) => {
      if (queueFromStorage.hasOwnProperty(key)) {
        if (queueFromStorage[key].flat().length === 0) {
          const newQueue = this._createQueue(collection);
          this.queue = { ...this.queue, [key]: newQueue[key] };
        }
      }
    });

    this._initializeFirstRoundState();
  }

  /**
   * Initialize the first round completion state for each key.
   */
  _initializeFirstRoundState() {
    Object.keys(this.config).forEach((key) => {
      this.firstRoundCompleted[key] = false;
    });
  }

  /**
   *
   * @param {Array} collection
   * @returns
   */
  _createQueue(collection) {
    const shuffledCollection = collection.shuffle();
    const organizedCollection = Object.groupBy(
      shuffledCollection,
      ({ difficulty }) => difficulty,
    );
    return this._transformCollection(organizedCollection);
  }

  _transformCollection(collection) {
    const queueSet = {};
    for (const key in this.config) {
      if (Object.prototype.hasOwnProperty.call(collection, key)) {
        const length = this.config[key];
        const items = collection[key];

        const subArrays = [];
        for (let i = 0; i < items.length; i += length) {
          subArrays.push(items.slice(i, i + length));
        }

        queueSet[key] = subArrays;
      }
    }

    return queueSet;
  }

  isFirstRoundCompleted(key) {
    return this.firstRoundCompleted[key];
  }

  dequeue(key) {
    if (this.queue.hasOwnProperty(key)) {
      const arrays = this.queue[key];

      // Find the first non-empty array and dequeue the first element
      for (const array of arrays) {
        if (array.length > 0) {
          array.shift();

          // Check if the first sub-array is now empty to mark the first round as completed
          if (!this.firstRoundCompleted[key] && array.length === 0) {
            this.firstRoundCompleted[key] = true;
          }
          break;
        }
      }

      // Optionally remove empty sub-arrays after dequeuing
      this.queue[key] = arrays.filter((array) => array.length > 0);
    }
  }

  getNext(key) {
    if (this.queue.hasOwnProperty(key)) {
      const arrays = this.queue[key];
      for (const array of arrays) {
        if (array.length > 0) {
          return array[0];
        }
      }
    }

    return null;
  }
}

export default QueueManager;
