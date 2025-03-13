import { useState } from 'react';
import { Repository } from '../entity/Repository';
import api from '../config/axiosconfig';
import RepositoryTable from '../components/RepositoryTable';
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchPage() {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRepositories = async () => {
    if (!username) return;
    setLoading(true);
    setError('');
  
    try {
      const response = await api.get(`/export/repositories/${username}`);
      const repositories: Repository[] = response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        owner: repo.owner.login,
        stars: repo.stargazers_count,
      }));
      if (repositories.length === 0) {
        setError('O usuário não possui repositórios públicos.');
      } else {
        setRepositories(repositories);
      }
    } catch (err: any) {
        setError('Usuário não encontrado. Verifique o nome de usuário.');
    } finally {
      setLoading(false);
    }
  };
  

  const exportCSV = async () => {
    if (!repositories) return;
    try {
      window.location.href = `${process.env.REACT_APP_API_BASE_URL}/export/repositories/${repositories[0].owner}/csv`;
    } catch (err) {
      setError('Erro ao exportar CSV.');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Pesquisar Repositórios</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Digite o nome do usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" onClick={fetchRepositories} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
            {repositories.length > 0 && (
              <button className="btn btn-secondary" onClick={exportCSV}>
                Exportar CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {repositories.length > 0 && (
        <div className="mt-4">
          <h2>Repositórios Encontrados</h2>
          <RepositoryTable repositories={repositories} />
        </div>
      )}
    </div>
  );
}

export default SearchPage;
