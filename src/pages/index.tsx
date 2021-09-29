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
}

export default function Home() {

  const [todos, setTodos] = useState<List[]>([])
  const {register, handleSubmit, reset} = useForm<FormValues>()

  useEffect(() => {
    localForage.getItem('todo')
      .then((response: any) => {
        console.log(response);
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
  
  async function changeAddTodo(data: FormValues, e: any){
    const addTodo = {id: `${uuid()}`, name:`${data.name}`}
    setTodos([...todos!, addTodo])
    await localForage.setItem('todo', [...todos!, addTodo]).then(() => {
      console.log('Atualizado')
      console.log('log de add: ', todos)
    }).catch((err) => {
      console.log(err)
    })
    e.target.reset()
  }

  const listLocal = () => {
    const todoLocal = localForage.getItem('todo')
      .then((response: any) => {
        return response
      })
      .catch(error => {
        return console.log(error)
      });
    console.log(todoLocal)
  }

  const removeTodo = (id: string) => {
    const todoIndex = todos.findIndex(todo => todo.id === id)
    todos.splice(todoIndex, 1)

    setTodos([...todos])

    localForage.setItem('todo', todos)
  }

  const deleteListLocal = () => {
    localForage.removeItem('todo')
    .then((response: any) => {
      console.log(response)
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
    <div>
      <ul>
        {todos?.map(todo => (
          <li key={todo?.id}>{todo?.name}
          <button onClick={() => removeTodo(todo?.id)}>Feito</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(changeAddTodo)}>
        <div>
          <label>Todo:</label>
          <input {...register('name')} type="text" />
        </div>
        <button>Enviar</button>
      </form>
      <button onClick={listLocal}>GET</button>
      <button onClick={deleteListLocal}>DELETE ALL</button>
    </div>
  )
}
