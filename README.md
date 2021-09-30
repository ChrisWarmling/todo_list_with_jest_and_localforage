# App TodoList para estudo de Jest e localForage

## localForage
É uma biblioteca JavaScript semelhante ao `localStorage`, com a vantagem de não apenas armazenar strings mas dados de várias formas diferentes principalmente objetos e arrays podendo ser mais de 1 item.
Não é preciso de configuração, apesnas se necessário indicar em qual armazenamento do navegador deve-se trabalhar.
Pode-se dizer que se comporta como um "falso banco de dados", tem suas muitas limitações por isso deve ser usado com moderação e sem atribuir dados muito importantes nele, de modo geral é uma ótima ferramenta para melhorar a experiência offline da aplicação.

Para armazenar dados:
```tsx
localForage.setItem('x', y)
```
Onde `x` nomeia o item que será armazenado e `y` o item a ser passado.

Requisição de um item:
```tsx
localForage.getItem('x')
      .then((response: any) => {
        // if (response) setTodos(response)
        return response
      })
      .catch(error => {
        return console.log(error)
      });
```
Da mesma maneira que anteriormente, o `x` respresenta o item nomeado anteriormente.

Remover o item inteiro:
```tsx
localForage.removeItem('todo')
      .then((response: any) => {
        setTodos(response)
      })
      .catch(error => {
        return console.log(error)
      })
```
Não é necessário retornar algo, nesse exemplo remove-se o item `todo`, que é um array de objetos, e retorna `undefined` para `setTodos`

Essas são as três operações básicas de inserir, retornar e remover do localForage, há outras operações destacadas abaixo:
```tsx
localforage.clear() //remove tudo que tiver
localforage.length() // retorna o número de keys contidas no 'banco'
```

Não há uma função que permita fazer adições alterações em apenas um item do array ou objeto, nesse caso toda alteração deverá ser feita necessáriamente com `setItem` de certa forma desconsiderando todos os valores anteriores e passando os novos, seguindo nesse raciocínio, o exemplo abaixo descreve essa ação:
```tsx
const removeTodo = (id: string) => {
    //retorna o index do item desejado
    const todoIndex = todos.findIndex(todo => todo.id === id)
    //exclui ele do array
    todos.splice(todoIndex, 1)

    setTodos([...todos])

    localForage.setItem('todo', todos)
  }
```

###### Apesar de na documentação dizer que é assincrono, em diversos momentos foi necessário executar em uma função assincrona para conseguir pegar os valores do array que é retornado.
