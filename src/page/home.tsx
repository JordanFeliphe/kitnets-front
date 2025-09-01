/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import { toast } from 'react-toastify'

// Tipos de exemplo - substitua pelos seus próprios tipos
const tiposExemplo = [{
  value: 'FIRST_MODEL_TWO',
  name: 'Modelo com 2 produtos'
}, {
  value: 'FIRST_MODEL_TRHEE',
  name: 'Modelo com 3 produtos'
}, {
  value: 'FIRST_MODEL_FOUR',
  name: 'Modelo com 4 produtos'
},]

export default function MultipleImageUpload() {
  const [imagens, setImagens] = useState<File[]>([])
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false) // Estado para controlar o loading

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagens(prevImagens => [...prevImagens, ...Array.from(e.target.files || [])])
    }
  }

  const removerImagem = (index: number) => {
    setImagens(imagens.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true) // Ativar o estado de loading

    const formData = new FormData()
    imagens.forEach((imagem) => {
      formData.append(`images`, imagem)
    })
    formData.append('model', tipoSelecionado)

    try {
      const response = await fetch('http://38.242.247.121:5190/processor', {
        method: 'POST',
        body: formData,
      })
      const dataImg = await response.json();
      console.log(dataImg)
      fetch(`http://38.242.247.121:5190/images/${dataImg.filnename}`).then(response => {
        response.arrayBuffer().then(function(buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.jpg"); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
        toast.success('Kit gerado com sucesso!');
      })
      .catch(err => {
        console.log(err);
      });

      if (response.ok) {
        console.log('Envio bem-sucedido')
      } else {
        console.error('Erro no envio')
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setIsLoading(false) // Desativar o estado de loading ao fim do processo
    }
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center overflow-hidden font-sans '>

    <form onSubmit={handleSubmit} className="max-w-lg w-xl  p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="imagens" className="block text-sm font-medium text-gray-700 mb-2">
          Selecione as imagens
        </label>
        <input
          id="imagens"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagemChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      {imagens.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {imagens.map((imagem, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(imagem)}
                alt={`Imagem ${index + 1}`}
                className="w-full h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removerImagem(index)}
                className="absolute -top-2 -right-2 text-red-500 hover:text-red-700"
              >
                <span>X</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
          Selecione o tipo
        </label>
        <select
          id="tipo"
          value={tipoSelecionado}
          onChange={(e) => setTipoSelecionado(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Selecione um tipo</option>
          {tiposExemplo.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={isLoading} // Desativar o botão enquanto estiver carregando
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 mr-3 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          'Gerar kit'
        )}
      </button>
    </form>
    </div>
  )
}
