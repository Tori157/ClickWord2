import '../extensions/array';

class QueueManager {
  constructor(queueKey, collection, config) {
    this.config = config;
    this.queueKey = queueKey;

    // Retrieve initial states from localStorage or initialize them if not found
    this.firstRoundCompleted = JSON.parse(localStorage.getItem('firstRoundCompleted')) || {};
    this.queue = JSON.parse(localStorage.getItem(queueKey)) || this._createAndInitializeQueue(collection);

    // Ensure firstRoundCompleted has all required keys initialized
    this._initializeFirstRoundState();
  }

  /**
   * Initializes the queue and first round state, then saves them to localStorage.
   */
  _createAndInitializeQueue(collection) {
    const queue = this._createQueue(collection);
    this._initializeFirstRoundState();
    this._saveState();
    return queue;
  }

  /**
   * Initialize the first round completion state for each key.
   */
  _initializeFirstRoundState() {
    Object.keys(this.config).forEach((key) => {
      this.firstRoundCompleted[key] = this.firstRoundCompleted[key] ?? false;
    });
    this._saveState();
  }

  /**
   * Save the current queue and firstRoundCompleted state to localStorage.
   */
  _saveState() {
    localStorage.setItem(this.queueKey, JSON.stringify(this.queue));
    localStorage.setItem('firstRoundCompleted', JSON.stringify(this.firstRoundCompleted));
  }

  /**
   * Creates and organizes the queue based on the collection and config.
   * @param {Array} collection
   * @returns {Object} Organized queue
   */
  _createQueue(collection) {
    const shuffledCollection = collection.shuffle();
    const organizedCollection = Object.groupBy(shuffledCollection, ({ difficulty }) => difficulty);
    return this._transformCollection(organizedCollection);
  }

  /**
   * Transforms the organized collection into sub-arrays based on the config.
   * @param {Object} collection
   * @returns {Object} Queue set with sub-arrays
   */
  _transformCollection(collection) {
    return Object.fromEntries(
      Object.entries(this.config).map(([key, length]) => {
        const items = collection[key] || [];
        const subArrays = Array.from({ length: Math.ceil(items.length / length) }, (_, i) =>
          items.slice(i * length, i * length + length),
        );
        return [key, subArrays];
      }),
    );
  }

  /**
   * Checks if the first round for a given key is completed.
   * @param {String} key
   * @returns {Boolean}
   */
  isFirstRoundCompleted(key) {
    return this.firstRoundCompleted[key] || false;
  }

  /**
   * Dequeues an item from the queue and updates the state.
   * @param {String} key
   */
  dequeue(key) {
    const arrays = this.queue[key] || [];

    for (const array of arrays) {
      if (array.length > 0) {
        array.shift();
        if (!this.firstRoundCompleted[key] && array.length === 0) {
          this.firstRoundCompleted[key] = true;
        }
        break;
      }
    }

    // Filter out empty arrays and save the updated state
    this.queue[key] = arrays.filter((array) => array.length > 0);
    this._saveState();
  }

  /**
   * Retrieves the next item in the queue for the given key.
   * @param {String} key
   * @returns {Object|null}
   */
  getNext(key) {
    return this.queue[key]?.find((array) => array.length > 0)?.[0] || null;
  }
}

export default QueueManager;
