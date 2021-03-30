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
var todoList = document.getElementById('todoList')
var todoCount = document.getElementById('todoCount')
var ulTodoList = document.getElementById('ulTodoList')
var search = document.getElementById('search')
var progressFeedback = document.getElementById('progressFeedback')
var progress = document.getElementById('progress')
var playPauseBtn = document.getElementById('playPauseBtn')
var cancelBtn = document.getElementById('cancelBtn')

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

    getDefaultTodoList()

    search.onkeyup = () => {
      if(search.value != ''){
          var searchText = search.value.toLowerCase()
          dbRefUsers.child(user.uid)
          .orderByChild('nameLower')
          .startAt(searchText).endAt(searchText + '\uf8ff') //delimita resultados
          .once('value').then((dataSnapshot) => {
            fillTodoList(dataSnapshot);
          })
        } 
      else{
        getDefaultTodoList();
      }
    } 
    showItem(userContent)
}

function getDefaultTodoList() {
  dbRefUsers.child(firebase.auth().currentUser.uid).on('value', (dataSnapshot) => {
    fillTodoList(dataSnapshot);
  }) 
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
    var user = firebase.auth().currentUser;
    userName.innerHTML = newUserName 
    user.updateProfile({
      displayName: newUserName
    }).catch((err) => {
      alert('Ocorreu um erro')
      console.log(err)
    })
  }
  hideItem(loading)
}

function deleteAccount(){
  var confirmation = confirm('Deseja mesmo excluir sua conta?')
  if(confirmation){
    var user = firebase.auth().currentUser;
    user.delete()
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