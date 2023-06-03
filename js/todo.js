// TodoList class
class TodoList {
    constructor() {
      this.enterButton = document.getElementById("enter");
      this.input = document.getElementById("userInput");
      this.ul = document.querySelector("ul");
      this.item = document.getElementsByTagName("li");
      
      this.enterButton.addEventListener("click", this.addListAfterClick.bind(this));
      this.input.addEventListener("keypress", this.addListAfterKeypress.bind(this));
    }
    
    inputLength() {
      return this.input.value.length;
    }
    
    listLength() {
      return this.item.length;
    }
    
    createListElement() {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(this.input.value));
      this.ul.appendChild(li);
      this.input.value = "";
      
      li.addEventListener("click", () => this.crossOut(li));
      this.addDeleteButton(li);
    }
    
    crossOut(li) {
      li.classList.toggle("done");
    }
    
    addDeleteButton(li) {
      const dBtn = document.createElement("button");
      dBtn.appendChild(document.createTextNode("X"));
      li.appendChild(dBtn);
      
      dBtn.addEventListener("click", () => this.deleteListItem(li));
    }
    
    deleteListItem(li) {
      li.classList.add("delete");
    }
    
    addListAfterClick() {
      if (this.inputLength() > 0) {
        this.createListElement();
      }
    }
    
    addListAfterKeypress(event) {
      if (this.inputLength() > 0 && event.which === 13) {
        this.createListElement();
      }
    }
  }
  
  // Create a new instance of TodoList
  const todoList = new TodoList();
  