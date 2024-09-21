"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as Input from '@/components/Form/Input';
import { Button } from '@/components/Button';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export default function EditPage() {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/location/#${id}`)
        .then(response => {
          const locationData = response.data[0]; // Garantir que pegue o primeiro item do array
          setFormData({
            name: locationData.name || '',
            latitude: locationData.latitude || '',
            longitude: locationData.longitude || '',
          });
          setIsLoading(false); 
        })
        .catch(error => {
          console.error("Erro ao carregar local:", error);
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/location/${id}`, formData);
      Toastify({
        text: "Local atualizado com sucesso!",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();
      router.push("/register");
    } catch (error) {
      Toastify({
        text: "Erro ao atualizar local!",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "#E5010B",
      }).showToast();
    }
  };

  return (
    <>
      <h1 className="text-3xl font-medium text-zinc-900 dark:text-zinc-100">Editar Local</h1>
      <form className="mt-6 flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-3 pt-5 lg:grid-cols-form">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-100">Nome</label>
          <Input.Root>
            <Input.Control
              name="name"
              id="name"
              placeholder="Digite aqui o nome do local"
              value={formData.name || ''} // Garantir que tenha um valor sempre
              onChange={handleChange}
            />
          </Input.Root>
        </div>

        <div className="grid gap-3 lg:grid-cols-form">
          <label htmlFor="latitude" className="text-sm font-medium text-zinc-700 dark:text-zinc-100">Coordenadas</label>
          <div className="grid gap-6 lg:grid-cols-2">
            <Input.Root>
              <Input.Control
                name="latitude"
                id="latitude"
                type="text"
                placeholder="x"
                value={formData.latitude || ''} // Garantir que tenha um valor sempre
                onChange={handleChange}
              />
            </Input.Root>
            <Input.Root>
              <Input.Control
                name="longitude"
                id="longitude"
                type="text"
                placeholder="y"
                value={formData.longitude || ''} // Garantir que tenha um valor sempre
                onChange={handleChange}
              />
            </Input.Root>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-5">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" variant="primary">Atualizar</Button>
        </div>
      </form>
    </>
  );
}
