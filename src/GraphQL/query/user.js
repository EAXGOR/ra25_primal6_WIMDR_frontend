import gql from 'graphql-tag';

const user = gql`
  query Me {
    me {
      id
      name
      email
      phone
      roles
      emergenciesCreated {
        id
        location {
          latitude
          longitude
        }
      }
    }
  }
`;
export default user;
