document.getElementById('add').addEventListener('click', toggleFormVisibility);

function toggleFormVisibility() {
  const formContainer = document.getElementById('todoForm');
  const image = document.getElementById('img');
  formContainer.style.display = formContainer.style.display === 'none' || formContainer.style.display === '' ? 'block' : 'none';
  
  if (localStorage.getItem('imageHidden') === 'true') {
    image.style.display = 'none';
  } else {
    image.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
  }
}

let selectedPriority = ''; 
let editingTaskIndex = null; 

const errorMessageElement = document.createElement('p');
errorMessageElement.style.color = 'red';
errorMessageElement.style.display = 'none'; 
document.getElementById('todoForm').appendChild(errorMessageElement); 

document.querySelectorAll('.hover\\:cursor-pointer').forEach(button => {
  button.addEventListener('click', function () {
    document.querySelectorAll('.hover\\:cursor-pointer').forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');
    selectedPriority = this.textContent.trim(); 
  });
});

document.getElementById('todoForm').addEventListener('submit', saveOrUpdateTask);

function saveOrUpdateTask(e) {
  e.preventDefault(); 

  let title = document.getElementById('todoInput').value;
  let description = document.getElementById('todotextarea').value;

  if (!title || !description) {
    errorMessageElement.textContent = 'لطفا تمامی اطلاعات را وارد کنید';
    errorMessageElement.style.display = 'block'; 
    return;
  }

  if (!selectedPriority) {
    errorMessageElement.textContent = 'لطفا اولویت را انتخاب کنید';
    errorMessageElement.style.display = 'block'; 
    return;
  }

  errorMessageElement.style.display = 'none';

  let task = {
    title,
    description,
    priority: selectedPriority
  }

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  if (editingTaskIndex !== null) {
    tasks[editingTaskIndex] = task;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    editingTaskIndex = null; 
  } else {
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  document.getElementById('img').style.display = 'none';
  localStorage.setItem('imageHidden', 'true');

  getTasks();

  document.getElementById('todoForm').reset();
  selectedPriority = ''; 
  document.querySelectorAll('.hover\\:cursor-pointer').forEach(btn => btn.classList.remove('selected'));

  document.getElementById('todoForm').style.display = 'none';
}

function getTasks() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let tasksView = document.getElementById('tasks');
  tasksView.innerHTML = '';

  tasks.forEach((task, i) => {
    let priorityColorClass, priorityImage;

    if (task.priority === 'بالا') {
      priorityColorClass = 'bg-red-100 text-red-500 rounded-md px-2 mr-2'; 
      priorityImage = 'images/Frame 1000005475 (1).png'; 
    } else if (task.priority === 'متوسط') {
      priorityColorClass = 'bg-orange-100 text-orange-500 rounded-md px-2 mr-2'; 
      priorityImage = 'images/Frame 1000005475.png'; 
    } else {
      priorityColorClass = 'bg-green-100 text-green-500 rounded-md px-2 mr-2'; 
      priorityImage = 'images/Frame 1000005475 2.png'; 
    }

    tasksView.innerHTML += `
      <div class="flex flex-row items-center gap-5 w-4/5 border py-2 my-4 rounded-lg">
          <img class="h-14" src="${priorityImage}" alt="Priority Image">
          <input id="checkbox-${i}" type="checkbox">
          <div class="flex flex-col gap-1 w-5/6">
            <div class="text-gray-600">
              <p id="task-title-${i}">${task.title}
              <span class="priority-tag ${priorityColorClass}">${task.priority}</span></p>
            </div>
            <div>
              <p>${task.description}</p>
            </div>
          </div>
          <div>
          	<div class="relative">
		          <button id="edit-btn-${i}" class="bg-transparent peer">
                  <img class="hover:cursor-pointer" src="images/Frame 33317.png" alt="">
                </button>
		          <div class="absolute z-[99] w-20 flex flex-row-reverse gap-2 p-2 bg-white rounded-md overflow-hidden shadow-lg peer-focus:visible peer-focus:opacity-100 opacity-0 invisible duration-200">
                  <img onclick="editTask(${i})" class="hover:cursor-pointer" src="images/tabler_edit.png" alt="">
                  <p onclick="deleteTask('${task.title}')" class="btn btn-danger">
                    <img class="hover:cursor-pointer" src="images/tabler_trash-x.png" alt="">
                  </p>
		          </div>
	        </div>
      </div>`;

    document.getElementById(`checkbox-${i}`).addEventListener('click', () => {
      moveToCompleted(task.title, task.description, task.priority);
    });

    document.getElementById(`edit-btn-${i}`).addEventListener('click', () => {
      editTask(i);
    });
  });

  getCompletedTasks();
}

