//users



const getUsers = () => {
    fetch('/users')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const usersTable = document.getElementById('table-body');
            usersTable.innerHTML = '';

            if (Array.isArray(data)) {
                console.log(data)
                data.forEach(user => {
                    const item = document.createElement('tr');
                    item.innerHTML = `                         
                <td>${user.ClientID}</td>
                <td>${user.Name}</td>
                <td>${user.Username}</td>
                <td>${user.Email}</td>
                <td>${user.CPF}</td>
                <td>${user.Birthdate}</td>
                <td>${user.CEPs}</td>
                <td>
                    <button class="edit-button" onclick="loadUserById(${user.ClientID})">Editar</button>
                    <button class="delete-button-user delete-button">Excluir</button>
                </td>
            
                        `;
                    usersTable.appendChild(item);
                });
            } else {
                console.error('Os dados retornados não são um array:', data);
            }
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button-user')) {
        const userId = event.target.closest('tr').querySelector('td').innerText;
        
        if (confirm('Você tem certeza que deseja deletar este usuário?')) {
            fetch(`/users/${userId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    console.log('Usuário deletado com sucesso');
                    getUsers(); 
                } else {
                    console.error('Erro ao deletar o usuário');
                }
            })
            .catch(error => console.error('Erro ao deletar o usuário', error));
        }
    }
});

const loadUserById = (userID) => {
    location.href=`crud_edit.html?id=${userID}&type=user`;

}

//crud_edit

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');

const loadUser = () => {
    fetch(`/user?id=${myParam}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const pageName = document.getElementById('pageName');
            pageName.innerHTML = '<h1>Editar Usuário</h1>'
            const edit = document.getElementById('edit');
            edit.innerHTML = '';
            const item = document.createElement('form');
            item.innerHTML = `
            <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" class="form-control" value="${data.Email}"required>
    </div>
    <div class="form-group">
        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" name="cpf" class="form-control"  value="${data.CPF}"required>
    </div>
    <div class="form-group">
        <label for="nome">Nome:</label>
        <input type="text" id="name" name="name" class="form-control" value="${data.Name}" required>
    </div>
    <div class="form-group">
        <label for="birthdate">Data de Nascimento:</label>
        <input type="date" id="birthdate" name="birthdate" class="form-control" value="${data.BirthdateInput}" required>
    </div>
    <div class="form-group">
        <label for="phoneNumber">Número de Telefone:</label>
        <input type="tel" id="phoneNumber" name="phoneNumber" class="form-control" value="${data.PhoneNumbers}"required>
    </div>
    <div class="form-group">
        <label for="cep">CEP:</label>
        <input type="text" id="cep" name="cep" class="form-control" value="${data.CEPs}" required>
    </div>
    <div class="form-group">
        <label for="address">Endereço:</label>
        <input type="text" id="address" name="address" class="form-control" value="${data.Addresses}" required>
    </div>
    <div class="form-group">
        <label for="city">Cidade:</label>
        <input type="text" id="city" name="city" class="form-control" value="${data.City}" required>
    </div>
    <div class="form-group">
        <label for="state">Estado:</label>
        <input type="text" id="state" name="state" class="form-control" value="${data.State}" required>
    </div>
    <div class="form-group">
        <label for="houseNum">Número da Casa:</label>
        <input type="text" id="houseNum" name="houseNum" class="form-control"  value="${data.HouseNumbers}"required>
    </div>
    <div class="form-group">
        <label for="complement">Complemento:</label>
        <input type="text" id="complement" name="complement" class="form-control" value="${data.Complement}">
    </div>
    <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" class="form-control" value="${data.Username}" required>
    </div>
    <button type="button" class="submit" onclick="handleSubmit()"/>Submit</button>`;
            edit.appendChild(item);
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}

const handleSubmit = () => {
    // Captura os valores dos campos do formulário
    const formData = {
        email: document.getElementById('email').value,
        cpf: document.getElementById('cpf').value,
        name: document.getElementById('name').value,
        birthdate: document.getElementById('birthdate').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        cep: document.getElementById('cep').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        houseNum: document.getElementById('houseNum').value,
        complement: document.getElementById('complement').value,
        username: document.getElementById('username').value
    };

    // Faz a requisição PUT para atualizar os dados do usuário
    fetch(`/user/${myParam}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Erro ao atualizar o usuário');

            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Usuário atualizado com sucesso!');
        })
        .catch(error => console.error('Erro ao enviar os dados', error));
};

const getProducts = () => {
    fetch('/products')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const productsTable = document.getElementById('table-body');
            productsTable.innerHTML = '';

            if (Array.isArray(data)) {
                console.log(data)
                data.forEach(product => {
                    const item = document.createElement('tr');
                    item.innerHTML = `                         
                <td>${product.ProductID}</td>
                <td>${product.Name}</td>
                <td>${product.Rating}</td>
                <td>${product.Price}</td>
                <td>${product.Stock}</td>
                <td>${product.Type}</td>
                <td>
                    <button class="edit-button" onclick="loadProductById(${product.ProductID})">Editar</button>
                    <button class="delete-button-product delete-button">Excluir</button>
                </td>
            
                        `;
                    productsTable.appendChild(item);
                });
            } else {
                console.error('Os dados retornados não são um array:', data);
            }
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}


document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button-product')) {
        const productId = event.target.closest('tr').querySelector('td').innerText;
        
        if (confirm('Você tem certeza que deseja deletar este produto?')) {
            fetch(`/products/${productId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    console.log('Produto deletado com sucesso');
                    getProducts(); 
                } else {
                    console.error('Erro ao deletar o produto');
                }
            })
            .catch(error => console.error('Erro ao deletar o produto', error));
        }
    }
});


