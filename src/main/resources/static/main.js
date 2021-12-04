let showUserOrAdminFlag = true;
let roleList = [
    {id: 1, role: "ROLE_ADMIN"},
    {id: 2, role: "ROLE_USER"}
]

$(async function () {
    await getUser();
    await infoUser();
    // await title();
    await getUsers();
    await getDefaultModal();
    await create();
})

const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getAllUsers: async () => await fetch('api/users'),
    getUserByUsername: async () => await fetch(`api/user`),
    getUserById: async (id) => await fetch(`api/user/${id}`),
    createUser: async (user) => await fetch('api/user', {
        method: 'POST',
        headers: userFetch.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/user/${id}`, {
        method: 'PUT',
        headers: userFetch.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/user/${id}`, {method: 'DELETE', headers: userFetch.head})
}

async function infoUser() {
    let temp = '';
    const info = document.querySelector('#info');
    await userFetch.getUserByUsername()
        .then(res => res.json())
        .then(user => {
            temp += `
             <span style="color: white">
               ${user.username} with roles <span>${user.roles.map(e => " " + e.role.substr(5))}</span>
                </div>
            </span>
                </tr>
            `;
        });
    info.innerHTML = temp;
}

//
//--read--
//

async function getUser() {
    let temp = '';
    const table = document.querySelector('#tableUser tbody');
    await userFetch.getUserByUsername()
        .then(res => res.json())
        .then(user => {
            temp = `
                <tr>
                    <td>${user.userId}</td>
                    <td>${user.username}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(e => " " + e.role.substr(5))}</td>
                </tr>
            `;
            table.innerHTML = temp;

            $(function () {
                let role = ""
                for (let i = 0; i < user.roles.length; i++) {
                    role = user.roles[i].role
                    if (role === "ROLE_ADMIN") {
                        showUserOrAdminFlag = false;
                    }
                }
                if (showUserOrAdminFlag) {
                    $("#userTable").addClass("show active");
                    $("#userTab").addClass("show active");
                } else {
                    $("#adminTable").addClass("show active");
                    $("#adminTab").addClass("show active");
                }
            })
        })
}

async function title() {
    let temp = ''
    const h1a1 = document.querySelector('#h1a1');
    if (isUser) {
        temp = `
            <h1 className="h1 a1" id="h1a1">User information page</h1>
            `;
        h1a1.innerHTML = temp;
    } else {
        temp = `
            <h1 className="h1 a1" id="h1a1">Admin panel</h1>
            `;
        h1a1.innerHTML = temp;
    }
}

async function getUsers() {
    let temp = '';
    const table = document.querySelector('#tableAllUsers tbody');
    await userFetch.getAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                temp += `
                <tr>
                    <td>${user.userId}</td>
                    <td>${user.username}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(e => " " + e.role.substr(5))}</td>
                    <td>
                        <button type="button" data-userid="${user.userId}" data-action="edit" class="btn btn-info"
                            className data-toggle="modal" data-target="#editModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-userid="${user.userId}" data-action="delete" class="btn btn-danger"
                            className data-toggle="modal" data-target="#deleteModal">Delete</button>
                    </td>
                </tr>
               `;
            })
            table.innerHTML = temp;
        })

    $("#tableAllUsers").find('button').on('click', (event) => {

        let defaultModal = $('#defaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getDefaultModal() {
    $('#defaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                update(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

//
// -- create --
//

async function create() {
    $('#addUser').click(async () => {
        let addUserForm = $('#addForm')
        let username = addUserForm.find('#usernameCreate').val().trim();
        let password = addUserForm.find('#passwordCreate').val().trim();
        let firstName = addUserForm.find('#firstNameCreate').val().trim();
        let lastName = addUserForm.find('#lastNameCreate').val().trim();
        let age = addUserForm.find('#ageCreate').val().trim();
        let email = addUserForm.find('#emailCreate').val().trim();
        let checkedRoles = () => {
            let array = []
            let options = document.querySelector('#rolesCreate').options
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    array.push(roleList[i])
                }
            }
            return array;
        }
        let data = {
            username: username,
            password: password,
            lastName: lastName,
            firstName: firstName,
            age: age,
            email: email,
            roles: checkedRoles()
        }

        const response = await userFetch.createUser(data);
        if (response.ok) {
            await getUsers();
            addUserForm.find('#usernameCreate').val('');
            addUserForm.find('#passwordCreate').val('');
            addUserForm.find('#firstNameCreate').val('');
            addUserForm.find('#lastNameCreate').val('');
            addUserForm.find('#ageCreate').val('');
            addUserForm.find('#emailCreate').val('');
            addUserForm.find(checkedRoles()).val('');
            let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert" id="successMessage">
                         User create successful!
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert);
            $('.nav-tabs a[href="#adminTable"]').tab('show');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert);
        }
    });
}

