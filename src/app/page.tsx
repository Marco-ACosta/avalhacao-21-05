"use client";

import { ref, onValue, remove } from "firebase/database";
import { db } from "./services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import Link from "next/link";
import signOutUser from "./services/firebase/auth/signOut";

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
  const [loading, setLoading] = useState(true);
  const [metas, setMetas] = useState<IMeta>({});

  useEffect(() => {
    const fetchData = () => {
      const unsubscribe = onValue(ref(db, "/metas"), (querySnapShot) => {
        const metasData: IMeta = querySnapShot.val() || {};
        console.log(metasData);
        setMetas(metasData);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  function clearUser(userKey: string) {
    const userRef = ref(db, `/metas/${userKey}`);
    remove(userRef);
  }

  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <header className="flex px-6">
        <div className="space-x-4">
          <Link href="/signIn">
            <button className="bg-blue-500 text-white  py-2 px-4">
              Login
            </button>
          </Link>
          <Link href="/signUp">
            <button className="bg-green-500 text-white py-2 px-4">
              Registrar
            </button>
          </Link>
          <button
            onClick={async () => {
              const { error } = await signOutUser();
              if (error) {
                console.error("Erro ao deslogar:", error);
              }
            }}
            className="bg-red-500 text-white py-2 px-4"
          >
            Logout
          </button>
          <Link href="/novasmetas">
            <button className="bg-green-500 text-white py-2 px-4">
              Nova Meta
            </button>
          </Link>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-12">
        {!loading &&
          Object.keys(metas).map((userId) => (
            <div key={userId} className="relative py-3">
              <div className="max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                  <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    {loading
                      ? "Carregando..."
                      : `${metas[userId].titulo}`.toUpperCase()}
                  </h2>
                  <div className="my-4">
                    <h1 className="text-xl font-bold">{`ID: ${userId}`}</h1>
                    <p className="text-gray-700">{`Descrição: ${metas[userId].descricao}`}</p>
                    <p className="text-gray-700">{`Inicio: ${metas[userId].data_inicio}`}</p>
                    <p className="text-gray-700">{`Conclusão: ${metas[userId].data_conclusao}`}</p>
                    <p className="text-gray-700">{`Status: ${metas[userId].status}`}</p>
                    <p className="text-gray-700">{`Usuario: ${metas[userId].usuario}`}</p>
                    <div className="flex justify-center space-x-4 mt-4">
                      <Link href={`/meta/${userId}`}>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                          Detalhes
                        </button>
                      </Link>
                      <button
                        onClick={() => clearUser(userId)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
