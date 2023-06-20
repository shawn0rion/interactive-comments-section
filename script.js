class User {
  constructor(name, isUser = false) {
    this.name = name;
    this.isUser = isUser;
    this.pfp = "";
    this.messages = [];
  }

  sendMessage(text) {
    const message = new Message(text, this);
    this.messages.push(message);
    renderMessage(message);
    return message;
  }

  sendReply(parent, text) {
    const message = new Message(text, this);
    message.parent = parent;
    parent.replies.push(message);
    let tempParent = parent;
    while (tempParent !== "") {
      message.nestedLevel += 1;
      tempParent = tempParent.parent;
    }
    renderMessage(message);
    return message;
  }
}

class Message {
  constructor(text, user) {
    this.parent = "";
    this.nestedLevel = 0;
    this.text = text;
    this.user = user;
    this.timeSincePost = new Date().toLocaleDateString;
    this.replies = [];
  }

  delete() {
    console.log("delete: ", this);
    this.user.messages = this.user.messages.filter((x) => x !== this);
  }

  edit(text) {
    if (text === "") return;
    this.text = text;
  }
}

function renderMessage(message) {
  const messages = document.querySelector("#messages");
  const li = document.createElement("li");
  // add classes to message
  li.className = "message";
  message.parent !== "" ? li.classList.add("reply") : "";
  li.textContent = message.user.name + ": " + message.text;
  // offset message foreach nested level
  li.style.marginLeft = `calc(var(--message-offset) * ${message.nestedLevel})`;

  messages.appendChild(li);
}

// Creating a few users
let user1 = new User("Alice");
let user2 = new User("Bob");
let user3 = new User("Charlie");

// Users sending messages
user1.sendMessage("Hello, this is Alice!");
user2.sendMessage("Hi Alice, Bob here.");

// User replying to a message
// For example, Alice replies to Bob's message
let bobMessage = user2.messages[0]; // getting Bob's message
let aliceToBobReply = user1.sendReply(bobMessage, "Nice to meet you, Bob!"); // Alice replies to Bob

// Bob replies to Alice's message in his thread
let bobToAliceReply = user2.sendReply(
  aliceToBobReply,
  "Nice to you too, Alice!"
);
user3.sendMessage("Hello everyone, I am Charlie.");

// Bob replies to Alice
console.log(aliceToBobReply);
console.log(bobToAliceReply);

// Similarly, other users can also reply to each other's messages in a similar way.
