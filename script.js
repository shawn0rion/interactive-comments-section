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

// from parent message, insert a message below and one level deeper
function renderReplyTextarea(parentMessageEl, parentMessage) {
  const messages = document.querySelector("#messages");

  // remove any existing active replies
  const activeReply = document.querySelector(".reply.active");
  if (activeReply !== null) messages.removeChild(activeReply);

  const newNestedLevel = parentMessage.nestedLevel + 1;
  const li = document.createElement("li");
  li.classList.add("message", "reply", "active");
  li.style.marginLeft = `calc(var(--message-offset) * ${newNestedLevel})`;

  const textarea = document.createElement("textarea");
  textarea.id = "reply-input";

  const buttonContainer = document.createElement("div");

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button");
  buttonContainer.appendChild(cancelButton);

  const replyButton = document.createElement("button");
  replyButton.textContent = "Reply";
  replyButton.classList.add("reply-button");

  buttonContainer.appendChild(replyButton);
  li.appendChild(textarea);
  li.appendChild(buttonContainer);
  messages.insertBefore(li, parentMessageEl.nextSibling);
  // create cancel button
  // create reply button
  // add event listeners
  cancelButton.addEventListener("click", (event) => {
    messages.removeChild(li);
  });
  replyButton.addEventListener("click", (event) => {
    // this user1 will be replaced by currentUser
    user1.sendReply(parentMessage, textarea.value);
    messages.removeChild(li);
  });
}

function renderMessage(message) {
  const messages = document.querySelector("#messages");
  const li = document.createElement("li");
  // add classes to message
  li.className = "message";
  li.style.marginLeft = `calc(var(--message-offset) * ${message.nestedLevel})`;
  message.parent !== "" ? li.classList.add("reply") : "";

  const userDetails = document.createElement("div");
  const username = document.createElement("span");
  const messageText = document.createElement("p");

  userDetails.classList.add("user-details");
  username.classList.add("username");
  messageText.classList.add("message-text");

  username.textContent = message.user.name;
  messageText.textContent = message.text;

  userDetails.appendChild(username);
  li.appendChild(userDetails);
  li.appendChild(messageText);
  // temporary reply event listener
  li.addEventListener("click", (e) => {
    renderReplyTextarea(e.currentTarget, message);
  });

  // handle reply
  if (message.parent !== "") {
    const listItems = document.querySelectorAll(".message");
    const parentMessageEl = [...listItems].find(
      (x) =>
        x.querySelector(".message-text").textContent === message.parent.text
    );
    messages.insertBefore(li, parentMessageEl.nextSibling);
  } else {
    // handle message
    messages.appendChild(li);
  }
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
