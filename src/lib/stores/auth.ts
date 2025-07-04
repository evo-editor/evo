import { writable } from "svelte/store"
import axiosRequest from "../api/axios"


interface GithubUser {
    type: "github",
    avatar: string,
    username: string,
    createdAt: Date,
    settings: object,
    installedExtensions: string[]
}


interface User {
    type: "email",
    username: string,
    email: string,
    createdAt: Date,
    settings: object,
    installedExtensions: string[]
}



export const connectedUser = writable<(GithubUser | User) | null>(null)


export const updateUser = async (): Promise<void> => {
    try {
        const { data } = await axiosRequest.get("/user")
        connectedUser.set(data.user)
    }
    catch(error) {
        connectedUser.set(null)
    }
}