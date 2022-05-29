import type { AppProps } from 'next/app'
import { UserProvider } from '../components/user_context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  ) 
}

export default MyApp