const addProduct = () => {
    const formData = {
        name: document.getElementById('name').value,
        rating: document.getElementById('rating').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        URL: document.getElementById('URL').value,
        type: document.getElementById('type').value,
    };

    fetch('/addProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar o produto');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Produto adicionado com sucesso!');
            window.location.href = 'crud_products.html';
        })
        .catch(error => console.error('Erro ao enviar os dados', error));
};



const loadProductById = (userID) => {
    location.href=`crud_edit.html?id=${userID}&type=product`;

}

//crud_edit

const loadProduct = () => {
    fetch(`/product?id=${myParam}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const pageName = document.getElementById('pageName');
            pageName.innerHTML = '<h1>Editar Produto</h1>'
            const edit = document.getElementById('edit');
            edit.innerHTML = '';
            const item = document.createElement('form');
            item.innerHTML = `
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" class="form-control" value="${data.Name}" required>
            </div>
            <div class="form-group">
                <label for="rating">Rating:</label>
                <input type="number" id="rating" name="rating" class="form-control" min="0" max="5" step="0.1" value="${data.Rating}" required>
            </div>
            <div class="form-group">
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" class="form-control" min="0" step="0.01" value="${data.Price}" required>
            </div>
            <div class="form-group">
                <label for="stock">Stock:</label>
                <input type="number" id="stock" name="stock" class="form-control" min="0" value=${data.Stock} required>
            </div>
            <div class="form-group">
                <label for="stock">URL:</label>
                <input type="url" id="URL" name="url" class="form-control" value="${data.URL}" required>
            </div>
            <div class="form-group">
                <label for="type">Type:</label>
                <select id="type" name="type" class="form-control" required>
                    <option value="${data.Type}">${data.Type}<option>
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                    <option value="console">Console</option>
                </select>
            </div>
            <button type="button" onclick="editProduct()" class="submit">Editar</button>
`
            edit.appendChild(item);
        })
        .catch(error => console.error('Erro ao carregar os produtos', error));
}


const editProduct = () => {
    // Captura os valores dos campos do formulário
    const formData = {
        name: document.getElementById('name').value,
        rating: document.getElementById('rating').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        URL: document.getElementById('URL').value,
        type: document.getElementById('type').value,
    };

    // Faz a requisição PUT para atualizar os dados do produto
    fetch(`/editProduct/${myParam}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Erro ao atualizar o produto');

            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Produto atualizado com sucesso!');
            window.location.href='crud_products.html';
        })
        .catch(error => console.error('Erro ao enviar os dados', error));
};
