import gql from 'graphql-tag';

const getRequests = gql`
  query GetRequests {
    getRequests {
      id
      location {
        longitude
        latitude
      }
      handledBy {
        location {
          longitude
          latitude
        }
      }
    }
  }
`;
export default getRequests;
