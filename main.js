let addItem = document.getElementById("add-a-item")
let submitItem = document.getElementById("submitBtn")
let showList = document.getElementById("showList")
let replaceSubmit = document.getElementById("replaceSubmitBtn")
let loaderBtn = document.getElementById("loaderBtn")

//span loader for inside button
let spanLoader = document.createElement("span")
spanLoader.classList.add("spinner-border" ,"spinner-border-sm")
spanLoader.setAttribute("aria-hidden","true")

submitItem.addEventListener("click", () => {
    handleSubmit()
})

//Loader
function loader() {
    showList.innerHTML = ""
    let flexDiv = document.createElement("div")
    let div = document.createElement("div")
    div.classList.add("spinner-border", "text-dark")
    flexDiv.classList.add("d-flex", "justify-content-center")
    div.setAttribute("role", "status")
    showList.appendChild(flexDiv)
    flexDiv.appendChild(div)
}
loader()

function handleSubmit() {
    if (addItem.value.trim() !== "") {
        //submit btn loader
        submitBtn.innerHTML = ""
        submitBtn.appendChild(spanLoader)
        submitBtn.setAttribute("disabled","")
        db.collection("todo").add({
            name: addItem.value.trim(),
            timestamp: new Date().toISOString()
        })
            .then((res) => {
                addItem.value = "";
                //Hide loader
                submitBtn.innerHTML = "Submit"
                submitBtn.removeAttribute("disabled")                
                getData()
            })
            .catch((err) => console.log(err))
    } else {
        addItem.classList.add("border-danger")
    }
}

//validation handler
addItem.addEventListener("input", () => {
    if (addItem.value.trim() === "") {
        addItem.classList.add("border-danger")
    } else {
        addItem.classList.remove("border-danger")
    }
})

function getData() {
    db.collection("todo")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            //hide lodaer
            showList.innerHTML = ""
            querySnapshot.forEach((doc) => {
                //render DOM
                let divRow = document.createElement("div")
                let divColText = document.createElement("div")
                let divColEdit = document.createElement("div")
                let divColDelete = document.createElement("div")
                let text = document.createElement("div")
                let buttonEdit = document.createElement("button")
                let buttonDelete = document.createElement("button")
                divRow.classList.add("row", "mt-2")
                divColDelete.classList.add("col-md-2")
                divColEdit.classList.add("col-md-2")
                divColText.classList.add("col-md-8")
                text.classList.add("bg-light", "p-2")
                buttonEdit.classList.add("btn", "btn-success", "w-100")
                buttonDelete.classList.add("btn", "btn-danger", "w-100")
                text.innerHTML = doc.data().name
                buttonEdit.innerHTML = "Edit"
                buttonDelete.innerHTML = "Delete"
                divColDelete.appendChild(buttonDelete)
                divColEdit.appendChild(buttonEdit)
                divColText.appendChild(text)
                divRow.appendChild(divColText)
                divRow.appendChild(divColEdit)
                divRow.appendChild(divColDelete)
                showList.appendChild(divRow)

                buttonDelete.onclick = () => {
                    deleteItem(buttonDelete,doc.id)
                }

                buttonEdit.onclick = () => {
                    updateItem(doc.id, text)
                }
            });
        });
}
getData()

function deleteItem(btnDelete, docId) {
    //button loader
    btnDelete.innerHTML = ""
    btnDelete.appendChild(spanLoader)
    btnDelete.setAttribute("disabled","")

    db.collection("todo")
        .doc(docId)
        .delete()
        .then(() => {
            getData()
        })
        .catch((err) => {
            console.log(err)
            showList.innerHTML = err
        })
}

function updateItem(docId, text) {
    addItem.value = text.innerHTML
    //add save & cancel btn instead of submit btn
    replaceSubmit.innerHTML = ""
    submitBtn.style.display = "none"
    let save = document.createElement("button")
    let cancel = document.createElement("button")
    save.innerHTML = "save";
    cancel.innerHTML = "x";
    save.classList.add("btn", "btn-success")
    cancel.classList.add("btn", "btn-danger", "ms-1")
    replaceSubmit.appendChild(save)
    replaceSubmit.appendChild(cancel)

    //add return submit button if cancel
    cancel.onclick = () => {
        submitBtn.style.display = "block"
        replaceSubmit.innerHTML = ""
        addItem.value = ""
    }

    //save button
    save.onclick = () => {
        if (addItem.value.trim() !== "") {
            save.innerHTML = ""
            save.appendChild(spanLoader)
            save.setAttribute("disabled","")
            
            db.collection("todo")
                .doc(docId)
                .update({
                    name: addItem.value.trim()
                })
                .then(() => {
                    save.removeAttribute("disabled")
                    save.innerHTML = "Save"
                    replaceSubmit.innerHTML = ""
                    submitBtn.style.display = "block"
                    addItem.value = ""
                    getData()
                })
                .catch((err) => {
                    console.log(err)
                    showList.innerHTML = err
                })
        }
    }
}