todoForm.onsubmit = (event) => {
    event.preventDefault()
    if(todoForm.name.value != '') {
        var data = {
            name: todoForm.name.value
        }
        dbRefUsers.child(firebase.auth().currentUser.uid).push(data)
        .then(() => {
            console.log('Adicionado ' + data.name + ' ao banco de dados')
        }) 
    }else {
        alert('Erro, nome de tarefa em branco')
    }
}