"use client";

import { ref, onValue, push } from "firebase/database";
import { db } from "../services/firebase/firebaseConfiguration";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, User, signOut } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import { app } from "../services/firebase/firebaseConfiguration";

interface AuthContextProviderProps {
    children: ReactNode;
  }

/* codigo para limitar uso para apenas usarios logados (não funcionou acho)
  const auth = getAuth(app);

  export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
  }) => {
    const [userAuth, setUserAuth] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (authUserCredentials: User | null) => {
          setUserAuth(authUserCredentials);
          setLoading(false);
        }
      );
  
      return () => unsubscribe();
    }, []);
  
    async function logout() {
      let result = null,
        error = null;
      try {
        result = await signOut(auth);
      } catch (e) {
        error = e;
      }
  
      return { result, error };
    }
  
    return (
      <AuthContext.Provider value={{ userAuth, logout }}>
        {loading ? (
          <div className="min-h-screen bg-gray-800 flex justify-center items-center">
            <h1 className="text-white text-3xl">Loading...</h1>
          </div>
        ) : (
          children
        )}
      </AuthContext.Provider>
    );
  };
 */ 
interface IMeta {
    [key: string]: {
        data_conclusao: string;
        data_inicio: string;
        descricao: string;
        status: string;
        titulo: string;
        usuario: string;
    };
}


export default function Home() {
    const router = useRouter();
    const [newMeta, setnewMeta] = useState({
        data_conclusao: "",
        data_inicio: "",
        descricao: "",
        status: "",
        titulo: "",
        usuario: "",
    });

    const addnewMeta = () => {
        push(ref(db, "/metas"), newMeta);
        setnewMeta({
            data_conclusao: "",
            data_inicio: "",
            descricao: "",
            status: "",
            titulo: "",
            usuario: "",
            //tentei aplicar esse metodo e não consegui: https://stackoverflow.com/questions/38352772/is-there-any-way-to-get-firebase-auth-user-uid
        });
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
            <div className="max-w-md mx-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addnewMeta();
                    }}
                >
                    <div className="mb-4">
                        <h2 className="text-center text-3xl mb-8 font-extrabold text-white">
                            Cadastrar meta
                        </h2>
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="titulo"
                        >
                            Titulo:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="titulo"
                            type="text"
                            placeholder="Titulo"
                            maxLength={30}//limite de characteres
                            value={newMeta.titulo}
                            onChange={(e) =>
                                setnewMeta({ ...newMeta, titulo: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="descricao"
                        >
                            Descrição:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="descricao"
                            type="text"
                            placeholder="descrição"
                            maxLength={100}//limite de characteres
                            value={newMeta.descricao}
                            onChange={(e) =>
                                setnewMeta({ ...newMeta, descricao: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-8">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="status"
                        >
                            Status:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="status"
                            type="text"
                            placeholder="Status"
                            value={newMeta.status}
                            onChange={(e) =>
                                setnewMeta({ ...newMeta, status: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-8">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="data_inicio"
                        >
                            Data de inicio:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="data_inicio"
                            type="text"
                            placeholder="Data de inicio"
                            value={newMeta.data_inicio}
                            onChange={(e) =>
                                setnewMeta({ ...newMeta, data_inicio: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-8">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="data_conclusao"
                        >
                            Data de Conclusão:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="data_conclusao"
                            type="text"
                            placeholder="Data de Conclusão"
                            value={newMeta.data_conclusao}
                            onChange={(e) =>
                                setnewMeta({ ...newMeta, data_conclusao: e.target.value })
                            }
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Adicionar Meta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}