function deleteTask(title) {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks = tasks.filter(task => task.title !== title);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  getTasks();
}

function moveToCompleted(title, description, priority) {
  let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
  
  let completedTask = {
    title,
    description,
    priority
  };
  
  completedTasks.push(completedTask);
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

  deleteTask(title);
  getTasks(); 
}

function getCompletedTasks() {
  let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
  let completedView = document.getElementById('completedTasks');
  completedView.innerHTML = '';

  if (completedTasks.length > 0) {
    completedView.innerHTML += `<div>
      <p class="text-xl font-bold">تسک‌های انجام شده</p>
      <p class="text-gray-500">${completedTasks.length} تسک انجام شده است.</p>
      </div>`;
  }

  completedTasks.forEach((task, i) => {
    let priorityColorClass, priorityImage;
    
    if (task.priority === 'بالا') {
      priorityColorClass = 'bg-red-100 text-red-500 rounded-md px-2 mr-2'; 
      priorityImage = 'images/Frame 1000005475 (1).png'; 
    } else if (task.priority === 'متوسط') {
      priorityColorClass = 'bg-orange-100 text-orange-500 rounded-md px-2 mr-2'; 
      priorityImage = 'images/Frame 1000005475.png'; 
    } else {
      priorityColorClass = 'bg-green-100 text-green-500 rounded-md px-2 mr-2'; 
      priorityImage = 'images/Frame 1000005475 2.png'; 
    }

    completedView.innerHTML += `
      <div class="flex flex-row items-center gap-5 w-4/5 border py-2 rounded-lg my-2">
        <img class="h-14" src="${priorityImage}" alt="Priority Image">
        <img class="hover:cursor-pointer w-5" src="images/tick-square.png" alt="">
        <div class="flex flex-row gap-3 w-5/6">
          <p class="line-through">${task.title}</p>
          <p class="${priorityColorClass}">${task.priority}</p>
        </div>
        <div class="relative">
		          <button class="bg-transparent peer">
                  <img class="hover:cursor-pointer" src="images/Frame 33317.png" alt="">
                </button>
		          <div class="absolute z-[99] w-20 flex flex-row-reverse gap-2 p-2 bg-white rounded-md overflow-hidden shadow-lg peer-focus:visible peer-focus:opacity-100 opacity-0 invisible duration-200">
                  <img onclick="editCompletedTask('${task.title}', '${task.description}', '${task.priority}')" class="hover:cursor-pointer" src="images/tabler_edit.png" alt="">
                  <p onclick="deleteCompletedTask('${task.title}')" class="btn btn-danger">
                    <img class="hover:cursor-pointer" src="images/tabler_trash-x.png" alt="">
                  </p>
		          </div>
	      </div>      
      </div>`;
  });
}

function editTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks[index];

  const todoInput = document.getElementById('todoInput');
  const todoDescription = document.getElementById('todotextarea');

  todoInput.value = task.title;
  todoDescription.value = task.description;
  selectedPriority = task.priority; 

  document.querySelectorAll('.hover\\:cursor-pointer').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.textContent.trim() === task.priority) {
      btn.classList.add('selected');
    }
  });

  editingTaskIndex = index; 
  toggleFormVisibility(); 
}

function editCompletedTask(title, description, priority) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(task => task.title === title);

  if (taskIndex !== -1) {
    editTask(taskIndex); 
    deleteCompletedTask(title); 
  }
}

function deleteCompletedTask(title) {
  let completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
  completedTasks = completedTasks.filter(task => task.title !== title);
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  getCompletedTasks(); 
}

window.onload = function() {
  getTasks();
  toggleFormVisibility();
};