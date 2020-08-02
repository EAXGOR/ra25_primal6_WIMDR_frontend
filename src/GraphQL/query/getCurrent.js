import gql from 'graphql-tag';

const getCurrent = gql`
  query GetCurrent {
    getCurrent {
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
export default getCurrent;
