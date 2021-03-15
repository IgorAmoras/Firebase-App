var authForm = document.getElementById('authForm')
var authFormTitle = document.getElementById('authFormTitle')
var register = document.getElementById('register')
var access = document.getElementById('access')
var loading = document.getElementById('loading')
var auth = document.getElementById('auth');
var userContent = document.getElementById('userContent')
var userEmail = document.getElementById('userEmail')
var emailVerified = document.getElementById('emailVerified')
var sendEmailVerificationDiv = document.getElementById('sendEmailVerificationDiv')
var passwordReset = document.getElementById('passwordReset')
var userImg = document.getElementById('userImg')
var userName = document.getElementById('userName')
var todoForm = document.getElementById('todoForm')

function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = 'Cadastrar conta'
  authFormTitle.innerHTML = 'Insira seus dados para se cadastrar'
  hideItem(register)
  hideItem(passwordReset)
  showItem(access)
}

function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = 'Acessar'
  authFormTitle.innerHTML = 'Acesse a sua conta para continuar'
  hideItem(access)
  showItem(register)
  showItem(passwordReset) 
}


function showItem(element) {
  element.style.display = 'block'
}


function hideItem(element) {
  element.style.display = 'none'
}

function showUserContent(user){
    console.log(user)
    if(user.emailVerified){
      hideItem(sendEmailVerificationDiv)
      emailVerified.innerHTML = 'E-mail autenticado'
    }else{
      showItem(sendEmailVerificationDiv)
      emailVerified.innerHTML = 'E-mail não autenticado'
    }
    userImg.src = user.photoURL ? user.photoURL : 'img/unknownUser.png'
    userName.innerHTML = user.displayName
    userEmail.innerHTML = user.email
    hideItem(auth)
    showItem(userContent)
}
 
function showAuth(){
    authForm.email.value = ''
    authForm.password.value = ''
    hideItem(userContent)
    showItem(auth)
}

function sendEmailVerification(){
  showItem(loading);
  var user = firebase.auth().currentUser;
  user.sendEmailVerification(actionCodeSettings)
  .then( () =>{
    alert('Email de verificação enviado para ' + user.email)
  }).catch( (error) => {
    alert('Erro ao enviar e-mail de verificação ' + error)
  }).finally(()=>{
    hideItem(loading)
  });
}

function updateInfo(){
  var newUserName = prompt('Insira um novo nome de usuário', userName.innerHTML)
  if(newUserName)   {
    showItem(loading)
    userName.innerHTML = newUserName 
    firebase.auth().updateProfile({
      displayName: newUserName
    }).catch((err) => {
      alert('Ocorreu um erro')
      console.log(err)
    })
  }
}

function deleteAccount(){
  var confirmation = confirm('Deseja mesmo excluir sua conta?')
  if(confirmation){
    firebase.auth().currentUser.delete()
    .then(()=>{
      alert('Conta excluída com sucesso!')
    })
    .catch((err) => {
      console.log(err)
    })
  }
}
var actionCodeSettings = {
  url: 'https://fir-course-9ba2b.firebaseapp.com'
}

var database = firebase.database();
var dbRefUsers = database.ref('users')