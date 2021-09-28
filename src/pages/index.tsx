import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

type List = {
  id: number
  name: string
  checked?: boolean
}

export default function Home() {

  const [todos, setTodos] = useState<List[]>()

  useEffect(() => {
    returnList()
  }, [])

  async function returnList() {
    await fetch('api/list').then(response => {
      return response.json()
    }).then(data => {
      setTodos(data.list)
    })
  }

  function changeAddTodo(){
    const addTodo = {id: 4, name:`todo add ${Date.now()}`}
    setTodos([...todos, addTodo])
  }

  // useEffect(() => {
  //   console.log(todos)
  // }, [todos])
  return (
    <div>
      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </div>
  )
}
