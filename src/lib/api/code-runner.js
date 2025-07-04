import axios from "axios"


const runCodeRequest = axios.create({
    url: 'https://onecompiler-apis.p.rapidapi.com/api/v1/run',
    headers: {
        'x-rapidapi-key': '2b242f59dfmsh33da668fad06e7cp180b99jsn4c0cd8777b70',
        'x-rapidapi-host': 'onecompiler-apis.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
})

export default runCodeRequest