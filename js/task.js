class Task {
  constructor(text, done = false) {
    this.id = Date.now(); // Unique ID based on timestamp
    this.text = text;
    this.done = done;
  }
}
