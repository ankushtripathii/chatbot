const chatInput = document.querySelector(".chat_input textarea");
const sendBtn = document.querySelector(".chat_input span");
const chatBox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".button-toggler");
const closeBtn = document.querySelector(".close-btn");

let userMessg;

const API_KEY = "ADD YOUR API KEY ";
const inputInitHeight = chatInput.scrollHeight;

const createChat = (message, className) => {
  //create chat element with the pass message and class name
  const chatEl = document.createElement("li");
  chatEl.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatEl.innerHTML = chatContent;
  chatEl.querySelector("p").textContent = message;
  return chatEl;
};
const generateResp = (incomingChat) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const mssgElement = incomingChat.querySelector("p");
  const requestbBody = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessg }],
    }),
  };

  ///send POST request to api ,get response
  fetch(API_URL, requestbBody)
    .then((res) => res.json())
    .then((data) => {
      mssgElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      mssgElement.classList.add("error");
      mssgElement.textContent = "Oops! something went wrong. please try again";
    })
    .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};
const chatHandle = () => {
  //getting entered mssg and removing extra white spaces
  userMessg = chatInput.value.trim();
  //return if chat input field is empty
  if (!userMessg) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  //append user message to the chatbox
  chatBox.appendChild(createChat(userMessg, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  setTimeout(() => {
    //display message while waititng for the response
    const incomingChat = createChat("• • • •", "incoming");
    chatBox.appendChild(incomingChat);
    generateResp(incomingChat);
  }, 600);
};

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendBtn.addEventListener("click", chatHandle);
closeBtn.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});

chatToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});
