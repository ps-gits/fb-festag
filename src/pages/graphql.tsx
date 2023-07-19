import axios from 'axios';
import { useState } from 'react';

const GraphQlApi = () => {
  const [data, setData] = useState('');
  const callApi = async () => {
    const response = await axios.post(
      `https://edge.sitecorecloud.io/api/graphql/v1`,
      {
        query:
          '{item(path: "/sitecore/content/flight-booking/flight-booking/Home/Data/flight-booking-dictionary", language: "EN") {    name    id    fields {      name      value  }}}',
      },
      {
        headers: {
          'x-gql-token':
            'ampjVGM4ODNnRTZEa0RjSFNrckx0ZXpQenJEZHlHYUFqbmJwQUh0RlNWVT18YXJhYmVzcXVlZmwwZjcwLWRlbW9wcm9qZWN0LWRlbW9lbnYtNzliYw==',
        },
      }
    );
    setData(JSON.stringify(response?.data?.data?.item?.fields));
  };
  return (
    <div>
      <button onClick={callApi}>Click To Fetch Data</button>
      <div>{data?.length > 0 && data}</div>
    </div>
  );
};

export default GraphQlApi;
