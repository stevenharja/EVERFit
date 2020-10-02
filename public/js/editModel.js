import axios from 'axios';

export const editModel = async (model, id, data) => {
  try {
    const url = `/api/v1/${model}/${id}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      alert(`Data changed successfully.`);
    }
  } catch (err) {
    alert(
      `${model} failed to be updated. Please ensure that you are authorized to modify this ${model}`
    );
  }
};
