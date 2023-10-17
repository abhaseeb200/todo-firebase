let addItem = document.getElementById("add-a-item")
let submitItem = document.getElementById("submitBtn")
let showList = document.getElementById("showList")
let replaceSubmit = document.getElementById("replaceSubmit")
let loaderBtn = document.getElementById("loaderBtn")


submitItem.addEventListener("click", () => {
    handleSubmit()
})

//Loader
function loader() {
    console.log("loader..")
    showList.innerHTML = ""
    let flexDiv = document.createElement("div")
    let div = document.createElement("div")
    div.classList.add("spinner-border", "text-dark")
    flexDiv.classList.add("d-flex", "justify-content-center")
    div.setAttribute("role", "status")
    showList.appendChild(flexDiv)
    flexDiv.appendChild(div)
}

function handleSubmit() {
    if (addItem.value.trim() !== "") {
        //submit btn loader
        loaderBtn.style.display = "block"
        submitBtn.style.display = "none"

        console.log("clicked....")
        db.collection("todo").add({
            name: addItem.value.trim(),
            timestamp: new Date().toISOString()
        })
            .then((res) => {
                addItem.value = "";
                loaderBtn.style.display = "none"
                submitBtn.style.display = "block"
                getData()
            })
            .catch((err) => console.log(err))
    } else {
        addItem.classList.add("border-danger")
    }

}

addItem.addEventListener("input", () => {
    if (addItem.value.trim() === "") {
        addItem.classList.add("border-danger")
    } else {
        addItem.classList.remove("border-danger")
    }
})

loader()
function getData() {
    db.collection("todo")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            //hide lodaer
            showList.innerHTML = ""
            // loaderBtn.style.display = "none"
            submitBtn.style.display = "block"

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
                    deleteItem(divRow, doc.id)
                }

                buttonEdit.onclick = () => {
                    updateItem(divRow, doc.id, text)
                }
            });
        });
}
getData()

function deleteItem(row, docId) {
    console.log(row, docId)
    db.collection("todo")
        .doc(docId)
        .delete()
        .then(() => {
            console.log("delete item...")
            
            //update the DOM
            getData()
        })
        .catch((err) => {
            console.log(err)
            showList.innerHTML = err
        })
}

function updateItem(row, docId, text) {
    console.log(text.innerHTML)
    addItem.value = text.innerHTML
    //add save & cancel btn instead of submit btn
    submitBtn.style.display = "none"
    let save = document.createElement("button")
    let cancel = document.createElement("button")
    let div = document.createElement("div")

    save.innerHTML = "save";
    cancel.innerHTML = "x";
    save.classList.add("btn", "btn-success")
    cancel.classList.add("btn", "btn-danger", "ms-1")

    div.appendChild(save)
    div.appendChild(cancel)
    replaceSubmit.appendChild(div)
    //add return submit button if cancel
    cancel.onclick = () => {
        div.style.display = "none"
        submitBtn.style.display = "block"
        addItem.value = ""
    }
    //save button
    save.onclick = () => {
        if (addItem.value.trim() !== "") {
            loader()
            db.collection("todo")
                .doc(docId)
                .update({
                    name: addItem.value.trim()
                })
                .then(() => {
                    replaceSubmitBtn()
                    console.log("updated....")
                    getData()
                })
                .catch((err) => {
                    console.log(err)
                    showList.innerHTML = err
                })
        }
    }
}

function replaceSubmitBtn() {
    replaceSubmit.innerHTML = ""
    addItem.value = ""
    let submitBtn = document.createElement("button")
    submitBtn.innerHTML = "Submit"
    submitBtn.classList.add("btn", "btn-primary", "w-100")
    submitBtn.id = "submitBtn";
    replaceSubmit.appendChild(submitBtn)
    submitBtn.onclick = () => {
        handleSubmit()
    }
}