"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as Input from '@/components/Form/Input';
import { Button } from '@/components/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      axios.get(`http://localhost:5000/api/location/${id}`)
        .then(response => {
          const locationData = response.data;
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
      toast.success("Local atualizado com sucesso!", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => {
        router.push("/register");
      }, 3000);

    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || "Erro ao atualizar local!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <h1 className="text-3xl font-medium text-zinc-900 dark:text-zinc-100">Editar Local</h1>
      <form className="mt-6 flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-3 pt-5 lg:grid-cols-form">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-100">Nome</label>
          <Input.Root>
            <Input.Control
              name="name"
              id="name"
              placeholder="Digite aqui o nome do local"
              value={formData.name || ''}
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
                value={formData.latitude || ''}
                onChange={handleChange}
              />
            </Input.Root>
            <Input.Root>
              <Input.Control
                name="longitude"
                id="longitude"
                type="text"
                placeholder="y"
                value={formData.longitude || ''}
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
