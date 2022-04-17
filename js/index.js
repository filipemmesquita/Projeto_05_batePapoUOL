let nameGlobal ={};
function initializeMessages(){
    document.querySelector(`.nameField`).addEventListener("keyup", enterLogIn);
    formDisplayToggle(false);
}
function formDisplayToggle(hide){
    if(hide===true){
        document.querySelector(".logInWorking").style.display = 'flex';
        document.querySelector(".logInForm").style.display = 'none';
    }
    else{
        document.querySelector(".logInWorking").style.display = 'none';
        document.querySelector(".logInForm").style.display = 'flex';
    }

}
function logIn(){
    formDisplayToggle(true);
    const logInObject = {name: 
        document.querySelector(`.nameField`).value }
    const promisse=axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",logInObject);
    promisse.then(logInSucces(logInObject));
    promisse.catch(logInError);
}
function logInError(error){
    if(error.response.status=="400"){
        alert("Este nome está em uso! insira outro");
    }
    else{
        alert(`ERRO! Código: ${error.response.status} Mensagem: ${error.response.data}`)
    }
    window.location.reload();
}
function logInSucces(userNameObject){
    nameGlobal=userNameObject;
    document.querySelector(".logInScreen").style.display = 'none';
    requestMessages();
    setInterval(requestMessages,3000);
    requestUsers();
    setInterval(requestUsers, 10000);
    setInterval(keepConnection,4000);
    document.querySelector(`.messageField`).addEventListener("keyup", enterSendMessage);
}
//requestMessages também mantem o usuario conectado
function requestMessages(){
    const promisse= axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promisse.then(updateMessages);
    promisse.catch(catchError);
}
function keepConnection(){
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nameGlobal);
    promisse.catch(catchError)
}
function updateMessages(messageLog){
    const content= document.querySelector(".content");
    content.innerHTML = "";
    for(let messageNum=0;messageNum<messageLog.data.length;messageNum++){
        const messageData = messageLog.data[messageNum];
        if(messageData.type === "message"){
            const newMessage=document.createElement("div");
            newMessage.classList.add("message");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002para\u2002
            <span class="nameText">${messageData.to}</span>:
            \u2002${messageData.text}`;
            content.appendChild(newMessage);
        }
        else if(messageData.type ==="status"){
            const newMessage=document.createElement("div");
            newMessage.classList.add("status");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002${messageData.text}`;
            content.appendChild(newMessage);
        }
        else if((messageData.type === "private_message")&&((messageData.from===nameGlobal.name)||(messageData.to===nameGlobal.name))){
            const newMessage=document.createElement("div");
            newMessage.classList.add("private_message");
            newMessage.innerHTML=`<span class="timeText">(${messageData.time})</span>\u2002
            <span class="nameText">${messageData.from}</span>\u2002reservadamente para\u2002
            <span class="nameText">${messageData.to}</span>:
            \u2002${messageData.text}`;
            content.appendChild(newMessage);
        }
        content.lastChild.scrollIntoView();
    }
}
function catchError(erro) {
	console.log("Erro " + erro.response.status);
    window.location.reload();
}
function enterSendMessage(pressedkey){
if(pressedkey.code==="Enter"){
    requestSendMessage();
    }
}
function enterLogIn(pressedkey){
    if(pressedkey.code==="Enter"){
        logIn();
        }
    }
function requestSendMessage(){
    const messageField =document.querySelector(".messageField");
    const messageTo= document.querySelector(`input[type="radio"][name="messageTo"]:checked`).value;
    const messageType= document.querySelector(`input[type="radio"][name="messageType"]:checked`).value;
    if(messageField.value){
        const messageObject ={
            from: nameGlobal.name,
            to: messageTo,
            text: messageField.value,
            type: messageType
        }
        const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", messageObject)
        promisse.then(sendMessageSuccess)
        promisse.catch(catchError)
        messageField.value="";
    }
}
function sendMessageSuccess(){
    requestMessages();
}
function openSidebar(){
    document.querySelector(".sidebar").style.display="initial";
    document.querySelector(".sidebarContent").style.right="0";
}
function closeSidebar(){
    document.querySelector(".sidebar").style.display="none";
    document.querySelector(".sidebarContent").style.right="-83%";
}
function setSendText(){
    const messageTo= document.querySelector(`input[type="radio"][name="messageTo"]:checked`).value;
    const messageType= document.querySelector(`input[type="radio"][name="messageType"]:checked`).value;
    let messageTypeText="";
    if(messageType==="message"){
        messageTypeText="Público";
    }
    else{
        messageTypeText="Reservadamente";
    }
    document.querySelector(".bottom span").innerText=`Enviando para ${messageTo} (${messageTypeText})`;
}
function requestUsers(){
    const promisse=axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promisse.then(updateParticipants);
    promisse.catch(catchError);
}
function updateParticipants(participants){
    let selectedParticipant;
    //checa se alguma opção está marcada e armazena
    if(document.querySelectorAll(`input[name="messageTo"]:checked`).length!==0){
        selectedParticipant =document.querySelector(`input[name="messageTo"]:checked`).value;
    }
    else{
        selectedParticipant=null;
    }
    const participantList=document.querySelector(".participantList");
    participantList.innerHTML="";
    for(let i=0;i<participants.data.length;i++){
        const newParticipant=document.createElement("div");
        newParticipant.innerHTML=`
            <label onclick="setSendText()"><ion-icon name="person-circle"></ion-icon>${participants.data[i].name}
            <input type="radio" name="messageTo" value="${participants.data[i].name}" />
            <ion-icon class="checkmark" name="checkmark-outline"></ion-icon>
            </label>`
        participantList.appendChild(newParticipant);
    }
    //se nenhuma opção estava marcada, marca todos    
    if(selectedParticipant===null){
        document.querySelector(`input[value="Todos"]`).checked=true;
        setSendText();
    }
    //se alguma opção estava marcada, checa se a mesma ainda existe e a marca
    else if(document.querySelectorAll(`input[value="${selectedParticipant}"]`).length!==0){
        document.querySelector(`input[value="${selectedParticipant}"]`).checked=true;
        setSendText();
    }
    //se alguma opção estava marcada porém não existe mais
    else{
        document.querySelector(`input[value="Todos"]`).checked=true;
        setSendText();
    }
//essa solução não é semantica nem legível, porém foi o que deu
//essa bagunça é para que no caso de atualizar a lista de usuários, se o usuário selecionado tiver saído
}