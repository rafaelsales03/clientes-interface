import { FiTrash } from 'react-icons/fi'
import { api } from './services/api'
import { useEffect, useState, useRef, FormEvent} from 'react'
import People from "./assets/people.svg"



interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string;
}


function App() {

  const [customers, setCustomers] = useState<CustomerProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

async function loadCustomers() {
  const response = await api.get("/customers")
  setCustomers(response.data)
}

async function handleSubmit(event: FormEvent){
event.preventDefault();

if(!nameRef.current?.value || !emailRef.current?.value) return;

const response = await api.post("/customer", {
  name: nameRef.current.value,
  email: emailRef.current.value,
})
setCustomers(allCustomers => [...allCustomers, response.data])

nameRef.current.value = ""
emailRef.current.value = ""
}

async function handleDelete(id: string) {
 try {
  await api.delete("/customer", {
    params: {
      id: id,
    }
  })

  const allCustomers = customers.filter( (customer) => customer.id !== id)
  setCustomers(allCustomers)

 } catch(err) {
  console.log(err)
 }
}


  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full sm:max-w-2xl">
        <img src={People} className='w-full h-40'/>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome completo..."
            className="w-full mb-5 p-2 rounded"
            ref={nameRef}
          />

          <label className="font-medium text-white">Email:</label>
          <input
            type="email"
            placeholder="Digite seu email..."
            className="w-full mb-5 p-2 rounded"
            ref={emailRef}

          />



          <input
            type="submit"
            value="Cadastrar"
            className="my-4 cursor-pointer bg-blue-600 hover:bg-blue-600 text-black font-bold py-3 px-6 rounded-full shadow-lg shadow-neutral-950 transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
          />
        </form>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {customers.map((customer) => (
            <article
            key={customer.id}
            className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
          >
            <p><span className="font-medium">Nome:</span> {customer.name}</p>
            <p><span className="font-medium">Email:</span> {customer.email}</p>
            <p><span className="font-medium">Status:</span> {customer.status ? "ATIVO" : "INATIVO"}</p>

            <button 
            className='bg-red-700 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2'
            onClick={() => handleDelete(customer.id)}
            >
            

              <FiTrash size={18} color="#FFF"/>
            </button>

          </article>
          ))}
          
        </section>


      </main>
    </div>
  )
}

export default App