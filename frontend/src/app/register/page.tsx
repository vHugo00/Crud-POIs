"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Input from '@/components/Form/Input';
import { Pen, Search, Trash } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function Register() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/location/${id}`);
      setLocations((prevLocations) => prevLocations.filter((location) => location.id !== id));
      toast.success("Local excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir local.");
    }
  };

  const redirectToEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get<Location[]>('http://localhost:5000/api/location');
        setLocations(response.data);
      } catch (error) {
        console.error('Erro ao buscar locais:', error);
      }
    };
    fetchLocations();
  }, []);

  // Função de filtro por nome
  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <ToastContainer /> {/* Adicione o ToastContainer aqui */}
      <h1 className="text-3xl font-medium text-zinc-900 dark:text-zinc-100">Listagem de POIs</h1>

      {/* Campo de busca */}
      <div className="mb-4">
        <label htmlFor="searchQuery" className="block mb-4 mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-100">
          Buscar Local
        </label>
        <Input.Root>
          <Search className='text-zinc-600' />
          <Input.Control
            id="searchQuery"
            name="searchQuery"
            placeholder="Digite o nome do local"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Input.Root>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Local</th>
              <th scope="col" className="px-6 py-3 text-center">Latitude</th>
              <th scope="col" className="px-6 py-3 text-center">Longitude</th>
              <th scope="col" className="px-6 py-3 text-center">Editar</th>
              <th scope="col" className="px-6 py-3 text-center">Apagar</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations.map((location) => (
              <tr key={location.id} className="border-b odd:bg-white even:bg-gray-50 ">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900">{location.name}</th>
                <td className="px-6 py-4 text-center text-gray-800">{location.latitude}</td>
                <td className="px-6 py-4 text-center text-gray-800">{location.longitude}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => redirectToEdit(location.id)} className="text-blue-600 hover:underline">
                    <Pen />
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleDelete(location.id)} className="text-red-600 hover:underline">
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
