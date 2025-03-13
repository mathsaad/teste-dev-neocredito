import { useState, useEffect } from 'react';
import { Repository } from '../entity/Repository';
import api from '../config/axiosconfig';
import RepositoryTable from '../components/RepositoryTable';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io(process.env.REACT_APP_API_BASE_URL!);

function ListPage() {
  const [file, setFile] = useState<File | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRepositories();
    
    socket.on('processingComplete', (data) => {
      setSuccessMessage(data.message);
      fetchRepositories();
    });
    
    return () => {
      socket.off('processingComplete');
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setSuccessMessage('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/repositories/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('Arquivo enviado com sucesso. Processamento em andamento...');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao importar o arquivo.';
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepositories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/repositories');
      setRepositories(response.data);
    } catch (err) {
      setError('Erro ao buscar repositórios importados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Importar Repositórios</h1>
      <div className="mb-3">
        <input type="file" accept=".csv" className="form-control" onChange={handleFileChange} />
      </div>
      <button className="btn btn-primary mb-3" onClick={uploadFile} disabled={loading || !file}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <h2 className="mt-4">Repositórios Importados</h2>
      <button className="btn btn-secondary mb-3" onClick={fetchRepositories}>Atualizar Lista</button>
      <RepositoryTable repositories={repositories} />
    </div>
  );
}

export default ListPage;