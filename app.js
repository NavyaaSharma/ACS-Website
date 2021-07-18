import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { ChatClient } from "@azure/communication-chat";

// document.getElementById("screen2").style.display = 'none';
// document.getElementById("loadingDiv").removeAttribute('hidden');
// document.getElementById("wait").removeAttribute('hidden');

var params = new URLSearchParams(window.location.search)
var clientID = params.get('id');
var dept = params.get('dept');
let call;
let callAgent;
let chatClient;
let chatThreadClient;
let meetingLinkInput;
let threadIdInput;
const callButton = document.getElementById("join-meeting-button");

const callStateElement = document.getElementById('call-state');

const messagesContainer = document.getElementById("chat");
const hangUpButton = document.getElementById("hang-up-button");;
// const chatBox = document.getElementById("chat-box");
const sendMessageButton = document.getElementById("send-message");
const messagebox = document.getElementById("message-box");
const muteButton = document.getElementById('audio')
// var nameElement = document.getElementById('username');
console.log(sendMessageButton)
console.log(hangUpButton)
var userId = '';
var messages = '';
var name = "Guest User";
name = params.get('name')

if (dept == "Hardware") {
    meetingLinkInput = "https://teams.microsoft.com/l/meetup-join/19%3Ameeting_MjljOTdmNzItY2NjYy00YTYwLTkxZjItYjQyMjlmNGE0MmU4%40thread.v2/0?context=%7B%22Tid%22%3A%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2C%22Oid%22%3A%22b9a7ac57-b185-4884-8d8e-b4d3d029f92b%22%2C%22MessageId%22%3A%220%22%7D"
    threadIdInput = "19:meeting_MjljOTdmNzItY2NjYy00YTYwLTkxZjItYjQyMjlmNGE0MmU4@thread.v2"
}
else if (dept == "Software") {
    meetingLinkInput = "https://teams.microsoft.com/l/meetup-join/19%3Ameeting_ZTA5M2E0MGQtY2QwYi00MDI0LTllMzctNTg3MWZjODYwNzNk%40thread.v2/0?context=%7B%22Tid%22%3A%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2C%22Oid%22%3A%22b9a7ac57-b185-4884-8d8e-b4d3d029f92b%22%2C%22MessageId%22%3A%220%22%7D"
    threadIdInput = "19:meeting_ZTA5M2E0MGQtY2QwYi00MDI0LTllMzctNTg3MWZjODYwNzNk@thread.v2"
}
else if (dept == "Sales") {
    meetingLinkInput = "https://teams.microsoft.com/l/meetup-join/19%3Ameeting_NjFhZTcxYTUtNDJmYi00YzFhLWE2N2ItYWE2MGU3NWZjOTU5%40thread.v2/0?context=%7B%22Tid%22%3A%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2C%22Oid%22%3A%22b9a7ac57-b185-4884-8d8e-b4d3d029f92b%22%2C%22MessageId%22%3A%220%22%7D"
    threadIdInput = "19:meeting_NjFhZTcxYTUtNDJmYi00YzFhLWE2N2ItYWE2MGU3NWZjOTU5@thread.v2"
}
if (clientID && dept) {
    fetch(
        `https://chatbot-dictionary.herokuapp.com/get/query/${clientID}`).then((res) => {
            console.log(res)
            if (res.status == 204) {
                alert('You are not authorized to this live chat. Please consult our chatbot first')
                window.location.href = "https://customer-support.azurewebsites.net";
            }
            res.json().then(d => {
                messagebox.value = "My issue is: " + d.data;
                callButton.click();
            })
        })
}
else {
    alert('You are not authorized to this live chat. Please consult our chatbot first')
    window.location.href = "https://customer-support.azurewebsites.net";
}
async function init() {

    const connectionString = "endpoint=https://acs-chatbot.communication.azure.com/;accesskey=NnAc35r6H4rokCq/TmBOtoWb0LiVsRgeav+eQ/h0kRLv6swISKDq3cB0dcuLUH3XQz2r5btX4/h+uW0Hsugxyg==";
    const endpointUrl = "https://acs-chatbot.communication.azure.com/";

    const identityClient = new CommunicationIdentityClient(connectionString);

    let identityResponse = await identityClient.createUser();
    userId = identityResponse.communicationUserId;
    console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);

    let tokenResponse = await identityClient.getToken(identityResponse, [
        "voip",
        "chat",
    ]);

    const { token, expiresOn } = tokenResponse;
    console.log(`\nIssued an access token that expires at: ${expiresOn}`);
    console.log(token);

    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationTokenCredential(token);
    console.log("name is ", name)
    callAgent = await callClient.createCallAgent(tokenCredential, { displayName: name });
    callButton.disabled = false;

    chatClient = new ChatClient(
        endpointUrl,
        new AzureCommunicationTokenCredential(token)
    );

    console.log('Azure Communication Chat client created!');
}

