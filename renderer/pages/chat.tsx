import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, MouseEvent, useContext, useEffect, useState } from "react";
import { UserContext } from "../components/user_context";

type Message = {
    name: string,
    msg: string
}

const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));

const Chat:NextPage = () => {
    
    const { name } = useContext(UserContext);
    const [ msgs, setMsgs ] = useState<string[]>([])
    const [text, setText] = useState('')
    const { push } = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            global.ipcRenderer.send('read')
        }, 100);
        return () => clearInterval(interval)
    }, [])


    useEffect(() => {
        if (!name) {
            push("")
        }
    }, [])


    useEffect(() => {

        const func = (event, args: string) => {
            
            const message = (JSON.parse(args) as string[])

            setMsgs(
                message
            )
        }

        global.ipcRenderer.addListener('message', func)

        return () => {
            global.ipcRenderer.removeListener('message', func)
        }
    }, [])

    const sendMessage = async (msg: Message) => {
        global.ipcRenderer.send('message', JSON.stringify(msg))
        await sleep(100)
        global.ipcRenderer.send('read')
    }

    const onSubmit = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if(text.trim() == "clear"){
            global.ipcRenderer.send('clear')
            return;
        }

        const msg:Message = {
            name,
            msg: text
        } 

        sendMessage(msg)
    }

    return (
        <div>
            <h1>
                chat
            </h1>
            <h2>
                Usuario: {name}
            </h2>
            <ul>
                {
                    msgs.map(msg => (
                        <li>
                            {msg}
                        </li>
                    ))
                }
            </ul>
            <form onSubmit={onSubmit}>
                <input onChange={event => setText(event.target.value)} type="text" />
                <button type="submit" >enviar</button>
            </form>
        </div>
    )
}

export default Chat;