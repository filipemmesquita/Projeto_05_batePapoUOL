let messageNum=0;
function initializeMessages(){
    requestMessages();
}
function requestMessages(){
    const promisse= axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promisse.then(updateMessages);
    promisse.catch(catchError);
}
function updateMessages(messageLog){
    const content= document.querySelector(".content");

    for(;messageNum<messageLog.data.length;messageNum++){
        const newMessage=document.createElement("div");
        const messageData = messageLog.data[messageNum];
        console.log(messageData);
        if(messageData.type === "message"){
            newMessage.classList.add("message");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002para\u2002
            <span class="nameText">${messageData.to}</span>:
            \u0020${messageData.text}`
        }
        else if(messageData.type ==="status"){
            newMessage.classList.add("status");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002${messageData.text} `
        }
        content.appendChild(newMessage);
        if(messageData.type === "private_message"){
            newMessage.classList.add("private_message");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002reservadamente para\u2002
            <span class="nameText">${messageData.to}</span>:
            \u0020${messageData.text} `
        }
    }
}
function catchError(erro) {
	console.log("Erro " + erro.response.statuss);
}