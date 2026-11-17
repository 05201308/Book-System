function UserList(props) {
  const users = props.users;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Membership ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(function (u) {
            return (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.membership_id}</td>
                <td>{u.role}</td>
                <td className="actions">
                  <button className="btn small" onClick={function () { props.onEdit(u); }}>Update</button>
                  <button className="btn small red" onClick={function () { props.onDelete(u); }}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
