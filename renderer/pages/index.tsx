import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { UserContext } from '../components/user_context'



const Home: NextPage = () => {

  const [text, setText] = useState('') 
  const { name, setName } = useContext(UserContext);

  useEffect(()=> {
    if(name){
      push("chat")  
    }
  },[])

  const { push } = useRouter();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setName(text)
    push("chat")
  }

  return (
    <div>
        <form onSubmit={onSubmit}>
          <label htmlFor='name'>Name</label>
          <input onChange={event => setText(event.target.value)} id='name' type="text" />
          <button type='submit'>
            Submit
          </button>    
        </form>
    </div>
  )
}

export default Home
