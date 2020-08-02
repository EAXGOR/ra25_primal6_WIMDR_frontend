import gql from 'graphql-tag';

const getAlert = gql`
  query GetAlert($latitude: String!, $longitude: String!) {
    getEmergencyAlert(input: { latitude: $latitude, longitude: $longitude }) {
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
export default getAlert;
