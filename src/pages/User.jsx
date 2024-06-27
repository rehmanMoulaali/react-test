import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';

/**
 * Retrieves all the users from the API.
 *
 * @return {Promise<Array>} An array of user objects.
 */
async function getAllUsers() {
  try {
    const url = `${config.baseURL}/user`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

/**
 * Deletes a user from the API.
 *
 * @param {number} id - The ID of the user to delete.
 * @return {Promise<void>} - A promise that resolves when the user is deleted.
 * @throws {Error} - If an error occurs during the deletion process.
 */
async function deleteUser(id) {
  try {
    const url = `${config.baseURL}/user/${id}`;
    const response = await axios.delete(url);
    if (response.status === 200) {
      console.log('User deleted successfully');
    } else {
      console.log('User not deleted');
      throw new Error('User not deleted');
    }
  } catch (error) {
    console.error(error.message);
  }
}

const User = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllUsers().then((res) => {
      setUsers(res.users);
      const uniqueRoles = [...new Set(res.users.map(user => user.roles.name))];
      setRoles(uniqueRoles);
    });
  }, []);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole ? user.roles.name === selectedRole : true;
    const matchesSearch = searchTerm ? (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.manager?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    ) : true;
    return matchesRole && matchesSearch;
  });

  console.log('Filtered Users:', filteredUsers);

  return (
    <div>
      <h1>Users</h1>
      <div>
        <label>Filter by Role: </label>
        <select value={selectedRole} onChange={handleRoleChange}>
          <option value=''>All</option>
          {roles.map((role, index) => (
            <option key={index} value={role}>{role}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Search: </label>
        <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search users..." />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact (Email, Phone)</th>
            <th>Username</th>
            <th>Reporting To</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}<br />{user.phone}</td>
              <td>{user.username}</td>
              <td>{user.manager?.name}</td>
              <td>{user.roles.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
