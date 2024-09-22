"use client";

import axios from 'axios';
import * as Input from '@/components/Form/Input';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    // Validação do nome
    if (!formData.name.trim()) {
      toast.error("O campo 'Nome' não pode estar vazio!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const lat = formData.latitude.trim();
    const long = formData.longitude.trim();

    // Verificação se a latitude e longitude contêm caracteres inválidos
    if (!/^\d+$/.test(lat) || !/^\d+$/.test(long)) {
      toast.error("As coordenadas devem conter apenas números inteiros e positivos, sem vírgulas ou pontos!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Converte as coordenadas para números inteiros
    const latNumber = Number(lat);
    const longNumber = Number(long);

    // Verifica se as coordenadas são números inteiros e positivos
    if (!Number.isInteger(latNumber) || latNumber < 0 || !Number.isInteger(longNumber) || longNumber < 0) {
      toast.error("As coordenadas devem ser números inteiros e positivos!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Coordenadas válidas, pode prosseguir com o envio
    console.log("Coordenadas válidas:", { lat: latNumber, long: longNumber });

    try {
      await axios.post('http://localhost:5000/api/location', formData);
      toast.success("Local salvo com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({ name: '', latitude: '', longitude: '' });
    } catch (error) {
      toast.error("Verifique se todos os campos foram preenchidos!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <h1 className="text-3xl font-medium text-zinc-900 dark:text-zinc-100">Registros de POIs</h1>
      <form id="settings" className="mt-6 flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-3 pt-5 lg:grid-cols-form">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-100">Nome</label>
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

        <div className="grid gap-3 lg:grid-cols-form">
          <label htmlFor="latitude" className="text-sm font-medium text-zinc-700 dark:text-zinc-100">Coordenadas</label>
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
                id="longitude"
                type="text"
                placeholder="y"
                value={formData.longitude}
                onChange={handleChange}
              />
            </Input.Root>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-5">
          <Button type="submit" form="settings" variant="primary">Salvar</Button>
        </div>
      </form>
    </>
  );
}
