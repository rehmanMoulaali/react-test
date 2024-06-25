import React from "react";
import axios from 'axios'
import config from '../config.json' 
import sarchInTheTable from "../hooks/SarchInTable";
import sortByParam from "../hooks/Sort";
import filterBy from "../hooks/Filter";

/**
 * Retrieves all the users from the API.
 *
 * @return {Promise<Array>} An array of user objects.
 */
async function getAllUsers() {
  try {
    // Construct the URL by appending the endpoint to the base URL
    const url = `${config.baseURL}/user`;
    // Send a GET request to the constructed URL and await the response
    const response = await axios.get(url);
    // Return the data from the response, which is an array of user objects
    return response.data;
  } catch (error) {
    // If an error occurs, log the error message and return an empty array
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
    // Construct the URL by appending the user ID to the base URL
    const url = `${config.baseURL}/user/${id}`;
    // Send a DELETE request to the constructed URL
    const response = await axios.delete(url);
    // Log a success message if the response status is 200
    if (response.status === 200) {
      console.log('User deleted successfully');
    }else{
      console.log('User not deleted');
      throw new Error('User not deleted');
    }
  } catch (error) {
    // If an error occurs, log the error message
    console.error(error.message);
  }
}

const User = () => {
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    getAllUsers().then((res) => {
      console.log(res);
      setUsers(res.users);
    });
  }, []);
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default User;