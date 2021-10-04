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


## Jest
Com Jest cria-se um "ambiente" de testes automatizado, basicamente é selecionado um componente ou uma página e é passado o que espera-se que seja retornado.

#### Instalações e configurações
Primeiro instalar os seguintes pacotes:
```console
yarn add -D jest @types/jest @babel/preset-typescript @testing-library/jest-dom jest-styled-components @testing-library/react styled-components.macro
```
Após as instalações deverão ser feitas algumas configurações, na raiz do projeto deve-se criar o aquivo `.babelrc.js` e adicionar o seguinte código:
```js
module.exports = {
  "presets": [
    "next/babel",
    "@babel/preset-typescript"
  ],
  "plugins": [
    [
      "styled-components",
      {
        "ssr": true,
        "displayName": true
      }
    ]
  ],
  "env": {
    "test": {
      "plugins": [
        [
          "styled-components",
          {
            "ssr": false,
            "displayName": false
          }
        ]
      ]
    }
  }
}
```
Para não ficar importando em todos os documentos as bibliotecas necessárias, fazer uma pasta na raiz do projeto chamada `.jest` e dentro dela um arquivo com o nome `jest-setup.ts` e adicionar o seguinte:
```ts
import '@testing-library/jest-dom';
import 'jest-styled-components';
```
Na raiz do projeto fazer a seguinte configuração em `jest.config.js` após criar o mesmo:
```js
module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts(x)?'],
  collectCoverage: true,

  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/out/', '/public/'],

  setupFilesAfterEnv: ['<rootDir>/.jest/jest-setup.ts'],
};
```
Em `package.json` adicionar em scripts:
```json
"test": "jest",
"test:watch": "jest --watch"
```
Opcionalmente pode-se adicionar o seguinte também em scripts:
```json
// mostrará no terminal os testes de forma mais limpa
"test:silent": "jest --watchAll --silent --noStackTrace",
// executará todos os testes e mostrará em uma página dinamica
// as linhas que foram testadas
"test:coverage": "jest --coverage --silent --noStackTrace"
```

#### Padrões e codificação de testes
Todos os arquivos relacionados ao teste direto deve conter no nome de arquivo `nome.spec.tsx` dentro de qualquer pasta, para melhor organização coloca-se na pasta `__test__` e dali fazer as importações necessárias com relação a página ou componente que será testado.
A codificação dos testes segue um padrão comum:
```tsx
describe('', () => {
  it('', () => {
    //teste
  })
})
```
A função `describe` serve para agrupar ou organizar melhor os testes, entre as aspas coloca-se um rótulo para tal grupo de testes como por exemplo qual página será testada, `it`  funciona de forma semelhante, no lugar de `it` pode-se colocar `test`, por padrão nesse 'escopo' determina-se o que se espera daquele teste.
Nos testes especificamente não há um padrão, há muitas formas de testar um componente ou uma página. Adiante há três exemplos diferentes para diferentes ações.
O primeiro teste verifica se há um botão enviar na página, nota-se a presença de um id, esse seria o responsável para que o teste possa identificar diretamente o elemento:
```tsx
// elemento na página
<div data-testid="todo-list">
  <button>Enviar</button>
</div>

// teste
test('Testing to have send button', async () => {
  const { getByText, getByTestId } = render(<Home/>)

  expect(getByTestId("todo-list")).toContainElement(
      getByText("Enviar")
    )
})
```
O segundo teste verifica a existencia de um input especifico:
```tsx
// elemento na página
<div>
  <label>Todo:</label>
  <input {...register('name')} type="text" data-testid="todo-input" />
</div>

// teste
test('Testing to have input element', async () => {
  render(<Home/>)

  const inputTd = screen.getByTestId('todo-input')
  expect(inputTd).toBeInTheDocument()
  expect(inputTd).toHaveAttribute('type', 'text')
})
```
O terceiro teste verifica a funcionalidade do elemento colocando um texto no input e clicando em enviar:
```tsx
test('Testing send event', async () => {
  render(<Home />)
  const setup = () => {
      const input = screen.getByTestId('todo-input')
      return {
        input,
        ...screen,
      }
    }
    const {input} = setup()
    fireEvent.change(input, {target: {value: 'teste jest'}})
    await actWait()
    fireEvent.click(screen.getByText("Enviar"))
    await actWait()
    expect(screen.getByTestId('todo-list')).toContainElement(
        screen.getByText('teste jest')
    )
})
```
Nota-se algumas linhas contendo `await actWait()`, quando adicionamos itens em uma aplicação React o navegador renderiza cada novo item que é colocado, isso não funciona dessa forma no teste sendo que seria necessário pedir para renderizar cada nova mudança, é isso o que essa função faz, ressaltando porém que essa função é 'customizada' sendo que existe uma função `act()` nativa do React que serve exatamente para testes, nesse caso especifico importa-se o act de `@testing-library/react`:
```tsx
import { act } from '@testing-library/react'
const wait = (amount = 0) => {
  return new Promise((resolve) => setTimeout(resolve, amount));
};

const actWait = async (amount = 0) => {
  await act(async () => {
    await wait(amount);
  });
};
```
###### Até o momento da publicação não foi encontrado uma solução para o erro de multiplos elementos que obtém-se quando realiza-se o teste de forma que primeiro é feito o teste de adicionar um item e em segundo momento o de remover sendo que nesse segundo teste é necessário adicionar o item que será removido.