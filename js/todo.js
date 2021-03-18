todoForm.onsubmit = (event) => {
    event.preventDefault()
    if(todoForm.name.value != '') {
        var file = todoForm.file.files[0];
        console.log(file)
        if(file != null) {
            if(file.type.includes('application', 'image')){
                var imageName = firebase.database().ref().push().key + '-' + file.name
                var imagePath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imageName
                var storageRef = firebase.storage().ref(imagePath)
                var upload = storageRef.put(file);
                trackUpload(upload)
            }
            else {
                alert('Extensão de arquivo não suportada')
            }
        }
        var data = {
            name: todoForm.name.value,
            nameLower: todoForm.name.value.toLowerCase()
        }
        dbRefUsers.child(firebase.auth().currentUser.uid).push(data)
        .then(() => {
            console.log('Adicionado ' + data.name + ' ao banco de dados')
        }).catch((err) => {
            showErr('falha ao adicionar tarefa', err)
        })
    }else {
        alert('Nome da tarefa em branco')
    }
    todoForm.name.value = ''
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
    var selected = document.getElementById(key)
    var newName = prompt('Escolha um novo nome para ' + selected.innerHTMl)
    if(newName != ''){
        var data = {
            name: newName,
            nameLower: newName.toLowerCase()
        }
        dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data)
        .then(()=>{
            console.log('Updated ' + data.nameLower)
        }).catch(()=>{
            showErr('Erro ao atualizar a tarefa', err)
        })
    } else {
        alert('Nome da tarefa em branco')
    }
}

function trackUpload(upload){
    upload.on('state_changed', 
    (snapshot) => {
       console.log(snapshot)
       showItem(progressFeedback)
       console.log(Math.round(snapshot.bytesTransferred/snapshot.totalBytes*100) + '%') 
       progress.value = snapshot.bytesTransferred/snapshot.totalBytes*100
    }, (err) => {
        showErr('There has been an error on the upload of the file', err)
    }, (sucess) => {
        console.log('Sucesso')
        hideItem(progress)
    }
    )
}