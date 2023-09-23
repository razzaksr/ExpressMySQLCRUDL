import { useEffect, useState } from "react"
import { apiCallRead } from "./API"

const App=()=>{

  const create=async()=>{

  }
  const read=async()=>{
    
  }
  const update=async()=>{
    
  }
  const dele=async()=>{
    
  }
  const list=async()=>{
   const d = await apiCallRead(); 
   setData(d.data)
  }

  const [data,setData]=useState([])

  useEffect(()=>{
    list()
  },[])

  return(
    <>
      <h1>React Client</h1>
      <table>
        <thead><tr>
          <th>Name</th><th>ID</th><th>Price</th>
        </tr></thead>
        <tbody>
          {data.map((v,k)=>(
            <tr>
              <td>{v.pro_name}</td>
              <td>{v.pro_id}</td>
              <td>{v.pro_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
export default App;
