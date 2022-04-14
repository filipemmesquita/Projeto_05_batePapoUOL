function initializeMessages(){
    logIn(prompt("Por favor insira seu lindo nome"));

    requestMessages();
    setInterval(requestMessages,3000)
}
function logIn(userName){
    const logInObject = {name: userName }
    const promisse=axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",logInObject);
    promisse.then(requestMessages);
    promisse.catch(logInError);
}
function logInError(error){
    if(error.response.status=="400"){
        logIn(prompt("Este nome está em uso! insira outro"));
    }
    else{
        alert(`ERRO! Código: ${error.response.status} Mensagem: ${error.response.data}`)
    }
}

function requestMessages(){
    const promisse= axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promisse.then(updateMessages);
    promisse.catch(catchError);
}
function updateMessages(messageLog){
    const content= document.querySelector(".content");
    content.innerHTML = ""
    for(let messageNum=0;messageNum<messageLog.data.length;messageNum++){
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
        else if(messageData.type === "private_message"){
            newMessage.classList.add("private_message");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002reservadamente para\u2002
            <span class="nameText">${messageData.to}</span>:
            \u0020${messageData.text} `
        }
        content.appendChild(newMessage);
        content.lastChild.scrollIntoView();
    }

}
function catchError(erro) {
	console.log("Erro " + erro.response.statuss);
}