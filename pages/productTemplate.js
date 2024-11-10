const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('id');

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
                    const productContainer = document.getElementById('product');
                    productContainer.innerHTML = '';
                    var rating = '';
                    for (let i = 0; i < data.Rating; i++) {
                        rating += '⭐';
                    }
                    const item = document.createElement('div');
                    item.className = 'img';
                    item.innerHTML = `<img src="${data.URL ? data.URL : 'https://via.placeholder.com/300'}" alt="imagem do produto">`;
                    const item2 = document.createElement('div');
                    item2.className = 'text';
                    item2.innerHTML = `${data.Name}</div>
                            <div class="rating">${rating}</div>
                            <div class="price">R$${data.Price}</div>
                            <button type="button" class="buyButton">Adicionar ao Carrinho</button>
                            <div class="description">Product description goes here. This is a placeholder text.</div>
                            <div class="shipping">
                                <label for="shipping">Calcular o frete</label>
                                <input type="text" name="shipping" id="shipping" placeholder="00000-000">
                            </div>`
                    productContainer.appendChild(item);
                    productContainer.appendChild(item2);
                })
                .catch(error => console.error('Erro ao carregar os produtos', error));
        }
        document.addEventListener('DOMContentLoaded', loadProduct);
