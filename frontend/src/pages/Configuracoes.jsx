import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";
import { toast } from "react-toastify";

export default function Configuracoes() {
  const { org, setOrg, theme, setTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [nome, setNome] = useState(org?.name || "");
  const [logo, setLogo] = useState(org?.logo || "");
  const [primary, setPrimary] = useState(theme?.primary || "#2563eb");
  const [secondary, setSecondary] = useState(theme?.secondary || "#22d3ee");

  async function salvar(e) {
    e.preventDefault();
    try {
      await api.put("/org", { name: nome, logo, primary, secondary });
      setOrg({ ...org, name: nome, logo });
      setTheme({ primary, secondary });
      toast.success("Configurações salvas com sucesso!");
    } catch {
      toast.error("Erro ao salvar configurações.");
    }
  }

  // Só admin pode acessar
  if (user?.role !== "admin") return <div className="p-8 text-red-600">Acesso negado</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Configurações da Organização</h2>
          <form onSubmit={salvar} className="space-y-4">
            <div>
              <label className="block font-semibold">Nome</label>
              <input
                className="w-full border p-2 rounded"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Logo (URL)</label>
              <input
                className="w-full border p-2 rounded"
                value={logo}
                onChange={e => setLogo(e.target.value)}
              />
              {logo && <img src={logo} alt="logo" className="h-16 mt-2" />}
            </div>
            <div>
              <label className="block font-semibold">Cor primária</label>
              <input
                type="color"
                value={primary}
                onChange={e => setPrimary(e.target.value)}
                className="w-16 h-10 border-0"
              />
            </div>
            <div>
              <label className="block font-semibold">Cor secundária</label>
              <input
                type="color"
                value={secondary}
                onChange={e => setSecondary(e.target.value)}
                className="w-16 h-10 border-0"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
