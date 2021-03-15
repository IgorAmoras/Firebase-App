todoForm.onsubmit = (event) => {
    event.preventDefault()
    if(todoForm.name.value != '') {
        var data = {
            name: todoForm.name.value
        }
        dbRefUsers.child(firebase.auth().currentUser.uid).push(data)
        .then(() => {
            console.log('Adicionado ' + data.name + ' ao banco de dados')
        }).catch((err) => {
            showErr('falha ao adicionar tarefa', err)
        })
    }else {
        alert('Erro, nome de tarefa em branco')
    }
}

function fillTodoList(dataSnapshot) {
    ulTodoList.innerHTML = ''
    var num = dataSnapshot.numChildren();
    todoCount.innerHTML = num + (num > 1 ? ' Tarefas': ' Tarefa') + ':'
    dataSnapshot.forEach(elem => {
        var value = elem.val()
        var li = document.createElement('li')
        var span = document.createElement('span')
        span.appendChild(document.createTextNode(value.name))
        li.appendChild(span)

        var liRemoveBtn = document.createElement('button')
        liRemoveBtn.appendChild(document.createTextNode('Excluir'))
        liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + elem.key + '\")')
        liRemoveBtn.setAttribute('class', 'danger_btn')
        li.appendChild(liRemoveBtn)

        ulTodoList.appendChild(li)
    });
}

function removeTodo(key){
    var confirmation = confirm('Deseja realmente deletar?')
    if(confirmation){
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove()
        .catch((err)=> {
            showErr('Erro ao remover', err)
        })
    } 
}