let nameGlobal ="";
function initializeMessages(){
    logIn(prompt("Por favor insira seu lindo nome"));
}
function logIn(userName){

    const logInObject = {name: userName }
    const promisse=axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",logInObject);
    promisse.then(logInSucces(logInObject));
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
function logInSucces(userNameObject){
    nameGlobal=userNameObject.name;
    requestMessages(userNameObject );
    setInterval(requestMessages,3000,userNameObject)
}
//requestMessages também mantem o usuario conectado
function requestMessages(name){
    const promisse= axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promisse.then(updateMessages);
    promisse.catch(catchError);
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", name).then(console.log,console.log) 
}
function updateMessages(messageLog){
    const content= document.querySelector(".content");
    content.innerHTML = ""
    for(let messageNum=0;messageNum<messageLog.data.length;messageNum++){
        const messageData = messageLog.data[messageNum];
        if(messageData.type === "message"){
            const newMessage=document.createElement("div");
            newMessage.classList.add("message");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002para\u2002
            <span class="nameText">${messageData.to}</span>:
            \u0020${messageData.text}`;
            content.appendChild(newMessage);
        }
        else if(messageData.type ==="status"){
            const newMessage=document.createElement("div");
            newMessage.classList.add("status");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002${messageData.text} `;
            content.appendChild(newMessage);
        }
        else if((messageData.type === "private_message")&&((messageData.from===nameGlobal)||(messageData.to===nameGlobal))){
            const newMessage=document.createElement("div");
            newMessage.classList.add("private_message");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002reservadamente para\u2002
            <span class="nameText">${messageData.to}</span>:
            \u0020${messageData.text} `;
            content.appendChild(newMessage);
        }
        
        content.lastChild.scrollIntoView();
    }

}
function catchError(erro) {
	console.log("Erro " + erro.response.statuss);
}