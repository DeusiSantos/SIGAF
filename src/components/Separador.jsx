


const Separador = (props) => {
    return (
        <div className=" px-6 items-center flex justify-center text-center">
            <div className="text-center ">
                <div className="flex gap-3">
                    {/* Ícone */}
                    <div className="inline-flex p-3  bg-gray-100 rounded-xl text-gray-600 ">
                        {props.icone && <props.icone className="w-6 h-6" />}
                    </div>

                    {/* Título */}
                    <h1 className="text-4xl font-light text-gray-800 ">
                        {props.titulo || "Título do Separador"}
                    </h1>
                    

                </div>
                {/* Linha */}
                <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
            </div>
        </div>
    );
}

export default Separador;