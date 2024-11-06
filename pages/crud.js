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
                    <button class="edit-button" onclick="location.href='login_registration.html'">Editar</button>
                    <button class="delete-button">Excluir</button>
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
    if (event.target.classList.contains('delete-button')) {
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
                    <button class="edit-button" onclick="location.href='login_registration.html'">Editar</button>
                    <button class="delete-button">Excluir</button>
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

