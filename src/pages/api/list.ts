// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type List = {
  id: number
  name: string
  checked?: boolean
}

type Data = {
  list: List[]
}

const resp = [
  {id: 1, name: 'John', checked: false},
  {id: 2, name: 'Luis', checked: false}
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const list = resp
  res.status(200).json({list})
}
