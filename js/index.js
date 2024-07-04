// Get the form element
const todoForm = document.getElementById('todo-form');
// Filter form 
const filterFormForTodo = document.getElementById("todo-filter-form");

// get data from localStorage
let GetTodoData = JSON.parse(localStorage.getItem("TodoData")) || [];

const taskList = document.querySelector('.task-list');



function setItemInLocalStorage(passData) {
    localStorage.setItem("TodoData", JSON.stringify(passData));

}

const renderTaskList = (dataRender) => {
    taskList.innerHTML = dataRender.map((item, index) => {
        return `
            <li class="task-item" onclick="todoStatusCheck(${index})"  id="updateValue${index}" ondblclick="updateValue(${index},${item.id})" for="todoStatus${index}">
                <div>
                    <input type="checkbox" name="status" status: ${item.status ? 'checked' : ''}  onchange="todoStatusCheck(${index})" id="todoStatus${index}" />
                    <label>
                        <span class="task-time">${index + 1}</span>
                        <span class="task-time cureser-pointer">${item.taskName}</span>
                    </label>

                </div>
                <div>
                    <button class="delete-button"  onclick="dataDelete(${item.id})"> 
                        <i class="material-icons"  style="font-size:20px">delete</i> 
                    </button>
                    <button class="edit-button" onclick="event.stopPropagation(); updateValue(${index},${item.id})"> 
                        <i class="material-icons" style="font-size:20px">edit</i>
                    </button>
                </div>
            </li>`;
    }).join('');
    
}

// Initial render
renderTaskList(GetTodoData);

// Add submit event listener to the form
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the value of the input field
    let todoValue = document.getElementById('todo-value').value.trim();
    if (todoValue === "") return;

    const data = {
        id: GetTodoData.length + 1,
        taskName: todoValue,
        status: false
    }


    GetTodoData.push(data);

    // Render the updated task list
    renderTaskList(GetTodoData);
    setItemInLocalStorage(GetTodoData);

});

// delete Data 
function dataDelete(id) {
    GetTodoData = GetTodoData.filter((item) => item.id !== id)

    setItemInLocalStorage(GetTodoData);

    renderTaskList(GetTodoData)
}

// uppdate or not 
function todoStatusCheck(index) {

    GetTodoData[index].status = !GetTodoData[index].status
    setItemInLocalStorage(GetTodoData);
    renderTaskList(GetTodoData);
}

// Update Data 
function updateValue(index, id) {
    let dataInSetInput = document.getElementById(`updateValue${index}`)

    dataInSetInput.innerHTML = GetTodoData.filter((data) => data.id === id).map((item) => {
        return `
        <label>
            <form onsubmit="updateDataVlue(event,${index})">
                <span class="task-time">${index + 1}</span>
                <input class="task-time cureser-pointer"  value="${item.taskName}" onclick="event.stopPropagation(); "  onblur="updateDataVlue(event,${index})"  id="editTaskInput${index}" />
            </form>
        </label>
        `;
    }).join('');

    // Set focus on the input element after a short delay to ensure it's rendered
    setTimeout(() => {
        let editTaskInput = document.getElementById(`editTaskInput${index}`);
        if (editTaskInput) {
            editTaskInput.focus();
            // Set the cursor at the end of the input value
            let length = editTaskInput.value.length;
            editTaskInput.setSelectionRange(length, length);
        }
    }, 0);
}

function updateDataVlue(e, index) {
    e.preventDefault();

    const updateInputValue = document.getElementById(`editTaskInput${index}`).value.trim()

    if (updateInputValue == "") {
        return false;
    }
    GetTodoData[index].taskName = updateInputValue;
    setItemInLocalStorage(GetTodoData);
    renderTaskList(GetTodoData);
}

function hello(filterValue) {

    let filterData =
        (filterValue === "completed") ?
            GetTodoData.filter(data => data.status === true) :
            (filterValue === "ongoing") ?
                GetTodoData.filter(data => data.status === false) :
                GetTodoData;

    renderTaskList(filterData)
}

// filter Data 
filterFormForTodo.addEventListener("submit", (e) => {
    e.preventDefault();

    // filter value get
    const filterFormValue = document.getElementById('todo-filter-value').value.trim();

    const filterData = GetTodoData.filter((item) => item.taskName.toLowerCase().includes(filterFormValue.toLowerCase()) )
 
    renderTaskList(filterData);

})