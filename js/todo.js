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
        span.setAttribute('id', `${elem.key}`)
        li.appendChild(span)

        var liRemoveBtn = document.createElement('button')
        liRemoveBtn.appendChild(document.createTextNode('Excluir'))
        liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + elem.key + '\")')
        liRemoveBtn.setAttribute('class', 'danger_btn')
        li.appendChild(liRemoveBtn)

        var liUpdateBtn = document.createElement('button')
        liUpdateBtn.appendChild(document.createTextNode('Atualizar'))
        liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + elem.key + '\")')
        liUpdateBtn.setAttribute('class', 'alternative2')
        li.appendChild(liUpdateBtn)

        ulTodoList.appendChild(li)
    });
}

function removeTodo(key){
    console.log(key)
    var selected = document.getElementById(key)
    var confirmation = confirm('Deseja realmente deletar ' + selected.innerHTML + '?')
    if(confirmation){
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove()
        .catch((err)=> {
            showErr('Erro ao remover', err)
        })
    } 
}

function updateTodo(key) {
    console.log('hey')
    var selectedItem = document.getElementById(key)
    var newName = prompt('Escolha um novo nome \"' + selectedItem.innerHTMl + '\".', selectedItem.innerHTML)
    if(newName != ''){
        var data = {
            name: newName
        }
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data)
        .then(()=>{
            console.log('Updated ' + data.name)
        }).catch(()=>{
            showErr('Erro ao atualizar a tarefa', err)
        })
    } else {
        alert('Nome da tarefa em branco')
    }
}