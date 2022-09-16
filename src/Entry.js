import Form from './Form';
import App from './App';
import { useState } from "react"

export default function Entry() {
    const [page, setPage] = useState('form')

    return ({
        
        "form": <Form setPage={setPage} />,
        "app": <App />,
    }[page])
}