//
// -- update --
//

async function update(modal, id) {
    let user = (await userFetch.getUserById(id)).json();

    modal.find('.modal-title').html('Edit user');

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let editButton = `<button  class="btn btn-info" id="editButton">Edit</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="editUser">
               <div class="form-group">
                    <label for="userId" class="col-form-label">ID</label>
                    <input type="text" class="form-control username" id="userId" value="${user.userId}" readonly>
               </div>
                   
               <div class="form-group">
                    <label for="username" class="col-form-label">Username</label>
                    <input type="text" class="form-control username" id="username" value="${user.username}" required>
               </div>

                <div class="form-group">
                    <label for="password" class="com-form-label">Password</label>
                    <input type="password" class="form-control" id="password" field="${user.password}" required>
                </div>

                <div class="form-group">
                    <label for="firstName" class="com-form-label">First Name</label>
                    <input type="text" class="form-control" id="firstName" value="${user.firstName}">
                </div>

                <div class="form-group">
                    <label for="lastName" class="com-form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastName" value="${user.lastName}">
                </div>

                <div class="form-group">
                    <label for="age" class="com-form-label">Age</label>
                    <input type="number" class="form-control" id="age" value="${user.age}">
                </div>

                <div class="form-group">
                    <label for="email" class="com-form-label">Email</label>
                    <input type="text" class="form-control" id="email" value="${user.email}" required>
                </div>
                
                <div class="form-group">
                    <label for="roles" class="com-form-label">Role</label>
                    <select multiple id="roles" size="2" class="form-control" style="max-height: 100px">
                    <option value="ROLE_ADMIN">ADMIN</option>
                    <option value="ROLE_USER" selected>USER</option>
                    </select>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let checkedRoles = () => {
            let array = []
            let options = document.querySelector('#roles').options
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    array.push(roleList[i])
                }
            }
            return array;
        }
        let userId = modal.find("#userId").val().trim();
        let username = modal.find("#username").val().trim();
        let password = modal.find("#password").val().trim();
        let firstName = modal.find("#firstName").val().trim();
        let lastName = modal.find("#lastName").val().trim();
        let age = modal.find("#age").val().trim();
        let email = modal.find("#email").val().trim();
        let data = {
            userId: userId,
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            roles: checkedRoles()

        }
        const response = await userFetch.updateUser(data, id);

        if (response.ok) {
            await getUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

//
// -- delete --
//

async function deleteUser(modal, id) {
    let user = (await userFetch.getUserById(id)).json();

    modal.find('.modal-title').html('Delete user');

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);


    user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="deleteUser">
               <div class="form-group">
                    <label for="userId" class="col-form-label">ID</label>
                    <input type="text" class="form-control username" id="userId" value="${user.userId}" readonly>
               </div>
                   
               <div class="form-group">
                    <label for="username" class="col-form-label">Username</label>
                    <input type="text" class="form-control username" id="username" value="${user.username}" readonly>
               </div>

                <div class="form-group">
                    <label for="name" class="com-form-label">First Name</label>
                    <input type="text" class="form-control" id="firstName" value="${user.firstName}" readonly>
                </div>

                <div class="form-group">
                    <label for="lastName" class="com-form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastName" value="${user.lastName}" readonly>
                </div>

                <div class="form-group">
                    <label for="age" class="com-form-label">Age</label>
                    <input type="text" class="form-control" id="age" value="${user.age}" readonly>
                    <div class="invalid-feedback">
                        Age cannot be empty
                    </div>
                </div>

                <div class="form-group">
                    <label for="email" class="com-form-label">Email</label>
                    <input type="text" class="form-control" id="email" value="${user.email}"  readonly>
                </div>
                
                 <div class="form-group">
                <label for="roles" class="com-form-label">Role:</label>
                <select id="roles" class="form-control" readonly>
                <option>${user.roles.map(role => " " + role.role.substr(5))}</option>
            })}</option>
                </select>
            </div>

            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#deleteButton").on('click', async () => {
        const response = await userFetch.deleteUser(id);

        if (response.ok) {
            await getUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}
