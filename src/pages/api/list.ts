// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type List = {
  id: string
  name: string
  checked?: boolean
}

type Data = {
  list: List[]
}

const resp = [
  { id: '1', name: 'John', checked: false },
  { id: '2', name: 'Luis', checked: false }
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const list = resp
  res.status(200).json({ list })
}

// function cont(valor) {
//   let notas = [100, 50, 20, 10, 5, 2]
//   for (let celula of notas) {
//     // if(valor === 8) continue
//     var qtd = parseInt(valor / celula)
//     console.log(`qtd de ${celula}: ${qtd}`)
//     valor = valor % celula
//   }
// }