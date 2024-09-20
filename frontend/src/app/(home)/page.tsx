"use client"
import axios from 'axios';
import * as Input from '@/components/Form/Input';
import { Button } from '@/components/Button';
import { useState } from 'react';
import 'toastify-js/src/toastify.css'; 
import Toastify from 'toastify-js';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validação dos campos
    if (!formData.name.trim()) {
      Toastify({
        text: "O campo 'Nome' não pode estar vazio!",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      return; // Sai da função se o campo estiver vazio
    }
  
    if (isNaN(Number(formData.latitude)) || isNaN(Number(formData.longitude))) {
      Toastify({
        text: "As coordenadas devem ser números válidos!",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      return; // Sai da função se as coordenadas não forem válidas
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/location', formData);
      Toastify({
        text: "Local salvo com sucesso!",
        duration: 3000,
        gravity: "top",
        position: 'right',
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
        
      console.log('Response:', response.data);
    } catch (error) {
      Toastify({
        text: "Erro ao salvar local!",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "#E5010B",
      }).showToast();
      console.error('Error saving location:', error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-medium text-zinc-900 dark:text-zinc-100">
        Registros de POIs
      </h1>
      <form id="settings" className="mt-6 flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-3 pt-5 lg:grid-cols-form ">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-100">
            Nome
          </label>
          <div className="flex gap-3">
            <Input.Root>
              <Input.Control
                name="name"
                id="name"
                placeholder="Digite aqui o nome do local"
                value={formData.name}
                onChange={handleChange}
              />
            </Input.Root>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-form ">
          <label htmlFor="latitude" className="text-sm font-medium text-zinc-700 dark:text-zinc-100">
            Coordenadas
          </label>
          <div className="grid gap-6 lg:grid-cols-2">
            <Input.Root>
              <Input.Control
                name="latitude"
                id="latitude"
                type="text"
                placeholder="x"
                value={formData.latitude}
                onChange={handleChange}
              />
            </Input.Root>
            <Input.Root>
              <Input.Control
                name="longitude"
                type="text"
                placeholder="y"
                value={formData.longitude}
                onChange={handleChange}
              />
            </Input.Root>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-5">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" form="settings" variant="primary">
            Salvar
          </Button>
        </div>
      </form>
    </>
  );
}
