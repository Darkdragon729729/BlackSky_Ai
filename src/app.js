const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

if (sendBtn) {

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});

}

async function sendMessage(){

const message = messageInput.value.trim();

if(message === "") return;

addUserMessage(message);

messageInput.value = "";

addBotMessage("Thinking...");

try{

const response = await fetch("/api/gemini",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
message:message
})

});

const data = await response.json();

removeThinking();

addBotMessage(data.reply);

}catch(err){

removeThinking();

addBotMessage("❌ Unable to contact Gemini AI.");

console.error(err);

}

}

function addUserMessage(text){

const div=document.createElement("div");

div.className="user";

div.textContent=text;

chatBox.appendChild(div);

chatBox.scrollTop=chatBox.scrollHeight;

}

function addBotMessage(text){

const div=document.createElement("div");

div.className="bot";

div.id="bot-temp";

div.textContent=text;

chatBox.appendChild(div);

chatBox.scrollTop=chatBox.scrollHeight;

}

function removeThinking(){

const temp=document.getElementById("bot-temp");

if(temp){
temp.removeAttribute("id");
}

}
