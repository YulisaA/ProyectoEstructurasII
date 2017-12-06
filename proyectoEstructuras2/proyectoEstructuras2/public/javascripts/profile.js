var users = [];
var chats = [];
var fromUser; 
var toUser;
var fileToDownloadFromServer;
$( document ).ready(function() {
    document.getElementById('messageToSend').value = "";
    $.ajax({
        url: "/users",
        method: 'GET',
        type: 'json',
        success: function(res){
            users = res;
            let userlog = document.getElementById('userName');
            for(var i = 0; i < users.length;i++){
                if(userlog.innerHTML.toString() !== users[i].userName.toString()){
                    $(usersList).append(`<li onclick="cargarChat('${userlog.innerHTML}','${users[i].userName}')" class="list-group-item liSelected">${users[i].userName}</li>`);
                }
            }
        }
    });
    $.ajax({
        url: "/chats",
        method: 'GET',
        type: 'json',
        success: function(res){
            chats = res;
        }
    });
});



function searchText(textToSearch){
    var userMessages = document.getElementById('usersMessages');
    while( userMessages.firstChild ){
        userMessages.removeChild( userMessages.firstChild );
    }
    $.ajax({
        url: "/chats",
        method: 'GET',
        type: 'json',
        success: function(res){
            chats = res;
        }
    });
    for(var i = 0;i<chats.length;i++){
        console.log(chats[i].message);
        if(chats[i].message.includes(textToSearch)){
            if(chats[i].fromUser == fromUser && chats[i].toUser == toUser ){
                $(usersMessages).append(`<li>${'Mensaje de : '+chats[i].fromUser+' A: '+chats[i].toUser+" Mensaje: "+chats[i].message}</li>`);
            }
            if(chats[i].fromUser == toUser && chats[i].toUser == fromUser ){
                $(usersMessages).append(`<li>${'Mensaje de : '+chats[i].fromUser+' A: '+chats[i].toUser+" Mensaje: "+chats[i].message}</li>`);
            }
        }
    }
}

$(document).keypress(function(e) {
    let search = document.getElementById('search');
    console.log($(":focus"));
    if(e.which == 13) {
        if($(search).is(':focus')){
            if(!search.value) return;
            searchText(search.value);
            return;
        }
        sendMessage();
    }
});



function cargarChat(fromThisUser, toThisUser){
    var userNameToSend = document.getElementById('userToSend');
    var messageToSend = document.getElementById('messages');
    var userMessages = document.getElementById('usersMessages');
    var userToRecibe = document.getElementById('userWhoRecibe');

    while( userMessages.firstChild ){
        userMessages.removeChild( userMessages.firstChild );
    }
    messageToSend.value = "";
    userNameToSend.innerHTML = toThisUser;
    fromUser = fromThisUser;
    var archivo = `<button type="button"></button>`;
    toUser = toThisUser;
    $( "#userToSend" ).innerHTML = toThisUser.toString();
    $( "#messageToSend" ).focus();
    $('html, body').animate({scrollTop:$(document).height()}, 'slow');
    $.ajax({
        url: "/chats",
        method: 'GET',
        type: 'json',
        success: function(res){
            chats = res;
            for(var i = 0;i<chats.length;i++){
                if(chats[i].fromUser == fromUser && chats[i].toUser == toUser ){
                    $(usersMessages).append(`<li>${chats[i].message}</li>`);
                }
                if(chats[i].fromUser == toUser && chats[i].toUser == fromUser ){
                    $(usersMessages).append(`<li>${chats[i].message}</li>`);
                    userWhoRecibe.innerHTML = chats[i].fromUser;
                }
            }
        }
    });


}



function downloadFile(fileToDownload){
    fileToDownloadFromServer = fileToDownload;
    var file = {
        "fileToDownload":fileToDownloadFromServer
    }
    console.log("Este es el archivo: "+file.fileToDownload);
    $.ajax({
        type: "GET",
        url: "/profile/descargarArchivo",
       success: function(res){
        
        }
    });
}

function enviarDatos(){
    if(!fromUser)return;
    var documentUploaded = document.getElementById('upload');
    var fileNameUploaded = document.getElementById('fileNameUploaded');
    var form = $('#fileUploadForm')[0];
    var data = new FormData(form);
    fileNameUploaded.innerHTML = documentUploaded.files[0].name.toString();

    var archivo = `${documentUploaded.files[0].name+" "}<a href="/profile/download/${documentUploaded.files[0].name}"><button>Download</button></a>`;
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/profile/upload",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
        },
        error: function (e) {
        }
    });
    var message = {
        "fromUser": fromUser,
        "toUser":toUser,
        "message":archivo.toString()
    }
    $.ajax({
        url: "/chats",
        method: 'POST',
        data: message,
        type: 'json',
        success: function(res){
        }
    });
    cargarChatCliente(fromUser,toUser);
}

function uploadFile(){
    var documentUploaded = document.getElementById('upload');
    if(!fromUser)return;
    var archivo = `<a  href="${'/upload/'+documentUploaded.files[0].name}"><button>Download</button></a>`;

    if(documentUploaded.files.length == 1){
        var message = {
            "fromUser": fromUser,
            "toUser":toUser,
            "message":archivo
        }
        alert(message.fromUser+"-"+message.toUser+"-"+message.message);
        return;
    }
    console.log('esta vacio');
}

function sendFile(thismessage){
    var message = {
        "fromUser": fromUser,
        "toUser":toUser,
        "message":thismessage
    }
    $.ajax({
        url: "/chats",
        method: 'POST',
        data: message,
        type: 'json',
        success: function(res){
           messageToSend.value = ""; 
        }
    });
    cargarChat(fromUser,toUser);
}

function cargarChatCliente(fromThisUser, toThisUser){
    var userNameToSend = document.getElementById('userToSend');
    var messageToSend = document.getElementById('messages');
    var userMessages = document.getElementById('usersMessages');

    while( userMessages.firstChild ){
        userMessages.removeChild( userMessages.firstChild );
    }
    messageToSend.value = "";
    userNameToSend.innerHTML = toThisUser;
    fromUser = fromThisUser;
    var archivo = `<button></button>`;
    toUser = toThisUser;
    $( "#userToSend" ).innerHTML = toThisUser.toString();
    $( "#messageToSend" ).focus();
    $('html, body').animate({scrollTop:$(document).height()}, 'slow');
    $.ajax({
        url: "/chats",
        method: 'GET',
        type: 'json',
        success: function(res){
            chats = res;
            for(var i = 0;i<chats.length;i++){
                if(chats[i].fromUser == fromUser && chats[i].toUser == toUser ){
                    messageToSend.value = messageToSend.value+"Yo: "+chats[i].message+"\n";
                }
                if(chats[i].fromUser == toUser && chats[i].toUser == fromUser ){
                    messageToSend.value = messageToSend.value+chats[i].fromUser+": "+chats[i].message+"\n";
                }
                if(chats[i].fromUser == fromUser && chats[i].toUser == toUser ){
                    $(usersMessages).append(`<li>${chats[i].message}</li>`);
                }
            }
        }
    });

}

function sendMessage(){

    var messageToSend = document.getElementById('messageToSend');
    var messages = document.getElementById('messages');
    if(!messageToSend.value) return;
    if(!fromUser)return;
    var message = {
        "fromUser": fromUser,
        "toUser":toUser,
        "message":messageToSend.value
    }
    $.ajax({
        url: "/chats",
        method: 'POST',
        data: message,
        type: 'json',
        success: function(res){
           messageToSend.value = ""; 
        }
    });

    cargarChatCliente(fromUser,toUser);
}