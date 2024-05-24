"use client";

import { ref, onValue, update } from "firebase/database";
import { db } from "../../services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useParams, useRouter } from "next/navigation";

interface IUserParams extends Params {
    id: string;
}

interface IMeta {
    data_conclusao: string;
    data_inicio: string;
    descricao: string;
    status: string;
    titulo: string;
    usuario: string;
}

export default function Home() {
    const router = useRouter();
    const params: IUserParams = useParams();
    const { id } = params;
    const [meta, setMetas] = useState<IMeta>({
        data_conclusao: "",
        data_inicio: "",
        descricao: "",
        status: "",
        titulo: "",
        usuario: "",
    });

    useEffect(() => {
        const fetchData = () => {
            const unsubscribe = onValue(ref(db, `/metas/${id}`), (querySnapShot) => {
                const placeData: IMeta = querySnapShot.val() || {};
                console.log(placeData);
                setMetas(placeData);
            });

            return () => unsubscribe();
        };

        fetchData();
    }, []);

    const editMEta = () => {
        update(ref(db, `/metas/${id}`), meta);
        setMetas({
            data_conclusao: "",
            data_inicio: "",
            descricao: "",
            status: "",
            titulo: "",
            usuario: "",
        });
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
            <div className="max-w-md mx-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editMEta();
                    }}
                >
                    <div className="mb-4">
                        <h2 className="text-center text-3xl mb-8 font-extrabold text-white">
                            Editar meta
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
                            placeholder="Título"
                            value={meta.titulo}
                            onChange={(e) => setMetas({ ...meta, titulo: e.target.value })}
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
                            placeholder="Descrição"
                            value={meta.descricao}
                            onChange={(e) => setMetas({ ...meta, descricao: e.target.value })}
                        />
                    </div>
                    <div className="mb-8">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="status"
                        >
                            Stuatus:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="status"
                            type="text"
                            placeholder="Stuatus"
                            value={meta.status}
                            onChange={(e) => setMetas({ ...meta, status: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="data_inicio"
                        >
                            Data Inicio:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="data_inicio"
                            type="text"
                            placeholder="Data Inicio"
                            value={meta.data_inicio}
                            onChange={(e) => setMetas({ ...meta, data_inicio: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="data_conclusao"
                        >
                            Data Conclusão:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="data_conclusao"
                            type="text"
                            placeholder="Data Conclusão"
                            value={meta.data_conclusao}
                            onChange={(e) => setMetas({ ...meta, data_conclusao: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Editar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}