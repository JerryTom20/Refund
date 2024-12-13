//Pegando o elemento do form
const form = document.querySelector("form");

const amount = document.getElementById("amount");

const expense = document.getElementById("expense");

const category = document.getElementById("category");

//seleciona os elementos da lista

const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

//oninput ele observa o que esta sendo colocado no valor
amount.oninput = () => {
    //Aqui esta substituindo para aceitar apenas numero com o REGEX
    let value = amount.value.replace(/\D/g, "")
    //Transformando o valor em centavos
    value = Number(value) / 100
    //Atualizando o valor do input
    amount.value = formatCurrencyBRL(value)

}

function formatCurrencyBRL(value) {
    //Formatando o valor para padrão real
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value
}

//dados do submit
form.onsubmit = () => {
    event.preventDefault() //Não carrega a pagina

    //objeto criado para um novo pedido
    const newExpese = {
        id: new Date().getTime(),
        expense: expense.value, //Nome da despesa
        category_id: category.value, // valor da categoria, o nome em si (pela o id)
        category_name: category.options[category.selectedIndex].text, //O nome da opção
        amount: amount.value, //o valor do gasto
        created_at: new Date(), //A data dele
    }
    ///chama a função que ira add o item na lista
    expenseAdd(newExpese)
}
//Add item na lista
function expenseAdd(newExpense) {
    try {
        //criando elemento para add na lista
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //criando o icone da categoria

        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)

        // Adicionando informações no item
        expenseItem.append(expenseIcon)
        expenseList.append(expenseItem)


        //colocando o nome da despesa
        const info = document.createElement("div")
        info.classList.add("expense-info")

        const title = document.createElement("strong")
        title.textContent = newExpense.expense
        info.append(title);
        expenseItem.append(info);
        //sub titulo nas despesas 
        const subTitle = document.createElement("span")
        subTitle.textContent = newExpense.category_name
        info.append(subTitle)
        //colocando os custo da despesa
        const custo = document.createElement("span")
        custo.classList.add("expense-amount")
        custo.textContent = newExpense.amount


        //Criando valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        //contatenando o html
        expenseAmount.innerHTML = `<small>R$</small> ${amount.value.toUpperCase().replace("R$", "")}`

        expenseItem.append(expenseAmount)


        //Aqui é a função de remove do botão 
        const remove = document.createElement("img")
        remove.classList.add("remove-icon")
        remove.setAttribute("src", `img/remove.svg`)

        expenseItem.append(remove)
        //Função de click para fazer o remove
        remove.addEventListener("click", function () {
            expenseItem.remove();
        })
        //limpa o form
        formClear()
        //atualiza os totais
        updateTotals()


    } catch (error) {
        alert("Não foi possivel atualizar a lista")
    }
}

//att os totais das despesas

function updateTotals() {
    try {
        //recupera os intens da lista 
        const items = expenseList.children
        //Contatenando os items com html
        expensesQuantity.textContent = `${items.length}
         ${items.length > 1 ? "despesas" : "despesa"}`

        //variavel para somar total

        let total = 0

        //percorre cada item (li) da lista

        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")
            //removendo que não é numero e substituindo a virgula para ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            //converte o valor para float

            value = parseFloat(value)
            //incrementando o valor total
            total += Number(value)
        }


        //criando span para add o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"
        //formatando o valor e removendo o R$ que sera exibido no Small com o estilo customizavel
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")


        //Limpa o conteudo do elemento
        expenseTotal.innerHTML = ""

        //Add o simbolo e o total add
        expenseTotal.append(symbolBRL, total)





    }
    catch (error) {
        alert("Não foi possivel atualizar os totais")
    }
}

//Evento que captura o clique nos itens da lista

expenseList.addEventListener("click", function (event) {
    //verificar se o evento clicado é o icone
    if (event.target.classList.contains("remove-icon")) {
        //obtem a li pai do elemento clicado
        const item = event.target.closest(".expense")
        //remove o item da lista
        item.remove()
    }
    //atualiza os totais
    updateTotals()
})

function formClear() {
    expense.value = ""
    category.value = ""
    amount.value = ""
    //coloca o foco no input do amount
    expense.focus()
}