class Task {
  constructor(text, done = false) {
    this.id = Date.now();
    this.text = text;
    this.done = done;
    this.created_date = new Date();
  }
}
