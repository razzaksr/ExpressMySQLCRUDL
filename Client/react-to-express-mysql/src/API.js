import axios from "axios"
const url="http://localhost:2000"

export const apiCallCreate=async(object)=>{
    const data=await axios.post(`${url}`,object)
    return data
}

export const apiCallRead=async(id)=>{
    id=id||''
    const data=await axios.get(`${url}/${id}`)
    return data
}

export const apiCallUpdate=async(id)=>{
    const data=await axios.put(`${url}/${id}`)
    return data
}

export const apiCallDelete=async(id)=>{
    await axios.delete(`${url}/${id}`)
}