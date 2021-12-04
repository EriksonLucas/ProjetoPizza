let cart = [];
let modalQt = 1; //valor quatidade de pizza no modal
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el); // encurtando o código

//listagen das pizzas
pizzaJson.map((item, index)=>{
    
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    //preencher as informações em pizza item

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    //preencher indereço src em item--img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    //preencher as informações do nome em item name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    //preencher as informações da descrição em iten desc
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    //preencher as informações do valor em iten price, usando o tamplate string e to fixed para padronizar as 2 casas decimais após a virgula
    
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{ //adicionando evento de click no link da img

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        //indetificando a pizza que foi clicada para abrir no modal... .closest() procura o parente mais próximo. saio da manipulação no ('a') e foi para o ('.pizza-item')
        modalQt = 1;
        modalKey = key;
        
        e.preventDefault(); //bloquear a ação default de atualizar a tela a cada clik

        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIdex)=>{ //.forEach() para aplicar a função para cada um dos itens do query selector all
            
           if (sizeIdex == 2){
                size.classList.add('selected');
           } 
           size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIdex]
        });
        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaWindowArea').style.opacity = 0 //opacidade 0
        c('.pizzaWindowArea').style.display = 'flex' ; //ao clicar altera o display de pizza window area

        setTimeout(()=>{ //aguarda 200 milesegundos, para aplicar opacidade 100%, e junto com transition do css faz a animação
            c('.pizzaWindowArea').style.opacity = 1
        }, 200);
    });
    c('.pizza-area').append(pizzaItem);
});

//eventos do modal

function closeModal(){ //trasição para fechamento
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt ++;
    c('.pizzaInfo--qt').innerHTML = modalQt;

});
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt > 1) {
    modalQt --;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
cs('.pizzaInfo--size').forEach((size, sizeIdex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
 });
// alterando preço de acordo com o tamanho
document.querySelectorAll('.pizzaInfo--size').forEach( (item, itemIndex) => {
    item.addEventListener('click', (event) => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        item.classList.add('selected');

        let price = pizzaJson[modalKey].price;
        let size = itemIndex;

        if ( itemIndex == 0 ) price *= 0.6;
        else if ( itemIndex == 1 ) price *= 0.8;

        document.querySelector('.pizzaInfo--actualPrice').innerHTML = ` ${price.toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`; 

    });
});
//carinho de compras
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c(".pizzaInfo--size.selected").getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    } else {
            cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt,
            });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length >0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    
    c('aside').style.left = '100vw';
});
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''

    let subtotal = 0;
    let desconto = 0;
    let total =0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price*cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode('true');
            
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1: 
                    pizzaSizeName = 'M';
                    break;
                case 2: 
                    pizzaSizeName = 'G';
                    break;
            }   



            let pizzaName = `${pizzaItem.name} + (${pizzaSizeName})`;


            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else{
                    cart.splice(i, 1);
                }
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal*0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        

    } else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}