callButton.addEventListener("click", async () => {
    await init();
    call = callAgent.join({ meetingLink: meetingLinkInput }, { displayName: name });

    call.on('stateChanged', () => {
        callStateElement.innerText = call.state;
        if (callStateElement.innerText == "Connected") {
            document.getElementById("loadingDiv").style.display = 'none';
            document.getElementById("wait").style.display = 'none';
            document.getElementById("screen2").removeAttribute('hidden');
            document.body.style.backgroundColor = "rgb(26, 26, 26);"
            messages += `<div style="background-color: burlywood; text-align: center; ">
                        <p style="color: black;  vertical-align: middle; margin: auto;">You are now
                            connected to
                            our ${dept} team. Please put up your problems through chat, We will be answering them ASAP.
                            Please be patient.
                        </p>
                    </div>`;
            messagesContainer.innerHTML = messages;
            sendMessageButton.click();
        }
        else {
            document.getElementById("loadingDiv").removeAttribute('hidden');
            document.getElementById("wait").removeAttribute('hidden');
        }
    })
    console.log(call);

    // open notifications channel
    await chatClient.startRealtimeNotifications();

    // subscribe to new message notifications
    chatClient.on("chatMessageReceived", (e) => {
        console.log("Notification chatMessageReceived!");
        console.log(e.threadId)
        // check whether the notification is intended for the current thread
        if (threadIdInput != e.threadId) {
            console.log('a')
            return;
        }

        if (e.sender.communicationUserId != userId) {
            renderReceivedMessage(e.message);
            console.log('aa')
        }
        else {
            console.log("hey")
            renderSentMessage(e.message);
            console.log('aaa')
        }
    });
    chatThreadClient = await chatClient.getChatThreadClient(threadIdInput);
    await call.mute();
});

async function renderReceivedMessage(message) {
    messages += '<div style="background-color: black;padding: 5px; margin: 5px; width: fit-content; margin-right: 20%;">' + message + '</div>';
    messagesContainer.innerHTML = messages;
}

async function renderSentMessage(message) {
    messages += '<div style="background-color: gray; padding: 5px; margin: 5px; width: fit-content; align-self: flex-end; margin-left: 20%;" >' + message + '</div>';
    messagesContainer.innerHTML = messages;
}

hangUpButton.addEventListener("click", async () => {
    // end the current call
    await call.hangUp();
    window.location.href = "https://customer-support.azurewebsites.net/thanks.html";
});

messagebox.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMessageButton.click();
    }
});
sendMessageButton.addEventListener("click", async () => {
    let message = messagebox.value;
    // let name = document.getElementById('username').value;
    let sendMessageRequest = { content: message };
    let sendMessageOptions = { senderDisplayName: name };
    let sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
    let messageId = sendChatMessageResult.id;

    messagebox.value = '';
    console.log(`Message sent!, message id:${messageId}`);
});

