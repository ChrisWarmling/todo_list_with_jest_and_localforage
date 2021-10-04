import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import localForage from 'localforage'
import list from './api/list'

type List = {
  id: string
  name: string
  checked?: boolean
}

type FormValues = {
  name: string
  checked: boolean
}

export default function Home() {

  const [todos, setTodos] = useState<List[]>([])
  const { register, handleSubmit } = useForm<FormValues>()

  useEffect(() => {
    localForage.getItem('todo')
      .then((response: any) => {
        if (response) setTodos(response)
      })
      .catch(error => {
        return console.log(error)
      });
  }, [])

  // async function returnList() {
  //   // await fetch('api/list').then(response => {
  //   //   return response.json()
  //   // }).then(data => {
  //   //   setTodos(data.list)
  //   // })


  // }

  async function changeAddTodo(data: FormValues, e: any) {
    const addTodo = { id: `${uuid()}`, name: `${data.name}`, checked: false }
    setTodos([...todos!, addTodo])
    await localForage.setItem('todo', [...todos!, addTodo]).then(() => {
    }).catch((err) => {
      console.log(err)
    })
    e.target.reset()
  }

  const checkTodo = async (id: string) => {
    // await localForage.getItem('todo')
    //   .then((response: any) => {
        const todoIndex = todos.findIndex(todo => todo.id === id)
        
        // response[todoIndex].checked = !response[todoIndex].checked
        
        todos[todoIndex].checked = !todos[todoIndex].checked

        setTodos([...todos])
        
        localForage.setItem('todo', todos)
        
  //       return response
  //     })
  //     .catch(error => {
  //       return console.log(error)
  //     });
  }

  const removeTodo = (id: string) => {
    const todoIndex = todos.findIndex(todo => todo.id === id)
    todos.splice(todoIndex, 1)

    setTodos([...todos])
    
    // setTodos(todos.filter(todo => todo.id != id))

    localForage.setItem('todo', todos)
  }

  const deleteAllTodo = () => {
    localForage.removeItem('todo')
      .then((response: any) => {
        setTodos(response)
      })
      .catch(error => {
        return console.log(error)
      })
  }

  // useEffect(() => {
  //   console.log(todos)
  // }, [todos])

  return (
    <div data-testid="todo-list">
      <ul data-testid="todo-itens">
        {todos?.map(todo => (
          <li key={todo?.id}>
            <input type="checkbox" checked={todo?.checked} onChange={() => checkTodo(todo?.id)} />
            {todo?.name}
            <button onClick={() => removeTodo(todo?.id)} data-testid={`${todo?.name}`}>Feito</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(changeAddTodo)}>
        <div>
          <label>Todo:</label>
          <input {...register('name')} type="text" data-testid="todo-input" />
        </div>
        <button>Enviar</button>
      </form>
      <button onClick={deleteAllTodo}>DELETE ALL</button>
    </div>
  )
}
