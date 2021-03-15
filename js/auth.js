
// Traduz para português brasileiro a autenticação do Firebase
firebase.auth().languageCode = 'pt-BR'

// Função que trata a submissão do formulário de autenticação
authForm.onsubmit = (event) => {
  showItem(loading)
  event.preventDefault()
  if (authForm.submitAuthForm.innerHTML == 'Acessar') {
    firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value)
    .catch((err) =>{
      showErr('Falha no cadastro', err)
      hideItem(loading)
    })
  } else {
    firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value)
    .catch((err) =>{
      showErr('Falha no cadastro', err)
      hideItem(loading)
    })
  }
}

// Função que centraliza e trata a autenticação
firebase.auth().onAuthStateChanged((user) => {
  hideItem(loading)
  if (user) {
    showUserContent(user)
  } else {
    showAuth()
  }
})

// Função que permite ao usuário sair da conta dele
function signOut() {
  firebase.auth().signOut().catch((err) => {
    showErr('Falha no cadastro', err)
  })
}

// Função que permite o usuário fazer a verificação do e-mail dele
function sendEmailVerification() {
  showItem(loading)
  var user = firebase.auth().currentUser
  user.sendEmailVerification(actionCodeSettings).then(function () {
    alert('E-mail de verificação foi enviado para ' + user.email + '! Verifique a sua caixa de entrada')
  }).catch(function (error) {
    alert('Houve um erro ao enviar o e-mail de verificação')
    console.log(error)
  }).finally(function () {
    hideItem(loading)
  })
}

// Função que permite o usuário redefinir a senha dele
function sendPasswordResetEmail() {
  var email = prompt('Redefinir senha! Informe o seu endereço de e-mail.', authForm.email.value)
  if (email) {
    showItem(loading)
    firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).then(function () {
      alert('E-mail de redefinição de senha foi enviado para ' + email + '.')
    }).catch(function (error) {
      alert('Houve um erro ao enviar e-mail de redefinição de senha!')
      console.log(error)
    }).finally(function () {
      hideItem(loading)
    })
  } else {
    alert('É preciso preencher o campo de e-mail para redefinir a senha!')
  }
}

// Função que permite a autenticação pelo Google
function signInWithGoogle() {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  .catch((error)=> {
    alert('Houve um erro ao autenticar usando o Google')
    console.log(error)
    hideItem(loading)
  })
}

function showErr(prefix, err){
  console.log(err.code)
  switch(err.code){
    case 'auth/invalid-email': 
    case 'auth/wrong-password': alert(prefix + ': ' + 'Email ou senha incorreta')
    break
    case 'auth/weak-password': alert(prefix + ' ' + 'Senha fraca')
    break
    case 'auth/email-already-in-use': alert(prefix + ' ' + 'Email já em uso')
    break
    default: alert(prefix + ' ' + err.message)
  }
}