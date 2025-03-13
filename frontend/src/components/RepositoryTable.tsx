import { Repository } from '../entity/Repository';

interface RepositoryTableProps {
  repositories: Repository[];
}

function RepositoryTable({ repositories }: RepositoryTableProps) {
  return (
    <table className="table table-striped">
      <thead className="table-dark">
        <tr>
          <th>Nome</th>
          <th>Proprietário</th>
          <th>⭐ Estrelas</th>
        </tr>
      </thead>
      <tbody>
        {repositories.map((repo) => (
          <tr key={repo.id}>
            <td>{repo.name}</td>
            <td>{repo.owner}</td>
            <td>{repo.stars}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RepositoryTable;
