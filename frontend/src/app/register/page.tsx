"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Input from '@/components/Form/Input';
import { Pen, Search, Trash } from 'lucide-react';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { Button } from '@/components/Button';


// Interface para os dados de um local
interface Location {
  id: number; 
  name: string;
  latitude: number;
  longitude: number;
}

// Interface para os dados atualizados de um local
interface UpdatedData {
  name: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState<number | string>('');

  // Função para deletar um local
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/location/${id}`);
      
      // Atualize a lista local de items removendo o item deletado
      setLocations((prevLocations) => prevLocations.filter((location) => location.id !== id));
      
      // Exibir mensagem de sucesso
      toast.success("Location deleted successfully!");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Error deleting location.");
    }
  };

  // Função para editar um local
  const editLocation = async (id: number, updatedData: UpdatedData): Promise<void> => {
    try {
      await axios.put(`http://localhost:5000/api/location/${id}`, updatedData);
      toast.success('Local atualizado com sucesso!');
      // Atualize a lista de locais após editar
      setLocations((prevLocations) =>
        prevLocations.map((location) =>
          location.id === id ? { ...location, ...updatedData } : location
        )
      );
    } catch (error) {
      toast.error('Erro ao atualizar local!');
    }
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

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const [latitude, longitude] = searchQuery.split(',').map(Number);
      const response = await axios.get<Location[]>('http://localhost:5000/api/location/proximity', {
        params: {
          latitude,
          longitude,
          maxDistance: Number(maxDistance),
        }
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Erro ao buscar locais por proximidade:', error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-medium text-zinc-900 dark:text-zinc-100">
        Listagem de POIs
      </h1>
      <div className="mt-6 flex flex-col">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-white">
              Buscar POIs
            </h2>
          </div>
        </div>
      </div>

      <form id="search" className="mt-6 flex w-full flex-col gap-5" onSubmit={handleSearch}>
        <Input.Root className="mx-1 w-auto">
          <Input.Prefix>
            <Search className="h-5 w-5 text-zinc-500" />
          </Input.Prefix>
          <Input.Control 
            type="text" 
            placeholder="Encontrar um local (latitude,longitude)" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </Input.Root>
        <div className="flex items-center gap-3">
          <Input.Root>
            <Input.Control
              name="latitude"
              id="latitude"
              type="text"
              placeholder="Latitude"
            />
          </Input.Root>
          <Input.Root>
            <Input.Control
              name="longitude"
              type="text"
              placeholder="Longitude"
            />
          </Input.Root>
          <Input.Root>
            <Input.Control
              name="distancia" 
              type="text"
              placeholder="Distadistância máxima"
            />
          </Input.Root>
          <Button type="submit" form="settings" variant="primary">
            Buscar
          </Button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Local</th>
                <th scope="col" className="px-6 py-3 text-center">Latitude</th>
                <th scope="col" className="px-6 py-3 text-center">Longitude</th>
                <th scope="col" className="px-6 py-3 text-center">Editar</th>
                <th scope="col" className="px-6 py-3 text-center">Apagar</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {location.name}
                  </th>
                  <td className="px-6 py-4 text-center">{location.latitude}</td>
                  <td className="px-6 py-4 text-center">{location.longitude}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => editLocation(location.id, {
                        name: location.name,
                        latitude: location.latitude,
                        longitude: location.longitude,
                      })}
                      className="text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      <Pen />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(location.id)} 
                      className="text-red-600 dark:text-red-500 hover:underline"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}
