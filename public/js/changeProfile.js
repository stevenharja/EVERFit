import axios from 'axios';
export const changeProfile = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      alert('Profile changed successfully.');
    }
  } catch (err) {
    alert('Profile failed to be updated.');
  }
};
